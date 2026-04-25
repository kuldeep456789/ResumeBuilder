import React from 'react';
import './TemplateStyles.css';

const SimpleTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-simple">
            <header className="tpl-simp-header">
                <div className="tpl-simp-name-block">
                    <h1 className="tpl-simp-name">{header?.name || 'Your Name'}</h1>
                    <h2 className="tpl-simp-title">{header?.title || 'Professional Title'}</h2>
                </div>
                
                <div className="tpl-simp-contact">
                    {header?.links?.map((link, i) => (
                        <div key={i} className="tpl-simp-contact-item">
                            <a href={link.url} target="_blank" rel="noreferrer">{link.label || link.url}</a>
                        </div>
                    ))}
                </div>
            </header>

            <div className="tpl-simp-divider" />

            <main className="tpl-simp-body">
                {summary && (
                    <div className="tpl-simp-section">
                        <h3 className="tpl-simp-sec-title">{data.sectionTitles?.summary || 'Objective'}</h3>
                        <p className="tpl-simp-summary">{summary}</p>
                    </div>
                )}

                {experience?.length > 0 && experience[0]?.company && (
                    <div className="tpl-simp-section">
                        <h3 className="tpl-simp-sec-title">{data.sectionTitles?.experience || 'Work Experience'}</h3>
                        <div className="tpl-simp-items">
                            {experience.map((exp, i) => (
                                <div key={i} className="tpl-simp-item">
                                    <div className="tpl-simp-item-header">
                                        <div className="tpl-simp-item-role">{exp.role} <span className="tpl-simp-item-company">at {exp.company}</span></div>
                                        <div className="tpl-simp-item-date">{exp.date}</div>
                                    </div>
                                    <ul className="tpl-simp-bullets">
                                        {exp.description?.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {education?.length > 0 && education[0]?.school && (
                    <div className="tpl-simp-section">
                        <h3 className="tpl-simp-sec-title">{data.sectionTitles?.education || 'Education'}</h3>
                        <div className="tpl-simp-items">
                            {education.map((edu, i) => (
                                <div key={i} className="tpl-simp-item" style={{ marginBottom: 12 }}>
                                    <div className="tpl-simp-item-header">
                                        <div className="tpl-simp-item-role">{edu.degree}</div>
                                        <div className="tpl-simp-item-date">{edu.date}</div>
                                    </div>
                                    <div className="tpl-simp-item-company">{edu.school}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                    <div className="tpl-simp-section">
                        <h3 className="tpl-simp-sec-title">{data.sectionTitles?.skills || 'Skills'}</h3>
                        <div className="tpl-simp-skills">
                            {skills.categories.map((cat, i) => (
                                <div key={i} className="tpl-simp-skill-row">
                                    {cat.name && <strong className="tpl-simp-skill-cat">{cat.name}: </strong>}
                                    <span className="tpl-simp-skill-items">{cat.items}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

export default SimpleTemplate;
