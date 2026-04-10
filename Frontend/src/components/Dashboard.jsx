import React from 'react';

const Dashboard = ({ user, onLogout, onEdit, onNew, onUpload, data, atsScore, onViewPortfolio }) => {
  const displayName = user?.fullName || user?.email || user?.phone || 'User';

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container/30 min-h-screen relative pb-20">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .tap-highlight-none {
            -webkit-tap-highlight-color: transparent;
        }
        .editorial-shadow {
            box-shadow: 0 24px 40px rgba(0, 0, 0, 0.06);
        }
      `}</style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden ring-1 ring-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
        <h1 className="font-headline font-bold text-[#e9c176] tracking-tighter text-lg">RESUME FIX</h1>
        <button onClick={onLogout} className="text-[#e9c176] hover:opacity-80 transition-opacity active:duration-150 scale-95" title="Logout">
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-md mx-auto">
        {/* Hero Branding */}
        <section className="mb-10">
          <h2 className="font-headline text-4xl font-normal text-on-surface leading-tight tracking-tight mb-2">
            Craft Your <span className="italic text-primary">Story</span>
          </h2>
          <p className="text-on-surface-variant font-body text-sm tracking-wide leading-relaxed">
            The atelier is open. Refine your narrative for the global stage.
          </p>
        </section>

        {/* Active Draft Card */}
        <section className="relative mb-8">
          <div className="bg-surface-container-low rounded-xl p-6 editorial-shadow relative overflow-hidden group">
            {/* Background texture/gradient hint */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 block mb-1">Active Draft</span>
                <h3 className="font-headline text-2xl text-on-surface">{data?.header?.name || 'Anonymous'}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium tracking-wide">
                  {data?.header?.title || 'SOFTWARE DEVELOPER'}
                </p>
              </div>
              
              {/* ATS Score Badge */}
              <div className="bg-surface-bright/40 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border border-primary/10">
                <span className="text-xs font-bold text-primary tracking-tighter">{atsScore?.overall || 0}/100</span>
                <div className="w-8 h-1 bg-surface-container mt-1 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${atsScore?.overall || 0}%` }}></div>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-on-surface-variant mt-1">ATS Score</span>
              </div>
            </div>

            {/* Mini Preview Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold">Key Skills</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {(() => {
                      const items = data?.skills?.categories?.[0]?.items;
                      if (!items) return 'Not specified';
                      return Array.isArray(items) ? items.join(', ') : String(items);
                    })()}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold">Latest Project</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {data?.projects?.[0]?.title || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle Mini Resume Mockup */}
            <div className="bg-surface-container-highest/50 rounded-lg p-3 border border-outline-variant/10">
              <div className="flex gap-2">
                <div className="w-12 h-16 bg-surface-container-lowest rounded-sm flex flex-col gap-1.5 p-1.5">
                  <div className="w-full h-1 bg-primary/20 rounded-full"></div>
                  <div className="w-3/4 h-0.5 bg-on-surface-variant/10 rounded-full"></div>
                  <div className="w-full h-0.5 bg-on-surface-variant/10 rounded-full"></div>
                  <div className="w-full h-0.5 bg-on-surface-variant/10 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-1.5 bg-primary/10 w-1/2 rounded-full"></div>
                  <div className="h-1 bg-outline-variant/20 w-full rounded-full"></div>
                  <div className="h-1 bg-outline-variant/20 w-5/6 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Actions */}
        <div className="flex flex-col gap-4 mb-8">
          <button onClick={onEdit} className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform text-sm tracking-wide uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl" data-icon="edit_note">edit_note</span>
            Continue Editing Draft
          </button>
          
          <button onClick={onViewPortfolio} className="w-full bg-surface-container-highest text-primary font-bold py-4 rounded-xl active:scale-[0.98] transition-transform text-sm tracking-wide uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
            View Live Portfolio
          </button>
        </div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onNew} className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-low border border-outline-variant/15 active:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary mb-3 scale-110 group-active:scale-95 transition-transform" data-icon="add_circle">add_circle</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface">New Resume</span>
          </button>
          
          <button onClick={onUpload} className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-low border border-outline-variant/15 active:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary mb-3 scale-110 group-active:scale-95 transition-transform" data-icon="cloud_upload">cloud_upload</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Upload Resume</span>
          </button>
        </div>

        {/* Decorative Quote */}
        <div className="mt-16 text-center">
          <p className="font-headline italic text-on-surface-variant/40 text-sm leading-relaxed">
            "Your resume is not a list of jobs, it is a curated portfolio of your impact."
          </p>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-safe bg-[#131313] z-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-[#d7c4a5]/15">
        <button className="flex flex-col items-center justify-center bg-[#c5a059]/20 text-[#e9c176] rounded-xl px-4 py-2 tap-highlight-none active:scale-90 transition-transform">
          <span className="material-symbols-outlined" data-icon="edit_note">edit_note</span>
          <span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest mt-1">Atelier</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#d7c4a5]/60 hover:text-[#e9c176] transition-colors tap-highlight-none active:scale-90 transition-transform">
          <span className="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
          <span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest mt-1">Portfolio</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#d7c4a5]/60 hover:text-[#e9c176] transition-colors tap-highlight-none active:scale-90 transition-transform">
          <span className="material-symbols-outlined" data-icon="history_edu">history_edu</span>
          <span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest mt-1">Drafts</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#d7c4a5]/60 hover:text-[#e9c176] transition-colors tap-highlight-none active:scale-90 transition-transform">
          <span className="material-symbols-outlined" data-icon="person">person</span>
          <span className="font-['Manrope'] text-[10px] font-medium uppercase tracking-widest mt-1">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
