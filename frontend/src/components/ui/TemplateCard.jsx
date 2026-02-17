import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PREVIEW_LINES = [85, 60, 90, 50, 70, 55, 80, 45, 65, 75, 58, 82]

export default function TemplateCard({ template, index }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="rounded-2xl overflow-hidden border-2 transition-colors duration-300"
        style={{ borderColor: hovered ? `${template.accent}80` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 20px 60px ${template.accent}25` : 'none' }}
      >
        {/* Template preview */}
        <div className="relative bg-white" style={{ aspectRatio: '3/4' }}>
          <div className="absolute inset-0 p-3 flex flex-col gap-0">
            {/* Header bar */}
            <div className="rounded mb-2.5 p-2" style={{ background: template.accent }}>
              <div className="h-2 rounded-full bg-white/70 mb-1" style={{ width: '65%' }} />
              <div className="h-1.5 rounded-full bg-white/40" style={{ width: '40%' }} />
            </div>
            {/* Content lines */}
            {PREVIEW_LINES.map((w, i) => (
              <div key={i} className="h-1.5 rounded-full mb-1.5"
                style={{ width: `${w}%`, marginLeft: i % 4 === 0 ? '10px' : '0', background: i % 3 === 0 ? `${template.accent}50` : '#e2e8f0' }} />
            ))}
          </div>

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-end justify-center pb-5"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
          >
            <button
              onClick={() => navigate('/builder')}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-xl transition-transform hover:scale-105"
              style={{ background: template.accent }}
            >
              Use Template →
            </button>
          </motion.div>

          {/* Badge */}
          {template.badge && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-md"
              style={{ background: template.accent }}>
              {template.badge}
            </div>
          )}

          {/* ATS score pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 text-[10px] font-semibold">{template.atsScore}% ATS</span>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-white px-4 py-3.5 border-t border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-0.5">{template.name}</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{template.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
