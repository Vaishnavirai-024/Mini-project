import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageWrapper from '../components/ui/PageWrapper'
import ATSScoreCard from '../components/ui/ATSScoreCard'
import api from '../utils/api'
import { Upload, FileText, ChevronRight } from 'lucide-react'

const STEPS = [
  'Parsing resume structure…',
  'Extracting keywords…',
  'Running ATS simulation…',
  'Matching job requirements…',
  'Generating improvement tips…',
  'Finalizing report…',
]

export default function AnalyzerPage() {
  const [resumeText, setResumeText]   = useState('')
  const [jdText, setJdText]           = useState('')
  const [fileName, setFileName]       = useState('')
  const [fileObj, setFileObj]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [progress, setProgress]       = useState(0)
  const [progressLabel, setLabel]     = useState('')
  const [result, setResult]           = useState(null)
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return }
    setFileName(f.name)
    setFileObj(f)
    // Try to read text files directly in browser
    if (f.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = ev => setResumeText(ev.target.result)
      reader.readAsText(f)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) { const fakeEvent = { target: { files: [f] } }; handleFile(fakeEvent) }
  }

  const analyze = async () => {
    if (!resumeText.trim() && !fileObj) {
      toast.error('Please upload a resume or paste your resume text.')
      return
    }
    setLoading(true); setResult(null); setProgress(0)

    // Progress animation
    let step = 0
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 16 + 4, 94))
      setLabel(STEPS[Math.min(step, STEPS.length - 1)])
      step++
    }, 200)

    try {
      let data
      if (fileObj && !resumeText) {
        // Upload file
        const formData = new FormData()
        formData.append('resume', fileObj)
        formData.append('jobDescription', jdText)
        const res = await api.post('/analyze/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        data = res.data
      } else {
        // Send text
        const res = await api.post('/analyze/text', { resumeText, jobDescription: jdText })
        data = res.data
      }
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => { setResult(data.data); setLoading(false) }, 400)
    } catch (err) {
      clearInterval(interval)
      setLoading(false)
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.')
    }
  }

  return (
    <PageWrapper className="bg-slate-950 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            ATS Resume <span className="grad-text">Analyzer</span>
          </h1>
          <p className="text-slate-400 text-lg">Upload your resume and paste a job description for instant ATS analysis.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── Left: Inputs ── */}
          <div className="space-y-4">

            {/* Resume upload */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-white p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-600 font-bold text-sm" style={{ background: '#ede9fe' }}>1</span>
                Upload Resume
              </h2>

              {/* Drop zone */}
              <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={handleDrop}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
                style={{ borderColor: fileName ? '#7c3aed' : '#e2e8f0' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.borderColor = fileName ? '#7c3aed' : '#e2e8f0'}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform hover:scale-110" style={{ background: '#f5f3ff' }}>
                  <Upload size={24} strokeWidth={1.8} className="text-brand-600" />
                </div>
                {fileName
                  ? <p className="font-semibold text-brand-600">✓ {fileName}</p>
                  : <>
                    <p className="font-semibold text-slate-700 mb-1">Drop your resume here or click to browse</p>
                    <p className="text-sm text-slate-400">PDF, DOCX, or TXT · up to 5MB</p>
                  </>}
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFile} />
              </div>

              {/* Paste text */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Or paste resume text</label>
                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={6}
                  className="input-base resize-none" placeholder="Paste your resume content here..." />
              </div>
            </motion.div>

            {/* Job description */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="card-white p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm" style={{ background: '#e0e7ff' }}>2</span>
                Job Description <span className="text-slate-400 text-xs font-normal ml-1">(optional — improves results)</span>
              </h2>
              <textarea value={jdText} onChange={e => setJdText(e.target.value)} rows={9}
                className="input-base resize-none" placeholder="Paste the full job description here to match keywords and requirements..." />
            </motion.div>

            {/* Analyze button */}
            <motion.button onClick={analyze} disabled={loading || (!resumeText.trim() && !fileObj)}
              whileHover={!loading ? { scale: 1.01 } : {}} whileTap={!loading ? { scale: 0.99 } : {}}
              className="btn-primary w-full py-4 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
                : <><FileText size={18} />Analyze My Resume<ChevronRight size={16} /></>}
            </motion.button>
          </div>

          {/* ── Right: Results ── */}
          <div>
            <AnimatePresence mode="wait">
              {/* Empty state */}
              {!loading && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card-white flex flex-col items-center justify-center text-center p-12" style={{ minHeight: 420 }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f8fafc' }}>
                    <svg width="32" height="32" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-700 text-xl mb-2">Your Analysis Will Appear Here</h3>
                  <p className="text-slate-400 text-sm max-w-xs">Upload your resume and optionally paste a job description to get your ATS score and personalized recommendations.</p>
                </motion.div>
              )}

              {/* Loading state */}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card-white flex flex-col items-center justify-center p-12 gap-6" style={{ minHeight: 420 }}>
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full" style={{ border: '4px solid rgba(124,58,237,.15)' }} />
                    <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '4px solid transparent', borderTopColor: '#7c3aed' }} />
                    <div className="absolute inset-3 rounded-full" style={{ border: '4px solid transparent', borderTopColor: '#818cf8', animation: 'spin .7s linear infinite reverse' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-700 text-lg">Analyzing your resume…</p>
                    <p className="text-slate-400 text-sm mt-1">{progressLabel}</p>
                  </div>
                  <div className="w-64 h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
                      style={{ background: 'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {!loading && result && (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <ATSScoreCard result={result} />
                  <Link to="/builder" className="btn-primary w-full py-3.5 text-sm mt-4 rounded-xl">Build Optimized Resume →</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
