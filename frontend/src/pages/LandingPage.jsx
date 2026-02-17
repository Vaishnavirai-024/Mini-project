import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/ui/PageWrapper'
import FeatureCard from '../components/ui/FeatureCard'

// ─── Hero Illustration ────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div className="relative mx-auto" style={{ width: 340, height: 400 }}>
      <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,.28), transparent 70%)' }} />

      {/* Resume card */}
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22,1,.36,1] }}
        className="glass rounded-2xl absolute inset-x-6 inset-y-4 p-5 overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}>

        {/* Name / title lines */}
        <div className="mb-5">
          <div className="h-3 rounded-full mb-2" style={{ width: 120, background: 'rgba(255,255,255,.55)' }} />
          <div className="h-2 rounded-full" style={{ width: 80, background: 'rgba(255,255,255,.25)' }} />
        </div>

        {/* Content lines */}
        {[85, 100, 70, 90, 60, 80, 75, 88, 50, 65].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full mb-2"
            style={{ width: `${w}%`, marginLeft: i % 4 === 0 ? 14 : 0, background: i % 3 === 0 ? 'rgba(124,58,237,.4)' : 'rgba(255,255,255,.18)' }} />
        ))}

        {/* Animated scan line */}
        <div className="scan-line absolute left-0 right-0 h-0.5 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,.9),transparent)', boxShadow: '0 0 14px 6px rgba(139,92,246,.38)' }} />

        {/* ATS score badge */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 260 }}
          className="absolute top-4 right-4 rounded-xl p-2.5 text-center"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 8px 24px rgba(124,58,237,.5)' }}>
          <div className="text-white text-[10px] font-bold">ATS</div>
          <div className="text-white text-xl font-black leading-none">87%</div>
        </motion.div>

        {/* Keyword chips */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
          {[['React', true], ['Node.js', true], ['REST API', null], ['Python', false]].map(([k, matched]) => (
            <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: matched === true ? 'rgba(16,185,129,.25)' : matched === false ? 'rgba(255,255,255,.07)' : 'rgba(124,58,237,.3)',
                       color: matched === true ? '#34d399' : matched === false ? '#475569' : '#c4b5fd' }}>
              {k}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
        className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-float"
        style={{ background: '#10b981', boxShadow: '0 4px 16px rgba(16,185,129,.45)', animationDuration: '3s' }}>
        ✓ ATS Pass
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
        className="absolute -bottom-3 -left-4 rounded-xl px-3 py-2 text-xs text-slate-300 shadow-xl animate-float-slow"
        style={{ background: '#1e293b', border: '1px solid rgba(124,58,237,.3)' }}>
        <span className="text-brand-400 font-bold">↑ 34%</span> more callbacks
      </motion.div>
    </div>
  )
}

