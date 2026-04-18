const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Memory Storage (Cloud-ready, avoids saving to local disk)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed for ATS analysis'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── @desc    Analyze PDF Resume using Gemini 2.5 Flash
// ─── @route   POST /api/analyze/upload
const analyzeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
    }

    const jobDescription = req.body.jobDescription || 'General Software Engineering Role';
    
    // Prepare the PDF buffer for Gemini
    const pdfPart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: "application/pdf"
      }
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Act as an Expert ATS Analyzer. Review this resume against the following Job Description: "${jobDescription}".
      Return STRICTLY a raw JSON object without markdown formatting. The JSON must have:
      {
        "atsScore": <number 0-100>,
        "matchPercent": <number 0-100>,
        "matched": ["keyword1", "keyword2", ...up to 10],
        "missing": ["keyword1", "keyword2", ...up to 6],
        "tips": ["tip 1", "tip 2", ...up to 5],
        "detectedRole": "<detected job role>"
      }
    `;

    // Call Gemini with Prompt + PDF file
    const result = await model.generateContent([prompt, pdfPart]);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResponse = JSON.parse(responseText);

    // Save history if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          analysisHistory: {
            atsScore: aiResponse.atsScore,
            matchPercentage: aiResponse.matchPercent,
            role: aiResponse.detectedRole || 'Analyzed Role'
          }
        }
      });
    }

    res.json({ success: true, data: aiResponse });

  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Analyze Resume Text using Gemini 2.5 Flash
// ─── @route   POST /api/analyze/text
const analyzeText = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide resume text.' });
    }

    const jd = jobDescription || 'General Software Engineering Role';
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Act as an Expert ATS Analyzer. Review this resume against the following Job Description: "${jd}".
      Resume Text:
      ${resumeText}
      
      Return STRICTLY a raw JSON object without markdown formatting. The JSON must have:
      {
        "atsScore": <number 0-100>,
        "matchPercent": <number 0-100>,
        "matched": ["keyword1", "keyword2", ...up to 10],
        "missing": ["keyword1", "keyword2", ...up to 6],
        "tips": ["tip 1", "tip 2", ...up to 5],
        "detectedRole": "<detected job role>"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResponse = JSON.parse(responseText);

    // Save history if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          analysisHistory: {
            atsScore: aiResponse.atsScore,
            matchPercentage: aiResponse.matchPercent,
            role: aiResponse.detectedRole || 'Analyzed Role'
          }
        }
      });
    }

    res.json({ success: true, data: aiResponse });

  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { upload, analyzeUpload, analyzeText };