import React, { useState } from 'react';
import { Type, Palette, Save, Download, Plus, Trash2, ChevronDown, ChevronUp, RotateCcw, Target, ShieldCheck, Zap } from 'lucide-react';
import ATSCategoryBreakdownCard from './ATSCategoryBreakdownCard';

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
        <div className="editor-sidebar no-print" style={{
            width: '100%',
            background: '#fff',
            padding: '32px 24px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#1a202c'
        }}>
            {/* Professional Controls Segment */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                    padding: '20px', 
                    border: '2.5px solid #1a202c', 
                    borderRadius: '16px',
                    background: '#fff',
                    marginBottom: '24px',
                    boxShadow: '8px 8px 0px #1a202c'
                }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.1em' }}>
                        Editor <span style={{ color: '#004AAD' }}>Workspace</span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button 
                            onClick={() => setLocationEnabled(!locationEnabled)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: locationEnabled ? '#1a202c' : 'transparent',
                                color: locationEnabled ? '#fff' : '#1a202c',
                                border: '2px solid #1a202c',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <ShieldCheck size={16} /> {locationEnabled ? 'LOCATION ENABLED' : 'ENABLE LOCATION'}
                        </button>

                        <button 
                            onClick={onCheckATS}
                            disabled={isScanning}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: isScanning ? '#f1f5f9' : '#004AAD',
                                color: isScanning ? '#64748b' : '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: '800',
                                cursor: isScanning ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                opacity: isScanning ? 0.7 : 1,
                                boxShadow: isScanning ? 'none' : '0 4px 12px rgba(0, 74, 173, 0.2)'
                            }}
                        >
                            {isScanning ? (
                                <>
                                    <RotateCcw size={16} className="animate-spin" /> SCANNING...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={16} /> CHECK ATS SCORE
                                </>
                            )}
                        </button>

                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                position: 'absolute', 
                                left: '12px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#1a202c',
                                display: 'flex'
                            }}>
                                <Target size={16} />
                            </div>
                            <input 
                                placeholder="TARGET ROLE (e.g. Frontend Engineer)"
                                value={data.targetRole || ''}
                                onChange={(e) => onChange({ ...data, targetRole: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: '#f8fafc',
                                    border: '2px solid #1a202c',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    outline: 'none',
                                    color: '#1a202c'
                                }}
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
                {/* Person Info */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'header' ? '' : 'header')} 
                        style={sectionHeaderStyle(activeSection === 'header')}
                    >
                        <span>PERSONAL INFO</span>
                        {activeSection === 'header' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'header' && (
                        <div style={sectionContentStyle}>
                            <input
                                placeholder="Full Name"
                                value={data.header.name}
                                onChange={(e) => handleChange('header', 'name', e.target.value)}
                                style={refinedInputStyle}
                            />
                            {data.header.links.map((link, i) => (
                                <div key={i} style={cardStyle}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            placeholder="Label"
                                            value={link.label}
                                            onChange={(e) => {
                                                const links = [...data.header.links];
                                                links[i].label = e.target.value;
                                                handleChange('header', 'links', links);
                                            }}
                                            style={{ ...refinedInputStyle, marginBottom: 0 }}
                                        />
                                        <button onClick={() => {
                                            const links = [...data.header.links];
                                            links.splice(i, 1);
                                            handleChange('header', 'links', links);
                                        }} style={deleteSmallBtnStyle}><Trash2 size={14} /></button>
                                    </div>
                                    <input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => {
                                            const links = [...data.header.links];
                                            links[i].url = e.target.value;
                                            handleChange('header', 'links', links);
                                        }}
                                        style={{ ...refinedInputStyle, marginBottom: 0 }}
                                    />
                                </div>
                            ))}
                            <button onClick={() => {
                                const links = [...data.header.links];
                                links.push({ label: '', url: '', type: '' });
                                handleChange('header', 'links', links);
                            }} style={addBtnStyle}><Plus size={14} /> Add Contact Link</button>
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'summary' ? '' : 'summary')} 
                        style={sectionHeaderStyle(activeSection === 'summary')}
                    >
                        <span>PROFESSIONAL SUMMARY</span>
                        {activeSection === 'summary' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'summary' && (
                        <div style={sectionContentStyle}>
                            <textarea
                                placeholder="Brief professional overview..."
                                value={data.summary || ''}
                                onChange={(e) => onChange({ ...data, summary: e.target.value })}
                                style={{ ...refinedTextareaStyle, minHeight: '150px' }}
                            />
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')} 
                        style={sectionHeaderStyle(activeSection === 'skills')}
                    >
                        <span>TECHNICAL SKILLS</span>
                        {activeSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'skills' && (
                        <div style={sectionContentStyle}>
                            {data.skills.categories.map((cat, i) => (
                                <div key={i} style={cardStyle}>
                                    <input
                                        placeholder="Category"
                                        value={cat.name}
                                        onChange={(e) => {
                                            const cats = [...data.skills.categories];
                                            cats[i].name = e.target.value;
                                            handleChange('skills', 'categories', cats);
                                        }}
                                        style={{ ...refinedInputStyle, fontWeight: '800' }}
                                    />
                                    <textarea
                                        placeholder="Skills (comma separated)"
                                        value={cat.items}
                                        onChange={(e) => {
                                            const cats = [...data.skills.categories];
                                            cats[i].items = e.target.value;
                                            handleChange('skills', 'categories', cats);
                                        }}
                                        style={{ ...refinedTextareaStyle, minHeight: '80px' }}
                                    />
                                    <button onClick={() => {
                                        const cats = [...data.skills.categories];
                                        cats.splice(i, 1);
                                        handleChange('skills', 'categories', cats);
                                    }} style={deleteSmallBtnStyle}><Trash2 size={14} /> Remove Category</button>
                                </div>
                            ))}
                            <button onClick={() => {
                                const cats = [...data.skills.categories];
                                cats.push({ name: '', items: '' });
                                handleChange('skills', 'categories', cats);
                            }} style={addBtnStyle}><Plus size={14} /> Add Skill Set</button>
                        </div>
                    )}
                </div>

                {/* Experience */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')} 
                        style={sectionHeaderStyle(activeSection === 'experience')}
                    >
                        <span>WORK EXPERIENCE</span>
                        {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'experience' && (
                        <div style={sectionContentStyle}>
                            {data.experience.map((exp, i) => (
                                <div key={i} style={cardStyle}>
                                    <input value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, i, 'company')} style={refinedInputStyle} placeholder="Company" />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input value={exp.role} onChange={(e) => handleChange('experience', 'role', e.target.value, i, 'role')} style={refinedInputStyle} placeholder="Role" />
                                        <input value={exp.date} onChange={(e) => handleChange('experience', 'date', e.target.value, i, 'date')} style={refinedInputStyle} placeholder="Date" />
                                    </div>
                                    <textarea
                                        value={exp.description.join('\n')}
                                        onChange={(e) => handleChange('experience', 'description', e.target.value.split('\n'), i, 'description')}
                                        style={refinedTextareaStyle}
                                        placeholder="Bullets (one per line)"
                                    />
                                    <button onClick={() => removeArrayItem('experience', i)} style={deleteSmallBtnStyle}><Trash2 size={14} /> Remove Entry</button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience', { company: '', role: '', date: '', description: [] })} style={addBtnStyle}><Plus size={14} /> Add Experience</button>
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'projects' ? '' : 'projects')} 
                        style={sectionHeaderStyle(activeSection === 'projects')}
                    >
                        <span>PROJECTS</span>
                        {activeSection === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'projects' && (
                        <div style={sectionContentStyle}>
                            {data.projects.map((proj, i) => (
                                <div key={i} style={cardStyle}>
                                    <input value={proj.title} onChange={(e) => handleChange('projects', 'title', e.target.value, i, 'title')} style={refinedInputStyle} placeholder="Project Name" />
                                    <input value={proj.techStack} onChange={(e) => handleChange('projects', 'techStack', e.target.value, i, 'techStack')} style={refinedInputStyle} placeholder="Technologies" />
                                    <textarea
                                        value={proj.description.join('\n')}
                                        onChange={(e) => handleChange('projects', 'description', e.target.value.split('\n'), i, 'description')}
                                        style={refinedTextareaStyle}
                                        placeholder="Description Bullets"
                                    />
                                    <button onClick={() => removeArrayItem('projects', i)} style={deleteSmallBtnStyle}><Trash2 size={14} /> Remove Project</button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('projects', { title: '', techStack: '', date: '', description: [] })} style={addBtnStyle}><Plus size={14} /> Add Project</button>
                        </div>
                    )}
                </div>

                {/* Appearance */}
                <div className="section-block" style={{ marginBottom: '16px' }}>
                    <div 
                        onClick={() => setActiveSection(activeSection === 'settings' ? '' : 'settings')} 
                        style={sectionHeaderStyle(activeSection === 'settings')}
                    >
                        <span>APPEARANCE & TYPE</span>
                        {activeSection === 'settings' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'settings' && (
                        <div style={sectionContentStyle}>
                            <label style={labelStyle}>Template Style</label>
                            <select
                                value={data.settings.template || 'standard'}
                                onChange={(e) => handleChange('settings', 'template', e.target.value)}
                                style={refinedSelectStyle}
                            >
                                <option value="standard">Standard Professional</option>
                                <option value="modern">Modern Creative</option>
                                <option value="minimalist">Minimalist Exec</option>
                            </select>
                            
                            <label style={labelStyle}>Theme Color</label>
                            <input
                                type="color"
                                value={data.settings.themeColor}
                                onChange={(e) => handleChange('settings', 'themeColor', e.target.value)}
                                style={{ width: '100%', height: '40px', padding: '4px', border: '2px solid #1a202c', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}
                            />

                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <label style={{ ...labelStyle, color: '#1a202c', marginBottom: '12px' }}>Custom Section Headings</label>
                                {Object.keys(data.sectionTitles || {}).map(key => (
                                    <div key={key} style={{ marginBottom: '12px' }}>
                                        <label style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>{key}</label>
                                        <input
                                            value={data.sectionTitles[key]}
                                            onChange={(e) => {
                                                const titles = { ...data.sectionTitles, [key]: e.target.value };
                                                onChange({ ...data, sectionTitles: titles });
                                            }}
                                            style={{ ...refinedInputStyle, padding: '8px 12px', fontSize: '12px', marginBottom: 0 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reset Action */}
                <button 
                    onClick={onReset}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: '2px solid #f87171',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        marginTop: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <RotateCcw size={16} /> Reset All Data
                </button>
            </div>
        </div>
    );
};

// --- STYLING MACROS ---
const sectionHeaderStyle = (isActive) => ({
    padding: '16px 20px',
    background: isActive ? '#1a202c' : '#fff',
    color: isActive ? '#fff' : '#1a202c',
    border: '2.5px solid #1a202c',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '0.1em',
    transition: 'all 0.2s',
    boxShadow: isActive ? 'none' : '4px 4px 0px #1a202c'
});

const sectionContentStyle = {
    padding: '24px 8px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const refinedInputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#fff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    outline: 'none',
    transition: 'all 0.2s',
    marginBottom: '8px'
};

const refinedTextareaStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#fff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.6',
    fontWeight: '500',
    color: '#334155',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
};

const refinedSelectStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#fff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: '16px'
};

const cardStyle = {
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    background: '#f8fafc',
    marginBottom: '12px'
};

const labelStyle = {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: '6px',
    display: 'block',
    letterSpacing: '0.05em'
};

const addBtnStyle = {
    padding: '12px',
    background: '#f0fdf4',
    color: '#15803d',
    border: '2px dashed #86efac',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%'
};

const deleteSmallBtnStyle = {
    padding: '8px',
    background: '#fff',
    color: '#ef4444',
    border: '1.5px solid #fee2e2',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
export default Editor;
