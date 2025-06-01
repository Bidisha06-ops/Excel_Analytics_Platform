const path = require('path');


const uploadExcelFile = (req, res) => {
  try {
   
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

   
    const ext = path.extname(req.file.originalname);
    if (ext !== '.xls' && ext !== '.xlsx') {
      return res.status(400).json({ success: false, message: 'Only .xls and .xlsx files are allowed' });
    }

   
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
    });
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};

module.exports = { uploadExcelFile };
