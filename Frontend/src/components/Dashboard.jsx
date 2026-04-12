import React from 'react';
import Header from './Header';

const Dashboard = ({ user, onLogout, onEdit, onNew, onUpload, data, atsScore, onViewPortfolio, themeMode = 'dark', onToggleTheme }) => {
  const primarySkillItems = data?.skills?.categories?.[0]?.items;
  const parsedSkills = Array.isArray(primarySkillItems)
    ? primarySkillItems
    : (primarySkillItems ? String(primarySkillItems).split(',').map((item) => item.trim()).filter(Boolean) : []);
  const experienceCount = Array.isArray(data?.experience)
    ? data.experience.filter((item) => item?.company || item?.role).length
    : 0;
  const projectCount = Array.isArray(data?.projects)
    ? data.projects.filter((item) => item?.title).length
    : 0;
  const score = atsScore?.overall || 0;

  const sidebarItems = [
    { icon: 'edit_note', label: 'Atelier', active: true },
    { icon: 'auto_stories', label: 'Portfolio' },
    { icon: 'history_edu', label: 'Drafts' },
    { icon: 'person', label: 'Account' }
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container/30 min-h-screen relative overflow-hidden">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .tap-highlight-none {
            -webkit-tap-highlight-color: transparent;
        }
        .lux-card-shadow {
            box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28);
        }
        @keyframes floatY {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulseOpacity {
            0% { opacity: 0.25; }
            50% { opacity: 0.55; }
            100% { opacity: 0.25; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute -left-20 top-28 h-72 w-72 rounded-full bg-[#c5a059]/20 blur-3xl"
        style={{ animation: 'floatY 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute right-[-70px] top-64 h-80 w-80 rounded-full bg-[#5f7489]/18 blur-3xl"
        style={{ animation: 'pulseOpacity 7s ease-in-out infinite' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(220,190,130,0.07),transparent_40%)]" />

      <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="rounded-3xl border border-[#d7c4a5]/15 bg-[#111111]/85 backdrop-blur-md p-3 flex flex-col gap-2 lux-card-shadow">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`w-[118px] px-4 py-3 rounded-2xl border text-left transition-all duration-200 ${
                item.active
                  ? 'bg-[#c5a059]/20 text-[#f0cd85] border-[#c5a059]/45 shadow-[0_12px_20px_rgba(0,0,0,0.22)]'
                  : 'bg-[#171717]/75 text-[#d7c4a5]/65 border-[#d7c4a5]/10 hover:text-[#f0cd85] hover:border-[#d7c4a5]/30'
              }`}
            >
              <span className="material-symbols-outlined text-lg leading-none" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="block font-['Manrope'] text-[10px] font-semibold uppercase tracking-[0.18em] mt-2">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* TopAppBar */}
      <Header
        title="RESUME FIX"
        subtitle="Personal Workspace"
        user={user}
        onLogout={onLogout}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <main className="relative pt-24 pb-16 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 items-start">
            <section className="space-y-8">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d7c4a5]/25 bg-[#c5a059]/10 text-[10px] uppercase tracking-[0.24em] font-bold text-[#eac782]">
                  <span className="material-symbols-outlined text-[14px] leading-none" data-icon="stars">stars</span>
                  Curated Workspace
                </span>
                <div>
                  <h2 className="font-headline text-[2.6rem] sm:text-5xl leading-[1.06] tracking-tight text-[#f8f4ee]">
                    Craft Your <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#f0cd85] to-[#c7903a]">Story</span>
                  </h2>
                  <p className="mt-3 text-[#d7ccb8]/85 max-w-lg text-base leading-relaxed">
                    The atelier is open. Refine your narrative, sharpen your impact, and publish work that feels unmistakably yours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#d7c4a5]/12 bg-[#151515]/75 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#d7c4a5]/70 font-bold">ATS Readiness</span>
                  <div className="mt-2 text-2xl font-headline text-[#f8f4ee]">{score}<span className="text-sm text-[#d7c4a5]/60">/100</span></div>
                </div>
                <div className="rounded-2xl border border-[#d7c4a5]/12 bg-[#151515]/75 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#d7c4a5]/70 font-bold">Experience Blocks</span>
                  <div className="mt-2 text-2xl font-headline text-[#f8f4ee]">{experienceCount}</div>
                </div>
                <div className="rounded-2xl border border-[#d7c4a5]/12 bg-[#151515]/75 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#d7c4a5]/70 font-bold">Project Highlights</span>
                  <div className="mt-2 text-2xl font-headline text-[#f8f4ee]">{projectCount}</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={onEdit}
                  className="w-full sm:w-auto min-w-[260px] bg-gradient-to-r from-[#e9c176] to-[#cda158] text-[#1f1708] font-extrabold py-4 px-8 rounded-2xl shadow-[0_18px_30px_rgba(201,155,80,0.25)] hover:brightness-105 hover:-translate-y-[1px] active:scale-[0.98] transition-all text-sm tracking-[0.06em] uppercase inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl" data-icon="edit_note">edit_note</span>
                  Continue Editing Draft
                </button>

                <button
                  onClick={onViewPortfolio}
                  className="w-full sm:w-auto min-w-[260px] bg-[#222222]/85 border border-[#d7c4a5]/20 text-[#efc97f] font-extrabold py-4 px-8 rounded-2xl hover:bg-[#2a2a2a] active:scale-[0.98] transition-all text-sm tracking-[0.06em] uppercase inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
                  View Live Portfolio
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={onNew}
                  className="group rounded-2xl bg-[#151515]/88 border border-[#d7c4a5]/14 p-6 hover:-translate-y-[2px] hover:border-[#d7c4a5]/35 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e9c176]/12 border border-[#e9c176]/35 flex items-center justify-center mb-4 group-hover:bg-[#e9c176]/18">
                    <span className="material-symbols-outlined text-[#efc97f]" data-icon="add_circle">add_circle</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3e5c6]">New Resume</span>
                </button>

                <button
                  onClick={onUpload}
                  className="group rounded-2xl bg-[#151515]/88 border border-[#d7c4a5]/14 p-6 hover:-translate-y-[2px] hover:border-[#d7c4a5]/35 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e9c176]/12 border border-[#e9c176]/35 flex items-center justify-center mb-4 group-hover:bg-[#e9c176]/18">
                    <span className="material-symbols-outlined text-[#efc97f]" data-icon="cloud_upload">cloud_upload</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3e5c6]">Upload Resume</span>
                </button>
              </div>
            </section>

            <section className="relative">
              <div className="rounded-3xl border border-[#d7c4a5]/18 bg-[linear-gradient(155deg,rgba(29,29,29,0.95),rgba(18,18,18,0.98))] p-6 sm:p-7 lux-card-shadow">
                <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#c5a059]/12 blur-2xl" />
                <div className="relative flex justify-between items-start mb-7">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#e7c785]/70 block mb-2">Active Draft</span>
                    <h3 className="font-headline text-3xl leading-tight text-[#f8f4ee]">{data?.header?.name || 'Anonymous'}</h3>
                    <p className="text-xs text-[#d7c4a5]/70 mt-2 font-semibold tracking-[0.1em] uppercase">
                      {data?.header?.title || 'Software Developer'}
                    </p>
                  </div>

                  <div className="bg-[#2a2a2a]/70 backdrop-blur-md rounded-2xl p-3 border border-[#d7c4a5]/18 min-w-[88px]">
                    <span className="text-sm font-bold text-[#efc97f] tracking-tight">{score}/100</span>
                    <div className="w-full h-1.5 bg-[#3a3a3a] mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#efc97f] to-[#c7903a] transition-all duration-500" style={{ width: `${score}%` }}></div>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[#d7c4a5]/65 mt-1.5 inline-block">ATS Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-7">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#efc97f] font-bold">Key Skills</h4>
                    <p className="text-sm text-[#f4e8d0]/90 leading-relaxed mt-2 min-h-[42px]">
                      {parsedSkills.length > 0 ? parsedSkills.slice(0, 4).join(', ') : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#efc97f] font-bold">Latest Project</h4>
                    <p className="text-sm text-[#f4e8d0]/90 leading-relaxed mt-2 min-h-[42px]">
                      {data?.projects?.[0]?.title || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#2a2a2a]/70 rounded-2xl p-4 border border-[#d7c4a5]/12">
                  <div className="flex gap-3">
                    <div className="w-14 h-20 bg-[#101010] rounded-md flex flex-col gap-1.5 p-2 border border-[#d7c4a5]/12">
                      <div className="w-full h-1 bg-[#efc97f]/45 rounded-full"></div>
                      <div className="w-4/5 h-0.5 bg-[#d7c4a5]/25 rounded-full"></div>
                      <div className="w-full h-0.5 bg-[#d7c4a5]/25 rounded-full"></div>
                      <div className="w-full h-0.5 bg-[#d7c4a5]/25 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-1.5 bg-[#efc97f]/22 w-1/2 rounded-full"></div>
                      <div className="h-1 bg-[#d7c4a5]/20 w-full rounded-full"></div>
                      <div className="h-1 bg-[#d7c4a5]/20 w-5/6 rounded-full"></div>
                      <div className="h-1 bg-[#d7c4a5]/20 w-3/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d7c4a5]/14 bg-[#141414]/80 px-5 py-4">
                <p className="font-headline italic text-[#b8aa90]/75 text-sm leading-relaxed text-center">
                  "Your resume is not a list of jobs, it is a curated portfolio of your impact."
                </p>
              </div>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em] text-[#d7c4a5]/60">
            <span className="px-3 py-1.5 rounded-full border border-[#d7c4a5]/14 bg-[#171717]/65">{parsedSkills.length} Skills Curated</span>
            <span className="px-3 py-1.5 rounded-full border border-[#d7c4a5]/14 bg-[#171717]/65">{projectCount} Projects Highlighted</span>
            <span className="px-3 py-1.5 rounded-full border border-[#d7c4a5]/14 bg-[#171717]/65">{experienceCount} Experience Entries</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
