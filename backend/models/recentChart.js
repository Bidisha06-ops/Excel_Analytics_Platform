const mongoose = require('mongoose');

const recentChartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelRecord',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    default: 'analyze',
  },
  chartType: {
    type: String, // e.g. "Bar Chart", "Line Chart"
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RecentChart', recentChartSchema);
