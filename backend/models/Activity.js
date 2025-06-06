const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['upload', 'analyze', 'export', 'update-profile'],
  },
  filename: {
    type: String,
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Record', // assuming you have a Record model
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', activitySchema);
