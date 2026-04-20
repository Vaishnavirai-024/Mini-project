import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom' // FIX: Added routing hooks
import { motion, AnimatePresence } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ResumePreview from '../components/ui/ResumePreview'
import EditorSection from '../components/ui/EditorSection'
import api from '../utils/api'
import { Save, Printer, Download, Eye, EyeOff } from 'lucide-react'

// FIX: Dummy data ko hata kar ek empty structure banaya
const EMPTY_RESUME = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  projects: [],
  certifications: [],
  achievements: [],
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
  const { id } = useParams() // FIX: URL se ID pakadna
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [data, setData]               = useState(EMPTY_RESUME)
  const [activeSection, setSection]   = useState('personal')
  const [template, setTemplate]       = useState('classic')
  const [saving, setSaving]           = useState(false)
  const [loading, setLoading]         = useState(!!id) // FIX: Agar URL me ID hai toh loading true hogi
  const [showPreview, setShowPreview] = useState(false)
  const [resumeId, setResumeId]       = useState(id || null) 
  const previewRef = useRef(null)

  // FIX: Component load hote hi Database se data fetch karna
  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const response = await api.get(`/resume/${id}`)
          const fetchedData = response.data.data

          // Backend data ko state mein set karna
          setData({
            personal: fetchedData.personal || EMPTY_RESUME.personal,
            summary: fetchedData.summary || '',
            experience: fetchedData.experience || [],
            education: fetchedData.education || [],
            skills: fetchedData.skills || EMPTY_RESUME.skills,
            projects: fetchedData.projects || [],
            certifications: fetchedData.certifications || [],
            achievements: fetchedData.achievements || [],
          })
          setTemplate(fetchedData.template || 'classic')
          setResumeId(fetchedData._id)
        } catch (err) {
          console.error("Fetch error:", err)
          toast.error('Failed to load resume data')
          navigate('/dashboard') // Error aaye toh wapas bhej do
        } finally {
          setLoading(false)
        }
      }
      fetchResume()
    }
  }, [id, navigate])

  const handlePrint = useReactToPrint({ content: () => previewRef.current, documentTitle: `${data.personal.name || 'Resume'} - ResumeAI` })

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...data, template, title: `${data.personal.name || 'My'} Resume` }
      
      if (resumeId) {
        // Update existing resume
        await api.put(`/resume/${resumeId}`, payload)
        toast.success('Resume updated successfully!')
      } else {
        // Create new resume
        const response = await api.post('/resume', payload)
        if (response.data && response.data.data && response.data.data._id) {
          setResumeId(response.data.data._id)
          // URL update kar do bina page refresh kiye
          window.history.replaceState(null, '', `/builder/${response.data.data._id}`)
        }
        toast.success('Resume saved successfully!')
      }
    } catch (err) {
      console.error(err)
      localStorage.setItem('rai_draft', JSON.stringify({ data, template }))
      toast.success('Draft saved locally! (Server Error)')
    } finally {
      setSaving(false)
    }
  }

  const update = useCallback((section, value) => {
    setData(prev => ({ ...prev, [section]: value }))
  }, [])

  // FIX: Loading screen dikhana jab data fetch ho raha ho
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="text-slate-600 font-medium">Loading your resume...</span>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col" style={{ paddingTop: '4rem' }}>

      {/* ── Toolbar ── */}
      <div className="no-print sticky top-16 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-slate-700 font-bold text-sm hidden sm:block shrink-0">Resume Builder</span>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              ← Dashboard
            </Link>
          )}
          <select value={template} onChange={e => setTemplate(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
            {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
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