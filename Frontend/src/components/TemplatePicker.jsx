import React, { useState } from 'react';
import './TemplatePicker.css';
import { initialResumeState } from '../data';

// Import actual template components
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import BusinessTemplate from './templates/BusinessTemplate';
import SimpleTemplate from './templates/SimpleTemplate';

const TEMPLATES = [
  {
    id: 'executive',
    name: 'Executive Pro',
    category: 'professional',
    badge: 'Most Popular',
    badgeColor: '#6338f0',
    desc: 'Classic two-column layout trusted by Fortune 500 recruiters.',
    tags: ['ATS Optimised', 'Clean', 'Structured'],
    Component: ExecutiveTemplate
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    category: 'business',
    badge: 'Business',
    badgeColor: '#0369a1',
    desc: 'Bold header with sidebar — perfect for management & finance roles.',
    tags: ['Sidebar', 'Bold', 'Corporate'],
    Component: CorporateTemplate
  },
  {
    id: 'modern',
    name: 'Modern Creative',
    category: 'creative',
    badge: 'Trending',
    badgeColor: '#7c3aed',
    desc: 'Vibrant accent lines and fresh typography for tech & design.',
    tags: ['Colorful', 'Modern', 'Tech'],
    Component: ModernTemplate
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    category: 'simple',
    badge: 'Simple',
    badgeColor: '#374151',
    desc: 'Pure content focus with generous whitespace. Less is more.',
    tags: ['Minimal', 'Classic', 'Whitespace'],
    Component: MinimalTemplate
  },
  {
    id: 'business',
    name: 'Business Standard',
    category: 'business',
    badge: 'Business',
    badgeColor: '#0f766e',
    desc: 'Structured timeline format ideal for sales & operations.',
    tags: ['Timeline', 'Bold Titles', 'Formal'],
    Component: BusinessTemplate
  },
  {
    id: 'simple',
    name: 'Simple & Clean',
    category: 'simple',
    badge: 'Beginner',
    badgeColor: '#65a30d',
    desc: 'One-page straightforward layout — great for first jobs.',
    tags: ['One Page', 'Easy', 'Quick'],
    Component: SimpleTemplate
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: 'auto_awesome' },
  { id: 'professional', label: 'Professional', icon: 'work' },
  { id: 'business', label: 'Business', icon: 'business_center' },
  { id: 'simple', label: 'Simple', icon: 'article' },
  { id: 'creative', label: 'Creative', icon: 'palette' },
];

const TemplatePicker = ({ onSelect, onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = activeTab === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.category === activeTab);

  return (
    <div className="tp-page animate-fade-in">
      <div className="tp-header">
        <button className="tp-back-btn" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Dashboard</span>
        </button>

        <div className="tp-hero">
          <div className="tp-glow" />
          <h1 className="tp-title">
            Select Your <span>Masterpiece</span>
          </h1>
          <p className="tp-subtitle">
            Every template is meticulously engineered for ATS systems. Select a foundation and customise everything later.
          </p>
        </div>

        <div className="tp-filters">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all' ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat.id).length;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`tp-filter-btn ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                {cat.label}
                <span className="tp-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tp-grid-wrapper">
        <div className="tp-grid">
          {filtered.map((tpl) => {
            const isHovered = hoveredId === tpl.id;
            const TemplateComponent = tpl.Component;

            return (
              <div 
                key={tpl.id} 
                className="tp-card"
                onMouseEnter={() => setHoveredId(tpl.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ '--tpl-accent': tpl.badgeColor }}
                onClick={() => onSelect(tpl.id)}
              >
                {tpl.badge && (
                  <div className="tp-card-badge" style={{ background: tpl.badgeColor, boxShadow: `0 4px 12px ${tpl.badgeColor}60` }}>
                    {tpl.badge}
                  </div>
                )}

                <div className="tp-card-preview-container">
                  <div className="tp-card-preview-target">
                     {/* We render the literal component, but scaled down securely via CSS */}
                     {TemplateComponent && <TemplateComponent data={initialResumeState} />}
                  </div>
                </div>

                <div className="tp-card-content">
                  <h3 className="tp-card-title">{tpl.name}</h3>
                  <p className="tp-card-desc">{tpl.desc}</p>
                  <div className="tp-card-tags">
                    {tpl.tags.map(tag => (
                      <span key={tag} className="tp-card-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className={`tp-card-overlay ${isHovered ? 'visible' : ''}`}>
                  <button className="tp-card-btn" onClick={(e) => { e.stopPropagation(); onSelect(tpl.id); }}>
                    <span className="material-symbols-outlined">magic_button</span>
                    Use This Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="tp-footer-gradient" />
    </div>
  );
};

export default TemplatePicker;
