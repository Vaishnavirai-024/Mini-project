const express = require('express');
const router = express.Router();
const { upload, analyzeUpload, analyzeText } = require('../controllers/analyzeController');

// POST /api/analyze/upload  — file + optional JD
router.post('/upload', upload.single('resume'), analyzeUpload);

// POST /api/analyze/text  — paste text + optional JD
router.post('/text', analyzeText);

module.exports = router;
