import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function ScoreCircle({ score }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    let frame, start
    const duration = 1300
    const animate = (t) => {
      if (!start) start = t
      const progress = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(score * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const color  = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label  = score >= 80 ? 'Strong' : score >= 60 ? 'Moderate' : 'Weak'
  const offset = circumference - (circumference * animated) / 100

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 144, height: 144 }}>
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
          <circle cx="72" cy="72" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.04s linear', filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{animated}</span>
          <span className="text-slate-400 text-xs font-medium">ATS Score</span>
        </div>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${color}20`, color }}>
        {label}
      </span>
    </div>
  )
}

export default function ATSScoreCard({ result }) {
  const { score, matchPercent, matched, missing, tips, breakdown } = result

  return (
    <div className="space-y-4">
      {/* Score + overview */}
      <div className="card-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-800 text-xl">Analysis Results</h2>
          <span className="text-slate-400 text-xs font-medium">Powered by AI</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ScoreCircle score={score} />
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-600 font-medium">Keyword Match</span>
              <span className="font-bold text-slate-800">{matchPercent}%</span>
            </div>
            <div className="h-2 rounded-full mb-5 overflow-hidden bg-slate-100">
              <motion.div initial={{ width: 0 }} animate={{ width: `${matchPercent}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 text-center" style={{ background: '#f0fdf4' }}>
                <div className="text-2xl font-black" style={{ color: '#16a34a' }}>{matched.length}</div>
                <div className="text-xs font-medium" style={{ color: '#15803d' }}>Matched</div>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: '#fef2f2' }}>
                <div className="text-2xl font-black" style={{ color: '#dc2626' }}>{missing.length}</div>
                <div className="text-xs font-medium" style={{ color: '#b91c1c' }}>Missing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="card-white p-5">
          <h3 className="font-bold text-slate-800 mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Keyword Relevance', score: breakdown.keywordScore,      max: 25 },
              { label: 'Action Verbs',      score: breakdown.actionVerbScore,   max: 10 },
              { label: 'Format & Contact',  score: breakdown.formatScore,       max: 10 },
              { label: 'Quantification',    score: breakdown.quantificationScore, max: 5 },
            ].map(({ label, score: s, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{label}</span>
                  <span className="font-bold text-slate-700">{s}/{max}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s / max) * 100}%` }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="card-white p-5">
        <h3 className="font-bold text-slate-800 mb-4">Keyword Analysis</h3>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: '#16a34a' }}>✓ Matched Keywords</p>
          <div className="flex flex-wrap gap-2">{matched.map(k => <span key={k} className="tag-match">{k}</span>)}</div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: '#dc2626' }}>✗ Missing Keywords</p>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0
              ? missing.map(k => <span key={k} className="tag-miss">{k}</span>)
              : <span className="text-slate-400 text-sm">No significant gaps detected!</span>}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card-white p-5">
        <h3 className="font-bold text-slate-800 mb-4">💡 AI Improvement Tips</h3>
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
              className="flex gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#ede9fe', color: '#7c3aed' }}>{i + 1}</span>
              {tip}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
