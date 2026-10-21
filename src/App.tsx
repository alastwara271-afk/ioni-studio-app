import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { VoiceStudio } from './components/voice/VoiceStudio';
import { YouTubeAcademy } from './components/youtube/YouTubeAcademy';
import { VideoPlanGenerator } from './components/video-plan/VideoPlanGenerator';
import { FreelancingAcademy } from './components/freelancing/FreelancingAcademy';
import { AiChat } from './components/chat/AiChat';
import { ImageStudio } from './components/image/ImageStudio';
import { SubscriptionManager } from './components/account/SubscriptionManager';
import { WelcomeGateModal } from './components/modals/WelcomeGateModal';
import { VercelGuideModal } from './components/modals/VercelGuideModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Youtube, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, t, setIsGateModalOpen, hasSubscribed, youtubeChannelUrl } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Workspace Body */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'voice' && <VoiceStudio />}
          {activeTab === 'youtube' && <YouTubeAcademy />}
          {activeTab === 'videoPlan' && <VideoPlanGenerator />}
          {activeTab === 'freelance' && <FreelancingAcademy />}
          {activeTab === 'chat' && <AiChat />}
          {activeTab === 'image' && <ImageStudio />}
          {activeTab === 'subscription' && <SubscriptionManager />}

          {/* Gate dedicated view */}
          {activeTab === 'gate' && (
            <div className="max-w-2xl mx-auto py-10 space-y-6 animate-in fade-in">
              <div className="p-8 rounded-3xl bg-[#090C15] border border-yellow-500/30 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
                  <Youtube className="w-8 h-8 fill-current" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">
                    {t.gate.title}
                  </h2>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    {t.gate.subtitle}
                  </p>
                  <p className="text-xs font-mono text-yellow-300">
                    {youtubeChannelUrl}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all"
                  >
                    <Youtube className="w-4 h-4 fill-current" />
                    <span>{t.gate.subscribeBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setIsGateModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Access Verification</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left rtl:text-right text-xs text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">{t.gate.howItWorks}</span>
                  <p>{t.gate.howItWorksDesc}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <WelcomeGateModal />
      <VercelGuideModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
