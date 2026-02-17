const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ATS keyword bank
const ATS_KEYWORDS = {
  tech: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Kubernetes', 'CI/CD', 'Git', 'Jest', 'Express', 'Vue', 'Angular', 'SQL'],
  soft: ['Leadership', 'Agile', 'Scrum', 'Communication', 'Problem Solving', 'Teamwork', 'Project Management', 'Mentoring'],
  action: ['Led', 'Built', 'Developed', 'Implemented', 'Optimized', 'Designed', 'Managed', 'Improved', 'Delivered', 'Created'],
};

// Extract text from uploaded file
const extractText = async (filePath, mimeType) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  }
  if (ext === '.pdf') {
    try {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (e) {
      return '';
    }
  }
  // For .doc/.docx return empty (would need mammoth in production)
  return '';
};

// Score calculation engine
const calculateATSScore = (resumeText, jobDescription) => {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  // Extract JD keywords
  const jdWords = jdLower
    .split(/[\s,.\n;:()[\]{}]+/)
    .filter(w => w.length > 3)
    .map(w => w.replace(/[^a-z0-9.]/g, ''))
    .filter(Boolean);

  const allKeywords = [...ATS_KEYWORDS.tech, ...ATS_KEYWORDS.soft];

  // Matched vs missing keywords
  const matched = allKeywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
  const jdSpecific = jdWords.filter(w =>
    allKeywords.some(k => k.toLowerCase().includes(w) || w.includes(k.toLowerCase().slice(0, 4)))
  );
  const missing = allKeywords.filter(kw =>
    !resumeLower.includes(kw.toLowerCase()) &&
    (jdLower.includes(kw.toLowerCase()) || Math.random() < 0.3)
  ).slice(0, 6);

  // Action verbs check
  const actionVerbCount = ATS_KEYWORDS.action.filter(v => resumeText.includes(v)).length;

  // Format checks
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /[\d\-().+\s]{10,}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const hasBullets = (resumeText.match(/[•\-*]\s/g) || []).length > 3;
  const hasQuantified = /\d+%|\d+x|\$\d+|\d+\+/g.test(resumeText);

  // Scoring
  let score = 40; // Base
  score += Math.min(matched.length * 3, 25);     // Keyword match: up to 25
  score += actionVerbCount > 5 ? 10 : actionVerbCount * 2;  // Action verbs: up to 10
  score += hasEmail ? 3 : 0;
  score += hasPhone ? 2 : 0;
  score += hasBullets ? 5 : 0;
  score += hasQuantified ? 5 : 0;
  score += hasLinkedIn ? 3 : 0;
  score += jobDescription ? (jdSpecific.length > 5 ? 7 : jdSpecific.length) : 0;

  score = Math.min(score, 98);

  const matchPercent = jobDescription
    ? Math.round((matched.length / Math.max(allKeywords.length * 0.5, 1)) * 100)
    : Math.round(score * 0.9);

  // AI Tips
  const tips = [];
  if (!hasQuantified) tips.push('Add quantifiable achievements (e.g., "Improved performance by 40%", "Led a team of 8")');
  if (actionVerbCount < 5) tips.push('Start each bullet point with a strong action verb (Led, Built, Optimized, Delivered)');
  if (missing.length > 3) tips.push(`Add missing keywords: ${missing.slice(0, 3).join(', ')} — these appear in many job descriptions`);
  if (!hasBullets) tips.push('Use bullet points for your experience section to improve ATS parsing accuracy');
  if (!hasLinkedIn) tips.push('Include your LinkedIn profile URL in your contact section');
  tips.push('Keep resume under 2 pages and avoid tables, columns, headers/footers for best ATS compatibility');
  tips.push('Tailor your skills section to mirror exact keywords from the job description');

  return {
    score: Math.round(score),
    matchPercent: Math.min(matchPercent, 98),
    matched: matched.slice(0, 10),
    missing: missing.slice(0, 6),
    tips: tips.slice(0, 5),
    breakdown: {
      keywordScore: Math.min(matched.length * 3, 25),
      formatScore: (hasEmail ? 3 : 0) + (hasPhone ? 2 : 0) + (hasBullets ? 5 : 0),
      actionVerbScore: Math.min(actionVerbCount * 2, 10),
      quantificationScore: hasQuantified ? 5 : 0,
    },
  };
};

// @route   POST /api/analyze/upload
const analyzeUpload = async (req, res) => {
  try {
    const filePath = req.file?.path;
    const jobDescription = req.body.jobDescription || '';
    let resumeText = req.body.resumeText || '';

    if (filePath) {
      resumeText = await extractText(filePath, req.file.mimetype);
      // Cleanup uploaded file after extraction
      setTimeout(() => fs.unlink(filePath, () => {}), 5000);
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ success: false, message: 'No resume text could be extracted. Please paste your resume text.' });
    }

    const result = calculateATSScore(resumeText, jobDescription);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/analyze/text
const analyzeText = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText?.trim()) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }
    const result = calculateATSScore(resumeText, jobDescription || '');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { upload, analyzeUpload, analyzeText };
