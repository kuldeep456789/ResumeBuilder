import React, { useState } from 'react';
import './TemplatePicker.css';

const TEMPLATES = [
  {
    id: 'executive',
    name: 'Executive Pro',
    category: 'professional',
    badge: 'Most Popular',
    badgeColor: '#6338f0',
    desc: 'Classic two-column layout trusted by Fortune 500 recruiters.',
    tags: ['ATS Optimised', 'Clean', 'Structured'],
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    category: 'business',
    badge: 'Business',
    badgeColor: '#0369a1',
    desc: 'Bold header with sidebar — perfect for management & finance roles.',
    tags: ['Sidebar', 'Bold', 'Corporate'],
  },
  {
    id: 'modern',
    name: 'Modern Creative',
    category: 'creative',
    badge: 'Trending',
    badgeColor: '#7c3aed',
    desc: 'Vibrant accent lines and fresh typography for tech & design.',
    tags: ['Colorful', 'Modern', 'Tech'],
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    category: 'simple',
    badge: 'Simple',
    badgeColor: '#374151',
    desc: 'Pure content focus with generous whitespace. Less is more.',
    tags: ['Minimal', 'Classic', 'Whitespace'],
  },
  {
    id: 'business',
    name: 'Business Standard',
    category: 'business',
    badge: 'Business',
    badgeColor: '#0f766e',
    desc: 'Structured timeline format ideal for sales & operations.',
    tags: ['Timeline', 'Bold Titles', 'Formal'],
  },
  {
    id: 'simple',
    name: 'Simple & Clean',
    category: 'simple',
    badge: 'Beginner',
    badgeColor: '#65a30d',
    desc: 'One-page straightforward layout — great for first jobs.',
    tags: ['One Page', 'Easy', 'Quick'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: 'auto_awesome' },
  { id: 'professional', label: 'Professional', icon: 'work' },
  { id: 'business', label: 'Business', icon: 'business_center' },
  { id: 'simple', label: 'Simple', icon: 'article' },
  { id: 'creative', label: 'Creative', icon: 'palette' },
];

/* ═══════════════════════════════════════════════
   UNIQUE PREVIEW COMPONENTS — each looks totally different
   ═══════════════════════════════════════════════ */

/* 1. EXECUTIVE PRO — Dark navy header, two-column, gold accents */
const PreviewExecutive = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
    {/* Navy header band */}
    <div style={{ background: '#1e3a5f', padding: '20px 22px 14px' }}>
      <div style={{ width: '55%', height: 16, background: '#c9a84c', borderRadius: 2, marginBottom: 6 }} />
      <div style={{ width: '38%', height: 8, background: 'rgba(255,255,255,0.45)', borderRadius: 2, marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[28, 24, 22].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} />
            <div style={{ width: w * 2, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
    {/* Gold divider */}
    <div style={{ height: 3, background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)' }} />
    {/* Two column body */}
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left col */}
      <div style={{ width: '58%', padding: '14px 12px 14px 22px', borderRight: '1px solid #e8ecf0' }}>
        {[
          { label: 'EXPERIENCE', lines: [100, 85, 70, 90, 75] },
          { label: 'PROJECTS', lines: [80, 65] },
        ].map(sec => (
          <div key={sec.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 6, fontWeight: 800, letterSpacing: '0.2em', color: '#1e3a5f', marginBottom: 5, borderBottom: '1.5px solid #1e3a5f', paddingBottom: 2 }}>{sec.label}</div>
            {sec.lines.map((w, i) => (
              <div key={i} style={{ height: 6, width: `${w}%`, background: i === 0 ? '#94a3b8' : '#dde4ee', borderRadius: 2, marginBottom: 4 }} />
            ))}
          </div>
        ))}
      </div>
      {/* Right col */}
      <div style={{ flex: 1, padding: '14px 12px 14px 12px', background: '#f8f9fd' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 6, fontWeight: 800, letterSpacing: '0.2em', color: '#1e3a5f', marginBottom: 5 }}>SKILLS</div>
          {[85, 70, 90, 65, 80].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
              <div style={{ flex: 1, height: 5, background: '#e8ecf0', borderRadius: 999 }}>
                <div style={{ width: `${w}%`, height: '100%', background: 'linear-gradient(90deg, #1e3a5f, #3d6b9f)', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 6, fontWeight: 800, letterSpacing: '0.2em', color: '#1e3a5f', marginBottom: 5 }}>EDUCATION</div>
          {[70, 55].map((w, i) => (
            <div key={i} style={{ height: 6, width: `${w}%`, background: '#dde4ee', borderRadius: 2, marginBottom: 4 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* 2. CORPORATE ELITE — Deep blue sidebar + photo, white right panel, bold blue text */
const PreviewCorporate = () => (
  <div style={{ height: '100%', display: 'flex', fontFamily: 'sans-serif', overflow: 'hidden' }}>
    {/* Dark sidebar */}
    <div style={{ width: '36%', background: 'linear-gradient(175deg, #0c2d6b 0%, #0369a1 100%)', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Avatar circle */}
      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', marginBottom: 8 }} />
      <div style={{ width: '80%', height: 9, background: 'rgba(255,255,255,0.85)', borderRadius: 2, marginBottom: 4 }} />
      <div style={{ width: '55%', height: 6, background: 'rgba(255,255,255,0.45)', borderRadius: 2, marginBottom: 14 }} />
      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 10 }} />
      {/* Skills in sidebar */}
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: 5.5, fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', marginBottom: 6, textTransform: 'uppercase' }}>Skills</div>
        {['Python', 'React', 'SQL', 'AWS'].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 4, padding: '3px 6px', marginBottom: 4, fontSize: 5.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{s}</div>
        ))}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.2)', margin: '8px 0' }} />
        <div style={{ fontSize: 5.5, fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', marginBottom: 5, textTransform: 'uppercase' }}>Languages</div>
        {[75, 60].map((w, i) => (
          <div key={i} style={{ height: 5, width: `${w}%`, background: 'rgba(255,255,255,0.25)', borderRadius: 999, marginBottom: 5 }} />
        ))}
      </div>
    </div>
    {/* White right panel */}
    <div style={{ flex: 1, padding: '18px 14px', background: '#fff' }}>
      <div style={{ width: '90%', height: 14, background: '#0369a1', borderRadius: 2, marginBottom: 5, opacity: 0.9 }} />
      <div style={{ width: '55%', height: 7, background: '#94a3b8', borderRadius: 2, marginBottom: 4 }} />
      <div style={{ width: '70%', height: 6, background: '#cbd5e1', borderRadius: 2, marginBottom: 12 }} />
      {[
        { label: 'WORK EXPERIENCE', lines: [100, 80, 70, 90, 65] },
        { label: 'ACHIEVEMENTS', lines: [85, 75, 60] },
      ].map(sec => (
        <div key={sec.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 5.5, fontWeight: 800, color: '#0369a1', letterSpacing: '0.15em', borderBottom: '1.5px solid #0369a1', paddingBottom: 3, marginBottom: 5 }}>{sec.label}</div>
          {sec.lines.map((w, i) => (
            <div key={i} style={{ height: 5.5, width: `${w}%`, background: i === 0 ? '#94a3b8' : '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* 3. MODERN CREATIVE — Vivid purple gradient header, accent lines left, tech-feel */
const PreviewModern = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
    {/* Vivid header */}
    <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a855f7 100%)', padding: '18px 20px 14px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -14, right: -14, width: 60, height: 60, border: '10px solid rgba(255,255,255,0.08)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: -20, right: 20, width: 40, height: 40, border: '6px solid rgba(255,255,255,0.06)', borderRadius: '50%' }} />
      <div style={{ width: '60%', height: 16, background: '#fff', borderRadius: 3, opacity: 0.95, marginBottom: 6 }} />
      <div style={{ width: '40%', height: 7, background: 'rgba(255,255,255,0.55)', borderRadius: 2, marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        {['Portfolio', 'GitHub', 'LinkedIn'].map((t, i) => (
          <div key={i} style={{ padding: '2px 8px', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, fontSize: 5, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{t}</div>
        ))}
      </div>
    </div>
    {/* Body */}
    <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
        { label: 'EXPERIENCE', accent: '#7c3aed', lines: [100, 80, 70, 90] },
        { label: 'SKILLS', accent: '#7c3aed', chips: true },
        { label: 'PROJECTS', accent: '#7c3aed', lines: [85, 65] },
      ].map(sec => (
        <div key={sec.label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 3, height: 12, background: sec.accent, borderRadius: 2 }} />
            <div style={{ fontSize: 6, fontWeight: 800, letterSpacing: '0.15em', color: sec.accent }}>{sec.label}</div>
          </div>
          {sec.chips ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['React', 'Node', 'Python', 'AWS', 'Docker', 'SQL'].map((s, i) => (
                <div key={i} style={{ padding: '2px 7px', background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: 999, fontSize: 5, color: '#7c3aed', fontWeight: 700 }}>{s}</div>
              ))}
            </div>
          ) : sec.lines.map((w, i) => (
            <div key={i} style={{ height: 6, width: `${w}%`, background: i === 0 ? '#c4b5fd' : '#ede9fe', borderRadius: 2, marginBottom: 4 }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* 4. CLEAN MINIMAL — Pure white, centered name, serif-feel, lots of breathing room */
const PreviewMinimal = () => (
  <div style={{ height: '100%', background: '#fff', padding: '22px 24px', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column' }}>
    {/* Centered header */}
    <div style={{ textAlign: 'center', marginBottom: 14 }}>
      <div style={{ width: '55%', height: 16, background: '#1a1a1a', borderRadius: 2, margin: '0 auto 7px' }} />
      <div style={{ width: '40%', height: 7, background: '#9ca3af', borderRadius: 2, margin: '0 auto 5px' }} />
      <div style={{ width: '70%', height: 5, background: '#d1d5db', borderRadius: 2, margin: '0 auto' }} />
    </div>
    {/* Thin full-width rule */}
    <div style={{ height: 1, background: '#1a1a1a', marginBottom: 14 }} />
    {/* Sections with generous spacing */}
    {[
      { label: 'Experience', lines: [100, 85, 70] },
      { label: 'Education', lines: [80, 60] },
      { label: 'Skills', lines: [90, 70, 55] },
    ].map((sec, idx) => (
      <div key={sec.label} style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', color: '#1a1a1a', textTransform: 'uppercase' }}>{sec.label}</div>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>
        {sec.lines.map((w, i) => (
          <div key={i} style={{ height: 5.5, width: `${w}%`, background: i === 0 ? '#6b7280' : '#d1d5db', borderRadius: 1, marginBottom: 4 }} />
        ))}
      </div>
    ))}
  </div>
);

/* 5. BUSINESS STANDARD — Teal accent, timeline with dots, stat boxes at top */
const PreviewBusiness = () => (
  <div style={{ height: '100%', background: '#f0fdfa', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
    {/* Teal banner */}
    <div style={{ background: '#0f766e', padding: '16px 20px', borderBottom: '4px solid #0d9488' }}>
      <div style={{ width: '65%', height: 15, background: '#fff', borderRadius: 2, opacity: 0.95, marginBottom: 5 }} />
      <div style={{ width: '40%', height: 7, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
    </div>
    {/* Stat boxes row */}
    <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: '#ccfbf1', borderBottom: '1px solid #99f6e4' }}>
      {['8 yrs Exp', '12 Projects', 'MBA'].map((t, i) => (
        <div key={i} style={{ flex: 1, background: '#fff', border: '1px solid #99f6e4', borderRadius: 6, padding: '5px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: 5, fontWeight: 800, color: '#0f766e' }}>{t}</div>
        </div>
      ))}
    </div>
    {/* Timeline body */}
    <div style={{ flex: 1, padding: '10px 16px 10px 10px', overflow: 'hidden' }}>
      {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((label, secIdx) => (
        <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {/* Timeline spine */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12, flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f766e', border: '2px solid #ccfbf1', flexShrink: 0 }} />
            {secIdx < 2 && <div style={{ width: 2, flex: 1, background: '#99f6e4', marginTop: 2 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: 2 }}>
            <div style={{ fontSize: 6, fontWeight: 800, color: '#0f766e', letterSpacing: '0.12em', marginBottom: 5 }}>{label}</div>
            {(secIdx === 2
              ? ['React · Node.js', 'AWS · Docker', 'Python · SQL']
              : [100, 80, 65].map(w => w)
            ).map((item, i) => (
              typeof item === 'string'
                ? <div key={i} style={{ padding: '2px 6px', background: '#ccfbf1', border: '1px solid #99f6e4', borderRadius: 4, fontSize: 5, color: '#0f766e', fontWeight: 600, marginBottom: 3, display: 'inline-block', marginRight: 4 }}>{item}</div>
                : <div key={i} style={{ height: 5.5, width: `${item}%`, background: i === 0 ? '#2dd4bf' : '#99f6e4', borderRadius: 2, marginBottom: 4 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* 6. SIMPLE & CLEAN — Bright green accent, one-column, friendly & airy */
const PreviewSimple = () => (
  <div style={{ height: '100%', background: '#fff', padding: '20px 22px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
    {/* Large name area */}
    <div style={{ marginBottom: 6 }}>
      <div style={{ width: '60%', height: 18, background: '#111827', borderRadius: 2, marginBottom: 5 }} />
      <div style={{ width: '40%', height: 8, background: '#65a30d', borderRadius: 2, opacity: 0.8, marginBottom: 6 }} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {[48, 42, 38].map((w, i) => (
          <div key={i} style={{ height: 6, width: w, background: '#d1d5db', borderRadius: 99 }} />
        ))}
      </div>
    </div>
    {/* Green full divider */}
    <div style={{ height: 3, background: 'linear-gradient(90deg, #65a30d, #84cc16)', borderRadius: 999, marginBottom: 14 }} />
    {/* Sections */}
    {[
      { label: 'Objective', lines: [100, 85, 70], color: '#65a30d' },
      { label: 'Work Experience', lines: [100, 75, 60, 80], color: '#65a30d' },
      { label: 'Education', lines: [85, 55], color: '#65a30d' },
      { label: 'Skills', chips: ['HTML', 'CSS', 'JS', 'React'], color: '#65a30d' },
    ].map(sec => (
      <div key={sec.label} style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 6.5, fontWeight: 800, color: sec.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>{sec.label}</div>
        {sec.chips
          ? <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {sec.chips.map((c, i) => (
                <div key={i} style={{ padding: '1px 8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, fontSize: 5.5, color: '#15803d', fontWeight: 700 }}>{c}</div>
              ))}
            </div>
          : sec.lines.map((w, i) => (
              <div key={i} style={{ height: 5.5, width: `${w}%`, background: i === 0 ? '#86efac' : '#dcfce7', borderRadius: 2, marginBottom: 4 }} />
            ))
        }
      </div>
    ))}
  </div>
);

const PREVIEW_MAP = {
  executive: PreviewExecutive,
  corporate: PreviewCorporate,
  modern:    PreviewModern,
  minimal:   PreviewMinimal,
  business:  PreviewBusiness,
  simple:    PreviewSimple,
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
const TemplatePicker = ({ onSelect, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelect = (id) => {
    setSelectedId(id);
    setTimeout(() => onSelect(id), 300);
  };

  return (
    <div className="tp-page">
      {/* Back */}
      <button className="tp-back-btn" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="tp-header">
        <div className="tp-header-eyebrow">
          <span className="material-symbols-outlined">auto_awesome</span>
          Resume Templates
        </div>
        <h1 className="tp-title">
          Choose Your <span className="tp-title-accent">Perfect</span> Template
        </h1>
        <p className="tp-subtitle">
          Each template has a unique layout and style. Pick one, then personalise every detail in the editor.
        </p>
      </div>

      {/* Category Filters */}
      <div className="tp-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`tp-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="material-symbols-outlined">{cat.icon}</span>
            {cat.label}
            {cat.id !== 'all' && (
              <span className="tp-filter-count">
                {TEMPLATES.filter((t) => t.category === cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="tp-grid-wrapper">
        <div className="tp-grid">
          {filtered.map((tpl) => {
            const PreviewComp = PREVIEW_MAP[tpl.id];
            const isSelected = selectedId === tpl.id;
            const isHovered = hoveredId === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`tp-card ${isSelected ? 'tp-card--selected' : ''}`}
                style={{ '--tpl-accent': tpl.badgeColor }}
                onMouseEnter={() => setHoveredId(tpl.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSelect(tpl.id)}
              >
                <div className="tp-card-badge" style={{ background: tpl.badgeColor }}>
                  {tpl.badge}
                </div>

                <div className="tp-card-preview">
                  <PreviewComp />
                  <div className={`tp-card-overlay ${isHovered || isSelected ? 'visible' : ''}`}>
                    <button className="tp-select-btn" onClick={(e) => { e.stopPropagation(); handleSelect(tpl.id); }}>
                      <span className="material-symbols-outlined">
                        {isSelected ? 'check_circle' : 'edit_note'}
                      </span>
                      {isSelected ? 'Starting...' : 'Use This Template'}
                    </button>
                  </div>
                </div>

                <div className="tp-card-info">
                  <div className="tp-card-info-top">
                    <h3 className="tp-card-title">{tpl.name}</h3>
                    <div className="tp-card-cat-dot" style={{ background: tpl.badgeColor }} />
                  </div>
                  <p className="tp-card-desc">{tpl.desc}</p>
                  <div className="tp-card-tags">
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="tp-card-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tp-bottom-note">
        <span className="material-symbols-outlined">info</span>
        You can switch templates at any time from the editor settings.
      </div>
    </div>
  );
};

export default TemplatePicker;
