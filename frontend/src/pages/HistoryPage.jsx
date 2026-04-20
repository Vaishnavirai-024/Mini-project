import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Clock, TrendingUp, Loader, Eye, Download } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import { useAuth } from '../context/AuthContext'

export default function HistoryPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    bestScore: 0,
    improvementTrend: 0
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error('Please sign in to view your analysis history')
      navigate('/auth')
    }
  }, [isLoggedIn, authLoading, navigate])

  // Fetch analysis history
  useEffect(() => {
    if (authLoading || !isLoggedIn) return

    const fetchHistory = async () => {
      try {
        setLoading(true)
        const response = await api.get('/auth/me')
        if (response.data.success) {
          const userData = response.data.data || response.data.user
          const history = userData.analysisHistory || []
          setAnalyses(history.reverse()) // Show newest first

          // Calculate stats
          if (history.length > 0) {
            const scores = history.map(h => h.atsScore || 0)
            const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            const bestScore = Math.max(...scores)
            const trend = history.length > 1 
              ? Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100)
              : 0

            setStats({
              totalAnalyses: history.length,
              averageScore: avgScore,
              bestScore: bestScore,
              improvementTrend: trend
            })
          }
        }
      } catch (error) {
        console.error('Error fetching history:', error)
        toast.error('Failed to load analysis history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [authLoading, isLoggedIn])

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40', label: 'Excellent' }
    if (score >= 60) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', badge: 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/40', label: 'Good' }
    return { bg: 'bg-red-500/20', text: 'text-red-400', badge: 'bg-red-500/30 text-red-300 border border-red-500/40', label: 'Needs Work' }
  }

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Loading your analysis history...</p>
          </motion.div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="relative py-12 px-4 sm:px-6 min-h-screen">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute animate-float" style={{ top: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,.15),transparent 70%)', filter: 'blur(48px)' }} />
          <div className="absolute animate-float-slow" style={{ bottom: '15%', left: '10%', width: 350, height: 350, background: 'radial-gradient(circle,rgba(99,102,241,.12),transparent 70%)', filter: 'blur(56px)' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Analysis <span className="grad-text">History</span>
            </h1>
            <p className="text-slate-400 text-lg">Track your resume improvements over time</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {[
              { icon: <BarChart3 className="w-5 h-5" />, label: 'Total Analyses', value: stats.totalAnalyses },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Average Score', value: `${stats.averageScore}%` },
              { icon: <BarChart3 className="w-5 h-5" />, label: 'Best Score', value: `${stats.bestScore}%` },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Improvement', value: `${stats.improvementTrend > 0 ? '+' : ''}${stats.improvementTrend}%` },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass rounded-2xl p-6"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(124,58,237,.2)' }}>
                    <div className="text-purple-400">{stat.icon}</div>
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">{stat.label}</p>
                </div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* History Table */}
          {analyses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Past Analyses
              </h2>
              
              {/* Responsive Table */}
              <div className="glass rounded-2xl overflow-hidden border border-white/10" style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/30">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">ATS Score</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Match %</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analyses.map((analysis, index) => {
                        const scoreColor = getScoreColor(analysis.atsScore)
                        const date = new Date(analysis.createdAt || Date.now())
                        const formattedDate = date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric'
                        })
                        const formattedTime = date.toLocaleTimeString('en-US', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })

                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 + index * 0.05 }}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-sm">{formattedDate}</span>
                                <span className="text-slate-400 text-xs">{formattedTime}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-200 font-medium">{analysis.role || 'Analyzed Position'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-lg font-black ${scoreColor.text}`}>
                                  {analysis.atsScore}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColor.badge}`}>
                                  {scoreColor.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.1)' }}>
                                  <div 
                                    className="h-full rounded-full" 
                                    style={{ 
                                      width: `${analysis.matchPercentage}%`,
                                      background: 'linear-gradient(90deg, #7c3aed, #6366f1)'
                                    }} 
                                  />
                                </div>
                                <span className="text-slate-300 font-medium text-sm ml-2">{analysis.matchPercentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toast('Resume view feature coming soon!')}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-xs font-medium border border-purple-500/30"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-white/5">
                  {analyses.map((analysis, index) => {
                    const scoreColor = getScoreColor(analysis.atsScore)
                    const date = new Date(analysis.createdAt || Date.now())
                    const formattedDate = date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        className="p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-white font-bold text-sm">{analysis.role || 'Analyzed Position'}</h3>
                            <p className="text-slate-400 text-xs mt-1">{formattedDate}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColor.badge}`}>
                            {scoreColor.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-slate-400 text-xs mb-1">ATS Score</p>
                            <p className={`text-2xl font-black ${scoreColor.text}`}>{analysis.atsScore}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs mb-1">Match %</p>
                            <p className="text-2xl font-black text-slate-200">{analysis.matchPercentage}%</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toast('Resume view feature coming soon!')}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-xs font-medium border border-purple-500/30"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Resume
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-12 text-center"
              style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(124,58,237,.15)' }}>
                <BarChart3 className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No Analyses Yet</h3>
              <p className="text-slate-400 mb-6">Start analyzing resumes to build your history and track improvements</p>
              <button
                onClick={() => navigate('/analyzer')}
                className="btn-primary px-6 py-3 inline-flex items-center gap-2"
              >
                <span>Analyze Your First Resume</span>
                <TrendingUp className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
