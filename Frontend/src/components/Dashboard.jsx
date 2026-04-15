import React from 'react';
import Header from './Header';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onEdit, onNew, onUpload, data, atsScore, onViewPortfolio, savedResumes, onDelete, onLoad, themeMode = 'dark', onToggleTheme }) => {
  const primarySkillItems = data?.skills?.categories?.[0]?.items;
  const parsedSkills = Array.isArray(primarySkillItems)
    ? primarySkillItems
    : (primarySkillItems ? String(primarySkillItems).split(',').map((item) => item.trim()).filter(Boolean) : []);
  const experienceCount = Array.isArray(data?.experience)
    ? data.experience.filter((item) => item?.company || item?.role).length
    : 0;
  const projectCount = Array.isArray(data?.projects)
    ? data.projects.filter((item) => item?.title).length
    : 0;
  const score = atsScore?.overall || 0;

  const scoreColor = score >= 75 ? 'var(--rf-success)' : score >= 50 ? 'var(--rf-accent)' : 'var(--rf-danger)';

  return (
    <div className="dash-page">
      <Header
        title="Resume Fix"
        subtitle="Personal Workspace"
        user={user}
        onLogout={onLogout}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        activeView="dashboard"
        onNavigate={(view) => {
          if (view === 'editor') onEdit();
          if (view === 'portfolio') onViewPortfolio();
        }}
      />

      <main className="dash-main">
        <div className="dash-container">
          {/* ── Left Column: Hero + Actions ── */}
          <section className="dash-hero">

            <h2 className="dash-headline">
              Craft Your <span className="dash-headline-accent">Story</span>
            </h2>

            <p className="dash-description">
              Refine your narrative, sharpen your impact, and create a resume that stands out.
              ATS-optimized for maximum visibility.
            </p>

            {/* Stats Row */}
            <div className="dash-stats-row">
              <div className="dash-stat-card">
                <span className="dash-stat-label">ATS Score</span>
                <div className="dash-stat-value" style={{ color: scoreColor }}>{score}<span className="dash-stat-unit">/100</span></div>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Experience</span>
                <div className="dash-stat-value">{experienceCount}</div>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Projects</span>
                <div className="dash-stat-value">{projectCount}</div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="dash-actions-primary">
              <button onClick={onEdit} className="dash-btn dash-btn-primary" id="btn-continue-editing">
                <span className="material-symbols-outlined">edit_note</span>
                Continue Editing
              </button>
              <button onClick={onViewPortfolio} className="dash-btn dash-btn-secondary" id="btn-view-portfolio">
                <span className="material-symbols-outlined">visibility</span>
                View Portfolio
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="dash-actions-secondary">
              <button onClick={onNew} className="dash-action-card" id="btn-new-resume">
                <div className="dash-action-icon">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <div className="dash-action-text">
                  <span className="dash-action-title">New Resume</span>
                  <span className="dash-action-desc">Start from template</span>
                </div>
              </button>
              <button onClick={onUpload} className="dash-action-card" id="btn-upload-resume">
                <div className="dash-action-icon">
                  <span className="material-symbols-outlined">cloud_upload</span>
                </div>
                <div className="dash-action-text">
                  <span className="dash-action-title">Upload Resume</span>
                  <span className="dash-action-desc">Import existing PDF</span>
                </div>
              </button>
            </div>
          </section>

          {/* ── Right Column: Preview Card ── */}
          <aside className="dash-preview">
            <div className="dash-preview-card">
              <div className="dash-preview-glow"></div>

              <div className="dash-preview-header">
                <span className="dash-preview-label">Active Draft</span>
                <div className="dash-preview-score" style={{ '--score-color': scoreColor }}>
                  <span className="dash-preview-score-value">{score}</span>
                  <span className="dash-preview-score-label">ATS</span>
                </div>
              </div>

              <h3 className="dash-preview-name">{data?.header?.name || 'Your Name'}</h3>
              <p className="dash-preview-role">{data?.header?.title || 'Software Developer'}</p>

              <div className="dash-preview-divider"></div>

              <div className="dash-preview-details">
                <div className="dash-preview-detail">
                  <h4 className="dash-preview-detail-label">Key Skills</h4>
                  <p className="dash-preview-detail-value">
                    {parsedSkills.length > 0 ? parsedSkills.slice(0, 4).join(' · ') : 'Not yet specified'}
                  </p>
                </div>
                <div className="dash-preview-detail">
                  <h4 className="dash-preview-detail-label">Latest Project</h4>
                  <p className="dash-preview-detail-value">
                    {data?.projects?.[0]?.title || 'Not yet specified'}
                  </p>
                </div>
              </div>

              {/* Mini resume skeleton */}
              <div className="dash-preview-skeleton">
                <div className="dash-skeleton-header">
                  <div className="dash-skeleton-bar dash-skeleton-gold" style={{ width: '55%' }}></div>
                  <div className="dash-skeleton-bar" style={{ width: '35%' }}></div>
                </div>
                <div className="dash-skeleton-body">
                  <div className="dash-skeleton-line" style={{ width: '100%' }}></div>
                  <div className="dash-skeleton-line" style={{ width: '85%' }}></div>
                  <div className="dash-skeleton-line" style={{ width: '70%' }}></div>
                  <div className="dash-skeleton-line" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Score progress bar */}
              <div className="dash-preview-progress">
                <div className="dash-preview-progress-bar" style={{ width: `${score}%`, background: scoreColor }}></div>
              </div>
            </div>

            <div className="dash-quote-card">
              <p className="dash-quote-text">
                "Your resume is not a list of jobs — it is a curated portfolio of your impact."
              </p>
            </div>
          </aside>
        </div>

        {/* ── Saved Resumes ── */}
        {savedResumes && savedResumes.length > 0 && (
          <section className="dash-saved-section">
            <div className="dash-saved-container">
              <h3 className="dash-saved-title">
                <span className="material-symbols-outlined">folder_open</span>
                Saved Drafts
              </h3>
              <div className="dash-saved-list">
                {savedResumes.map((resume) => (
                  <div className="dash-saved-card" key={resume.id}>
                    <div className="dash-saved-info">
                      <span className="material-symbols-outlined dash-saved-icon">description</span>
                      <div>
                        <span className="dash-saved-name">{resume.title}</span>
                        <span className="dash-saved-date">
                          {new Date(resume.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="dash-saved-actions">
                      <button
                        className="dash-saved-btn dash-saved-btn-load"
                        onClick={() => onLoad(resume.data)}
                      >
                        <span className="material-symbols-outlined">open_in_new</span>
                        Load
                      </button>
                      <button
                        className="dash-saved-btn dash-saved-btn-delete"
                        onClick={() => onDelete(resume.id)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer Stats ── */}
        <div className="dash-footer-tags">
          <span className="dash-footer-tag">{parsedSkills.length} Skills Curated</span>
          <span className="dash-footer-tag">{projectCount} Projects</span>
          <span className="dash-footer-tag">{experienceCount} Experience Entries</span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
