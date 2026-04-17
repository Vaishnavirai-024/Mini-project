const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateQuestions, evaluateAnswer } = require('../controllers/interviewController');

router.use(protect);

router.post('/generate-questions', generateQuestions);
router.post('/evaluate-answer', evaluateAnswer);

module.exports = router;