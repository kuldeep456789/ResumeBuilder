import React from 'react';
import { Upload, Trash2, Edit3, Calendar, FileText } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onEdit, onNew, onUpload, lastSaved, data, atsScore, savedResumes = [], onDelete, onLoad }) => {
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                {/* Left Side: Text & Actions */}
                <div className="dashboard-left">
                    <div className="brand-strip">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'var(--gold-accent)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L4 8V16L12 20L20 16V8L12 4Z" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
                                <path d="M12 8L8 12V14C8 14.5304 8.21071 15.0391 8.58579 15.4142C8.96086 15.7893 9.46957 16 10 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V12L12 8Z" fill="black" />
                                <path d="M11 16V20L12 21L13 20V16" stroke="var(--gold-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: 'white' }}>RESUME <span style={{ color: 'var(--gold-accent)' }}>FIX</span></span>
                    </div>

                    <h1 className="main-title">
                        Craft Your <br />
                        <span className="serif-italic-gold">Story.</span>
                    </h1>
                    <p className="description">
                        Create multiple professional resumes and track your ATS optimization in real-time.
                    </p>
                    <div className="button-group">
                        <button className="btn-continue" onClick={onEdit}>
                            Continue Editing Draft
                        </button>
                        <button className="btn-new" onClick={onNew}>
                            New Resume
                        </button>
                        <button className="btn-upload" onClick={onUpload}>
                            <Upload size={18} /> Upload Resume
                        </button>
                    </div>

                    {/* Saved Resumes Section */}
                    {savedResumes.length > 0 && (
                        <div className="saved-resumes-section">
                            <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={20} style={{ color: 'var(--gold-accent)' }} />
                                My Saved Resumes
                            </h3>
                            <div className="saved-resumes-list">
                                {savedResumes.map(resume => (
                                    <div key={resume.id} className="saved-resume-card">
                                        <div>
                                            <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold' }}>{resume.title}</h4>
                                            <div className="saved-resume-meta">
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={12} /> {new Date(resume.lastModified).toLocaleDateString()}
                                                </span>
                                                <span style={{ color: 'var(--gold-accent)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    ATS: {calculateSimpleATS(resume.data)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="saved-resume-actions">
                                            <button 
                                                onClick={() => onLoad(resume.data)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: 'var(--gold-accent)',
                                                    color: 'black',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => onDelete(resume.id)}
                                                style={{
                                                    padding: '8px',
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Floating Preview */}
                <div className="dashboard-right">
                    <div className="preview-card-wrapper">
                        <div className="active-badge">ACTIVE DRAFT</div>
                        <div className="preview-card">
                            <div className="card-line-gold"></div>

                            {/* ATS Score Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'white',
                                padding: '6px 12px',
                                borderRadius: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: '1px solid #f1f5f9',
                                zIndex: 10
                            }} className="preview-score-badge">
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: atsScore.overall > 70 ? '#22c55e' : atsScore.overall > 50 ? '#f59e0b' : '#ef4444'
                                }}></div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    color: '#1a202c',
                                    letterSpacing: '0.5px'
                                }}>{atsScore.overall}/100</span>
                            </div>

                            <h2 className="card-name">{data?.header?.name || 'Anonymous'}</h2>
                            <p className="card-role">SOFTWARE DEVELOPER</p>

                            <div className="card-section">
                                <div className="card-section-title">PROJECTS</div>
                                {(data?.projects || []).slice(0, 2).map((proj, i) => (
                                    <div key={i} className="mini-project-link">
                                        <span className="dot"></span>
                                        <a href={(proj.links && proj.links[0]?.url) || "#"} target="_blank" rel="noopener noreferrer">
                                            {proj.title}
                                        </a>
                                    </div>
                                ))}
                            </div>

                            <div className="card-section">
                                <div className="card-section-title">SKILLS</div>
                                <div className="skeleton-bar gold" style={{ width: '80%' }}></div>
                                <div className="skeleton-bar red" style={{ width: '60%' }}></div>
                                <div className="skeleton-bar green" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple calculator for the list view
const calculateSimpleATS = (data) => {
    let score = 50;
    if (data.header?.name) score += 5;
    if (data.skills?.categories?.length > 0) score += 15;
    if (data.experience?.length > 0) score += 15;
    if (data.projects?.length > 0) score += 15;
    return Math.min(score, 100);
};

export default Dashboard;
