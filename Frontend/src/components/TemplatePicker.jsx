import React from 'react';
import './TemplatePicker.css';

const TemplatePicker = ({ onSelect, onBack }) => {
  const templates = [
    { id: 'standard', name: 'Standard Professional', theme: 'tp-theme-standard' },
    { id: 'modern', name: 'Modern Creative', theme: 'tp-theme-modern' },
    { id: 'minimalist', name: 'Executive Minimalist', theme: 'tp-theme-minimal' }
  ];

  return (
    <div className="tp-page">
      <button className="tp-back-btn" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Dashboard
      </button>

      <div className="tp-header">
        <h1 className="tp-title">Pick a template and build your resume in minutes!</h1>
      </div>

      <div className="tp-carousel-container">
        <div className="tp-carousel">
          {templates.map((tpl) => (
            <div key={tpl.id} className="tp-card" onClick={() => onSelect(tpl.id)}>
              <div className={`tp-card-preview ${tpl.theme}`}>
                <div className="tp-sk-header">
                  <div className="tp-sk-name"></div>
                  <div className="tp-sk-contact"></div>
                </div>

                <div className="tp-sk-section" style={{ marginTop: '20px' }}>
                  <div className="tp-sk-sec-title"></div>
                  <div className="tp-sk-line w-100"></div>
                  <div className="tp-sk-line w-90"></div>
                  <div className="tp-sk-line w-80"></div>
                </div>

                <div className="tp-sk-section" style={{ marginTop: '20px' }}>
                  <div className="tp-sk-sec-title"></div>
                  <div className="tp-sk-line w-100"></div>
                  <div className="tp-sk-line w-80"></div>
                  <div className="tp-sk-line w-60"></div>
                </div>

                <div className="tp-sk-section" style={{ marginTop: '20px' }}>
                  <div className="tp-sk-sec-title"></div>
                  <div className="tp-sk-line w-100"></div>
                  <div className="tp-sk-line w-100"></div>
                </div>
              </div>
              <div className="tp-card-info">
                <h3 className="tp-card-title">{tpl.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;
