const mongoose = require('mongoose');

// ─── Sub-schema: Personal Information ─────────────────────────────────
const personalSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  website: { type: String, default: '' },
}, { _id: false });

// ─── Sub-schema: Experience Entry ────────────────────────────────────
const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  period: { type: String, default: '' },
  location: { type: String, default: '' },
  bullets: [{ type: String, default: '' }],
}, { _id: true });

// ─── Sub-schema: Education Entry ────────────────────────────────────
const educationSchema = new mongoose.Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  period: { type: String, default: '' },
  gpa: { type: String, default: '' },
}, { _id: true });

// ─── Sub-schema: Skills ─────────────────────────────────────────────
const skillsSchema = new mongoose.Schema({
  technical: [{ type: String, default: '' }],
  soft: [{ type: String, default: '' }],
}, { _id: false });

// ─── Sub-schema: Project Entry ──────────────────────────────────────
const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  desc: { type: String, default: '' },
  tech: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: true });

// ─── Sub-schema: Certification Entry ────────────────────────────────
const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
}, { _id: true });

// ─── Main Resume Schema ────────────────────────────────────────────
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  title: {
    type: String,
    default: 'My Resume',
    trim: true,
  },
  template: {
    type: String,
    enum: ['classic', 'modern', 'minimal', 'executive', 'developer', 'creative', 'two-column', 'graduate'],
    default: 'classic',
  },
  // ─── File Metadata (for uploaded PDFs) ──────────────────────
  fileUrl: {
    type: String,
    default: null, // null if no file uploaded yet
  },
  fileName: {
    type: String,
    default: null,
  },
  // ─── Structured Resume Data ─────────────────────────────────
  personal: personalSchema,
  summary: {
    type: String,
    default: '',
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: skillsSchema,
  projects: [projectSchema],
  certifications: [certificationSchema],
  achievements: [{ type: String, default: '' }],
  // ─── Metadata ───────────────────────────────────────────────
  lastModified: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ user: 1, isPublished: 1 });

// ─── Pre-save hook: update lastModified ────────────────────────────
resumeSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);