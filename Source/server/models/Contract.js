const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    freelancerEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Contract title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    partyA: {
      name: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    partyB: {
      name: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    value: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'active', 'rejected', 'submitted', 'completed'],
      default: 'draft',
    },
    milestones: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
        status: {
          type: String,
          enum: ['pending', 'submitted', 'approved', 'paid'],
          default: 'pending',
        },
        submittedFile: {
          originalName: { type: String },
          filename: { type: String },
          path: { type: String },
          mimetype: { type: String },
          size: { type: Number },
          uploadedAt: { type: Date },
        },
      },
    ],
    submittedFile: {
      originalName: { type: String },
      filename: { type: String },
      path: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date },
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', contractSchema);
// Trigger nodemon restart
