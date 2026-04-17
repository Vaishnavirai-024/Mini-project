const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  signature: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
    default: 150,
    min: 1,
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
    index: true,
  },
  receipt: {
    type: String,
    default: '',
  },
  gateway: {
    type: String,
    default: 'razorpay',
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  verifiedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);