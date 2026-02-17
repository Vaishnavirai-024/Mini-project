import { motion } from 'framer-motion'

export default function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 cursor-default border border-white/5 hover:border-brand-500/30 transition-colors duration-300"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl"
        style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
        {icon}
      </div>
      <h3 className="text-white font-bold text-[17px] mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}
