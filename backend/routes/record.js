const express = require('express');
const router = express.Router();
const ExcelRecord = require('../models/excelRecord');
const { protect } = require('../middleware/auth'); // Auth middleware to populate req.user

/**
 * @route   GET /api/records/myuploads
 * @desc    Get all Excel uploads by the logged-in user
 * @access  Private (requires valid JWT token)
 */
router.get('/myuploads', protect, async (req, res) => {
  try {
    const userId = req.user.id; // ensure protect middleware sets req.user

    const uploads = await ExcelRecord.find({ uploadedBy: userId }).sort({ uploadedAt: -1 });

    res.status(200).json(uploads);
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/records/:id
 * @desc    Get Excel record by ID
 * @access  Public or Private (your choice)
 */
router.get('/:id', async (req, res) => {
  try {
    const record = await ExcelRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
