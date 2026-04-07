import React from 'react';
import { AlertTriangle, CircleCheck, Download, Save } from 'lucide-react';

const LEVEL_META = {
    weak: { label: 'Weak', color: '#ff7e94', bg: 'rgba(255, 126, 148, 0.14)', border: 'rgba(255, 126, 148, 0.45)' },
    medium: { label: 'Medium', color: '#ffc371', bg: 'rgba(255, 195, 113, 0.14)', border: 'rgba(255, 195, 113, 0.42)' },
    high: { label: 'High', color: '#4ee8d3', bg: 'rgba(78, 232, 211, 0.14)', border: 'rgba(78, 232, 211, 0.40)' },
};

const getLevelKey = (value) => {
    if (value < 55) return 'weak';
    if (value < 78) return 'medium';
    return 'high';
};

const PERFORMANCE_COPY = {
    skills: {
        good: 'Great keyword match. Keep adding role-specific technologies in Skills and Projects.',
        improve: 'Add stronger role keywords and modern tools in skills and project stacks.',
    },
    experience: {
        good: 'Experience bullets are strong and result-oriented.',
        improve: 'Use more quantified outcomes and action verbs in work experience bullets.',
    },
    projects: {
        good: 'Project section is clear and impactful with good technical context.',
        improve: 'Add measurable impact and complete tech stack in each project.',
    },
    structure: {
        good: 'Resume structure is well organized for ATS parsing.',
        improve: 'Improve section completeness and keep clear ATS-friendly headings.',
    },
};

