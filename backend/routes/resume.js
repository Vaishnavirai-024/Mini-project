const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer');

const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');

// All routes protected
router.use(protect);

// Routes
router.route('/')
  .get(getResumes)
  .post(upload.single("resume"), createResume);

router.route('/:id')
  .get(getResume)
  .put(upload.single("resume"), updateResume)
  .delete(deleteResume);

module.exports = router;