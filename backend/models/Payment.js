const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
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
    sparse: true, // allows null until payment is completed
    trim: true,
  },
  razorpaySignature: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1 paise'],
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR'],
  },
  creditsAwarded: {
    type: Number,
    default: 150,
    min: [0, 'Credits cannot be negative'],
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
    index: true,
  },
  plan: {
    type: String,
    enum: ['pro-monthly', 'pro-yearly', 'credits-pack'],
    required: [true, 'Plan type is required'],
  },
  receipt: {
    type: String,
    default: '',
    trim: true,
  },
  failureReason: {
    type: String,
    default: '',
  },
  paidAt: {
    type: Date,
    default: null,
  },
  gateway: {
    type: String,
    default: 'razorpay',
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────
paymentSchema.index({ user: 1, createdAt: -1 });

// ─── Pre-save hook: set paidAt when status changes to paid ──────────
paymentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'paid' && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);