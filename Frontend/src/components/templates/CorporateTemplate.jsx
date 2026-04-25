import React from 'react';
import './TemplateStyles.css';

const CorporateTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-corporate">
            {/* Sidebar */}
            <aside className="tpl-corp-sidebar">
                <div className="tpl-corp-avatar">
                   {header?.name ? header.name.split(' ').map(n => n[0]).join('').substring(0,2) : 'A'}
                </div>
                <h1 className="tpl-corp-name">{header?.name || 'Your Name'}</h1>
                <h2 className="tpl-corp-title">{header?.title || 'Professional Title'}</h2>
                
                <div className="tpl-corp-divider" />
                
                <div className="tpl-corp-contact">
                    <h3 className="tpl-corp-sidebar-title">Contact</h3>
                    {header?.links?.map((link, i) => (
                        <div key={i} className="tpl-corp-contact-item">
                            <a href={link.url} target="_blank" rel="noreferrer">{link.label || link.url}</a>
                        </div>
                    ))}
                </div>

                <div className="tpl-corp-divider" />

                {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                    <div className="tpl-corp-skills">
                        <h3 className="tpl-corp-sidebar-title">{data.sectionTitles?.skills || 'Skills'}</h3>
                        {skills.categories.map((cat, i) => (
                            <div key={i} className="tpl-corp-skill-cat">
                                {cat.name && <div className="tpl-corp-skill-cat-name">{cat.name}</div>}
                                {cat.items?.split(',').map((skill, idx) => (
                                    <div key={idx} className="tpl-corp-skill-item">{skill.trim()}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </aside>
            
            {/* Main Area */}
            <main className="tpl-corp-main">
                {summary && (
                    <div className="tpl-corp-section">
                        <div className="tpl-corp-summary">{summary}</div>
                    </div>
                )}
                
                {experience?.length > 0 && experience[0]?.company && (
                    <div className="tpl-corp-section">
                        <h3 className="tpl-corp-sec-title">{data.sectionTitles?.experience || 'Work Experience'}</h3>
                        <div className="tpl-corp-items">
                            {experience.map((exp, i) => (
                                <div key={i} className="tpl-corp-item">
                                    <div className="tpl-corp-item-header">
                                        <div className="tpl-corp-item-left">
                                            <h4 className="tpl-corp-item-role">{exp.role}</h4>
                                            <div className="tpl-corp-item-company">{exp.company}</div>
                                        </div>
                                        <div className="tpl-corp-item-date">{exp.date}</div>
                                    </div>
                                    <ul className="tpl-corp-bullets">
                                        {exp.description?.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects?.length > 0 && projects[0]?.title && (
                    <div className="tpl-corp-section">
                        <h3 className="tpl-corp-sec-title">{data.sectionTitles?.projects || 'Projects'}</h3>
                        <div className="tpl-corp-items">
                            {projects.map((proj, i) => (
                                <div key={i} className="tpl-corp-item">
                                    <div className="tpl-corp-item-header">
                                        <div className="tpl-corp-item-left">
                                            <h4 className="tpl-corp-item-role">{proj.title}</h4>
                                            {proj.techStack && <div className="tpl-corp-item-company">{proj.techStack}</div>}
                                        </div>
                                    </div>
                                    <ul className="tpl-corp-bullets">
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
                    <div className="tpl-corp-section">
                        <h3 className="tpl-corp-sec-title">{data.sectionTitles?.education || 'Education'}</h3>
                        <div className="tpl-corp-items">
                            {education.map((edu, i) => (
                                <div key={i} className="tpl-corp-item" style={{ marginBottom: 12 }}>
                                    <h4 className="tpl-corp-item-role">{edu.degree}</h4>
                                    <div className="tpl-corp-item-header">
                                        <div className="tpl-corp-item-left"><div className="tpl-corp-item-company">{edu.school}</div></div>
                                        <div className="tpl-corp-item-date">{edu.date}</div>
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

export default CorporateTemplate;
