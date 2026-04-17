const mongoose = require('mongoose');

// ─── Sub-document: Individual question within an interview session ───
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  expectedAnswer: {
    type: String,
    default: '',
  },
  userAnswer: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  feedback: {
    type: String,
    default: '',
  },
  timeTaken: {
    type: Number, // seconds spent on this question
    default: 0,
  },
}, { _id: true });

// ─── Main Interview Schema ─────────────────────────────────────────
const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: [true, 'Target role is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'hr', 'system-design', 'mixed'],
    default: 'mixed',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  questions: [questionSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  totalTimeTaken: {
    type: Number, // total seconds for the entire session
    default: 0,
  },
  aiFeedback: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, status: 1 });

// ─── Virtual: average score per question ────────────────────────────
interviewSchema.virtual('averageQuestionScore').get(function () {
  if (!this.questions || this.questions.length === 0) return 0;
  const total = this.questions.reduce((sum, q) => sum + (q.score || 0), 0);
  return +(total / this.questions.length).toFixed(2);
});

// Ensure virtuals are included in JSON output
interviewSchema.set('toJSON', { virtuals: true });
interviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Interview', interviewSchema);
