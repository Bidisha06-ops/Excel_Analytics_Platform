const express = require('express');
const router = express.Router();
const RecentChart = require('../models/recentChart');
const ExcelRecord = require('../models/excelRecord');
const { protect } = require('../middleware/auth');

// POST /api/recentCharts
router.post('/', protect, async (req, res) => {
  try {
    const { recordId } = req.body;

    const record = await ExcelRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const recentChart = await RecentChart.create({
      userId: req.user.id,  // ✅ Include this line
      recordId,
      filename: record.filename,
    });

    res.status(201).json({ success: true, recentChart });
  } catch (err) {
    console.error('Error creating recent chart:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recentCharts
router.get('/', protect, async (req, res) => {
  try {
    const recentCharts = await RecentChart.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(recentCharts);
  } catch (err) {
    console.error('Error fetching recent charts:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
