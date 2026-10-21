import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Sparkles,
  Copy,
  Download,
  Clock,
  Layers,
  Sliders,
  FileText,
  AlertCircle,
  CheckCircle2,
  Workflow,
  Share2,
} from 'lucide-react';

export const VideoPlanGenerator: React.FC = () => {
  const { t, language, addToast, recordUsage } = useApp();

  const [title, setTitle] = useState<string>('5 AI Tools That Will Replace Video Editors in 2026');
  const [script, setScript] = useState<string>(
    'Hook: 90% of editors are wasting 10 hours a week on tasks an AI can do in 30 seconds. In this video, we test the top 5 tools on a real project to see if they live up to the hype.'
  );
  const [category, setCategory] = useState<string>('Documentary / Tech Review');
  const [format, setFormat] = useState<string>('YouTube Long-form (16:9)');
  const [targetDuration, setTargetDuration] = useState<string>('5 minutes');
  const [style, setStyle] = useState<string>('Fast-paced & High Retention (Vox / Ali Abdaal style)');
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');
  const [software, setSoftware] = useState<string>('CapCut Desktop & Premiere Pro');
  const [budget, setBudget] = useState<string>('Free / Low-Cost');
  const [assets, setAssets] = useState<string>('Voice-over WAV, AI images, free stock B-roll, SFX');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !script.trim()) {
      addToast('error', 'Please enter a video title or script.');
      return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const res = await fetch('/api/video-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          script: script.trim(),
          category,
          format,
          targetDuration,
          style,
          experienceLevel,
          software,
          budget,
          assets,
          language: language === 'ar' ? 'ar' : 'en',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate editing blueprint.');
      }

      setGeneratedPlan(data.plan);
      recordUsage('videoPlans');
      addToast('success', language === 'ar' ? 'تم إنشاء مخطط المونتاج الذكي بنجاح!' : 'Video editing blueprint generated!');
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Blueprint generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPlan = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    addToast('success', t.common.copied);
  };

  const downloadFile = (formatType: 'txt' | 'json') => {
    if (!generatedPlan) return;
    const content =
      formatType === 'json'
        ? JSON.stringify({ title, targetDuration, software, blueprint: generatedPlan }, null, 2)
        : generatedPlan;
    const blob = new Blob([content], { type: formatType === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-plan-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.${formatType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', language === 'ar' ? 'تم تحميل ملف المخطط' : 'Blueprint file exported');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-black shadow-md shadow-yellow-500/20">
            <Film className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t.videoPlan.title}
          </h1>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 font-mono">
            Scene-by-Scene AI
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {t.videoPlan.subtitle}
        </p>
      </div>

      {/* Main Grid: Form (5 Cols) vs Blueprint Result (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4 shadow-xl">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t.videoPlan.form.videoTitle}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.videoPlan.form.videoTitlePlaceholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Script Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t.videoPlan.form.script}
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder={t.videoPlan.form.scriptPlaceholder}
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-yellow-400 resize-none font-sans"
              />
            </div>

            {/* 2x2 Select Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">{t.videoPlan.form.format}</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option>YouTube Long-form (16:9)</option>
                  <option>YouTube Shorts (9:16)</option>
                  <option>Instagram / Square (1:1)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">{t.videoPlan.form.duration}</label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option>60 seconds (Shorts/Reels)</option>
                  <option>3 minutes</option>
                  <option>5 minutes</option>
                  <option>8-10 minutes</option>
                  <option>15+ minutes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">{t.videoPlan.form.software}</label>
                <select
                  value={software}
                  onChange={(e) => setSoftware(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option>CapCut Desktop (Free)</option>
                  <option>Adobe Premiere Pro</option>
                  <option>DaVinci Resolve (Free/Studio)</option>
                  <option>Final Cut Pro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">{t.videoPlan.form.budget}</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option>Free ($0)</option>
                  <option>Low-Cost ($20-50)</option>
                  <option>Studio Pro ($200+)</option>
                </select>
              </div>
            </div>

            {/* Editing Style */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-400 font-semibold">{t.videoPlan.form.style}</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || (!title.trim() && !script.trim())}
              className="w-full py-3.5 px-5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{t.videoPlan.form.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.videoPlan.form.generateBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Blueprint Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#090C15] border border-slate-800 shadow-xl min-h-[520px] flex flex-col justify-between">
            {/* Blueprint Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-base text-white">
                    {t.videoPlan.blueprint.title}
                  </h3>
                </div>

                {generatedPlan && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyPlan}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
                      title={t.videoPlan.blueprint.copyPlan}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.common.copy}</span>
                    </button>
                    <button
                      onClick={() => downloadFile('txt')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>TXT</span>
                    </button>
                    <button
                      onClick={() => downloadFile('json')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Blueprint Content */}
              {generatedPlan ? (
                <div className="mt-4 prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans overflow-x-auto">
                  {generatedPlan}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
                    <Film className="w-7 h-7" />
                  </div>
                  <div className="max-w-sm space-y-1">
                    <h4 className="font-bold text-white text-base">
                      No Blueprint Generated Yet
                    </h4>
                    <p className="text-xs text-slate-400">
                      Fill out your video concept or script on the left and click Generate to receive an exact timeline with audio cues, B-roll requirements, and software workflows.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Note & Disclaimer */}
            <div className="pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p>
                Important: Generating an editing plan provides an architectural blueprint for human editors or timeline software. It is not an automated video render.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
