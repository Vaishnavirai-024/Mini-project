import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/ui/PageWrapper'
import TemplateCard from '../components/ui/TemplateCard'
import api from '../utils/api'

const FALLBACK_TEMPLATES = [
  { id: 'classic',   name: 'Classic ATS',          desc: 'Traditional format optimized for all ATS systems. Highest compatibility.',        badge: 'Most Popular',  accent: '#6366f1', category: 'ats',          atsScore: 98 },
  { id: 'modern',    name: 'Modern Professional',   desc: 'Contemporary design with gradient header. Perfect for tech and SaaS roles.',      badge: 'Trending',      accent: '#8b5cf6', category: 'professional', atsScore: 92 },
  { id: 'minimal',   name: 'Minimal Clean',         desc: 'Ultra-clean layout focused on content. Passes all major ATS systems.',           badge: 'ATS-Safe',      accent: '#10b981', category: 'ats',          atsScore: 97 },
  { id: 'executive', name: 'Executive',             desc: 'Premium layout for senior professionals and C-suite candidates.',                 badge: 'Premium',       accent: '#d97706', category: 'professional', atsScore: 94 },
  { id: 'developer', name: 'Developer',             desc: 'Code-inspired design for software engineers and technical roles.',               badge: 'Dev Pick',      accent: '#3b82f6', category: 'professional', atsScore: 90 },
  { id: 'creative',  name: 'Creative',              desc: 'Bold design for UX/UI designers and creative professionals.',                    badge: '',              accent: '#ec4899', category: 'creative',     atsScore: 82 },
  { id: 'two-column',name: 'Two Column',            desc: 'Sidebar layout for comprehensive skill and experience showcasing.',              badge: '',              accent: '#f59e0b', category: 'professional', atsScore: 88 },
  { id: 'graduate',  name: 'Graduate',              desc: 'Entry-level template highlighting education, projects, and internships.',        badge: 'Entry Level',   accent: '#0ea5e9', category: 'ats',          atsScore: 96 },
]

const FILTERS = [
  { label: 'All Templates',  value: 'all' },
  { label: 'ATS-Optimized',  value: 'ats' },
  { label: 'Professional',   value: 'professional' },
  { label: 'Creative',       value: 'creative' },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES)
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    api.get('/templates')
      .then(({ data }) => { if (data.success) setTemplates(data.data) })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter)

  return (
    <PageWrapper className="bg-slate-950 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Professional <span className="grad-text">Resume Templates</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            All templates are ATS-optimized, professionally designed, and ready to customize.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.value ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                style={filter === f.value
                  ? { background: '#7c3aed', border: '1px solid #7c3aed' }
                  : { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Template grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ border: '2px solid rgba(255,255,255,.05)' }}>
                <div style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,.03)' }} />
                <div className="bg-slate-900 p-4">
                  <div className="h-3 rounded bg-slate-800 mb-2 w-3/4" />
                  <div className="h-2 rounded bg-slate-800 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((tpl, i) => (
              <TemplateCard key={tpl.id} template={tpl} index={i} />
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-14">
          <p className="text-slate-500 mb-6 text-sm">All templates export as clean, ATS-friendly PDFs</p>
          <Link to="/builder" className="btn-primary px-8 py-4 text-base rounded-xl">Start Building Your Resume →</Link>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
