import React, { useState, useEffect } from 'react';
import './AtelierPortfolio.css';

const AtelierPortfolio = ({ data, onExit }) => {
  const [showIntro, setShowIntro] = useState(true);

  // Lock scroll when intro is visible
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIntro]);

  const { header, summary, experience, projects, skills } = data || {};

  return (
    <div className="atelier-portfolio-wrapper">
      {/* Avant-Garde Login Overlay */}
      <div className={`atelier-intro-overlay ${!showIntro ? 'fade-out' : ''}`}>
        <div className="intro-brand">ATELIER</div>
        <div className="intro-msg">
          Welcome to the Studio.<br/>
          <span style={{ fontSize: '0.875rem', opacity: 0.5, marginTop: '1rem', display: 'block' }}>
            A curated digital space where craftsmanship meets technical precision.
          </span>
        </div>
        <button className="intro-btn" onClick={() => setShowIntro(false)}>Enter</button>
      </div>

      {/* Navigation */}
      <nav className="atelier-nav">
        <div className="atelier-brand">ATELIER</div>
        <button className="atelier-nav-btn" onClick={onExit}>Exit Portfolio</button>
      </nav>

      {/* Main Content (Revealed after intro) */}
      <main>
        {/* Hero Section */}
        <section className="atelier-hero">
          <div className="atelier-label">• {header?.role || 'Digital Artisan'}</div>
          <h1 className="atelier-headline">{header?.name ? header.name.toUpperCase() : 'DECODING THE FUTURE OF LUXE.'}</h1>
          <p className="atelier-hero-desc">
            {summary || "An avant-garde digital workshop blending high-end couture aesthetics with brutalist technical precision. We don't build sites; we curate experiences."}
          </p>
        </section>

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="atelier-section">
            <header className="atelier-section-header">
              <h2 className="atelier-section-title">Professional Trajectory</h2>
            </header>
            <div className="atelier-grid">
              {experience.map((exp, idx) => (
                <article key={idx} className="atelier-card">
                  <div className="card-label">{exp.startDate} — {exp.endDate || 'Present'}</div>
                  <h3 className="card-title">{exp.title}</h3>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1.5rem', color: 'var(--primary)' }}>@ {exp.company}</div>
                  {exp.description && <p className="card-desc">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="card-desc" style={{ paddingLeft: '1.2rem' }}>
                      {exp.highlights.slice(0,3).map((item, idy) => (
                        <li key={idy} style={{ marginBottom: '0.5rem' }}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Works Section */}
        {projects && projects.length > 0 && (
          <section className="atelier-section">
            <header className="atelier-section-header">
              <h2 className="atelier-section-title">Selected Works</h2>
            </header>
            <div className="atelier-grid">
              {projects.map((proj, idx) => (
                <article key={idx} className="atelier-card">
                  <div className="card-label">CASE STUDY {String(idx + 1).padStart(2, '0')}</div>
                  <h3 className="card-title">{proj.title}</h3>
                  {proj.description && <p className="card-desc">{proj.description}</p>}
                  <div className="card-meta">
                    {proj.technologies && proj.technologies.slice(0, 4).map((tech, tidx) => (
                      <span key={tidx} className="meta-pill">{tech}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.categories && skills.categories.length > 0 && (
          <section className="atelier-section" style={{ paddingBottom: '12rem' }}>
            <header className="atelier-section-header">
              <h2 className="atelier-section-title">Technical Apparatus</h2>
            </header>
            <div className="atelier-skills-container">
              {skills.categories.map((cat, idx) => (
                <div key={idx} className="skill-category">
                  <h4 className="skill-category-title">{cat.name}</h4>
                  <div className="skill-list">
                    {cat.items.map((item, iDx) => (
                      <span key={iDx} className="skill-item">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AtelierPortfolio;
