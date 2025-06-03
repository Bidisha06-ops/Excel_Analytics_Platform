const mongoose = require('mongoose');

const excelRecordSchema = new mongoose.Schema({
  data: {
    type: [mongoose.Schema.Types.Mixed], // Excel rows
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ExcelRecord', excelRecordSchema);
