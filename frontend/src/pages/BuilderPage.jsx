import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'
import ResumePreview from '../components/ui/ResumePreview'
import EditorSection from '../components/ui/EditorSection'
import api from '../utils/api'
import { Save, Printer, Download, Eye, EyeOff } from 'lucide-react'

const DEFAULT_RESUME = {
  personal: { name: 'Alex Johnson', title: 'Senior Software Engineer', email: 'alex@email.com', phone: '(555) 123-4567', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexjohnson', website: '' },
  summary: 'Results-driven software engineer with 6+ years of experience building scalable web applications. Proven track record of delivering high-quality software solutions and mentoring cross-functional teams.',
  experience: [
    { id: 1, company: 'TechCorp Inc.', role: 'Senior Software Engineer', period: '2021 – Present', bullets: ['Led development of microservices architecture serving 2M+ daily users', 'Reduced API response times by 40% through Redis caching implementation', 'Mentored a team of 5 junior engineers, improving code quality by 35%'] },
    { id: 2, company: 'StartupXYZ', role: 'Software Engineer', period: '2019 – 2021', bullets: ['Built React dashboard used by 500+ enterprise clients globally', 'Implemented CI/CD pipeline reducing deployment time by 60%'] },
  ],
  education: [{ id: 1, school: 'UC Berkeley', degree: 'B.S. Computer Science', period: '2015 – 2019', gpa: '3.8/4.0' }],
  skills: { technical: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'], soft: ['Leadership', 'Agile/Scrum', 'Communication', 'Problem Solving'] },
  projects: [{ id: 1, name: 'OpenSource API Framework', desc: 'Built a REST API framework with 2K+ GitHub stars and 300+ contributors', tech: 'Node.js, Express, MongoDB', link: '' }],
  certifications: [{ id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023' }],
  achievements: ['Top 1% performer in company-wide hackathon 2023', 'Speaker at ReactConf 2022 — "Scaling React at Enterprise"', 'Open-source contributor with 500+ GitHub stars'],
}

const SECTIONS = [
  { id: 'personal',       label: 'Personal Info',    icon: '👤' },
  { id: 'summary',        label: 'Summary',          icon: '📋' },
  { id: 'experience',     label: 'Experience',       icon: '💼' },
  { id: 'education',      label: 'Education',        icon: '🎓' },
  { id: 'skills',         label: 'Skills',           icon: '⚡' },
  { id: 'projects',       label: 'Projects',         icon: '🚀' },
  { id: 'certifications', label: 'Certifications',   icon: '🏆' },
  { id: 'achievements',   label: 'Achievements',     icon: '⭐' },
]

const TEMPLATES = [
  { value: 'classic',   label: 'Classic ATS' },
  { value: 'modern',    label: 'Modern' },
  { value: 'minimal',   label: 'Minimal' },
  { value: 'executive', label: 'Executive' },
]

export default function BuilderPage() {
  const [data, setData]               = useState(DEFAULT_RESUME)
  const [activeSection, setSection]   = useState('personal')
  const [template, setTemplate]       = useState('classic')
  const [saving, setSaving]           = useState(false)
  const [showPreview, setShowPreview] = useState(false) // mobile toggle
  const previewRef = useRef(null)

  const handlePrint = useReactToPrint({ content: () => previewRef.current, documentTitle: `${data.personal.name || 'Resume'} - ResumeAI` })

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/resume', { ...data, template, title: `${data.personal.name || 'My'} Resume` })
      toast.success('Resume saved successfully!')
    } catch {
      // Not logged in or server off — save locally
      localStorage.setItem('rai_draft', JSON.stringify({ data, template }))
      toast.success('Draft saved locally!')
    } finally {
      setSaving(false)
    }
  }

  const update = useCallback((section, value) => {
    setData(prev => ({ ...prev, [section]: value }))
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col" style={{ paddingTop: '4rem' }}>

      {/* ── Toolbar ── */}
      <div className="no-print sticky top-16 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-slate-700 font-bold text-sm hidden sm:block shrink-0">Resume Builder</span>
          <select value={template} onChange={e => setTemplate(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
            {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile preview toggle */}
          <button onClick={() => setShowPreview(!showPreview)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>

          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-60">
            <Save size={13} />{saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
            <Printer size={13} />Print / PDF
          </button>
          <button onClick={handlePrint} className="btn-primary px-3 py-1.5 text-xs rounded-lg">
            <Download size={13} />Export
          </button>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>

        {/* Section sidebar */}
        <div className="no-print w-14 sm:w-48 bg-white border-r border-slate-200 flex flex-col pt-4 gap-0.5 px-2 overflow-y-auto shrink-0">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all text-sm w-full ${activeSection === s.id ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className="text-base shrink-0">{s.icon}</span>
              <span className="hidden sm:block truncate">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div className={`${showPreview ? 'hidden' : 'flex'} lg:flex flex-col flex-1 lg:max-w-sm bg-white border-r border-slate-100 overflow-y-auto`}>
          <div className="p-5 flex-1">
            <EditorSection section={activeSection} data={data} onChange={update} />
          </div>
        </div>

        {/* Live Preview */}
        <div className={`${showPreview ? 'flex' : 'hidden'} lg:flex flex-1 bg-slate-300 overflow-y-auto items-start justify-center p-6`}>
          <div className="w-full shadow-2xl rounded-lg overflow-hidden" style={{ maxWidth: 794 }}>
            <ResumePreview ref={previewRef} data={data} template={template} />
          </div>
        </div>
      </div>
    </div>
  )
}
