import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import AnalyzerPage from './pages/AnalyzerPage'
import BuilderPage from './pages/BuilderPage'
import TemplatesPage from './pages/TemplatesPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import InterviewPage from './pages/InterviewPage'
import HistoryPage from './pages/HistoryPage'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  return isLoggedIn ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const location = useLocation()
  const { isLoggedIn, loading } = useAuth()
  const isBuilder = location.pathname.startsWith('/builder')

  // Prevent flash of landing page while checking auth
  if (loading && location.pathname === '/') return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/analyzer"  element={<AnalyzerPage />} />
            <Route path="/builder"   element={<BuilderPage />} />
            <Route path="/builder/:id" element={<BuilderPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/auth"      element={<AuthPage />} />
            <Route path="/interview/:id" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
            <Route path="*"          element={<LandingPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isBuilder && <Footer />}
    </div>
  )
}
