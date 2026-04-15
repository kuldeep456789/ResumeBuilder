import React from 'react';
import '../Resume.css';

const StandardTemplate = React.forwardRef(({ data }, ref) => {
    const { header, skills, experience, projects, certifications, achievements, education, settings, sectionTitles, summary } = data;

    const sanitizeUrl = (url) => {
        if (!url) return "#";
        const trimmed = url.trim().toLowerCase();
        if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
            return "#";
        }
        return url;
    };

    const style = {
        '--theme-color': settings?.themeColor || '#004AAD',
        '--font-family': settings?.fontFamily || "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const titles = sectionTitles || {
        skills: "SKILLS",
        experience: "INTERNSHIP",
        projects: "PROJECTS",
        certifications: "TRAINING",
        achievements: "ACHIEVEMENTS",
        education: "EDUCATION"
    };

    // Split contact links into left (LinkedIn, GitHub) and right (Email, Mobile/Phone)
    const leftLinks = (header?.links || []).filter(l => {
        const t = (l.type || '').toLowerCase();
        return t.includes('linkedin') || t.includes('github');
    });
    const rightLinks = (header?.links || []).filter(l => {
        const t = (l.type || '').toLowerCase();
        return t.includes('email') || t.includes('mobile') || t.includes('phone');
    });

    const hasExperience = experience && experience.length > 0 && experience.some(e => e.company || e.role);
    const hasProjects = projects && projects.length > 0 && projects.some(p => p.title);
    const hasCertifications = certifications && certifications.length > 0 && certifications.some(c => c.name);
    const hasAchievements = achievements && achievements.length > 0 && achievements.some(a => a && a.trim());
    const hasEducation = education && education.length > 0 && education.some(e => e.institution);
    const hasSkills = skills?.categories?.length > 0 && skills.categories.some(c => c.name || c.items);

    return (
        <div className="resume-container" ref={ref} style={style}>
            {/* ═══ HEADER ═══ */}
            <div className="header">
                <h1>{header?.name || ''}</h1>
                <div className="contact-info">
                    <div className="contact-left">
                        {leftLinks.map((link, i) => (
                            <div key={i}>
                                <strong>{link.type}:</strong>{' '}
                                <a href={sanitizeUrl(link.url)} target="_blank" rel="noopener noreferrer">{link.label}</a>
                            </div>
                        ))}
                    </div>
                    <div className="contact-right">
                        {rightLinks.map((link, i) => (
                            <div key={i}>
                                <strong>{link.type}:</strong>{' '}
                                <a href={sanitizeUrl(link.url)} target="_blank" rel="noopener noreferrer">{link.label}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ SKILLS ═══ */}
            {hasSkills && (
                <div className="section skills-section">
                    <div className="section-title">{titles.skills}</div>
                    <div className="section-content skills-content-compact">
                        <ul className="skill-list standard-skill-list">
                            {skills.categories.filter(c => c.name || c.items).map((cat, i) => (
                                <li key={i} className="skill-category standard-skill-item">
                                    <strong>{cat.name}:</strong> {cat.items}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* ═══ EXPERIENCE / INTERNSHIP ═══ */}
            {hasExperience && (
                <div className="section">
                    <div className="section-title">{titles.experience}</div>
                    <div className="section-content">
                        {experience.filter(e => e.company || e.role).map((exp, i) => (
                            <div className="experience-item" key={i}>
                                <div className="item-header">
                                    <div className="item-title">
                                        <strong>{exp.company}</strong>
                                        {exp.role && <span className="item-role-separator"> | {exp.role}</span>}
                                    </div>
                                    <div className="item-date">{exp.date}</div>
                                </div>
                                {exp.description && exp.description.filter(d => d && d.trim()).length > 0 && (
                                    <ul className="item-description">
                                        {exp.description.filter(d => d && d.trim()).map((desc, d) => (
                                            <li key={d}>{desc}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ PROJECTS ═══ */}
            {hasProjects && (
                <div className="section">
                    <div className="section-title">{titles.projects}</div>
                    <div className="section-content">
                        {projects.filter(p => p.title).map((proj, i) => (
                            <div className="project-item" key={i}>
                                <div className="item-header">
                                    <div>
                                        <span className="item-title">
                                            <strong>{proj.title}</strong>
                                            {(proj.links || []).map((link, l) => (
                                                <span key={l}> | <a href={sanitizeUrl(link.url)} target="_blank" rel="noopener noreferrer">{link.label}</a></span>
                                            ))}
                                        </span>
                                        {proj.techStack && <span className="item-tech"> | <em>{proj.techStack}</em></span>}
                                    </div>
                                    <div className="item-date">{proj.date}</div>
                                </div>
                                {proj.description && proj.description.filter(d => d && d.trim()).length > 0 && (
                                    <ul className="item-description">
                                        {proj.description.filter(d => d && d.trim()).map((desc, d) => (
                                            <li key={d}>{desc}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ TRAINING / CERTIFICATIONS ═══ */}
            {hasCertifications && (
                <div className="section">
                    <div className="section-title">{titles.certifications}</div>
                    <div className="section-content">
                        <div className="training-list">
                            {certifications.filter(c => c.name).map((cert, i) => (
                                <div key={i} className="training-item">
                                    <strong>{cert.name}</strong> | {cert.provider}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ ACHIEVEMENTS ═══ */}
            {hasAchievements && (
                <div className="section">
                    <div className="section-title">{titles.achievements}</div>
                    <div className="section-content">
                        <ul className="achievements-list">
                            {achievements.filter(a => a && a.trim()).map((ach, i) => (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* ═══ EDUCATION ═══ */}
            {hasEducation && (
                <div className="section education-section">
                    <div className="section-title">{titles.education}</div>
                    <div className="section-content">
                        {education.filter(e => e.institution).map((edu, i) => (
                            <div className="education-item" key={i}>
                                <div className="education-header">
                                    <span className="institution">{edu.institution}</span>
                                    <span className="location">{edu.location}</span>
                                </div>
                                <div className="education-detail">
                                    <span className="degree">{edu.degree}</span>
                                    <span className="item-date">{edu.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default StandardTemplate;
