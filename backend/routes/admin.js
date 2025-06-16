const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ExcelRecord = require('../models/excelRecord');
const RecentChart = require('../models/recentChart');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await ExcelRecord.countDocuments();

    const chartAggregation = await RecentChart.aggregate([
      { $match: { chartType: { $exists: true, $ne: null } } },
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const mostUsedChart = chartAggregation[0]?._id || 'N/A';

    res.json({
      totalUsers,
      totalUploads,
      mostUsedChart,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
