const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ExcelRecord = require('../models/excelRecord');
const { protect } = require('../middleware/auth');
const XLSX = require('xlsx'); // Excel parser

// Multer config
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.xls' && ext !== '.xlsx') {
    return cb(new Error('Only Excel files are allowed'));
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter });

/**
 * @route POST /api/upload
 * @desc Upload Excel file, parse it, and store content
 */
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Parse Excel file from buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet); // Array of objects

    // Save to MongoDB
    const newRecord = new ExcelRecord({
      data: jsonData,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
    });

    const savedRecord = await newRecord.save();

    res.json({
      message: 'File uploaded and data saved successfully',
      file: req.file.originalname,
      record: savedRecord,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
