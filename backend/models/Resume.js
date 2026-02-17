const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'My Resume',
  },
  template: {
    type: String,
    enum: ['classic', 'modern', 'minimal', 'executive', 'developer', 'creative', 'two-column', 'graduate'],
    default: 'classic',
  },
  personal: {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  summary: { type: String, default: '' },
  experience: [{
    company: String,
    role: String,
    period: String,
    location: String,
    bullets: [String],
  }],
  education: [{
    school: String,
    degree: String,
    period: String,
    gpa: String,
  }],
  skills: {
    technical: [String],
    soft: [String],
  },
  projects: [{
    name: String,
    desc: String,
    tech: String,
    link: String,
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
  }],
  achievements: [String],
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

resumeSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
