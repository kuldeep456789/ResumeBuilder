import React from 'react';
import { Save, Download, Target, Plus } from 'lucide-react';

const EditorFooter = ({ atsScore, onSave, onDownload, data, onAddSkill, isScanning, isMobileView = false }) => {
    const missingKeywords = Array.isArray(atsScore?.missingKeywords) ? atsScore.missingKeywords : [];
    const keywordLimit = isMobileView ? 2 : 4;
    const score = Number.isFinite(atsScore?.overall)
        ? Math.max(0, Math.min(100, Math.round(atsScore.overall)))
        : 0;
    const scoreStatus = isScanning ? 'Scanning' : score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low';
    const displayKeywords = missingKeywords.slice(0, keywordLimit);

    return (
        <div className={`editor-footer-bar ${isMobileView ? 'mobile' : ''}`}>
            <div className="editor-footer-main">
                <div className="footer-match-pill">
                    <div className="footer-match-ring" style={{ '--match-score': `${score}%` }}>
                        <span>{isScanning ? '...' : `${score}%`}</span>
                    </div>
                    <div className="footer-match-copy">
                        <span className="footer-label">ATS Match</span>
                        <strong>{scoreStatus}</strong>
                    </div>
                </div>

                <span className="footer-separator" />

                <div className="footer-strategy">
                    <div className="footer-strategy-header">
                        <Target size={14} />
                        <span className="footer-label">Missing Strategy</span>
                    </div>

                    <div className="footer-tags">
                        {displayKeywords.length > 0 && !isScanning ? (
                            displayKeywords.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    className="footer-tag"
                                    onClick={() => onAddSkill(skill)}
                                >
                                    <Plus size={11} />
                                    {skill}
                                </button>
                            ))
                        ) : (
                            <span className="footer-no-tags">
                                {isScanning ? 'Scanning keywords...' : 'No missing keywords'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-action-group">
                <button
                    type="button"
                    onClick={() => {
                        const title = window.prompt('Resume Name:', data.header.name || 'My Resume');
                        if (title) onSave(title);
                    }}
                    className="footer-action-btn ghost"
                >
                    <Save size={16} />
                    Save Draft
                </button>

                <button
                    type="button"
                    onClick={onDownload}
                    className="footer-action-btn solid"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default EditorFooter;
