import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, FileText, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Analyzer',  to: '/analyzer' },
  { label: 'Builder',   to: '/builder' },
  { label: 'Templates', to: '/templates' },
]

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className={`no-print fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-brand-500/60" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            <FileText size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-white tracking-tight text-lg">
            Resume<span className="text-brand-400">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === to ? 'text-brand-300 bg-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost px-4 py-2 text-sm rounded-xl">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-4 py-2">Sign In</Link>
              <Link to="/auth" className="btn-primary px-5 py-2.5 text-sm">Get Started Free</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="md:hidden px-4 py-4 flex flex-col gap-2 glass-dark border-t border-white/5">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={to} to={to} className="text-slate-300 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">{label}</Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-1">
              {isLoggedIn
                ? <button onClick={handleLogout} className="text-slate-400 py-2 text-sm w-full text-left px-3">Logout</button>
                : <Link to="/auth" className="text-brand-400 py-2 text-sm font-semibold px-3 block">Sign In / Register →</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