// ─── Step component ───────────────────────────────────────────────────────────
function Step({ num, title, desc, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22,1,.36,1] }} className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-5 shadow-xl"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 8px 32px rgba(124,58,237,.35)' }}>
        {num}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-[200px]">{desc}</p>
    </motion.div>
  )
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative pt-32 pb-28 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute animate-float" style={{ top: '20%', left: '12%', width: 520, height: 520, background: 'radial-gradient(circle,rgba(124,58,237,.22),transparent 70%)', filter: 'blur(48px)' }} />
          <div className="absolute animate-float-slow" style={{ top: '42%', right: '8%', width: 380, height: 380, background: 'radial-gradient(circle,rgba(99,102,241,.16),transparent 70%)', filter: 'blur(56px)' }} />
          <div className="absolute inset-0 bg-grid opacity-100" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22,1,.36,1] }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.25)', color: '#c4b5fd' }}>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              AI-Powered Resume Analysis
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-[72px] font-black leading-none tracking-tight text-white mb-6">
              Beat ATS Bots.<br />
              <span className="grad-text">Get Hired</span><br />
              Faster.
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-lg">
              Analyze your resume against job descriptions, identify missing keywords, and optimize for ATS systems with AI-powered suggestions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/analyzer" className="btn-primary px-7 py-4 text-base">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Analyze Resume
              </Link>
              <Link to="/builder" className="btn-ghost px-7 py-4 text-base">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Build Resume
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-10 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <Stat value="10K+" label="Resumes Analyzed" />
              <Stat value="87%"  label="ATS Pass Rate" />
              <Stat value="3×"   label="More Interviews" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22,1,.36,1] }} className="flex justify-center">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', color: '#a5b4fc' }}>
              Everything You Need
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Powerful Features for<br /><span className="grad-text">Job Seekers</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">From ATS analysis to professional resume building, every tool you need to land your dream job.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'ATS Score Analysis',   desc: 'Get a real ATS compatibility score and understand exactly why your resume passes or fails screening.',        delay: 0 },
              { icon: '🔍', title: 'Keyword Detection',    desc: 'Identify missing keywords from job descriptions and get actionable suggestions to boost your match rate.',   delay: 80 },
              { icon: '✨', title: 'AI Improvement Tips',  desc: 'Receive personalized, AI-powered suggestions to improve phrasing, formatting, and content impact.',          delay: 160 },
              { icon: '📝', title: 'Resume Builder',       desc: 'Build professional resumes with our split editor and live A4 preview — like Overleaf for resumes.',          delay: 240 },
              { icon: '📄', title: 'PDF Export',           desc: 'Download pixel-perfect, ATS-optimized PDF resumes with one click, ready to submit anywhere.',               delay: 320 },
              { icon: '🎨', title: 'Premium Templates',    desc: 'Choose from 8 professionally designed templates built for modern ATS systems and recruiters.',               delay: 400 },
              { icon: '🔒', title: 'Secure & Private',     desc: 'Your resume data is encrypted and never shared. JWT authentication keeps your account safe.',               delay: 480 },
              { icon: '📊', title: 'Analysis History',     desc: 'Track your improvement over time with saved analysis history and ATS score progression.',                   delay: 560 },
            ].map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24" style={{ background: 'rgba(15,23,42,.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', color: '#6ee7b7' }}>
              Simple 4-Step Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">How <span className="grad-text">It Works</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <Step num="01" title="Upload Resume"       desc="Upload your PDF or Word resume to our secure platform."                delay={0} />
            <Step num="02" title="Paste Job Description" desc="Copy & paste the job description you're targeting."                  delay={0.1} />
            <Step num="03" title="Get Your Score"      desc="Receive an instant ATS score with detailed keyword breakdown."         delay={0.2} />
            <Step num="04" title="Improve & Download"  desc="Apply AI suggestions and download your optimized resume."             delay={0.3} />
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-600 text-xs font-semibold mb-8 uppercase tracking-widest">Built With</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['React.js', 'React Router', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Multer', 'pdf-parse'].map(t => (
              <span key={t} className="px-5 py-2.5 rounded-full text-slate-400 text-sm font-medium hover:text-brand-300 transition-colors cursor-default"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22,1,.36,1] }}
            className="relative glass rounded-3xl p-12 sm:p-16 text-center overflow-hidden" style={{ border: '1px solid rgba(124,58,237,.2)' }}>
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,.5),transparent)' }} />
            <div className="absolute pointer-events-none" style={{ top: -60, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse,rgba(124,58,237,.3),transparent 70%)', filter: 'blur(40px)' }} />
            <h2 className="relative text-4xl sm:text-5xl font-black text-white mb-4 leading-tight text-balance">
              Stop Getting Rejected Before<br /><span className="grad-text">Humans See Your Resume.</span>
            </h2>
            <p className="relative text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of job seekers who've boosted their interview rates with AI-powered resume optimization.</p>
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyzer" className="btn-primary px-8 py-4 text-base">Start Free Analysis →</Link>
              <Link to="/templates" className="btn-ghost px-8 py-4 text-base">Browse Templates</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
