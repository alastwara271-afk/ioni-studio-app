import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageGenerationItem } from '../../types';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Sliders,
  Maximize2,
  Trash2,
  AlertCircle,
  Eye,
  Wand2,
} from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const {
    t,
    language,
    imageHistory,
    addImageItem,
    recordUsage,
    addToast,
    trialState,
  } = useApp();

  const [prompt, setPrompt] = useState<string>(
    'Futuristic YouTube creator editing a holographic timeline in a dark cyberpunk studio with neon yellow and blue glow'
  );
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [stylePreset, setStylePreset] = useState<string>('Cinematic 4K');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const ratios = [
    { id: '16:9', label: t.image.ratios.landscape, icon: '16:9' },
    { id: '9:16', label: t.image.ratios.portrait, icon: '9:16' },
    { id: '1:1', label: t.image.ratios.square, icon: '1:1' },
    { id: '4:3', label: t.image.ratios.standard, icon: '4:3' },
  ];

  const styles = [
    { id: 'Cinematic 4K', label: t.image.styles.cinematic },
    { id: 'Photorealistic Studio', label: t.image.styles.photorealistic },
    { id: 'Anime / Comic Art', label: t.image.styles.anime },
    { id: '3D Pixar / Render', label: t.image.styles.threeD },
    { id: 'Cyberpunk Neon', label: t.image.styles.cyberpunk },
    { id: 'Minimalist Vector Art', label: t.image.styles.minimal },
  ];

  // AI Prompt Enhancer helper
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const enhancements = [
      'shot on 35mm anamorphic lens, volumetric golden hour rim lighting, 8k resolution, octane render, intricate texture detail',
      'studio lighting, hyper-realistic depth of field, dramatic shadows, ray tracing, ultra-sharp focus',
      'award-winning visual composition, cinematic color grading, Unreal Engine 5 aesthetic',
    ];
    const picked = enhancements[Math.floor(Math.random() * enhancements.length)];
    setPrompt(`${prompt.trim()}, ${picked}`);
    addToast('info', language === 'ar' ? 'تم تحسين وتفصيل الوصف بنجاح!' : 'Prompt enhanced with cinematic styling!');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      addToast('error', 'Please enter a prompt to generate an image.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          style: stylePreset,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to render image.');
      }

      setCurrentImage(data.imageUrl);

      const newItem: ImageGenerationItem = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        aspectRatio,
        style: stylePreset,
        imageUrl: data.imageUrl,
        createdAt: new Date().toLocaleTimeString(),
      };

      addImageItem(newItem);
      recordUsage('image');
      addToast('success', language === 'ar' ? 'تم توليد الصورة بنجاح!' : 'Image generated successfully!');
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Image generation failed.');
      addToast('error', err.message || 'Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (urlToDownload?: string) => {
    const url = urlToDownload || currentImage;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ioni-image-${aspectRatio.replace(':', '-')}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('success', language === 'ar' ? 'بدأ تحميل الصورة' : 'Image download started');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t.image.title}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 font-mono">
              Gemini 3.1 Flash Lite Image
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t.image.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{t.subscription.usage.image}:</span>
          <span className="text-yellow-400 font-bold">
            {trialState.usage.imageGenerations} / {trialState.usage.maxImageGenerations}
          </span>
        </div>
      </div>

      {/* Main Grid: Form (5 Cols) vs Render Preview (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4 shadow-xl">
            {/* Prompt Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Image Prompt & Scene Description
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  className="flex items-center gap-1 text-[11px] font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{t.image.enhancePrompt}</span>
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.image.promptPlaceholder}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-yellow-400 resize-none font-sans"
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.image.aspectRatio}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ratios.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspectRatio(r.id)}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right text-xs font-medium transition-all ${
                      aspectRatio === r.id
                        ? 'bg-yellow-400/15 border-yellow-400 text-yellow-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs">{r.icon}</div>
                    <div className="text-[11px] text-slate-400 truncate">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.image.stylePreset}
              </label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Notice */}
            {generationError && (
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{generationError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{t.image.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.image.generateBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Preview Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 shadow-xl min-h-[460px] flex flex-col justify-between">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                Render Canvas ({aspectRatio})
              </span>

              {currentImage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomImage(currentImage)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Full View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadImage()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs shadow-md shadow-yellow-400/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.common.download}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Image Canvas / Empty State */}
            <div className="flex-1 my-4 flex items-center justify-center bg-black/50 rounded-xl border border-slate-800 overflow-hidden relative min-h-[300px]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={prompt}
                  className="max-h-[420px] w-auto object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {t.image.noImages}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Choose an aspect ratio, pick your preferred style, and generate visuals for YouTube thumbnails and Shorts.
                  </p>
                </div>
              )}
            </div>

            {/* Prompt details banner */}
            {currentImage && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-yellow-400 block mb-0.5">Prompt:</span>
                <p className="text-slate-300 truncate">{prompt}</p>
              </div>
            )}
          </div>

          {/* Recent Images Strip */}
          {imageHistory.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {t.image.recentImages} ({imageHistory.length})
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentImage(item.imageUrl)}
                    className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-400 cursor-pointer group transition-all"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-h-[85vh] w-auto object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