const ATSCategoryBreakdownCard = ({
    atsScore,
    targetRole,
    isScanning,
    onCheckATS,
    onSave,
    onDownload,
    defaultTitle,
}) => {
    const overall = Number.isFinite(atsScore?.overall) ? atsScore.overall : 0;
    const sections = {
        skills: Number.isFinite(atsScore?.sections?.skills) ? atsScore.sections.skills : 0,
        experience: Number.isFinite(atsScore?.sections?.experience) ? atsScore.sections.experience : 0,
        projects: Number.isFinite(atsScore?.sections?.projects) ? atsScore.sections.projects : 0,
        structure: Number.isFinite(atsScore?.sections?.headers) ? atsScore.sections.headers : 0,
    };

    const performanceRows = [
        { key: 'skills', label: 'Skills', value: sections.skills },
        { key: 'experience', label: 'Work Experience', value: sections.experience },
        { key: 'projects', label: 'Projects', value: sections.projects },
        { key: 'structure', label: 'Structure', value: sections.structure },
    ].map((row) => {
        const levelKey = getLevelKey(row.value);
        return {
            ...row,
            levelKey,
            level: LEVEL_META[levelKey],
        };
    });

    const [activeKey, setActiveKey] = React.useState('skills');

    React.useEffect(() => {
        if (!performanceRows.some((row) => row.key === activeKey)) {
            setActiveKey(performanceRows[0]?.key || 'skills');
        }
    }, [activeKey, performanceRows]);

    const activeRow = performanceRows.find((row) => row.key === activeKey) || performanceRows[0];
    const activeCopy = PERFORMANCE_COPY[activeRow?.key] || PERFORMANCE_COPY.skills;
    const activeMessage = activeRow?.levelKey === 'high' ? activeCopy.good : activeCopy.improve;

    const missingTechStack = Array.isArray(atsScore?.missingTechStack)
        ? atsScore.missingTechStack
        : [];

    const handleSaveClick = () => {
        if (!onSave) return;
        const suggestedTitle = defaultTitle || 'My Resume';
        const title = window.prompt('Resume Name:', suggestedTitle);
        if (title === null) return;
        onSave(title.trim() || suggestedTitle);
    };

    return (
        <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '18px',
            background: 'linear-gradient(150deg, #061a33, #08284f)',
            border: '1px solid rgba(109, 164, 221, 0.32)',
            color: '#eaf4ff',
            boxShadow: '0 18px 36px rgba(3, 9, 18, 0.3)',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'linear-gradient(160deg, rgba(4, 24, 48, 0.96), rgba(8, 36, 70, 0.9))',
                border: '1px solid rgba(109, 164, 221, 0.25)',
                marginBottom: '14px',
            }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        background: `conic-gradient(#4EE8D3 ${overall}%, rgba(112, 143, 178, 0.35) 0)`,
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: '5px',
                            borderRadius: '50%',
                            background: '#0a2642',
                        }} />
                        <span style={{ position: 'relative', zIndex: 1, fontWeight: 800, fontSize: '0.86rem' }}>{overall}%</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.66rem', color: '#95bce1', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                            ATS Match
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                            {getLevelKey(overall) === 'high' ? 'High' : getLevelKey(overall) === 'medium' ? 'Medium' : 'Need Work'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={onCheckATS}
                        disabled={isScanning}
                        style={{
                            borderRadius: '10px',
                            border: '1px solid rgba(111, 166, 223, 0.4)',
                            background: isScanning ? 'rgba(24, 60, 104, 0.5)' : '#0d58b6',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '8px 11px',
                            cursor: isScanning ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isScanning ? 'Scanning...' : 'ATS Score Check'}
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveClick}
                        style={{
                            borderRadius: '10px',
                            border: '1px solid rgba(111, 166, 223, 0.45)',
                            background: 'rgba(8, 31, 60, 0.72)',
                            color: '#f2f8ff',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '8px 11px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        <Save size={14} /> Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={onDownload}
                        style={{
                            borderRadius: '10px',
                            border: '1px solid rgba(55, 145, 244, 0.74)',
                            background: 'linear-gradient(130deg, #0f4ead, #0f6cde)',
                            color: '#ffffff',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '8px 12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </div>

            <div style={{
                borderRadius: '14px',
                border: '1px solid rgba(99, 155, 214, 0.25)',
                background: 'linear-gradient(165deg, rgba(3, 24, 51, 0.95), rgba(5, 34, 69, 0.92))',
                padding: '14px',
                marginBottom: '12px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                        Performance Status
                    </h3>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                        {Object.values(LEVEL_META).map((level) => (
                            <span key={level.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#a8c8e8' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: level.color }} />
                                {level.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                    {performanceRows.map((row) => (
                        <div
                            key={row.key}
                            onMouseEnter={() => setActiveKey(row.key)}
                            style={{ display: 'grid', gridTemplateColumns: '130px 1fr auto', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        >
                            <span style={{ color: '#d2e7fb', fontSize: '1rem' }}>{row.label}</span>
                            <div style={{ height: '11px', background: 'rgba(130, 171, 212, 0.23)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${row.value}%`,
                                    height: '100%',
                                    background: row.level.color,
                                    borderRadius: '999px',
                                    transition: 'width 220ms ease',
                                }} />
                            </div>
                            <span style={{
                                minWidth: '78px',
                                textAlign: 'center',
                                borderRadius: '999px',
                                border: `1px solid ${row.level.border}`,
                                background: row.level.bg,
                                color: row.level.color,
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                padding: '4px 10px',
                            }}>
                                {row.level.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '12px',
                    borderRadius: '12px',
                    border: `1px solid ${activeRow?.level?.border || 'rgba(127, 171, 216, 0.25)'}`,
                    background: activeRow?.level?.bg || 'rgba(127, 171, 216, 0.15)',
                    padding: '10px',
                }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        {activeRow?.levelKey === 'high' ? (
                            <CircleCheck size={15} color={activeRow.level.color} />
                        ) : (
                            <AlertTriangle size={15} color={activeRow.level.color} />
                        )}
                        <span style={{
                            fontSize: '0.76rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: activeRow?.level?.color || '#9cc4eb',
                            fontWeight: 700,
                        }}>
                            Featured Insight ({activeRow?.label})
                        </span>
                    </div>
                    <p style={{ margin: 0, color: '#d5e8fb', fontSize: '0.87rem' }}>
                        {activeRow?.levelKey === 'high' ? 'Good: ' : 'Need Improvement: '}
                        {activeMessage}
                    </p>
                </div>
            </div>

            <div style={{
                marginTop: '10px',
                borderTop: '1px solid rgba(127, 171, 216, 0.25)',
                paddingTop: '12px',
            }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9cc4eb', marginBottom: '8px' }}>
                    Missing Tech Stack
                </div>
                {missingTechStack.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {missingTechStack.map((tech) => (
                            <span key={tech} style={{
                                border: '1px solid rgba(127, 176, 227, 0.52)',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                color: '#d9ebff',
                                background: 'rgba(16, 48, 86, 0.65)',
                            }}>
                                + {tech}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p style={{ margin: 0, color: '#d3e6fb', fontSize: '0.85rem' }}>
                        Great job. No major tech stack gaps detected.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ATSCategoryBreakdownCard;
