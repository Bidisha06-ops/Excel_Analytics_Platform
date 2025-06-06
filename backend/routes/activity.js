const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// GET /api/activity/recent
router.get('/recent', protect, async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activity logs.' });
  }
});

// POST /api/activity/analyze/:id  (new analyze logging route)
router.post('/analyze/:id', protect, async (req, res) => {
  try {
    const { filename } = req.body;
    const recordId = req.params.id;

    // Check if already logged for this file+user+recordId
    const existing = await Activity.findOne({
      userId: req.user.id,
      action: 'analyze',
      recordId: recordId,
    });

    if (existing) {
      return res.status(200).json({ success: false, message: 'Analyze activity already logged' });
    }

    await Activity.create({
      userId: req.user.id,
      action: 'analyze',
      filename: filename || 'unknown file',
      recordId: recordId,
    });

    res.status(200).json({ success: true, message: 'Analyze activity logged' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log analyze activity.' });
  }
});



module.exports = router;
