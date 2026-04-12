import React from 'react';

const Header = ({ 
  title, 
  subtitle, 
  onBack, 
  onLogout, 
  themeMode = 'dark',
  onToggleTheme,
  children,
  className = "" 
}) => {
  const nextThemeLabel = themeMode === 'light' ? 'dark' : 'light';

  return (
    <header className={`bg-background pt-6 pb-4 px-6 md:px-8 border-b border-outline-variant/15 sticky top-0 z-50 flex flex-col gap-6 ${className}`}>
      {/* Top Row: Navigation and Brand */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20 hover:bg-surface-container-highest transition-colors text-on-surface active:scale-95 shadow-sm"
              aria-label="Back"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
          )}
          <div className="flex flex-col justify-center">
            <h2 className="font-headline text-2xl md:text-3xl text-primary leading-tight font-bold tracking-tight">
              {title || 'Professional Editor Workspace'}
            </h2>
            <p className="text-[10px] md:text-xs uppercase font-body tracking-[0.2em] font-bold text-on-surface-variant/60 mt-1">
              {subtitle || 'Resume Studio Atelier'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-12 h-12 rounded-2xl bg-surface-container-highest flex justify-center items-center overflow-hidden border border-outline-variant/30 shadow-inner text-primary hover:text-on-surface active:scale-95 transition-colors"
            aria-label={`Switch to ${nextThemeLabel} mode`}
            title={`Switch to ${nextThemeLabel} mode`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {themeMode === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
          {/* Logout button can go here or in the actions row depending on the view. 
              Based on the image, it's in the actions row bottom right. 
          */}
        </div>
      </div>

      {/* Action Row / Contextual Area */}
      {children && (
        <div className="flex items-center justify-between">
          <div className="flex bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/10 shadow-sm">
            {children}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-12 h-12 flex items-center justify-center rounded-2xl text-[#d7c4a5]/70 hover:text-error hover:bg-error/10 transition-colors border border-transparent hover:border-error/20"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
