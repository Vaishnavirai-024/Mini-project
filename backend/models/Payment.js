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
=======
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

module.exports = mongoose.model('Payment', paymentSchema);

