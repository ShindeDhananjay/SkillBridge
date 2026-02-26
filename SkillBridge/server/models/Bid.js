const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
    },
    coverMessage: {
      type: String,
      required: [true, 'Cover message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One bid per student per project
bidSchema.index({ project: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
