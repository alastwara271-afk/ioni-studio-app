import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import {
  Mic2,
  Youtube,
  Film,
  Briefcase,
  MessageSquareCode,
  Image as ImageIcon,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Flame,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, t, trialState, hasSubscribed } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'voice', label: t.nav.voice, icon: Mic2, badge: 'Studio' },
    { id: 'youtube', label: t.nav.youtube, icon: Youtube, badge: 'Pro' },
    { id: 'videoPlan', label: t.nav.videoPlan, icon: Film, badge: 'AI Blueprints' },
    { id: 'freelance', label: t.nav.freelance, icon: Briefcase },
    { id: 'chat', label: t.nav.chat, icon: MessageSquareCode, badge: '24/7' },
    { id: 'image', label: t.nav.image, icon: ImageIcon, badge: '4K' },
    { id: 'subscription', label: t.nav.account, icon: CreditCard, badge: 'Trial' },
    { id: 'gate', label: t.nav.welcomeGate, icon: ShieldCheck },
  ];

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 rtl:left-auto rtl:right-0 z-40 h-full md:h-[calc(100vh-61px)] w-64 lg:w-72 bg-[#090C14] border-r rtl:border-r-0 rtl:border-l border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full rtl:translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header in drawer */}
        <div className="flex md:hidden items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black font-black flex items-center justify-center text-sm">
              I
            </div>
            <span className="font-bold text-white text-sm">{t.brand}</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t.brand} Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left rtl:text-right group ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500/15 via-yellow-500/10 to-blue-500/10 text-yellow-300 border border-yellow-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-yellow-400 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isActive
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: 1-Month Free Trial Usage Mini Meter */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-yellow-400" />
                {t.common.freeTrial}
              </span>
              <span className="text-[11px] font-bold text-yellow-400">
                {trialState.daysRemaining} {t.common.daysLeft}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-sky-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (trialState.daysRemaining / 30) * 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{t.subscription.usage.voice}</span>
              <span className="font-mono text-slate-200">
                {trialState.usage.voiceGenerations} / {trialState.usage.maxVoiceGenerations}
              </span>
            </div>
          </div>

          {/* Quick Support / Version */}
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>IONI Studio v2.0</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
