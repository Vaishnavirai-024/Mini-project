const multer = require('multer');

// ─── Memory Storage (Better for cloud deployments) ──────────────────
const storage = multer.memoryStorage();

// ─── File Filter: Only PDFs allowed ──────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files allowed. Please upload a valid PDF.'), false);
  }
};

// ─── Multer Configuration ────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;