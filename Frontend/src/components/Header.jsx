import React from 'react';

const Header = ({
  title,
  subtitle,
  onBack,
  onLogout,
  user,
  themeMode = 'dark',
  onToggleTheme,
  children,
  activeView,
  onNavigate,
  className = ""
}) => {
  const nextThemeLabel = themeMode === 'light' ? 'dark' : 'light';

  const navItems = onNavigate ? [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'editor', label: 'Editor', icon: 'edit_note' },
    { id: 'portfolio', label: 'Portfolio', icon: 'auto_stories' },
  ] : [];

  return (
    <header className={`rf-navbar ${className}`}>
      <div className="rf-navbar-inner">
        {/* Left: Logo + Brand */}
        <div className="rf-navbar-left">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rf-navbar-back-btn"
              aria-label="Back"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <div className="rf-navbar-brand">
            <div className="rf-navbar-logo">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>description</span>
            </div>
            <div className="rf-navbar-brand-text">
              <h1 className="rf-navbar-title">{title || 'Resume Fix'}</h1>
              <span className="rf-navbar-subtitle">{subtitle || 'Professional Studio'}</span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        {navItems.length > 0 && (
          <nav className="rf-navbar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rf-nav-link ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="material-symbols-outlined rf-nav-icon">{item.icon}</span>
                <span className="rf-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Center: Custom Actions (e.g., color picker, layout) */}
        {children && (
          <div className="rf-navbar-actions">
            {children}
          </div>
        )}

        {/* Right: User Controls */}
        <div className="rf-navbar-right">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rf-navbar-icon-btn"
            aria-label={`Switch to ${nextThemeLabel} mode`}
            title={`Switch to ${nextThemeLabel} mode`}
          >
            <span className="material-symbols-outlined">
              {themeMode === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {user && (
            <div className="rf-navbar-user-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
              <span className="rf-user-name">{user.fullName || user.email || 'User'}</span>
            </div>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rf-navbar-icon-btn rf-logout-btn"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
