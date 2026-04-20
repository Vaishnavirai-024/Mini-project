import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Loader, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'

export default function InterviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}
  
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        // Use the jobDescription and detectedRole from state if available
        const params = new URLSearchParams({
          resumeId: id,
          jobDescription: state.jobDescription || '',
          detectedRole: state.detectedRole || 'General'
        })
        const response = await api.get(`/interview/generate-questions?${params.toString()}`)
        if (response.data.success) {
          setQuestions(response.data.questions || [])
          if (!response.data.questions || response.data.questions.length === 0) {
            toast.error('No questions generated. Please try again.')
            navigate('/dashboard')
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        toast.error(error.response?.data?.message || 'Failed to load interview questions')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuestions()
  }, [id, navigate, state])

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    try {
      setSubmitting(true)
      const currentQuestion = questions[currentIndex]
      
      const response = await api.post('/interview/evaluate-answer', {
        resumeId: id,
        question: currentQuestion,
        answer: answer.trim(),
        questionIndex: currentIndex,
        jobDescription: state.jobDescription || '',
        detectedRole: state.detectedRole || 'General'
      })

      if (response.data.success) {
        setFeedback(response.data.feedback)
        
        // If this is the last question, mark interview as complete
        if (currentIndex === questions.length - 1) {
          setTimeout(() => {
            setInterviewComplete(true)
          }, 1500)
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error(error.response?.data?.message || 'Failed to evaluate answer')
    } finally {
      setSubmitting(false)
    }
  }

  // Move to next question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
      setFeedback(null)
    } else {
      setInterviewComplete(true)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Loading interview questions...</p>
          </motion.div>
        </div>
      </PageWrapper>
    )
  }

  if (interviewComplete) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 sm:p-12 max-w-md text-center"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
              className="mb-6"
            >
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mb-3">Interview Complete!</h2>
            <p className="text-slate-400 mb-8">
              Great job! You've completed all 5 questions. Your responses have been analyzed and saved.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary px-6 py-3 w-full"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-ghost px-6 py-3 w-full"
              >
                Retake Interview
              </button>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    )
  }

  if (!questions.length) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-400">No questions available</p>
        </div>
      </PageWrapper>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progressPercent = ((currentIndex + 1) / questions.length) * 100

  return (
    <PageWrapper>
      <div className="relative py-12 px-4 sm:px-6 min-h-screen">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute animate-float" style={{ top: '15%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,.15),transparent 70%)', filter: 'blur(48px)' }} />
          <div className="absolute animate-float-slow" style={{ bottom: '20%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(99,102,241,.12),transparent 70%)', filter: 'blur(56px)' }} />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-2">Mock Interview</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  Question <span className="grad-text">{currentIndex + 1}</span> of {questions.length}
                </h1>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #6366f1)' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{Math.round(progressPercent)}% complete</p>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 mb-8"
              style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}
            >
              {/* Question Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)', color: '#c4b5fd' }}>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Interview Question
              </div>

              {/* Question Text */}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                {currentQuestion}
              </h2>

              {/* Answer Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Be specific and detailed. Provide examples from your experience."
                  disabled={!!feedback}
                  className="w-full h-32 rounded-xl p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
              </div>

              {/* Feedback Section */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl border border-emerald-500/30"
                    style={{ background: 'rgba(16, 185, 129, .08)' }}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-emerald-300 font-semibold text-sm mb-2">AI Feedback</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{feedback}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!feedback ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <span>Submit Answer</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-5"
            style={{ background: 'rgba(15,23,42,.3)', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}
          >
            <p className="text-xs font-semibold text-slate-400 mb-3">💡 Interview Tips</p>
            <ul className="space-y-2">
              <li className="text-xs text-slate-500">✓ Be specific with examples from your experience</li>
              <li className="text-xs text-slate-500">✓ Keep answers concise but comprehensive (2-3 min speaking time)</li>
              <li className="text-xs text-slate-500">✓ Show confidence and enthusiasm in your responses</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
