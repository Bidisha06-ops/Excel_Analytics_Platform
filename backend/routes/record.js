const express = require('express');
const router = express.Router();
const ExcelRecord = require('../models/excelRecord');

/**
 * @route GET /api/record/:id
 * @desc Get Excel record by ID
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

// routes/record.js




module.exports = router;
