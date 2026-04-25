import React from 'react';
import './TemplateStyles.css';

const MinimalTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-minimal">
            <header className="tpl-min-header">
                <h1 className="tpl-min-name">{header?.name || 'Your Name'}</h1>
                <h2 className="tpl-min-title">{header?.title || 'Professional Title'}</h2>
                
                <div className="tpl-min-contact">
                    {header?.links?.map((link, i) => (
                        <React.Fragment key={i}>
                            <a href={link.url} target="_blank" rel="noreferrer" className="tpl-min-link">{link.label || link.url}</a>
                            {i < header.links.length - 1 && <span className="tpl-min-sep">|</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            <div className="tpl-min-divider" />

            <main className="tpl-min-body">
                {summary && (
                    <div className="tpl-min-section tpl-min-summary-sec">
                        <p className="tpl-min-summary">{summary}</p>
                    </div>
                )}

                {experience?.length > 0 && experience[0]?.company && (
                    <div className="tpl-min-section">
                        <div className="tpl-min-sec-header">
                            <h3 className="tpl-min-sec-title">{data.sectionTitles?.experience || 'Experience'}</h3>
                            <div className="tpl-min-sec-line" />
                        </div>
                        <div className="tpl-min-items">
                            {experience.map((exp, i) => (
                                <div key={i} className="tpl-min-item">
                                    <div className="tpl-min-item-row">
                                        <h4 className="tpl-min-item-role">{exp.role}</h4>
                                        <div className="tpl-min-item-date">{exp.date}</div>
                                    </div>
                                    <div className="tpl-min-item-company">{exp.company}</div>
                                    <ul className="tpl-min-bullets">
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
                    <div className="tpl-min-section">
                        <div className="tpl-min-sec-header">
                            <h3 className="tpl-min-sec-title">{data.sectionTitles?.education || 'Education'}</h3>
                            <div className="tpl-min-sec-line" />
                        </div>
                        <div className="tpl-min-items">
                            {education.map((edu, i) => (
                                <div key={i} className="tpl-min-item" style={{ marginBottom: 12 }}>
                                    <div className="tpl-min-item-row">
                                        <h4 className="tpl-min-item-role">{edu.school}</h4>
                                        <div className="tpl-min-item-date">{edu.date}</div>
                                    </div>
                                    <div className="tpl-min-item-company">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects?.length > 0 && projects[0]?.title && (
                    <div className="tpl-min-section">
                        <div className="tpl-min-sec-header">
                            <h3 className="tpl-min-sec-title">{data.sectionTitles?.projects || 'Projects'}</h3>
                            <div className="tpl-min-sec-line" />
                        </div>
                        <div className="tpl-min-items">
                            {projects.map((proj, i) => (
                                <div key={i} className="tpl-min-item">
                                    <div className="tpl-min-item-row">
                                        <h4 className="tpl-min-item-role">{proj.title}</h4>
                                    </div>
                                    {proj.techStack && <div className="tpl-min-item-company">{proj.techStack}</div>}
                                    <ul className="tpl-min-bullets">
                                        {proj.description?.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                    <div className="tpl-min-section">
                        <div className="tpl-min-sec-header">
                            <h3 className="tpl-min-sec-title">{data.sectionTitles?.skills || 'Skills'}</h3>
                            <div className="tpl-min-sec-line" />
                        </div>
                        <div className="tpl-min-skills">
                            {skills.categories.map((cat, i) => (
                                <div key={i} className="tpl-min-skill-row">
                                    {cat.name && <div className="tpl-min-skill-cat">{cat.name}:</div>}
                                    <div className="tpl-min-skill-items">{cat.items}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

export default MinimalTemplate;
