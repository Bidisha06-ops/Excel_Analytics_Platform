const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.xls' && ext !== '.xlsx') {
    return cb(new Error('Only Excel files are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', file: req.file.originalname });
});

module.exports = router;
