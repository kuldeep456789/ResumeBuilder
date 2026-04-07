import React from 'react';
import { Save, Download, Target, Plus } from 'lucide-react';

const EditorFooter = ({ atsScore, onSave, onDownload, data, onAddSkill, isScanning, isMobileView = false }) => {
    const missingKeywords = Array.isArray(atsScore?.missingKeywords) ? atsScore.missingKeywords : [];
    const keywordLimit = isMobileView ? 2 : 4;

    return (
        <div style={{
            minHeight: isMobileView ? '106px' : '80px',
            background: '#1a202c',
            borderTop: '1px solid #2d3748',
            display: 'flex',
            alignItems: isMobileView ? 'stretch' : 'center',
            flexDirection: isMobileView ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobileView ? '10px' : 0,
            padding: isMobileView ? '10px 12px' : '0 40px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
            {/* Optimizer Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobileView ? '10px' : '40px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '8px',
                        background: isScanning ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0, 74, 173, 0.2)',
                        borderRadius: '8px',
                        color: isScanning ? '#4ade80' : '#60a5fa',
                        display: 'flex',
                        animation: isScanning ? 'pulse 1.5s infinite' : 'none'
                    }}>
                        <Target size={isMobileView ? 16 : 20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Optimizer</div>
                        <div style={{ fontSize: isMobileView ? '12px' : '14px', fontWeight: '800', color: '#fff' }}>{isScanning ? 'SCANNING...' : 'LIVE ANALYSIS'}</div>
                    </div>
                </div>

                {!isMobileView && <div style={{ height: '30px', width: '1px', background: '#2d3748' }}></div>}

                {/* ATS Match Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#2d3748" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke={atsScore.overall > 70 ? '#10b981' : '#f59e0b'} strokeWidth="3"
                                strokeDasharray={isScanning ? '0 100' : `${atsScore.overall} 100`} strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: '900', color: '#fff' }}>
                            {isScanning ? '...' : `${atsScore.overall}%`}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>ATS Match</div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1' }}>{isScanning ? 'WAIT' : (atsScore.overall > 75 ? 'HIGH' : 'OPTIMIZING')}</div>
                    </div>
                </div>

                {/* Missing Keywords Suggestion */}
                {!isScanning && missingKeywords.length > 0 && !isMobileView && (
                    <>
                        <div style={{ height: '30px', width: '1px', background: '#2d3748' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '400px' }}>
                            <div style={{ fontSize: '9px', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Missing Strategy</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {missingKeywords.slice(0, keywordLimit).map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => onAddSkill(skill)}
                                        style={{
                                            background: 'rgba(96, 165, 250, 0.1)',
                                            border: '1px solid rgba(96, 165, 250, 0.2)',
                                            color: '#60a5fa',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                        onMouseOver={(e) => { e.target.style.background = 'rgba(96, 165, 250, 0.2)'; }}
                                        onMouseOut={(e) => { e.target.style.background = 'rgba(96, 165, 250, 0.1)'; }}
                                    >
                                        <Plus size={10} /> {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', width: isMobileView ? '100%' : 'auto' }}>
                <button
                    onClick={() => {
                        const title = window.prompt("Resume Name:", data.header.name || "My Resume");
                        if (title) onSave(title);
                    }}
                    style={{
                        flex: isMobileView ? 1 : 'none',
                        padding: isMobileView ? '10px 12px' : '10px 24px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1.5px solid #334155',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.background = '#2d3748'; e.target.style.borderColor = '#475569'; }}
                    onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#334155'; }}
                >
                    <Save size={16} /> Save Draft
                </button>

                <button
                    onClick={onDownload}
                    style={{
                        flex: isMobileView ? 1 : 'none',
                        padding: isMobileView ? '10px 14px' : '10px 28px',
                        background: '#004AAD',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 16px rgba(0, 74, 173, 0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.background = '#003a8c'; e.target.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.target.style.background = '#004AAD'; e.target.style.transform = 'translateY(0)'; }}
                >
                    <Download size={16} /> Download PDF
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default EditorFooter;
