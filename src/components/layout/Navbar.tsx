import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Languages,
  Clock,
  Youtube,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    t,
    language,
    setLanguage,
    trialState,
    setActiveTab,
    setIsVercelModalOpen,
    setIsGateModalOpen,
    hasSubscribed,
    youtubeChannelUrl,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('voice')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-black text-lg shadow-md shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <span>I</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#07090E]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                IONI <span className="text-yellow-400">VOICE</span> STUDIO
              </span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">
                AI Creative Production Suite
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Language Toggle, Trial Pill, Deploy Guide */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1-Month Free Trial Pill */}
          <button
            onClick={() => setActiveTab('subscription')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-semibold transition-all shadow-sm"
            title="View Free Trial & Usage Limits"
          >
            <Clock className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span className="hidden md:inline">{t.common.freeTrial}:</span>
            <span>{trialState.daysRemaining} {t.common.daysLeft}</span>
          </button>

          {/* YouTube Channel Status Gate Pill */}
          <button
            onClick={() => setIsGateModalOpen(true)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hasSubscribed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 animate-pulse'
            }`}
            title="YouTube Channel Subscription Gate"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>{hasSubscribed ? t.gate.statusUnlocked : t.gate.subscribeBtn}</span>
          </button>

          {/* Vercel Deploy Guide */}
          <button
            onClick={() => setIsVercelModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-sky-300 text-xs font-semibold transition-all"
            title="Vercel & Android Deployment Guide"
          >
            <Rocket className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{t.nav.deployGuide}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Switch Language / تغيير اللغة"
          >
            <Languages className="w-3.5 h-3.5 text-yellow-400" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
