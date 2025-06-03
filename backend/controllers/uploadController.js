const XLSX = require('xlsx');
const ExcelRecord = require('../models/excelRecord'); // your mongoose model

const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname);
    if (ext !== '.xls' && ext !== '.xlsx') {
      return res.status(400).json({ success: false, message: 'Only .xls and .xlsx files are allowed' });
    }

    // Read excel file from disk
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet); // Parse sheet data as JSON array

    // Create a new ExcelRecord document with the parsed data
    const newRecord = new ExcelRecord({
      date: new Date().toISOString(), // or whatever date format you want
      uploadedBy: req.user.id,  // assuming your protect middleware sets req.user
      uploadedAt: new Date(),
      data: data  // store the parsed Excel data here, you need to add this field to your schema
    });

    const savedRecord = await newRecord.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded and data saved successfully',
      record: savedRecord,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};
