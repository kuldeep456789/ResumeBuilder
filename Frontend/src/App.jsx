import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { initialResumeState } from './data';
import Resume from './components/Resume';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import EditorFooter from './components/EditorFooter';
import ResumeUploadModal from './components/ResumeUploadModal';
import TemplateSelectionModal from './components/TemplateSelectionModal';
import { calculateATSScore } from './services/ats/atsEngine';
import ErrorBoundary from './components/ErrorBoundary';
import './components/Resume.css';

function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const getIsMobileViewport = () => window.innerWidth <= 900;
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'editor'
  const [isMobileView, setIsMobileView] = useState(getIsMobileViewport);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [savedResumes, setSavedResumes] = useState(() => {
    try {
      const saved = localStorage.getItem('savedResumesList');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading saved resumes:", e);
      return [];
    }
  });

  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          ...initialResumeState,
          ...parsed,
          header: { ...initialResumeState.header, ...(parsed.header || {}) },
          skills: { ...initialResumeState.skills, ...(parsed.skills || {}) },
          experience: Array.isArray(parsed.experience) ? parsed.experience : initialResumeState.experience,
          projects: Array.isArray(parsed.projects) ? parsed.projects : initialResumeState.projects,
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : initialResumeState.certifications,
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : initialResumeState.achievements,
          education: Array.isArray(parsed.education) ? parsed.education : initialResumeState.education,
        };
      }
    } catch (e) {
      console.error("Error loading resume data:", e);
    }
    return initialResumeState;
  });

  const [isScanning, setIsScanning] = useState(false);
  const [atsScore, setAtsScore] = useState(() => calculateATSScore(data));

  const handleCheckATS = () => {
    setIsScanning(true);
    // Simulate deep scanning
    setTimeout(() => {
      setIsScanning(false);
      setAtsScore(calculateATSScore(data));
      // alert("Scan complete! Deep analysis updated.");
    }, 2500);
  };

  const handleAddSkill = (skill) => {
    setData(prev => {
        const firstCategory = prev.skills.categories[0];
        if (firstCategory) {
            const newCategories = [...prev.skills.categories];
            newCategories[0] = {
                ...firstCategory,
                items: firstCategory.items ? `${firstCategory.items}, ${skill}` : skill
            };
            return { ...prev, skills: { ...prev.skills, categories: newCategories } };
        }
        return prev;
    });
  };

  React.useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
    setLastSaved(new Date().toLocaleTimeString());
    if (!isScanning) setAtsScore(calculateATSScore(data));
  }, [data, isScanning]);

  React.useEffect(() => {
    localStorage.setItem('savedResumesList', JSON.stringify(savedResumes));
  }, [savedResumes]);

  React.useEffect(() => {
    const handleResize = () => setIsMobileView(getIsMobileViewport());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scanner Animation Style
  const scannerStyle = `
    @keyframes scanMove {
        0% { top: -2px; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
    .scanner-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(to bottom, transparent, #22c55e, transparent);
        box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
        z-index: 50;
        pointer-events: none;
        animation: scanMove 2.5s ease-in-out infinite;
    }
    .scanner-overlay {
        position: absolute;
        inset: 0;
        background: rgba(34, 197, 94, 0.03);
        z-index: 40;
        pointer-events: none;
        transition: opacity 0.3s;
    }
  `;

  const handleSaveResume = (title) => {
    const newResume = {
      id: Date.now().toString(),
      title: title || `Resume - ${new Date().toLocaleDateString()}`,
      lastModified: new Date().toISOString(),
      data: { ...data }
    };
    setSavedResumes(prev => [newResume, ...prev]);
    // alert("Resume saved successfully!");
  };

  const handleDeleteResume = (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setSavedResumes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleLoadResume = (resumeData) => {
    setData(resumeData);
    setView('editor');
  };

  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume',
  });

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard
          data={data}
          atsScore={atsScore}
          lastSaved={lastSaved}
          savedResumes={savedResumes}
          onEdit={() => setView('editor')}
          onUpload={() => setIsUploadOpen(true)}
          onDelete={handleDeleteResume}
          onLoad={handleLoadResume}
          onNew={() => {
            if (window.confirm("Create new resume? This will overwrite your current draft.")) {
              setIsTemplateModalOpen(true);
            }
          }}
        />
        <ResumeUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={(uploadedData) => {
            setData(uploadedData);
            setView('dashboard');
          }}
        />
        <TemplateSelectionModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelect={(templateId) => {
            setData({
              ...initialResumeState,
              settings: {
                ...initialResumeState.settings,
                template: templateId
              }
            });
            setIsTemplateModalOpen(false);
            setView('editor');
          }}
        />
      </>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      height: '100dvh',
      background: '#f8fafc',
      overflow: isMobileView ? 'auto' : 'hidden'
    }}>
      <style>{scannerStyle}</style>
      
      {/* Top Header */}
      <div style={{
        minHeight: '64px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: isMobileView ? 'wrap' : 'nowrap',
        padding: isMobileView ? '10px 14px' : '0 24px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: '#1a202c', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             <span style={{ color: '#fff', fontSize: '18px', fontWeight: '900' }}>R</span>
          </div>
          <h2 style={{ fontSize: isMobileView ? '0.95rem' : '1.1rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>Editor <span style={{ color: '#004AAD' }}>Workplace</span></h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <span style={{ display: isMobileView ? 'none' : 'inline', fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Last Sync: {lastSaved}
          </span>
          <button
            onClick={() => setView('dashboard')}
            style={{
              padding: isMobileView ? '7px 12px' : '8px 16px',
              fontSize: '12px',
              background: '#f1f5f9',
              color: '#475569',
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.background = '#e2e8f0'; e.target.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#e2e8f0'; }}
          >
            ← Exit to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobileView ? 'column' : 'row',
        flex: 1, 
        overflow: isMobileView ? 'auto' : 'hidden',
        paddingBottom: isMobileView ? '132px' : '80px' // Space for fixed footer
      }}>
        {/* Editor Sidebar */}
        <div style={{ 
          width: isMobileView ? '100%' : '450px',
          maxHeight: isMobileView ? 'none' : '100%',
          borderRight: isMobileView ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobileView ? '1px solid #e2e8f0' : 'none',
          background: '#fff',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <Editor
            data={data}
            atsScore={atsScore}
            onChange={setData}
            onDownload={handlePrint}
            onSave={handleSaveResume}
            onCheckATS={handleCheckATS}
            isScanning={isScanning}
            onReset={() => {
              if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                setData(initialResumeState);
              }
            }}
          />
        </div>

        {/* Live Preview Area */}
        <div style={{ 
          flex: 1, 
          background: '#cbd5e1',
          minHeight: isMobileView ? 'auto' : 0,
          padding: isMobileView ? '16px 12px 24px' : '40px',
          display: 'flex', 
          justifyContent: 'center', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
           <div style={{ 
             maxWidth: isMobileView ? '100%' : '850px',
             width: '100%',
             boxShadow: '0 25px 60px -12px rgba(0,0,0,0.2)',
             borderRadius: isMobileView ? '10px' : '2px',
             background: 'white',
             position: 'relative',
             height: 'fit-content'
           }}>
             {isScanning && (
                <>
                    <div className="scanner-line"></div>
                    <div className="scanner-overlay"></div>
                </>
             )}
             <Resume data={data} ref={resumeRef} />
           </div>
        </div>
      </div>

      {/* Persistence & Strategy Footer */}
      <EditorFooter 
        isMobileView={isMobileView}
        atsScore={atsScore} 
        onSave={handleSaveResume} 
        onDownload={handlePrint} 
        data={data}
        onAddSkill={handleAddSkill}
        onCheckATS={handleCheckATS}
        isScanning={isScanning}
      />
    </div>
  );
}

export default App;
