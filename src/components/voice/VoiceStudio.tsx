import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VoiceGenerationItem } from '../../types';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import {
  Mic2,
  Play,
  Pause,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  Clock,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Radio,
} from 'lucide-react';

export const VoiceStudio: React.FC = () => {
  const {
    t,
    language,
    voiceHistory,
    addVoiceItem,
    removeVoiceItem,
    recordUsage,
    addToast,
    hasApiKey,
  } = useApp();

  const [text, setText] = useState<string>(t.voice.samples.youtube);
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [stylePreset, setStylePreset] = useState<string>('Energetic YouTube Host');
  const [selectedLang, setSelectedLang] = useState<string>(language === 'ar' ? 'ar' : 'en');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Audio Player State
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Text Stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Standard speech is ~140 words per minute
  const estSeconds = Math.max(1, Math.round((wordCount / 140) * 60));

  const voices = [
    { id: 'Kore', label: t.voice.voices.kore, gender: 'Female', badge: 'Studio Anchor' },
    { id: 'Puck', label: t.voice.voices.puck, gender: 'Male', badge: 'Dynamic YouTube' },
    { id: 'Charon', label: t.voice.voices.charon, gender: 'Male', badge: 'Cinema & Doc' },
    { id: 'Fenrir', label: t.voice.voices.fenrir, gender: 'Male', badge: 'Inspiring & Deep' },
    { id: 'Zephyr', label: t.voice.voices.zephyr, gender: 'Female', badge: 'Warm & Friendly' },
  ];

  const styles = [
    { id: 'Energetic YouTube Host', label: t.voice.styles.youtube },
    { id: 'Cinematic Documentary Narrator', label: t.voice.styles.documentary },
    { id: 'Calm Educational Instructor', label: t.voice.styles.educational },
    { id: 'Urgent News Anchor', label: t.voice.styles.breaking },
    { id: 'Emotional Dramatic Storyteller', label: t.voice.styles.emotional },
    { id: 'Warm & Natural Conversational', label: t.voice.styles.conversational },
  ];

  // Sync sample text when user picks preset
  const handleSampleSelect = (sampleText: string) => {
    setText(sampleText);
    setGenerationError(null);
  };

  // Generate Audio via Server Route (Gemini 3.8 Flash Lite TTS)
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      addToast('error', 'Please enter a script to generate voice-over.');
      return;
    }
    if (text.length > 5000) {
      addToast('error', 'Script exceeds 5,000 characters limit.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName,
          style: stylePreset,
          language: selectedLang,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize speech.');
      }

      // Gemini returns base64 WAV file
      const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      setCurrentAudioUrl(audioUrl);

      const newItem: VoiceGenerationItem = {
        id: Date.now().toString(),
        text: text.trim(),
        voiceName,
        style: stylePreset,
        audioUrl,
        mimeType: data.mimeType || 'audio/wav',
        charCount: text.trim().length,
        createdAt: new Date().toLocaleTimeString(),
      };

      addVoiceItem(newItem);
      recordUsage('voice');
      addToast('success', language === 'ar' ? 'تم توليد التعليق الصوتي بنجاح!' : 'Voice-over synthesized successfully!');

      // Autoplay the generated audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 300);
    } catch (err: any) {
      console.error('TTS error:', err);
      setGenerationError(err.message || 'Error communicating with AI TTS engine.');
      addToast('error', err.message || 'Speech synthesis failed. Check API key configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Browser Speech Synthesis Preview Fallback
  const handleBrowserFallbackPreview = () => {
    if (!('speechSynthesis' in window)) {
      addToast('error', 'Browser speech synthesis is not supported on this device.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.volume = isMuted ? 0 : volume;

    if (selectedLang === 'ar') {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    addToast('info', language === 'ar' ? 'تشغيل المعاينة الصوتية بالمتصفح' : 'Playing browser speech preview');
  };

  // Audio Playback Listeners
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = (audioUrlToDownload?: string) => {
    const url = audioUrlToDownload || currentAudioUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ioni-voice-${voiceName.toLowerCase()}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('success', language === 'ar' ? 'بدأ تحميل الملف الصوتي' : 'Audio file download started');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-400 text-black shadow-md shadow-yellow-400/20">
              <Mic2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t.voice.title}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20 font-mono">
              Gemini 3.8 Flash Lite TTS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t.voice.subtitle}
          </p>
        </div>

        {/* Sample Prompts Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium mr-1">
            {t.common.samplePrompts}:
          </span>
          <button
            onClick={() => handleSampleSelect(t.voice.samples.youtube)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            YouTube Intro
          </button>
          <button
            onClick={() => handleSampleSelect(t.voice.samples.documentary)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Documentary
          </button>
          <button
            onClick={() => handleSampleSelect(t.voice.samples.arabicStory)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 text-xs transition-colors"
          >
            سرد وثائقي عربي
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Editor & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Script Textarea Card */}
          <div className="relative rounded-2xl bg-[#090C15] border border-slate-800 focus-within:border-yellow-400/80 transition-colors shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/40 rounded-t-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <FileText className="w-4 h-4 text-yellow-400" />
                <span>Script & Narration Editor</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>{wordCount} words</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Clock className="w-3 h-3" /> ~{estSeconds}s duration
                </span>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.voice.inputPlaceholder}
              rows={7}
              maxLength={5000}
              className="w-full bg-transparent p-4 text-white text-base leading-relaxed placeholder:text-slate-600 focus:outline-none resize-none font-sans"
            />

            {/* Bottom Bar in Editor */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 rounded-b-2xl border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setText('')}
                  className="hover:text-red-400 transition-colors"
                  title="Clear Text"
                >
                  {t.common.clear}
                </button>
                <button
                  onClick={handleBrowserFallbackPreview}
                  className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
                  title="Listen to browser speech preview"
                >
                  <Radio className="w-3 h-3" /> {t.voice.browserFallback}
                </button>
              </div>
              <div className="font-mono">
                <span className={charCount > 4500 ? 'text-amber-400 font-bold' : ''}>
                  {charCount}
                </span>{' '}
                / 5,000 {t.voice.charCount}
              </div>
            </div>
          </div>

          {/* Voice Presets & Style Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice Talent Selector */}
            <div className="p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.voice.voiceSelect}
              </label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-medium"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Studio voices powered by Google DeepMind high-fidelity neural acoustics.
              </p>
            </div>

            {/* Narration Style Preset */}
            <div className="p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.voice.stylePreset}
              </label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-medium"
              >
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Sets emotion, cadence, pause timing, and voice projection.
              </p>
            </div>
          </div>

          {/* Error Banner if any */}
          {generationError && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Generation Notice:</span>
                <p className="leading-relaxed">{generationError}</p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={handleBrowserFallbackPreview}
                    className="underline text-yellow-300 hover:text-yellow-200 font-semibold"
                  >
                    Use Browser Speech Synthesis Preview
                  </button>
                  <button
                    onClick={handleGenerateVoice}
                    className="underline text-slate-300 hover:text-white"
                  >
                    Retry Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleGenerateVoice}
            disabled={isGenerating || !text.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-base tracking-wide shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>{t.voice.generatingAudio}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{t.voice.generateBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audio Player & Recent History (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Custom Studio Audio Player Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#101524] to-[#0A0D17] border border-yellow-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  {t.voice.playbackControls}
                </h3>
              </div>
              <span className="text-xs font-mono text-yellow-300 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                {voiceName} • 24kHz WAV
              </span>
            </div>

            {/* Hidden HTML Audio Element */}
            <audio
              ref={audioRef}
              src={currentAudioUrl || undefined}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              preload="metadata"
            />

            {/* Waveform Visualizer */}
            <WaveformVisualizer isPlaying={isPlaying} />

            {/* Scrub / Seek Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                disabled={!currentAudioUrl}
                className="w-full accent-yellow-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Player Transport Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Play / Pause Primary */}
              <button
                onClick={togglePlayPause}
                disabled={!currentAudioUrl}
                className="w-12 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:hover:bg-yellow-400 text-black flex items-center justify-center font-bold shadow-lg shadow-yellow-400/20 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      playbackSpeed === s
                        ? 'bg-yellow-400 text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Download Action */}
              <button
                onClick={() => handleDownload()}
                disabled={!currentAudioUrl}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition-colors"
                title={t.common.download}
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <button onClick={toggleMute} className="hover:text-white transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-28 accent-yellow-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono">
                {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Recent Generations History */}
          <div className="p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {t.voice.recentGenerations}
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                {voiceHistory.length} files
              </span>
            </div>

            {voiceHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                {t.voice.noGenerations}
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {voiceHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs group transition-colors"
                  >
                    <div
                      onClick={() => {
                        setCurrentAudioUrl(item.audioUrl);
                        if (audioRef.current) {
                          audioRef.current.src = item.audioUrl;
                          audioRef.current.play().catch(() => {});
                          setIsPlaying(true);
                        }
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-yellow-400 font-mono">
                          {item.voiceName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {item.style}
                        </span>
                      </div>
                      <p className="text-slate-300 truncate text-[11px]">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDownload(item.audioUrl)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={t.common.download}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeVoiceItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
