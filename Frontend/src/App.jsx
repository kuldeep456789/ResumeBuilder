import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { initialResumeState } from './data';
import Resume from './components/Resume';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import ResumeUploadModal from './components/ResumeUploadModal';
import TemplateSelectionModal from './components/TemplateSelectionModal';
import AuthPage from './components/AuthPage';
import AtelierPortfolio from './components/portfolio/AtelierPortfolio';
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

  if (view === 'portfolio') {
    return <AtelierPortfolio data={data} onExit={() => setView('dashboard')} />;
  }

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
          onViewPortfolio={() => setView('portfolio')}
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

      <header className="bg-background pt-6 pb-4 px-6 md:px-8 border-b border-outline-variant/15 sticky top-0 z-50 flex flex-col gap-6">
        {/* Top Row: Navigation and Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleGoToMainPage}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20 hover:bg-surface-container-highest transition-colors text-on-surface active:scale-95 shadow-sm"
              aria-label="Back to Dashboard"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
            <div className="flex flex-col justify-center">
              <h2 className="font-headline text-2xl md:text-3xl text-primary leading-tight font-bold tracking-tight">Professional Editor Workspace</h2>
              <p className="text-[10px] md:text-xs uppercase font-body tracking-[0.2em] font-bold text-on-surface-variant/60 mt-1">Resume Studio Atelier</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex justify-center items-center overflow-hidden border border-outline-variant/30 shadow-inner">
               <span className="font-headline font-bold text-primary text-xl">
                   {displayUserName.charAt(0).toUpperCase()}
               </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between">
          <div className="flex bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/10 shadow-sm">
            <label 
              htmlFor="accentColorPicker" 
              className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#d7c4a5] to-[#c5a059] text-on-primary-container font-extrabold rounded-xl cursor-pointer text-xs uppercase tracking-[0.1em] relative group active:scale-[0.98] transition-transform shadow-md"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">palette</span>
              Color
              <input
                id="accentColorPicker"
                type="color"
                value={editorAccentColor}
                onChange={(e) => handleAccentColorChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0 overflow-hidden"
              />
            </label>
            <button className="flex items-center gap-2.5 px-6 py-3 text-on-surface-variant hover:text-on-surface font-bold rounded-xl hover:bg-surface-container-low transition-colors text-xs uppercase tracking-[0.1em] active:scale-[0.98]">
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              Layout
            </button>
          </div>

          <button
            onClick={onLogout}
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-[#d7c4a5]/70 hover:text-error hover:bg-error/10 transition-colors border border-transparent hover:border-error/20"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
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
