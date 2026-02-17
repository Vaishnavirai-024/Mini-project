import { Plus, Trash2 } from 'lucide-react'

// ─── Shared Field Components ─────────────────────────────────────────────────
function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder}
            className="input-base resize-none text-sm" />
        : <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="input-base text-sm" />}
    </div>
  )
}

function SectionHeader({ title, onAdd, addLabel = '+ Add' }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: '#7c3aed' }}>
          <Plus size={12} />{addLabel}
        </button>
      )}
    </div>
  )
}

function EntryCard({ children, onRemove, label }) {
  return (
    <div className="mb-4 p-4 border border-slate-200 rounded-xl relative group">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-slate-700 truncate">{label}</span>
        {onRemove && (
          <button onClick={onRemove} className="text-slate-300 hover:text-red-500 transition-colors ml-2 shrink-0">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Section Renderers ───────────────────────────────────────────────────────
function PersonalSection({ data, onChange }) {
  const up = (k, v) => onChange('personal', { ...data.personal, [k]: v })
  return (
    <>
      <SectionHeader title="Personal Information" />
      <Field label="Full Name"          value={data.personal.name}     onChange={v => up('name', v)}     placeholder="Alex Johnson" />
      <Field label="Job Title"          value={data.personal.title}    onChange={v => up('title', v)}    placeholder="Software Engineer" />
      <Field label="Email"              value={data.personal.email}    onChange={v => up('email', v)}    placeholder="alex@email.com" />
      <Field label="Phone"              value={data.personal.phone}    onChange={v => up('phone', v)}    placeholder="(555) 123-4567" />
      <Field label="Location"           value={data.personal.location} onChange={v => up('location', v)} placeholder="San Francisco, CA" />
      <Field label="LinkedIn"           value={data.personal.linkedin} onChange={v => up('linkedin', v)} placeholder="linkedin.com/in/yourname" />
      <Field label="Website (optional)" value={data.personal.website}  onChange={v => up('website', v)}  placeholder="yoursite.com" />
    </>
  )
}

function SummarySection({ data, onChange }) {
  return (
    <>
      <SectionHeader title="Professional Summary" />
      <Field label="Summary" value={data.summary} onChange={v => onChange('summary', v)} multiline
        placeholder="Results-driven professional with X+ years of experience…" />
      <p className="text-xs text-slate-400">💡 2–3 sentences highlighting your experience, key skills, and career focus.</p>
    </>
  )
}

function ExperienceSection({ data, onChange }) {
  const exps = data.experience || []
  const add = () => onChange('experience', [...exps, { id: Date.now(), company: '', role: '', period: '', bullets: [''] }])
  const remove = id => onChange('experience', exps.filter(e => e.id !== id))
  const upField = (id, k, v) => onChange('experience', exps.map(e => e.id === id ? { ...e, [k]: v } : e))
  const addBullet = id => onChange('experience', exps.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const upBullet = (id, bi, v) => onChange('experience', exps.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === bi ? v : b) } : e))
  const removeBullet = (id, bi) => onChange('experience', exps.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== bi) } : e))

  return (
    <>
      <SectionHeader title="Experience" onAdd={add} />
      {exps.map(e => (
        <EntryCard key={e.id} label={e.company || 'New Experience'} onRemove={() => remove(e.id)}>
          <Field label="Job Title"  value={e.role}    onChange={v => upField(e.id, 'role', v)}    placeholder="Software Engineer" />
          <Field label="Company"    value={e.company} onChange={v => upField(e.id, 'company', v)} placeholder="Company Name" />
          <Field label="Period"     value={e.period}  onChange={v => upField(e.id, 'period', v)}  placeholder="2021 – Present" />
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Bullet Points</label>
              <button onClick={() => addBullet(e.id)} className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-0.5"><Plus size={11}/>Add</button>
            </div>
            {e.bullets.map((b, bi) => (
              <div key={bi} className="flex gap-2 mb-2">
                <input value={b} onChange={ev => upBullet(e.id, bi, ev.target.value)} placeholder="Achieved X by doing Y, resulting in Z"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
                <button onClick={() => removeBullet(e.id, bi)} className="text-slate-300 hover:text-red-500 transition-colors text-lg leading-none px-1">×</button>
              </div>
            ))}
          </div>
        </EntryCard>
      ))}
      {exps.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No experience entries yet. Click "+ Add" to add one.</p>}
    </>
  )
}

