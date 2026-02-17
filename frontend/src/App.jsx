import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import AnalyzerPage from './pages/AnalyzerPage'
import BuilderPage from './pages/BuilderPage'
import TemplatesPage from './pages/TemplatesPage'
import AuthPage from './pages/AuthPage'

export default function App() {
  const location = useLocation()
  const isBuilder = location.pathname === '/builder'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<LandingPage />} />
            <Route path="/analyzer"  element={<AnalyzerPage />} />
            <Route path="/builder"   element={<BuilderPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/auth"      element={<AuthPage />} />
            <Route path="*"          element={<LandingPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isBuilder && <Footer />}
    </div>
  )
}
