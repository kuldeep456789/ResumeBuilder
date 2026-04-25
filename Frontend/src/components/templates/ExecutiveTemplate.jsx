import React from 'react';
import './TemplateStyles.css';

const ExecutiveTemplate = React.forwardRef(({ data }, ref) => {
    const { header, summary, experience, education, projects, skills } = data;
    
    return (
        <div ref={ref} className="tpl-page tpl-executive">
            {/* Header */}
            <div className="tpl-exec-header">
                <div className="tpl-exec-header-inner">
                    <h1 className="tpl-exec-name">{header?.name || 'Your Name'}</h1>
                    <h2 className="tpl-exec-title">{header?.title || 'Professional Title'}</h2>
                    
                    <div className="tpl-exec-contact">
                        {header?.links?.map((link, i) => (
                            <div key={i} className="tpl-exec-contact-item">
                                <span className="tpl-exec-dot"></span>
                                <a href={link.url} target="_blank" rel="noreferrer">{link.label || link.url}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Gold Divider */}
            <div className="tpl-exec-divider"></div>
            
            {/* Body */}
            <div className="tpl-exec-body">
                {/* Left Column (Main Experience) */}
                <div className="tpl-exec-col-left">
                    {/* Summary */}
                    {summary && (
                        <div className="tpl-exec-section">
                            <h3 className="tpl-exec-sec-title">{data.sectionTitles?.summary || 'PROFESSIONAL SUMMARY'}</h3>
                            <p className="tpl-exec-summary-text">{summary}</p>
                        </div>
                    )}
                    
                    {/* Experience */}
                    {experience?.length > 0 && experience[0]?.company && (
                        <div className="tpl-exec-section">
                            <h3 className="tpl-exec-sec-title">{data.sectionTitles?.experience || 'WORK EXPERIENCE'}</h3>
                            <div className="tpl-exec-items">
                                {experience.map((exp, i) => (
                                    <div key={i} className="tpl-exec-item">
                                        <div className="tpl-exec-item-header">
                                            <div>
                                                <h4 className="tpl-exec-item-title">{exp.role}</h4>
                                                <div className="tpl-exec-item-subtitle">{exp.company}</div>
                                            </div>
                                            <div className="tpl-exec-item-date">{exp.date}</div>
                                        </div>
                                        <ul className="tpl-exec-bullets">
                                            {exp.description?.map((desc, idx) => (
                                                <li key={idx}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {projects?.length > 0 && projects[0]?.title && (
                        <div className="tpl-exec-section">
                            <h3 className="tpl-exec-sec-title">{data.sectionTitles?.projects || 'PROJECTS'}</h3>
                            <div className="tpl-exec-items">
                                {projects.map((proj, i) => (
                                    <div key={i} className="tpl-exec-item">
                                        <div className="tpl-exec-item-header">
                                            <div>
                                                <h4 className="tpl-exec-item-title">{proj.title}</h4>
                                                {proj.techStack && <div className="tpl-exec-item-subtitle">{proj.techStack}</div>}
                                            </div>
                                        </div>
                                        <ul className="tpl-exec-bullets">
                                            {proj.description?.map((desc, idx) => (
                                                <li key={idx}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Right Column (Sidebar equivalent) */}
                <div className="tpl-exec-col-right">
                    {/* Skills */}
                    {skills?.categories?.length > 0 && skills.categories[0]?.items && (
                        <div className="tpl-exec-section">
                            <h3 className="tpl-exec-sec-title">{data.sectionTitles?.skills || 'TECHNICAL SKILLS'}</h3>
                            <div className="tpl-exec-skills">
                                {skills.categories.map((cat, i) => (
                                    <div key={i} className="tpl-exec-skill-group">
                                        {cat.name && <h4 className="tpl-exec-skill-cat">{cat.name}</h4>}
                                        <div className="tpl-exec-skill-list">
                                            {cat.items?.split(',').map((skill, idx) => (
                                                <span key={idx} className="tpl-exec-skill-pill">{skill.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education?.length > 0 && education[0]?.school && (
                        <div className="tpl-exec-section">
                            <h3 className="tpl-exec-sec-title">{data.sectionTitles?.education || 'EDUCATION'}</h3>
                            <div className="tpl-exec-items">
                                {education.map((edu, i) => (
                                    <div key={i} className="tpl-exec-item tpl-exec-edu">
                                        <h4 className="tpl-exec-item-title">{edu.degree}</h4>
                                        <div className="tpl-exec-item-subtitle">{edu.school}</div>
                                        <div className="tpl-exec-item-date">{edu.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ExecutiveTemplate;
