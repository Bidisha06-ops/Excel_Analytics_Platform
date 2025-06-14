const mongoose = require('mongoose');

const recentChartSchema = new mongoose.Schema({
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelRecord',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  userId: { // to support multi-user dashboard
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RecentChart', recentChartSchema);
