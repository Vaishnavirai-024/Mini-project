const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  razorpayOrderId: {
    type: String,
    required: [true, 'Razorpay Order ID is required'],
    unique: true,
    trim: true,
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true, // allows null until payment is captured
    trim: true,
  },
  razorpaySignature: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
    default: 'created',
  },
  plan: {
    type: String,
    enum: ['pro-monthly', 'pro-yearly', 'credits-pack'],
    required: [true, 'Plan type is required'],
  },
  creditsAwarded: {
    type: Number,
    default: 0,
    min: 0,
  },
  receipt: {
    type: String,
    trim: true,
  },
  failureReason: {
    type: String,
    default: '',
  },
  paidAt: {
    type: Date,
  },
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ razorpayOrderId: 1 }, { unique: true });

// ─── Pre-save: set paidAt when status changes to captured ──────────
paymentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'captured' && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