function EducationSection({ data, onChange }) {
  const items = data.education || []
  const add = () => onChange('education', [...items, { id: Date.now(), school: '', degree: '', period: '', gpa: '' }])
  const remove = id => onChange('education', items.filter(e => e.id !== id))
  const up = (id, k, v) => onChange('education', items.map(e => e.id === id ? { ...e, [k]: v } : e))
  return (
    <>
      <SectionHeader title="Education" onAdd={add} />
      {items.map(e => (
        <EntryCard key={e.id} label={e.school || 'New Education'} onRemove={() => remove(e.id)}>
          <Field label="School / University" value={e.school} onChange={v => up(e.id,'school',v)} placeholder="UC Berkeley" />
          <Field label="Degree"              value={e.degree} onChange={v => up(e.id,'degree',v)} placeholder="B.S. Computer Science" />
          <Field label="Period"              value={e.period} onChange={v => up(e.id,'period',v)} placeholder="2015 – 2019" />
          <Field label="GPA (optional)"      value={e.gpa}    onChange={v => up(e.id,'gpa',v)}    placeholder="3.8/4.0" />
        </EntryCard>
      ))}
    </>
  )
}

function SkillsSection({ data, onChange }) {
  const skills = data.skills || { technical: [], soft: [] }
  return (
    <>
      <SectionHeader title="Skills" />
      <Field label="Technical Skills (comma-separated)" value={skills.technical?.join(', ')}
        onChange={v => onChange('skills', { ...skills, technical: v.split(',').map(s => s.trim()).filter(Boolean) })}
        placeholder="React, Node.js, TypeScript, AWS…" multiline />
      <Field label="Soft Skills (comma-separated)" value={skills.soft?.join(', ')}
        onChange={v => onChange('skills', { ...skills, soft: v.split(',').map(s => s.trim()).filter(Boolean) })}
        placeholder="Leadership, Agile, Communication…" />
    </>
  )
}

function ProjectsSection({ data, onChange }) {
  const items = data.projects || []
  const add = () => onChange('projects', [...items, { id: Date.now(), name: '', desc: '', tech: '', link: '' }])
  const remove = id => onChange('projects', items.filter(p => p.id !== id))
  const up = (id, k, v) => onChange('projects', items.map(p => p.id === id ? { ...p, [k]: v } : p))
  return (
    <>
      <SectionHeader title="Projects" onAdd={add} />
      {items.map(p => (
        <EntryCard key={p.id} label={p.name || 'New Project'} onRemove={() => remove(p.id)}>
          <Field label="Project Name"   value={p.name} onChange={v => up(p.id,'name',v)} placeholder="My Awesome Project" />
          <Field label="Description"    value={p.desc} onChange={v => up(p.id,'desc',v)} placeholder="What it does and the impact" multiline />
          <Field label="Technologies"   value={p.tech} onChange={v => up(p.id,'tech',v)} placeholder="React, Node.js, MongoDB" />
          <Field label="Link (optional)"value={p.link} onChange={v => up(p.id,'link',v)} placeholder="github.com/you/project" />
        </EntryCard>
      ))}
    </>
  )
}

function CertificationsSection({ data, onChange }) {
  const items = data.certifications || []
  const add = () => onChange('certifications', [...items, { id: Date.now(), name: '', issuer: '', date: '' }])
  const remove = id => onChange('certifications', items.filter(c => c.id !== id))
  const up = (id, k, v) => onChange('certifications', items.map(c => c.id === id ? { ...c, [k]: v } : c))
  return (
    <>
      <SectionHeader title="Certifications" onAdd={add} />
      {items.map(c => (
        <EntryCard key={c.id} label={c.name || 'New Certification'} onRemove={() => remove(c.id)}>
          <Field label="Certification Name" value={c.name}   onChange={v => up(c.id,'name',v)}   placeholder="AWS Solutions Architect" />
          <Field label="Issuer"             value={c.issuer} onChange={v => up(c.id,'issuer',v)} placeholder="Amazon Web Services" />
          <Field label="Date"               value={c.date}   onChange={v => up(c.id,'date',v)}   placeholder="2023" />
        </EntryCard>
      ))}
    </>
  )
}

function AchievementsSection({ data, onChange }) {
  const items = data.achievements || []
  const add    = () => onChange('achievements', [...items, ''])
  const remove = i  => onChange('achievements', items.filter((_, ai) => ai !== i))
  const up     = (i, v) => onChange('achievements', items.map((a, ai) => ai === i ? v : a))
  return (
    <>
      <SectionHeader title="Achievements" onAdd={add} />
      {items.map((a, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={a} onChange={e => up(i, e.target.value)} placeholder="Top 1% performer in hackathon 2024"
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
          <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-500 transition-colors text-lg leading-none px-1">×</button>
        </div>
      ))}
    </>
  )
}

// ─── Main EditorSection ───────────────────────────────────────────────────────
export default function EditorSection({ section, data, onChange }) {
  const map = {
    personal:       <PersonalSection       data={data} onChange={onChange} />,
    summary:        <SummarySection        data={data} onChange={onChange} />,
    experience:     <ExperienceSection     data={data} onChange={onChange} />,
    education:      <EducationSection      data={data} onChange={onChange} />,
    skills:         <SkillsSection         data={data} onChange={onChange} />,
    projects:       <ProjectsSection       data={data} onChange={onChange} />,
    certifications: <CertificationsSection data={data} onChange={onChange} />,
    achievements:   <AchievementsSection   data={data} onChange={onChange} />,
  }
  return map[section] || null
}
