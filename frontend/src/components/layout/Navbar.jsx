import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, FileText, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Analyzer',  to: '/analyzer' },
  { label: 'Builder',   to: '/builder' },
  { label: 'History',   to: '/history' },
  { label: 'Templates', to: '/templates' },
]

const DASHBOARD_LINK = { label: 'Dashboard', to: '/dashboard' }

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
          {isLoggedIn && (
            <Link key={DASHBOARD_LINK.to} to={DASHBOARD_LINK.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === DASHBOARD_LINK.to ? 'text-brand-300 bg-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              {DASHBOARD_LINK.label}
            </Link>
          )}
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
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white text-sm bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-full transition-all border border-white/5 hover:border-white/10"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium pr-1.5">{user?.name}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-48 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col z-50 origin-top-right overflow-hidden"
                  >
                    <Link to="/profile" className="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors w-full text-left font-medium">
                      Profile
                    </Link>
                    <div className="h-px w-full bg-slate-800 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                      className="px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left font-medium"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            {isLoggedIn && (
              <Link key={DASHBOARD_LINK.to} to={DASHBOARD_LINK.to} className="text-slate-300 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">{DASHBOARD_LINK.label}</Link>
            )}
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
