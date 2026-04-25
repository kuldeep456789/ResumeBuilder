import React from 'react';
import './TemplateStyles.css';

const BusinessTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-business">
            <header className="tpl-bus-header">
                <h1 className="tpl-bus-name">{header?.name || 'Your Name'}</h1>
                <h2 className="tpl-bus-title">{header?.title || 'Professional Title'}</h2>
                
                <div className="tpl-bus-contact">
                    {header?.links?.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="tpl-bus-link">{link.label || link.url}</a>
                    ))}
                </div>
            </header>

            <main className="tpl-bus-body">
                {summary && (
                    <div className="tpl-bus-summary">
                        {summary}
                    </div>
                )}

                <div className="tpl-bus-timeline-container">
                    {experience?.length > 0 && experience[0]?.company && (
                        <div className="tpl-bus-section">
                            <div className="tpl-bus-sec-row">
                                <div className="tpl-bus-timeline-spine">
                                    <div className="tpl-bus-dot" />
                                    <div className="tpl-bus-line" />
                                </div>
                                <div className="tpl-bus-content">
                                    <h3 className="tpl-bus-sec-title">{data.sectionTitles?.experience || 'EXPERIENCE'}</h3>
                                    <div className="tpl-bus-items">
                                        {experience.map((exp, i) => (
                                            <div key={i} className="tpl-bus-item">
                                                <div className="tpl-bus-item-header">
                                                    <h4 className="tpl-bus-item-role">{exp.role}</h4>
                                                    <div className="tpl-bus-item-date">{exp.date}</div>
                                                </div>
                                                <div className="tpl-bus-item-company">{exp.company}</div>
                                                <ul className="tpl-bus-bullets">
                                                    {exp.description?.map((desc, idx) => (
                                                        <li key={idx}>{desc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {education?.length > 0 && education[0]?.school && (
                        <div className="tpl-bus-section">
                            <div className="tpl-bus-sec-row">
                                <div className="tpl-bus-timeline-spine">
                                    <div className="tpl-bus-dot" />
                                    <div className="tpl-bus-line" />
                                </div>
                                <div className="tpl-bus-content">
                                    <h3 className="tpl-bus-sec-title">{data.sectionTitles?.education || 'EDUCATION'}</h3>
                                    <div className="tpl-bus-items">
                                        {education.map((edu, i) => (
                                            <div key={i} className="tpl-bus-item" style={{ marginBottom: 12 }}>
                                                <div className="tpl-bus-item-header">
                                                    <h4 className="tpl-bus-item-role">{edu.degree}</h4>
                                                    <div className="tpl-bus-item-date">{edu.date}</div>
                                                </div>
                                                <div className="tpl-bus-item-company">{edu.school}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                        <div className="tpl-bus-section" style={{ paddingBottom: 0 }}>
                            <div className="tpl-bus-sec-row">
                                <div className="tpl-bus-timeline-spine">
                                    <div className="tpl-bus-dot" />
                                </div>
                                <div className="tpl-bus-content">
                                    <h3 className="tpl-bus-sec-title">{data.sectionTitles?.skills || 'SKILLS'}</h3>
                                    <div className="tpl-bus-skills">
                                        {skills.categories.map((cat, i) => (
                                            <div key={i} className="tpl-bus-skill-row">
                                                {cat.name && <div className="tpl-bus-skill-cat">{cat.name}</div>}
                                                <div className="tpl-bus-skill-chips">
                                                    {cat.items?.split(',').map((skill, idx) => (
                                                        <span key={idx} className="tpl-bus-skill-chip">{skill.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
});

export default BusinessTemplate;
