import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { initialResumeState } from './data';
import Resume from './components/Resume';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import ResumeUploadModal from './components/ResumeUploadModal';
import AuthPage from './components/AuthPage';
import AtelierPortfolio from './components/portfolio/AtelierPortfolio';
import Header from './components/Header';
import { calculateATSScore } from './services/ats/atsEngine';
import ErrorBoundary from './components/ErrorBoundary';
import { clearSession, fetchCurrentUser, readSession, saveSession } from './services/authService';
import TemplatePicker from './components/TemplatePicker';
import './components/Header.css';
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

      // Guest sessions don't need backend validation
      if (existingSession.token === 'guest-token') {
        if (isMounted) {
          setAuthUser(existingSession.user);
          setAuthLoading(false);
        }
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
        <div className="ls-content-wrapper">
          <div className="ls-header">
            <div className="ls-logo-box">
              <span className="material-symbols-outlined">edit_document</span>
            </div>
            <h1 className="ls-title">ResumeStudio</h1>
          </div>

          <div className="ls-card">
            <h2 className="ls-card-title">Curating your professional story...</h2>
            <p className="ls-card-desc">
              We are aligning your achievements with industry-standard benchmarks for executive visibility.
            </p>

            <div className="ls-progress-container">
              <div className="ls-progress-track">
                <div className="ls-progress-fill"></div>
              </div>
              <div className="ls-progress-labels">
                <span className="ls-progress-label">Analyzing Narrative</span>
                <span className="ls-progress-pct">65%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ls-footer">
          <span className="material-symbols-outlined">shield</span>
          <span className="ls-footer-text">Encrypted Studio Environment</span>
        </div>
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
  const themeStorageKey = 'resumeThemeMode';
  const getInitialThemeMode = () => {
    const persisted = localStorage.getItem(themeStorageKey);
    if (persisted === 'light' || persisted === 'dark') return persisted;

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  };

  const [view, setView] = useState('dashboard');
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [isMobileView, setIsMobileView] = useState(getIsMobileViewport);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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
    return {
      ...initialResumeState,
      header: {
        ...initialResumeState.header,
        name: user?.name || initialResumeState.header.name
      }
    };
  });

  const [isScanning, setIsScanning] = useState(false);
  const [atsScore, setAtsScore] = useState(() => calculateATSScore(data));
  const [editorAccentColor, setEditorAccentColor] = useState(() => data?.settings?.themeColor || '#004AAD');

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

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-light', themeMode === 'light');
    root.style.colorScheme = themeMode;
    localStorage.setItem(themeStorageKey, themeMode);
  }, [themeMode, themeStorageKey]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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

  if (view === 'templatepicker') {
    return (
      <TemplatePicker 
        onBack={() => setView('dashboard')}
        onSelect={(templateId) => {
          if (window.confirm('Create new resume? This will overwrite your current draft.')) {
            const nextData = {
              ...initialResumeState,
              header: {
                ...initialResumeState.header,
                name: user?.name || initialResumeState.header.name
              },
              settings: {
                ...initialResumeState.settings,
                template: templateId
              }
            };
            setData(nextData);
            setEditorAccentColor(nextData.settings.themeColor || '#004AAD');
            setView('editor');
          }
        }}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard
          user={user}
          onLogout={onLogout}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          data={data}
          atsScore={atsScore}
          lastSaved={lastSaved}
          savedResumes={savedResumes}
          onEdit={() => setView('editor')}
          onUpload={() => setIsUploadOpen(true)}
          onDelete={handleDeleteResume}
          onLoad={handleLoadResume}
          onViewPortfolio={() => setView('portfolio')}
          onNew={() => setView('templatepicker')}
        />
        <ResumeUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={(uploadedData) => {
            setData(uploadedData);
            setView('dashboard');
          }}
        />
      </>
    );
  }

  // ── Editor View ──
  return (
    <div className="editor-app-shell" style={{ '--editor-accent': editorAccentColor }}>
      <style>{scannerStyle}</style>

      <Header
        title="Resume Fix"
        subtitle="Editor Studio"
        onBack={handleGoToMainPage}
        onLogout={onLogout}
        user={user}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      >
        <label className="editor-action-btn editor-action-btn-accent" htmlFor="accentColorPicker">
          <span className="material-symbols-outlined">palette</span>
          Color
          <input
            id="accentColorPicker"
            type="color"
            value={editorAccentColor}
            onChange={(e) => handleAccentColorChange(e.target.value)}
            className="editor-color-hidden-input"
          />
        </label>
        <button className="editor-action-btn editor-action-btn-ghost" onClick={onLogout}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </Header>

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
