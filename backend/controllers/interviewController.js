const { GoogleGenerativeAI } = require('@google/generative-ai'); // ✅ Correct standard package
const User = require('../models/User');
const { callGeminiWithRetry } = require('../utils/geminiRetry');

const INTERVIEW_CREDIT_COST = 50;

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Helper: Clean and parse JSON from Gemini's response
const extractJson = (text) => {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  return JSON.parse(cleaned);
};

// ─── @desc    Generate 5 Interview Questions and Deduct Credits
// ─── @route   POST /api/interview/generate-questions
// ─── @access  Private
const generateQuestions = async (req, res) => {
  try {
    const { role, experience, resumeText } = req.body;

    if (!role || !experience || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Role, experience, and resumeText are required',
      });
    }

    // 1. Fetch user and check credits
    const user = await User.findById(req.user._id);
    if (user.credits < INTERVIEW_CREDIT_COST) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient credits to start the interview',
      });
    }

    // 2. Setup Gemini Model using your exact preferred syntax
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 3. Prompt Engineering
    const prompt = `
      Act as an Expert HR & Technical Interviewer for a ${role} candidate with ${experience} of experience.
      Resume text: ${resumeText.substring(0, 5000)}
      
      Generate exactly 5 interview questions. Mix technical and behavioral.
      Return STRICTLY as a JSON array of strings. Do not add markdown like \`\`\`json.
    `;

    // 4. Get Response
    const result = await callGeminiWithRetry(model, prompt);
    const questions = extractJson(result.response.text());

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error('Gemini did not return exactly 5 questions in an array');
    }

    // 5. Deduct Credits & Save
    user.credits -= INTERVIEW_CREDIT_COST;
    await user.save();

    return res.json({
      success: true,
      message: 'Interview questions generated successfully',
      data: {
        questions: questions,
        creditsDeducted: INTERVIEW_CREDIT_COST,
        creditsRemaining: user.credits,
      },
    });

  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate questions',
    });
  }
};

// ─── @desc    Evaluate a candidate answer using Gemini
// ─── @route   POST /api/interview/evaluate-answer
// ─── @access  Private
const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, role, experience } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required',
      });
    }

    // Setup Gemini Model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Act as a strict technical interviewer evaluating a candidate's answer.
      Role: ${role}, Experience: ${experience}
      Question: "${question}"
      Answer: "${answer}"
      
      Evaluate the answer. Return STRICTLY a JSON object with NO markdown tags format:
      {
        "confidence": <number 1-10>,
        "communication": <number 1-10>,
        "correctness": <number 1-10>,
        "feedback": "<short constructive feedback string under 30 words>"
      }
    `;

    const result = await callGeminiWithRetry(model, prompt);
    const evaluation = extractJson(result.response.text());

    return res.json({
      success: true,
      message: 'Answer evaluated successfully',
      data: evaluation,
    });

  } catch (error) {
    console.error("Error evaluating answer:", error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to evaluate answer',
    });
  }
};

module.exports = { generateQuestions, evaluateAnswer };