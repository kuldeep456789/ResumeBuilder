import React from 'react';
import './TemplateStyles.css';

const TechnicalTemplate = React.forwardRef(({ data }, ref) => {
  const { header, skills, experience, projects, education, achievements, certifications } = data;

  const fontStyle = {
    fontFamily: data.settings?.fontFamily || "'Inter', sans-serif",
    '--tpl-primary': data.settings?.themeColor || '#1d4ed8'
  };

  const primarySkillItems = skills?.categories?.[0]?.items;
  const parsedSkills = Array.isArray(primarySkillItems) 
    ? primarySkillItems 
    : (primarySkillItems ? String(primarySkillItems).split(',').map(s => s.trim()) : []);

  return (
    <div className="tpl-technical-container" style={fontStyle} ref={ref}>
      
      {/* HEADER SECTION */}
      <div className="tpl-technical-header">
        <h1 className="tpl-technical-name">{header?.name || 'Your Name'}</h1>
        <div className="tpl-technical-contact-grid">
          <div className="tpl-technical-contact-col left">
            {header?.social?.linkedin && (
              <div>LinkedIn: <a href={header.social.linkedin.startsWith('http') ? header.social.linkedin : `https://${header.social.linkedin}`} target="_blank" rel="noreferrer">{header.social.linkedin.replace(/https?:\/\/(www\.)?/, '')}</a></div>
            )}
            {header?.social?.github && (
              <div>GitHub: <a href={header.social.github.startsWith('http') ? header.social.github : `https://${header.social.github}`} target="_blank" rel="noreferrer">{header.social.github.replace(/https?:\/\/(www\.)?/, '')}</a></div>
            )}
            {header?.social?.portfolio && (
              <div>Portfolio: <a href={header.social.portfolio.startsWith('http') ? header.social.portfolio : `https://${header.social.portfolio}`} target="_blank" rel="noreferrer">{header.social.portfolio.replace(/https?:\/\/(www\.)?/, '')}</a></div>
            )}
          </div>
          <div className="tpl-technical-contact-col right">
            {header?.email && (
              <div>Email: <a href={`mailto:${header.email}`}>{header.email}</a></div>
            )}
            {header?.phone && (
              <div>Mobile: {header.phone}</div>
            )}
             {header?.location && (
              <div>Location: {header.location}</div>
            )}
          </div>
        </div>
      </div>

      {/* SKILLS SECTION */}
      {parsedSkills.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">SKILLS</h2>
          <div className="tpl-technical-divider" />
          <div className="tpl-technical-skills-list">
            {skills.categories?.map((cat, idx) => {
              const catItems = Array.isArray(cat.items) ? cat.items : (cat.items ? String(cat.items).split(',').map(s => s.trim()) : []);
              if (!cat.name && catItems.length === 0) return null;
              return (
                <div key={idx} className="tpl-technical-skill-line">
                  {cat.name && <span className="tpl-technical-skill-name">{cat.name}:</span>} {catItems.join(', ')}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">WORK EXPERIENCE</h2>
          <div className="tpl-technical-divider" />
          {experience.map((exp, idx) => (
            <div key={idx} className="tpl-technical-item">
              <div className="tpl-technical-item-header">
                <div>
                  <span className="tpl-technical-item-title">{exp.company}</span>
                  {exp.role && <span className="tpl-technical-item-subtitle"> | {exp.role}</span>}
                </div>
                <div className="tpl-technical-item-date">{exp.date}</div>
              </div>
              {exp.description && (
                <ul className="tpl-technical-bullets">
                  {(Array.isArray(exp.description) ? exp.description : exp.description.split('\n')).map((bullet, i) => {
                    const text = bullet.trim().replace(/^[-•]\s*/, '');
                    return text ? <li key={i}>{text}</li> : null;
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">PROJECTS</h2>
          <div className="tpl-technical-divider" />
          {projects.map((proj, idx) => (
            <div key={idx} className="tpl-technical-item">
              <div className="tpl-technical-item-header">
                <div>
                  <span className="tpl-technical-item-title">{proj.title}</span>
                  {proj.link && <span className="tpl-technical-item-subtitle"> | <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}>Link</a></span>}
                  {proj.technologies && <span className="tpl-technical-item-tech"> | {proj.technologies}</span>}
                </div>
                <div className="tpl-technical-item-date">{proj.date}</div>
              </div>
              {proj.description && (
                <ul className="tpl-technical-bullets">
                  {(Array.isArray(proj.description) ? proj.description : proj.description.split('\n')).map((bullet, i) => {
                    const text = bullet.trim().replace(/^[-•]\s*/, '');
                    return text ? <li key={i}>{text}</li> : null;
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS / TRAINING */}
      {certifications && certifications.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">TRAINING</h2>
          <div className="tpl-technical-divider" />
          {certifications.map((cert, idx) => (
            <div key={idx} className="tpl-technical-item">
               <div className="tpl-technical-item-header">
                  <div>
                    <span className="tpl-technical-item-title">{cert.name}</span>
                    {cert.issuer && <span className="tpl-technical-item-subtitle"> | {cert.issuer}</span>}
                  </div>
                  <div className="tpl-technical-item-date">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements && achievements.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">ACHIEVEMENTS</h2>
          <div className="tpl-technical-divider" />
          <ul className="tpl-technical-bullets-standalone">
            {achievements.map((ach, idx) => {
               const text = typeof ach === 'string' ? ach : (ach.title || '');
               return text.trim() ? <li key={idx}>{text}</li> : null;
            })}
          </ul>
        </div>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div className="tpl-technical-section">
          <h2 className="tpl-technical-section-title">EDUCATION</h2>
          <div className="tpl-technical-divider" />
          {education.map((edu, idx) => (
            <div key={idx} className="tpl-technical-item">
              <div className="tpl-technical-item-header">
                <div>
                  <span className="tpl-technical-item-title">{edu.school}</span>
                </div>
                <div className="tpl-technical-item-date">{edu.location || edu.date}</div>
              </div>
              <div className="tpl-technical-item-header">
                 <div className="tpl-technical-item-body">{edu.degree}</div>
                 <div className="tpl-technical-item-date">{edu.location ? edu.date : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
});

export default TechnicalTemplate;
