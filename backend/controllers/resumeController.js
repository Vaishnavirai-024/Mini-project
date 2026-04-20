const cloudinary = require('cloudinary').v2;
const Resume = require('../models/resumeModel');

// ─── Cloudinary Configuration ────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Helper: Upload buffer to Cloudinary ────────────────────────────
const uploadToCloudinary = (fileBuffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'resumes',
        public_id: `resume_${Date.now()}_${originalFilename.replace(/\s+/g, '_').split('.')[0]}`,
        overwrite: false,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// ─── Validation: Ensure structured resume data is valid ──────────────
const validateResumeData = (data) => {
  const errors = [];

  if (data.personal) {
    if (data.personal.name && typeof data.personal.name !== 'string') {
      errors.push('Personal name must be a string');
    }
    if (data.personal.email && !/^\S+@\S+\.\S+$/.test(data.personal.email)) {
      errors.push('Invalid email format');
    }
  }

  if (data.experience && !Array.isArray(data.experience)) {
    errors.push('Experience must be an array');
  }

  if (data.education && !Array.isArray(data.education)) {
    errors.push('Education must be an array');
  }

  if (data.skills) {
    if (!Array.isArray(data.skills.technical) && data.skills.technical) {
      errors.push('Technical skills must be an array');
    }
    if (!Array.isArray(data.skills.soft) && data.skills.soft) {
      errors.push('Soft skills must be an array');
    }
  }

  return errors;
};

// ─── @desc    Get all resumes for authenticated user ──────────────────
// ─── @route   GET /api/resume ──────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── @desc    Get single resume by ID ───────────────────────────────
// ─── @route   GET /api/resume/:id ──────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-__v');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── @desc    Create new resume (with file and/or structured data) ───
// ─── @route   POST /api/resume ──────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────
const createResume = async (req, res) => {
  try {
    // ─ Validate input
    if (!req.file && !req.body.personal && !req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a PDF file or resume data (personal info, title, etc.)',
      });
    }

    // ─ Validate structured data if provided
    if (req.body.personal || req.body.experience || req.body.skills) {
      const validationErrors = validateResumeData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors,
        });
      }
    }

    // ─ Prepare resume data
    const resumeData = {
      user: req.user._id,
      title: req.body.title || 'My Resume',
      template: req.body.template || 'classic',
      fileUrl: null,
      fileName: null,
    };

    // ─ Upload PDF to Cloudinary if file provided
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );

        resumeData.fileUrl = cloudinaryResult.secure_url;
        resumeData.fileName = req.file.originalname;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload resume file to cloud storage',
          error: process.env.NODE_ENV === 'development' ? cloudinaryError.message : undefined,
        });
      }
    }

    // ─ Add structured resume data
    if (req.body.personal) resumeData.personal = req.body.personal;
    if (req.body.summary) resumeData.summary = req.body.summary;
    if (req.body.experience && Array.isArray(req.body.experience)) {
      resumeData.experience = req.body.experience;
    }
    if (req.body.education && Array.isArray(req.body.education)) {
      resumeData.education = req.body.education;
    }
    if (req.body.skills) resumeData.skills = req.body.skills;
    if (req.body.projects && Array.isArray(req.body.projects)) {
      resumeData.projects = req.body.projects;
    }
    if (req.body.certifications && Array.isArray(req.body.certifications)) {
      resumeData.certifications = req.body.certifications;
    }
    if (req.body.achievements && Array.isArray(req.body.achievements)) {
      resumeData.achievements = req.body.achievements;
    }

    // ─ Create and save resume
    const resume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume,
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── @desc    Update existing resume ─────────────────────────────────
// ─── @route   PUT /api/resume/:id ──────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────
const updateResume = async (req, res) => {
  try {
    // ─ Check resume exists
    const existingResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // ─ Validate structured data if provided
    if (req.body.personal || req.body.experience || req.body.skills) {
      const validationErrors = validateResumeData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors,
        });
      }
    }

    // ─ Prepare update data
    const updateData = {};

    // ─ Update basic fields
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.template) updateData.template = req.body.template;
    if (typeof req.body.isPublished === 'boolean') updateData.isPublished = req.body.isPublished;

    // ─ Update file if new one provided
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );

        updateData.fileUrl = cloudinaryResult.secure_url;
        updateData.fileName = req.file.originalname;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload resume file to cloud storage',
          error: process.env.NODE_ENV === 'development' ? cloudinaryError.message : undefined,
        });
      }
    }

    // ─ Update structured data
    if (req.body.personal) updateData.personal = req.body.personal;
    if (req.body.summary) updateData.summary = req.body.summary;
    if (req.body.experience && Array.isArray(req.body.experience)) {
      updateData.experience = req.body.experience;
    }
    if (req.body.education && Array.isArray(req.body.education)) {
      updateData.education = req.body.education;
    }
    if (req.body.skills) updateData.skills = req.body.skills;
    if (req.body.projects && Array.isArray(req.body.projects)) {
      updateData.projects = req.body.projects;
    }
    if (req.body.certifications && Array.isArray(req.body.certifications)) {
      updateData.certifications = req.body.certifications;
    }
    if (req.body.achievements && Array.isArray(req.body.achievements)) {
      updateData.achievements = req.body.achievements;
    }

    // ─ Perform update
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── @desc    Delete resume ──────────────────────────────────────────
// ─── @route   DELETE /api/resume/:id ────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // ─ Delete file from Cloudinary if exists
    if (resume.fileUrl) {
      try {
        const publicId = resume.fileUrl.split('/').pop().split('.')[0];
        const fullPublicId = `resumes/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.warn('Warning: Failed to delete file from Cloudinary:', cloudinaryError.message);
        // Don't fail the delete operation if Cloudinary cleanup fails
      }
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
};
