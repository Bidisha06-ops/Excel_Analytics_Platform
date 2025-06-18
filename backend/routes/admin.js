const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ExcelRecord = require('../models/excelRecord');
const RecentChart = require('../models/recentChart');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await ExcelRecord.countDocuments();

    // 🔢 Most used chart from RecentChart
    const chartAggregation = await RecentChart.aggregate([
      { $match: { chartType: { $exists: true, $ne: null } } },
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostUsedChart = chartAggregation[0]?._id || 'N/A';

    // 📊 Daily uploads from ExcelRecord
    const uploadsPerDay = await ExcelRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          uploads: { $sum: 1 }
        }
      },
      {
        $project: {
          date: "$_id",
          uploads: 1,
          _id: 0
        }
      }
    ]);

    // 📈 Daily 'analyze' activity logs from Activity model
    const analyzedPerDay = await Activity.aggregate([
      { $match: { action: 'analyze' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          analyzed: { $sum: 1 }
        }
      },
      {
        $project: {
          date: "$_id",
          analyzed: 1,
          _id: 0
        }
      }
    ]);

    // 🧩 Merge by date
    const chartDataMap = {};

    uploadsPerDay.forEach(item => {
      chartDataMap[item.date] = {
        date: item.date,
        uploads: item.uploads,
        analyzed: 0
      };
    });

    analyzedPerDay.forEach(item => {
      if (chartDataMap[item.date]) {
        chartDataMap[item.date].analyzed = item.analyzed;
      } else {
        chartDataMap[item.date] = {
          date: item.date,
          uploads: 0,
          analyzed: item.analyzed
        };
      }
    });

    const chartData = Object.values(chartDataMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 🟢🟥 Online/Offline Stats
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const onlineCount = await User.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } });
    const offlineCount = totalUsers - onlineCount;

    // ✅ Final response
    res.json({
      totalUsers,
      totalUploads,
      mostUsedChart,
      chartData,
      onlineStats: {
        online: onlineCount,
        offline: offlineCount,
      },
    });

  } catch (error) {
    console.error('❌ Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
