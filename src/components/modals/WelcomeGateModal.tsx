import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Youtube, ShieldCheck, Check, Sparkles, X, ExternalLink, Settings2, Info } from 'lucide-react';

export const WelcomeGateModal: React.FC = () => {
  const {
    t,
    isGateModalOpen,
    setIsGateModalOpen,
    hasSubscribed,
    setHasSubscribed,
    youtubeChannelUrl,
    setYoutubeChannelUrl,
    addToast,
    language,
  } = useApp();

  const [clickedSubscribe, setClickedSubscribe] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>(youtubeChannelUrl);

  if (!isGateModalOpen) return null;

  const handleSubscribeClick = () => {
    setClickedSubscribe(true);
    window.open(youtubeChannelUrl, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmAccess = () => {
    setHasSubscribed(true);
    setIsGateModalOpen(false);
    addToast('success', t.gate.unlockedMsg);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setYoutubeChannelUrl(customUrl.trim());
      setShowConfig(false);
      addToast('success', language === 'ar' ? 'تم تحديث رابط القناة بنجاح' : 'Channel URL updated successfully');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0D121F] to-[#07090E] border border-yellow-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-yellow-500/10 text-white overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/30">
              I
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white tracking-wide">
                  {t.brand}
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  {t.common.freeTrial}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-xl text-slate-400 hover:text-yellow-300 hover:bg-white/5 transition-colors"
              title="Configure Channel URL"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            {hasSubscribed && (
              <button
                onClick={() => setIsGateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Config URL drawer */}
        {showConfig && (
          <form onSubmit={handleSaveConfig} className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              {language === 'ar' ? 'تعديل رابط قناة يوتيوب المخصصة:' : 'Customize YouTube Channel URL:'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="flex-1 bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm rounded-xl transition-colors"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}

        {/* Content */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#161226]/50 to-blue-950/40 border border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-600/20 text-red-400 shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-base mb-1">
                  {t.gate.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t.gate.subtitle}
                </p>
                <div className="mt-2 text-xs text-yellow-300/90 font-mono truncate">
                  {youtubeChannelUrl}
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe Action Button */}
          <button
            onClick={handleSubscribeClick}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Youtube className="w-5 h-5 fill-current" />
            <span>{t.gate.subscribeBtn}</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>

          {/* Privacy & YouTube API Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t.gate.howItWorks}</span>
            </div>
            <p>{t.gate.howItWorksDesc}</p>
          </div>

          {/* Unlock action button */}
          <div className="pt-2">
            <button
              onClick={handleConfirmAccess}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                clickedSubscribe || hasSubscribed
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20 scale-[1.01]'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{t.gate.confirmBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
