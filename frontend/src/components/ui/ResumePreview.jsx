import { forwardRef } from 'react'

const TEMPLATE_CONFIGS = {
  classic:   { headerBg: '#1e293b',                              accent: '#6366f1', font: 'Georgia, serif' },
  modern:    { headerBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', accent: '#6366f1', font: 'system-ui, sans-serif' },
  minimal:   { headerBg: 'transparent',                          accent: '#0f172a', font: 'system-ui, sans-serif' },
  executive: { headerBg: '#0f172a',                              accent: '#d97706', font: 'Georgia, serif' },
}

function SectionTitle({ title, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontWeight: 800, fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.2px', color: accent, whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: `${accent}35` }} />
    </div>
  )
}

function Chip({ label, accent }) {
  return (
    <span style={{ background: `${accent}18`, color: accent, padding: '2px 9px', borderRadius: 99, fontSize: 9, fontWeight: 700, display: 'inline-block', margin: '1px 2px' }}>
      {label}
    </span>
  )
}

const ResumePreview = forwardRef(function ResumePreview({ data, template = 'classic' }, ref) {
  const t = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.classic
  const isMinimal = template === 'minimal'
  const { personal, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div ref={ref} className="resume-preview" style={{ fontFamily: t.font, fontSize: '10.5px', lineHeight: 1.55, color: '#1e293b', background: '#fff', padding: '36px', minHeight: '297mm' }}>

      {/* Header */}
      {isMinimal ? (
        <div style={{ paddingBottom: 16, marginBottom: 18, borderBottom: `3px solid ${t.accent}` }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>{personal.name}</div>
          <div style={{ fontSize: 12, color: t.accent, fontWeight: 700, marginBottom: 8 }}>{personal.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 9, color: '#475569' }}>
            {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>
      ) : (
        <div style={{ background: t.headerBg, borderRadius: 8, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>{personal.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 600, marginBottom: 8 }}>{personal.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 9, color: 'rgba(255,255,255,.65)' }}>
            {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Professional Summary" accent={t.accent} />
          <p style={{ color: '#475569', fontSize: 10 }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Experience" accent={t.accent} />
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{e.role}</div>
                  <div style={{ color: t.accent, fontSize: 10, fontWeight: 600 }}>{e.company}</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 9, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.period}</div>
              </div>
              <ul style={{ margin: '5px 0 0', paddingLeft: 14 }}>
                {e.bullets?.map((b, bi) => <li key={bi} style={{ color: '#475569', fontSize: 9.5, marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Education" accent={t.accent} />
          {education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 11 }}>{e.degree}</div>
                <div style={{ color: t.accent, fontSize: 10 }}>{e.school}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 9 }}>{e.period}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Skills" accent={t.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[...(skills.technical || []), ...(skills.soft || [])].map(s => <Chip key={s} label={s} accent={t.accent} />)}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Projects" accent={t.accent} />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{p.name}</div>
              <div style={{ color: '#475569', fontSize: 9.5 }}>{p.desc}</div>
              <div style={{ color: t.accent, fontSize: 9, marginTop: 2 }}>{p.tech}</div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Certifications" accent={t.accent} />
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 10 }}>{c.name}</span>
              <span style={{ color: '#94a3b8', fontSize: 9 }}> — {c.issuer} ({c.date})</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle title="Achievements" accent={t.accent} />
          <ul style={{ paddingLeft: 14, margin: 0 }}>
            {achievements.map((a, i) => <li key={i} style={{ fontSize: 9.5, color: '#475569', marginBottom: 2 }}>{a}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
})

export default ResumePreview
