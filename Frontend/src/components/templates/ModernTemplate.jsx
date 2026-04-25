import React from 'react';
import './TemplateStyles.css';

const ModernTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-modern">
            {/* Header */}
            <header className="tpl-modern-header">
                <div className="tpl-modern-header-deco-1" />
                <div className="tpl-modern-header-deco-2" />
                
                <h1 className="tpl-modern-name">{header?.name || 'Your Name'}</h1>
                <h2 className="tpl-modern-title">{header?.title || 'Professional Title'}</h2>
                
                <div className="tpl-modern-contact">
                    {header?.links?.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="tpl-modern-contact-pill">
                            {link.label || link.url}
                        </a>
                    ))}
                </div>
            </header>

            {/* Body */}
            <main className="tpl-modern-body">
                {summary && (
                    <div className="tpl-modern-section tpl-modern-summary-sec">
                        <p className="tpl-modern-summary">{summary}</p>
                    </div>
                )}
                
                {experience?.length > 0 && experience[0]?.company && (
                    <div className="tpl-modern-section">
                        <div className="tpl-modern-sec-header">
                            <div className="tpl-modern-sec-accent" />
                            <h3 className="tpl-modern-sec-title">{data.sectionTitles?.experience || 'EXPERIENCE'}</h3>
                        </div>
                        <div className="tpl-modern-items">
                            {experience.map((exp, i) => (
                                <div key={i} className="tpl-modern-item">
                                    <div className="tpl-modern-item-header">
                                        <h4 className="tpl-modern-item-role">{exp.role}</h4>
                                        <div className="tpl-modern-item-meta">
                                            <span className="tpl-modern-item-company">{exp.company}</span>
                                            <span className="tpl-modern-meta-sep">•</span>
                                            <span className="tpl-modern-item-date">{exp.date}</span>
                                        </div>
                                    </div>
                                    <ul className="tpl-modern-bullets">
                                        {exp.description?.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                    <div className="tpl-modern-section">
                        <div className="tpl-modern-sec-header">
                            <div className="tpl-modern-sec-accent" />
                            <h3 className="tpl-modern-sec-title">{data.sectionTitles?.skills || 'SKILLS'}</h3>
                        </div>
                        <div className="tpl-modern-skills">
                            {skills.categories.map((cat, i) => (
                                <div key={i} className="tpl-modern-skill-group">
                                    {cat.name && <div className="tpl-modern-skill-label">{cat.name}:</div>}
                                    <div className="tpl-modern-skill-chips">
                                        {cat.items?.split(',').map((skill, idx) => (
                                            <span key={idx} className="tpl-modern-skill-chip">{skill.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects?.length > 0 && projects[0]?.title && (
                    <div className="tpl-modern-section">
                        <div className="tpl-modern-sec-header">
                            <div className="tpl-modern-sec-accent" />
                            <h3 className="tpl-modern-sec-title">{data.sectionTitles?.projects || 'PROJECTS'}</h3>
                        </div>
                        <div className="tpl-modern-items">
                            {projects.map((proj, i) => (
                                <div key={i} className="tpl-modern-item">
                                    <div className="tpl-modern-item-header">
                                        <h4 className="tpl-modern-item-role">{proj.title}</h4>
                                        {proj.techStack && <div className="tpl-modern-item-meta"><span className="tpl-modern-item-company">{proj.techStack}</span></div>}
                                    </div>
                                    <ul className="tpl-modern-bullets">
                                        {proj.description?.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {education?.length > 0 && education[0]?.school && (
                    <div className="tpl-modern-section">
                        <div className="tpl-modern-sec-header">
                            <div className="tpl-modern-sec-accent" />
                            <h3 className="tpl-modern-sec-title">{data.sectionTitles?.education || 'EDUCATION'}</h3>
                        </div>
                        <div className="tpl-modern-items">
                            {education.map((edu, i) => (
                                <div key={i} className="tpl-modern-item">
                                    <div className="tpl-modern-item-header">
                                        <h4 className="tpl-modern-item-role">{edu.degree}</h4>
                                        <div className="tpl-modern-item-meta">
                                            <span className="tpl-modern-item-company">{edu.school}</span>
                                            <span className="tpl-modern-meta-sep">•</span>
                                            <span className="tpl-modern-item-date">{edu.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

export default ModernTemplate;
