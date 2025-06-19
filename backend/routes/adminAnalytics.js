const express = require('express');
const router = express.Router();
const ExcelRecord = require('../models/excelRecord');
const RecentChart = require('../models/recentChart');
const Activity = require('../models/Activity');
const User = require('../models/user');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/usage-analytics', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const topUploaders = await ExcelRecord.aggregate([
      { $group: { _id: "$uploadedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $project: { username: "$user.username", count: 1 } }
    ]);

    const uploadTrends = await ExcelRecord.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$uploadedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const fileTypes = await ExcelRecord.aggregate([
      {
        $group: {
          _id: {
            $toLower: {
              $substrCP: [
                "$filename",
                { $subtract: [{ $strLenCP: "$filename" }, 4] },
                4
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const largestFiles = await ExcelRecord.find()
      .sort({ 'data.length': -1 })
      .limit(5)
      .select('filename data');

    const viewedChartTypes = await RecentChart.aggregate([
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topAnalyzedFiles = await RecentChart.aggregate([
      { $group: { _id: "$recordId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "excelrecords",
          localField: "_id",
          foreignField: "_id",
          as: "record"
        }
      },
      { $unwind: "$record" },
      { $project: { filename: "$record.filename", count: 1 } }
    ]);

    const peakAnalysisHours = await RecentChart.aggregate([
      { $project: { hour: { $hour: "$createdAt" } } },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const exportStats = await Activity.aggregate([
      { $match: { action: { $in: ["export_pdf", "export_png"] } } },
      { $group: { _id: "$action", count: { $sum: 1 } } }
    ]);

    const dailyActiveUsers = await Activity.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            userId: "$userId"
          }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          activeUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const registrations = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const inactiveUsers = await User.find({
      lastLogin: { $lt: oneMonthAgo }
    }).select("username email");

    const loginHeatmap = await Activity.aggregate([
      { $match: { action: "login" } },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$timestamp" },
          hour: { $hour: "$timestamp" }
        }
      },
      {
        $group: {
          _id: { day: "$dayOfWeek", hour: "$hour" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1, "_id.hour": 1 } }
    ]);

    res.json({
      fileUploadStats: { topUploaders, uploadTrends, fileTypes, largestFiles },
      chartTracking: { viewedChartTypes, topAnalyzedFiles, peakAnalysisHours, exportStats },
      userEngagement: { dailyActiveUsers, registrations, inactiveUsers, loginHeatmap }
    });

  } catch (err) {
    console.error('Admin Usage Analytics Error:', err.message);
    res.status(500).json({ message: 'Server error in usage analytics' });
  }
});

module.exports = router;
