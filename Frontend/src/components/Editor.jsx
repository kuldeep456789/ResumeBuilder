import React, { useState } from 'react';
import { Save, Download, Plus, Trash2, ChevronDown, ChevronUp, RotateCcw, Target, ShieldCheck } from 'lucide-react';
import ATSCategoryBreakdownCard from './ATSCategoryBreakdownCard';
import './Editor.css';

const Editor = ({ data, atsScore, onChange, onDownload, onReset, onSave, onCheckATS, isScanning }) => {
    const [activeSection, setActiveSection] = useState('header');
    const [locationEnabled, setLocationEnabled] = useState(false);

    const handleChange = (section, field, value, index = null, subField = null) => {
        const newData = { ...data };

        if (index !== null) {
            const updatedArray = [...(data[section] || [])];
            if (subField) {
                updatedArray[index] = { ...updatedArray[index], [subField]: value };
            } else {
                updatedArray[index] = value;
            }
            newData[section] = updatedArray;
        } else {
            newData[section] = { ...(data[section] || {}), [field]: value };
        }
        onChange(newData);
    };

    const addArrayItem = (section, initialItem) => {
        onChange({
            ...data,
            [section]: [...(data[section] || []), initialItem]
        });
    };

    const removeArrayItem = (section, index) => {
        onChange({
            ...data,
            [section]: data[section].filter((_, i) => i !== index)
        });
    };

    return (
        <div className="editor-sidebar no-print">
            {/* Controls Block */}
            <div className="ed-controls">
                <div className="ed-controls-card">
                    <h2 className="ed-controls-title">
                        Editor <span className="ed-accent-text">Workspace</span>
                    </h2>

                    <div className="ed-controls-actions">
                        <button
                            onClick={() => setLocationEnabled(!locationEnabled)}
                            className={`ed-toggle-btn ${locationEnabled ? 'active' : ''}`}
                        >
                            <ShieldCheck size={16} /> {locationEnabled ? 'LOCATION ENABLED' : 'ENABLE LOCATION'}
                        </button>

                        <button
                            onClick={onCheckATS}
                            disabled={isScanning}
                            className={`ed-ats-btn ${isScanning ? 'scanning' : ''}`}
                        >
                            {isScanning ? (
                                <><RotateCcw size={16} className="ed-spin" /> SCANNING...</>
                            ) : (
                                <><ShieldCheck size={16} /> CHECK ATS SCORE</>
                            )}
                        </button>

                        <div className="ed-target-input-wrap">
                            <Target size={16} className="ed-target-icon" />
                            <input
                                placeholder="TARGET ROLE (e.g. Frontend Engineer)"
                                value={data.targetRole || ''}
                                onChange={(e) => onChange({ ...data, targetRole: e.target.value })}
                                className="ed-target-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ATSCategoryBreakdownCard
                atsScore={atsScore}
                targetRole={data.targetRole}
                isScanning={isScanning}
                onCheckATS={onCheckATS}
                onSave={onSave}
                onDownload={onDownload}
                defaultTitle={data?.header?.name}
            />

            {/* Input Sections */}
            <div className="editor-sections">
                {/* Personal Info */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'header' ? '' : 'header')}
                        className={`ed-section-header ${activeSection === 'header' ? 'active' : ''}`}
                    >
                        <span>PERSONAL INFO</span>
                        {activeSection === 'header' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'header' && (
                        <div className="ed-section-content">
                            <input
                                placeholder="Full Name"
                                value={data.header.name}
                                onChange={(e) => handleChange('header', 'name', e.target.value)}
                                className="ed-input"
                            />
                            {data.header.links.map((link, i) => (
                                <div key={i} className="ed-card">
                                    <div className="ed-card-row">
                                        <input
                                            placeholder="Label"
                                            value={link.label}
                                            onChange={(e) => {
                                                const links = [...data.header.links];
                                                links[i].label = e.target.value;
                                                handleChange('header', 'links', links);
                                            }}
                                            className="ed-input"
                                        />
                                        <button onClick={() => {
                                            const links = [...data.header.links];
                                            links.splice(i, 1);
                                            handleChange('header', 'links', links);
                                        }} className="ed-delete-btn"><Trash2 size={14} /></button>
                                    </div>
                                    <input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => {
                                            const links = [...data.header.links];
                                            links[i].url = e.target.value;
                                            handleChange('header', 'links', links);
                                        }}
                                        className="ed-input"
                                    />
                                </div>
                            ))}
                            <button onClick={() => {
                                const links = [...data.header.links];
                                links.push({ label: '', url: '', type: '' });
                                handleChange('header', 'links', links);
                            }} className="ed-add-btn"><Plus size={14} /> Add Contact Link</button>
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'summary' ? '' : 'summary')}
                        className={`ed-section-header ${activeSection === 'summary' ? 'active' : ''}`}
                    >
                        <span>PROFESSIONAL SUMMARY</span>
                        {activeSection === 'summary' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'summary' && (
                        <div className="ed-section-content">
                            <textarea
                                placeholder="Brief professional overview..."
                                value={data.summary || ''}
                                onChange={(e) => onChange({ ...data, summary: e.target.value })}
                                className="ed-textarea ed-textarea-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
                        className={`ed-section-header ${activeSection === 'skills' ? 'active' : ''}`}
                    >
                        <span>TECHNICAL SKILLS</span>
                        {activeSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'skills' && (
                        <div className="ed-section-content">
                            {data.skills.categories.map((cat, i) => (
                                <div key={i} className="ed-card">
                                    <input
                                        placeholder="Category"
                                        value={cat.name}
                                        onChange={(e) => {
                                            const cats = [...data.skills.categories];
                                            cats[i].name = e.target.value;
                                            handleChange('skills', 'categories', cats);
                                        }}
                                        className="ed-input ed-input-bold"
                                    />
                                    <textarea
                                        placeholder="Skills (comma separated)"
                                        value={cat.items}
                                        onChange={(e) => {
                                            const cats = [...data.skills.categories];
                                            cats[i].items = e.target.value;
                                            handleChange('skills', 'categories', cats);
                                        }}
                                        className="ed-textarea"
                                    />
                                    <button onClick={() => {
                                        const cats = [...data.skills.categories];
                                        cats.splice(i, 1);
                                        handleChange('skills', 'categories', cats);
                                    }} className="ed-delete-btn ed-delete-wide"><Trash2 size={14} /> Remove Category</button>
                                </div>
                            ))}
                            <button onClick={() => {
                                const cats = [...data.skills.categories];
                                cats.push({ name: '', items: '' });
                                handleChange('skills', 'categories', cats);
                            }} className="ed-add-btn"><Plus size={14} /> Add Skill Set</button>
                        </div>
                    )}
                </div>

                {/* Experience */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
                        className={`ed-section-header ${activeSection === 'experience' ? 'active' : ''}`}
                    >
                        <span>WORK EXPERIENCE</span>
                        {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'experience' && (
                        <div className="ed-section-content">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="ed-card">
                                    <input value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, i, 'company')} className="ed-input" placeholder="Company" />
                                    <div className="ed-card-row">
                                        <input value={exp.role} onChange={(e) => handleChange('experience', 'role', e.target.value, i, 'role')} className="ed-input" placeholder="Role" />
                                        <input value={exp.date} onChange={(e) => handleChange('experience', 'date', e.target.value, i, 'date')} className="ed-input" placeholder="Date" />
                                    </div>
                                    <textarea
                                        value={exp.description.join('\n')}
                                        onChange={(e) => handleChange('experience', 'description', e.target.value.split('\n'), i, 'description')}
                                        className="ed-textarea"
                                        placeholder="Bullets (one per line)"
                                    />
                                    <button onClick={() => removeArrayItem('experience', i)} className="ed-delete-btn ed-delete-wide"><Trash2 size={14} /> Remove Entry</button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience', { company: '', role: '', date: '', description: [] })} className="ed-add-btn"><Plus size={14} /> Add Experience</button>
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'projects' ? '' : 'projects')}
                        className={`ed-section-header ${activeSection === 'projects' ? 'active' : ''}`}
                    >
                        <span>PROJECTS</span>
                        {activeSection === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'projects' && (
                        <div className="ed-section-content">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="ed-card">
                                    <input value={proj.title} onChange={(e) => handleChange('projects', 'title', e.target.value, i, 'title')} className="ed-input" placeholder="Project Name" />
                                    <input value={proj.techStack} onChange={(e) => handleChange('projects', 'techStack', e.target.value, i, 'techStack')} className="ed-input" placeholder="Technologies" />
                                    <textarea
                                        value={proj.description.join('\n')}
                                        onChange={(e) => handleChange('projects', 'description', e.target.value.split('\n'), i, 'description')}
                                        className="ed-textarea"
                                        placeholder="Description Bullets"
                                    />
                                    <button onClick={() => removeArrayItem('projects', i)} className="ed-delete-btn ed-delete-wide"><Trash2 size={14} /> Remove Project</button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('projects', { title: '', techStack: '', date: '', description: [] })} className="ed-add-btn"><Plus size={14} /> Add Project</button>
                        </div>
                    )}
                </div>

                {/* Appearance */}
                <div className="ed-section">
                    <button
                        onClick={() => setActiveSection(activeSection === 'settings' ? '' : 'settings')}
                        className={`ed-section-header ${activeSection === 'settings' ? 'active' : ''}`}
                    >
                        <span>APPEARANCE & TYPE</span>
                        {activeSection === 'settings' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {activeSection === 'settings' && (
                        <div className="ed-section-content">
                            <label className="ed-label">Template Style</label>
                            <select
                                value={data.settings.template || 'standard'}
                                onChange={(e) => handleChange('settings', 'template', e.target.value)}
                                className="ed-select"
                            >
                                <option value="executive">Executive Pro (Professional)</option>
                                <option value="corporate">Corporate Elite (Business)</option>
                                <option value="modern">Modern Creative (Creative)</option>
                                <option value="minimal">Clean Minimal (Simple)</option>
                                <option value="business">Business Standard (Business)</option>
                                <option value="simple">Simple & Clean (Beginner)</option>
                            </select>

                            <label className="ed-label">Theme Color</label>
                            <input
                                type="color"
                                value={data.settings.themeColor}
                                onChange={(e) => handleChange('settings', 'themeColor', e.target.value)}
                                className="ed-color-input"
                            />

                            <div className="ed-headings-card">
                                <label className="ed-label">Custom Section Headings</label>
                                {Object.keys(data.sectionTitles || {}).map(key => (
                                    <div key={key} className="ed-heading-field">
                                        <label className="ed-heading-label">{key}</label>
                                        <input
                                            value={data.sectionTitles[key]}
                                            onChange={(e) => {
                                                const titles = { ...data.sectionTitles, [key]: e.target.value };
                                                onChange({ ...data, sectionTitles: titles });
                                            }}
                                            className="ed-input ed-input-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reset */}
                <button onClick={onReset} className="ed-reset-btn">
                    <RotateCcw size={16} /> Reset All Data
                </button>
            </div>
        </div>
    );
};

export default Editor;
