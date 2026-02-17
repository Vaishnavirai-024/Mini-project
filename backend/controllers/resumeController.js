const Resume = require('../models/Resume');

// @desc    Get all resumes for user
// @route   GET /api/resume
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create resume
// @route   POST /api/resume
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, lastModified: Date.now() },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResumes, getResume, createResume, updateResume, deleteResume };
