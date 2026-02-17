import { Link } from 'react-router-dom'
import { FileText, Github } from 'lucide-react'

const FOOTER_LINKS = {
  Product:   [{ l: 'Features',     to: '/' }, { l: 'ATS Analyzer', to: '/analyzer' }, { l: 'Builder', to: '/builder' }, { l: 'Templates', to: '/templates' }],
  Account:   [{ l: 'Login',        to: '/auth' }, { l: 'Register', to: '/auth' }],
  Resources: [{ l: 'GitHub',       to: '#' }, { l: 'Docs', to: '#' }, { l: 'Blog', to: '#' }],
}

export default function Footer() {
  return (
    <footer className="no-print bg-slate-950 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <FileText size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-white text-lg">Resume<span className="text-brand-400">AI</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Beat ATS bots and land more interviews with AI-powered resume analysis and building.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ l, to }) => (
                  <li key={l}>
                    <Link to={to} className="text-slate-500 hover:text-brand-400 text-sm transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2025 ResumeAI. Built with React · Node.js · MongoDB.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
