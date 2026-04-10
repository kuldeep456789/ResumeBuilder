import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { initialResumeState } from './data';
import Resume from './components/Resume';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import ResumeUploadModal from './components/ResumeUploadModal';
import TemplateSelectionModal from './components/TemplateSelectionModal';
import AuthPage from './components/AuthPage';
import { calculateATSScore } from './services/ats/atsEngine';
import ErrorBoundary from './components/ErrorBoundary';
import { clearSession, fetchCurrentUser, readSession, saveSession } from './services/authService';
import './components/Resume.css';
import './App.css';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  React.useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const existingSession = readSession();
      if (!existingSession?.token) {
        if (isMounted) setAuthLoading(false);
        return;
      }

      try {
        const profile = await fetchCurrentUser(existingSession.token);
        const refreshedSession = {
          token: existingSession.token,
          user: profile.user
        };
        saveSession(refreshedSession);

        if (isMounted) {
          setAuthUser(profile.user);
        }
      } catch {
        clearSession();
        if (isMounted) {
          setAuthUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthSuccess = (sessionPayload) => {
    setAuthUser(sessionPayload.user);
  };

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
  };

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner"></div>
        <p>Checking your session...</p>
      </div>
    );
  }

  if (!authUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <ErrorBoundary>
      <MainApp key={String(authUser.id)} user={authUser} onLogout={handleLogout} />
    </ErrorBoundary>
  );
}

function MainApp({ user, onLogout }) {
  const getIsMobileViewport = () => window.innerWidth <= 900;
  const [view, setView] = useState('dashboard');
  const [isMobileView, setIsMobileView] = useState(getIsMobileViewport);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const resumeStorageKey = `resumeData:${user.id}`;
  const savedResumesStorageKey = `savedResumesList:${user.id}`;

  const [savedResumes, setSavedResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(savedResumesStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved resumes:', e);
      return [];
    }
  });

  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(resumeStorageKey);
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
          education: Array.isArray(parsed.education) ? parsed.education : initialResumeState.education
        };
      }
    } catch (e) {
      console.error('Error loading resume data:', e);
    }
    return initialResumeState;
  });

  const [isScanning, setIsScanning] = useState(false);
  const [atsScore, setAtsScore] = useState(() => calculateATSScore(data));
  const [editorAccentColor, setEditorAccentColor] = useState(() => data?.settings?.themeColor || '#004AAD');

  const displayUserName = user.fullName || user.email || user.phone || 'User';

  const handleCheckATS = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAtsScore(calculateATSScore(data));
    }, 2500);
  };

  React.useEffect(() => {
    localStorage.setItem(resumeStorageKey, JSON.stringify(data));
    setLastSaved(new Date().toLocaleTimeString());
    if (!isScanning) setAtsScore(calculateATSScore(data));
  }, [data, isScanning, resumeStorageKey]);

  React.useEffect(() => {
    localStorage.setItem(savedResumesStorageKey, JSON.stringify(savedResumes));
  }, [savedResumes, savedResumesStorageKey]);

  React.useEffect(() => {
    const currentThemeColor = data?.settings?.themeColor || '#004AAD';
    if (currentThemeColor !== editorAccentColor) {
      setEditorAccentColor(currentThemeColor);
    }
  }, [data?.settings?.themeColor, editorAccentColor]);

  React.useEffect(() => {
    const handleResize = () => setIsMobileView(getIsMobileViewport());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setSavedResumes((prev) => [newResume, ...prev]);
  };

  const handleDeleteResume = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleLoadResume = (resumeData) => {
    setData(resumeData);
    setEditorAccentColor(resumeData?.settings?.themeColor || '#004AAD');
    setView('editor');
  };

  const handleBackToPrevious = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setView('dashboard');
  };

  const handleGoToMainPage = () => {
    setView('dashboard');
  };

  const handleAccentColorChange = (nextColor) => {
    setEditorAccentColor(nextColor);
    setData((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        themeColor: nextColor
      }
    }));
  };

  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume'
  });

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard
          user={user}
          onLogout={onLogout}
          data={data}
          atsScore={atsScore}
          lastSaved={lastSaved}
          savedResumes={savedResumes}
          onEdit={() => setView('editor')}
          onUpload={() => setIsUploadOpen(true)}
          onDelete={handleDeleteResume}
          onLoad={handleLoadResume}
          onNew={() => {
            if (window.confirm('Create new resume? This will overwrite your current draft.')) {
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
            const nextData = {
              ...initialResumeState,
              settings: {
                ...initialResumeState.settings,
                template: templateId
              }
            };
            setData(nextData);
            setEditorAccentColor(nextData.settings.themeColor || '#004AAD');
            setIsTemplateModalOpen(false);
            setView('editor');
          }}
        />
      </>
    );
  }

  return (
    <div className="editor-app-shell" style={{ '--editor-accent': editorAccentColor }}>
      <style>{scannerStyle}</style>

      <header className="editor-topbar">
        <button
          type="button"
          className="editor-topbar-left editor-home-trigger"
          onClick={handleGoToMainPage}
          aria-label="Go to main page"
          title="Go to main page"
        >
          <div className="editor-brand-icon">
            <span>R</span>
          </div>
          <div className="editor-brand-copy">
            <p>Resume Studio</p>
            <h2>Professional Editor Workspace</h2>
          </div>
        </button>

        <div className="editor-topbar-right">
          <span className="editor-user-pill" title={displayUserName}>
            {displayUserName}
          </span>
          <span className="editor-last-sync">
            Last Sync: {lastSaved || 'Not yet'}
          </span>
          <div className="editor-color-control">
            <label htmlFor="accentColorPicker" className="editor-color-label">Color</label>
            <input
              id="accentColorPicker"
              type="color"
              value={editorAccentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="editor-color-input"
            />
          </div>
          <button
            onClick={handleBackToPrevious}
            className="topbar-exit-btn"
          >
            Back
          </button>
          <button
            onClick={onLogout}
            className="topbar-logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      <div
        className="editor-main-area"
        style={{ paddingBottom: isMobileView ? '18px' : '22px' }}
      >
        <aside className="editor-left-panel">
          <div className="left-panel-header">
            <h3>Editor Section</h3>
            <p>Build ATS-focused content on the left, see real output on the right.</p>
          </div>
          <Editor
            data={data}
            atsScore={atsScore}
            onChange={setData}
            onDownload={handlePrint}
            onSave={handleSaveResume}
            onCheckATS={handleCheckATS}
            isScanning={isScanning}
            onReset={() => {
              if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                setData(initialResumeState);
              }
            }}
          />
        </aside>

        <section className="editor-right-panel">
          <div className={`preview-frame ${isMobileView ? 'mobile' : ''}`}>
            {isScanning && (
              <>
                <div className="scanner-line"></div>
                <div className="scanner-overlay"></div>
              </>
            )}
            <Resume data={data} ref={resumeRef} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
