const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');

const CREDIT_PACK = {
  credits: 150,
  amountInPaise: 10000,
  currency: 'INR',
};

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay credentials are not configured');
    error.status = 500;
    throw error;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const safeSignatureMatch = (expectedSignature, receivedSignature) => {
  const expectedBuffer = Buffer.from(expectedSignature.trim().toLowerCase(), 'utf8');
  const receivedBuffer = Buffer.from((receivedSignature || '').trim().toLowerCase(), 'utf8');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

// @desc    Create Razorpay order for AI credit pack
// @route   POST /api/payment/order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const receipt = `credits_${req.user._id.toString()}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: CREDIT_PACK.amountInPaise,
      currency: CREDIT_PACK.currency,
      receipt,
      payment_capture: 1,
      notes: {
        userId: req.user._id.toString(),
        credits: String(CREDIT_PACK.credits),
        product: 'ai-credits',
      },
    });

    await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      credits: CREDIT_PACK.credits,
      status: 'created',
      receipt: order.receipt,
      gateway: 'razorpay',
      notes: order.notes || {},
    });

    return res.status(201).json({
      success: true,
      message: 'Razorpay order created',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        credits: CREDIT_PACK.credits,
        keyId: process.env.RAZORPAY_KEY_ID,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Razorpay payment signature and credit user
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment order not found',
      });
    }

    if (payment.status === 'paid') {
      const currentUser = await User.findById(req.user._id).select('credits');
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: {
          orderId: payment.orderId,
          paymentId: payment.paymentId,
          credits: currentUser?.credits ?? 0,
        },
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret is not configured',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!safeSignatureMatch(expectedSignature, razorpay_signature)) {
      await Payment.updateOne(
        { _id: payment._id },
        {
          $set: {
            status: 'failed',
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: payment._id, status: { $ne: 'paid' } },
      {
        $set: {
          status: 'paid',
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          verifiedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      const currentUser = await User.findById(req.user._id).select('credits');
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          credits: currentUser?.credits ?? 0,
        },
      });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { credits: updatedPayment.credits } },
        { new: true, runValidators: true }
      ).select('credits');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return res.json({
        success: true,
        message: 'Payment verified and credits added',
        data: {
          orderId: updatedPayment.orderId,
          paymentId: updatedPayment.paymentId,
          creditsAdded: updatedPayment.credits,
          totalCredits: updatedUser.credits,
        },
      });
    } catch (creditError) {
      await Payment.findByIdAndUpdate(updatedPayment._id, {
        $set: {
          status: payment.status,
          paymentId: payment.paymentId,
          signature: payment.signature,
          verifiedAt: payment.verifiedAt,
        },
      });

      throw creditError;
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createOrder, verifyPayment };