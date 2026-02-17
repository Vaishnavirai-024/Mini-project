import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import { FileText, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('demo@resumeai.com')
  const [password, setPassword] = useState('123456')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const { login, register }     = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'register' && !name.trim()) { toast.error('Name is required'); return }
    if (!email.trim() || !password.trim()) { toast.error('Email and password are required'); return }

    setLoading(true)
    try {
      let data
      if (mode === 'login') {
        data = await login(email, password)
      } else {
        data = await register(name, email, password)
      }
      if (data.success) {
        toast.success(`Welcome${data.user?.name ? `, ${data.user.name}` : ''}! 🎉`)
        navigate('/')
      } else {
        toast.error(data.message || 'Authentication failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="bg-slate-950 min-h-screen flex items-center justify-center pt-16 px-4 py-12">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ top: '30%', left: '30%', width: 320, height: 320, background: 'radial-gradient(circle,rgba(124,58,237,.2),transparent)', filter: 'blur(60px)' }} />
        <div className="absolute" style={{ bottom: '30%', right: '30%', width: 280, height: 280, background: 'radial-gradient(circle,rgba(99,102,241,.14),transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22,1,.36,1] }}
          className="glass rounded-2xl p-8" style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 8px 32px rgba(124,58,237,.45)' }}>
              <FileText size={24} className="text-white" strokeWidth={2} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 className="text-2xl font-black text-white mb-1">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                <p className="text-slate-400 text-sm">{mode === 'login' ? 'Sign in to your ResumeAI account' : 'Start building ATS-optimized resumes'}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Demo hint */}
          <div className="rounded-xl p-3 mb-6 flex items-start gap-3" style={{ background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.2)' }}>
            <span className="text-lg shrink-0">🔑</span>
            <div>
              <p className="text-[11px] font-bold text-brand-300">Demo Credentials</p>
              <p className="text-[11px] mt-0.5 text-brand-400/75">Email: demo@resumeai.com · Password: 123456</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-dark w-full" placeholder="Alex Johnson" />
              </div>
            )}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-dark w-full" placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-dark w-full pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base rounded-xl disabled:opacity-70 disabled:cursor-not-allowed">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <span className="text-slate-500 text-sm">{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}</span>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-semibold transition-colors text-brand-400 hover:text-brand-300">
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-3 text-center">
              <button className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Forgot password?</button>
            </div>
          )}
        </motion.div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">← Back to home</Link>
        </div>
      </div>
    </PageWrapper>
  )
}
