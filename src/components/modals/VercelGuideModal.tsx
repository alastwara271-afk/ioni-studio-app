import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Laptop, CheckCircle2, Copy, ExternalLink, X, Terminal, KeyRound, Rocket } from 'lucide-react';

export const VercelGuideModal: React.FC = () => {
  const { isVercelModalOpen, setIsVercelModalOpen, t, addToast } = useApp();

  if (!isVercelModalOpen) return null;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', t.common.copied);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0D121F] to-[#07090E] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 text-white">
        {/* Close Button */}
        <button
          onClick={() => setIsVercelModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl text-white">
                {t.deploy.title}
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Smartphone className="w-3 h-3" /> Android Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.deploy.subtitle}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-sm">
              1
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-white">{t.deploy.step1}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{t.deploy.step1Desc}</p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5" /> Open GitHub New Repo <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-sm">
              2
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-white">{t.deploy.step2}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{t.deploy.step2Desc}</p>
              <div className="pt-1">
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-slate-950 border border-slate-700 text-xs font-medium text-white transition-colors"
                >
                  <Rocket className="w-3.5 h-3.5 text-yellow-400" /> Open Vercel New Project <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold shrink-0 text-sm">
              3
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-white">{t.deploy.step3}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{t.deploy.step3Desc}</p>
              <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between font-mono text-xs text-yellow-300">
                <span>GEMINI_API_KEY</span>
                <button
                  onClick={() => copySnippet('GEMINI_API_KEY')}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                  title="Copy Key Name"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-sm">
              4
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-white">{t.deploy.step4}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{t.deploy.step4Desc}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Build Command:</span>
                  <span className="text-emerald-300 font-semibold">npm run build</span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Output Directory:</span>
                  <span className="text-emerald-300 font-semibold">dist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-sm">
              5
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-white">{t.deploy.step5}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{t.deploy.step5Desc}</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsVercelModalOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm transition-colors shadow-lg shadow-yellow-400/20"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
