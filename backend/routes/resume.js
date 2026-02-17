const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getResumes, getResume, createResume, updateResume, deleteResume,
} = require('../controllers/resumeController');

router.use(protect); // All resume routes require auth

router.route('/').get(getResumes).post(createResume);
router.route('/:id').get(getResume).put(updateResume).delete(deleteResume);

module.exports = router;
