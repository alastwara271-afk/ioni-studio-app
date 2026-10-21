import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Youtube,
  Search,
  TrendingUp,
  Target,
  Layers,
  Copy,
  Check,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  DollarSign,
  Tv,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const YouTubeAcademy: React.FC = () => {
  const { t, language, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'keywords' | 'competitor' | 'setup' | 'workflow'>('keywords');

  // Keyword Assistant State
  const [topicInput, setTopicInput] = useState<string>('AI Video Editing & Voice Overs');
  const [isSearchingKeywords, setIsSearchingKeywords] = useState<boolean>(false);
  const [keywordResults, setKeywordResults] = useState<any>(null);

  // Competitor Analysis State
  const [competitorInput, setCompetitorInput] = useState<string>('Ali Abdaal / Vox Media');
  const [isAnalyzingCompetitor, setIsAnalyzingCompetitor] = useState<boolean>(false);
  const [competitorResults, setCompetitorResults] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', t.common.copied);
  };

  // Keyword search handler
  const handleKeywordSearch = async () => {
    if (!topicInput.trim()) return;
    setIsSearchingKeywords(true);
    setKeywordResults(null);

    try {
      const res = await fetch('/api/youtube/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          language: language === 'ar' ? 'ar' : 'en',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to research keywords.');
      }
      setKeywordResults(data.data);
      addToast('success', language === 'ar' ? 'اكتمل تحليل الكلمات المفتاحية!' : 'Keyword analysis completed!');
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Keyword research failed.');
    } finally {
      setIsSearchingKeywords(false);
    }
  };

  // Competitor analysis handler
  const handleCompetitorAnalysis = async () => {
    if (!competitorInput.trim()) return;
    setIsAnalyzingCompetitor(true);
    setCompetitorResults(null);

    try {
      const res = await fetch('/api/youtube/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelIdentifier: competitorInput.trim(),
          language: language === 'ar' ? 'ar' : 'en',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze competitor.');
      }
      setCompetitorResults(data.analysis);
      addToast('success', language === 'ar' ? 'تم استخراج تدقيق المنافس بنجاح!' : 'Competitor audit ready!');
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Competitor analysis failed.');
    } finally {
      setIsAnalyzingCompetitor(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t.youtube.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t.youtube.subtitle}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveSubTab('keywords')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'keywords'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.youtube.tabs.keywords}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('competitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'competitor'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{t.youtube.tabs.competitor}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'setup'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.youtube.tabs.setup}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'workflow'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.youtube.tabs.workflow}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KEYWORD RESEARCH */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D17] border border-slate-800 shadow-xl space-y-4">
            <div className="max-w-xl">
              <h3 className="font-bold text-lg text-white">
                {t.youtube.keywords.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.youtube.keywords.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
                  placeholder={t.youtube.keywords.inputPlaceholder}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 font-medium"
                />
              </div>
              <button
                onClick={handleKeywordSearch}
                disabled={isSearchingKeywords || !topicInput.trim()}
                className="py-3 px-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all shrink-0"
              >
                {isSearchingKeywords ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{t.common.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.youtube.keywords.searchBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Keyword Results View */}
          {keywordResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
              {/* Long Tail & Search Intent */}
              <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    {t.youtube.keywords.longTail}
                  </h4>
                  {keywordResults.searchIntent && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20 font-mono">
                      Intent: {keywordResults.searchIntent}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {Array.isArray(keywordResults.longTailKeywords) ? (
                    keywordResults.longTailKeywords.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs group hover:border-slate-700 transition-colors"
                      >
                        <span className="font-medium text-slate-200">{item.keyword}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              item.competition === 'Low'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {item.competition} Comp
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.keyword)}
                            className="p-1 rounded text-slate-500 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">{JSON.stringify(keywordResults)}</p>
                  )}
                </div>

                {/* Recommended Tags */}
                {Array.isArray(keywordResults.recommendedTags) && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      Optimized Video Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {keywordResults.recommendedTags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          onClick={() => copyToClipboard(tag)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* High-CTR Titles & Content Gaps */}
              <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    {t.youtube.keywords.viralTitles}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {Array.isArray(keywordResults.viralTitleHooks) &&
                    keywordResults.viralTitleHooks.map((h: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider">
                            {h.formula || 'High CTR'}
                          </span>
                          <button
                            onClick={() => copyToClipboard(h.title)}
                            className="p-1 text-slate-500 hover:text-white transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-white font-medium leading-relaxed">
                          {h.title}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Blue Ocean Content Gaps */}
                {Array.isArray(keywordResults.contentGaps) && (
                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-sky-400 mb-2">
                      {t.youtube.keywords.contentGaps}
                    </h5>
                    <div className="space-y-1.5">
                      {keywordResults.contentGaps.map((gap: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPETITOR ANALYSIS */}
      {activeSubTab === 'competitor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D17] border border-slate-800 shadow-xl space-y-4">
            <div className="max-w-xl">
              <h3 className="font-bold text-lg text-white">
                {t.youtube.competitor.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.youtube.competitor.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCompetitorAnalysis()}
                placeholder={t.youtube.competitor.inputPlaceholder}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-400 font-medium"
              />
              <button
                onClick={handleCompetitorAnalysis}
                disabled={isAnalyzingCompetitor || !competitorInput.trim()}
                className="py-3 px-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all shrink-0"
              >
                {isAnalyzingCompetitor ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{t.common.generating}</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>{t.youtube.competitor.analyzeBtn}</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.youtube.competitor.notice}</span>
            </div>
          </div>

          {/* Competitor Audit Results */}
          {competitorResults && (
            <div className="p-6 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-base text-yellow-400 flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  {t.youtube.competitor.resultsTitle}
                </h4>
                <button
                  onClick={() => copyToClipboard(competitorResults)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.common.copy}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {competitorResults}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHANNEL SETUP BLUEPRINT */}
      {activeSubTab === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-white text-base">
              {t.youtube.setupGuides.nicheTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.youtube.setupGuides.nicheDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-sky-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-white text-base">
              {t.youtube.setupGuides.brandingTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.youtube.setupGuides.brandingDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-white text-base">
              {t.youtube.setupGuides.seoTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.youtube.setupGuides.seoDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-bold text-white text-base">
              {t.youtube.setupGuides.algorithmTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.youtube.setupGuides.algorithmDesc}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTION WORKFLOW MATRIX */}
      {activeSubTab === 'workflow' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#090C15]">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Production Stage</th>
                <th className="p-4 text-emerald-400">Free Tools Pathway ($0)</th>
                <th className="p-4 text-yellow-400">Pro Studio Pathway</th>
                <th className="p-4">Retention & Quality Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-white">1. Script & Hooks</td>
                <td className="p-4">IONI AI Chat (Free tier), Google Docs</td>
                <td className="p-4">Claude 3.7 / Notion AI</td>
                <td className="p-4 text-slate-400">First 30 seconds decide 70% of viewers retention</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">2. Voice-Over (TTS)</td>
                <td className="p-4">IONI Voice Studio (Included trial)</td>
                <td className="p-4">ElevenLabs / Studio Mic Shure SM7B</td>
                <td className="p-4 text-slate-400">Crisp vocal clarity builds subconscious trust</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">3. B-Roll & Visual Assets</td>
                <td className="p-4">Pexels, Pixabay, Wikimedia Commons</td>
                <td className="p-4">Storyblocks, Midjourney v6, Envato</td>
                <td className="p-4 text-slate-400">Visual cuts every 3-5s prevent viewer boredom</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">4. Video Editing</td>
                <td className="p-4">CapCut Desktop, DaVinci Resolve Free</td>
                <td className="p-4">Adobe Premiere Pro, After Effects</td>
                <td className="p-4 text-slate-400">Rhythm, zooms, kinetic typography and match cuts</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">5. SFX & Background Music</td>
                <td className="p-4">YouTube Audio Library, Freesound.org</td>
                <td className="p-4">Epidemic Sound, Artlist</td>
                <td className="p-4 text-slate-400">Risers, whooshes, and subtle bass impact cues</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">6. Thumbnail Design</td>
                <td className="p-4">Canva Free, Photopea.com</td>
                <td className="p-4">Photoshop, Midjourney + Lightroom</td>
                <td className="p-4 text-slate-400">High contrast facial emotion and 3-word rule for CTR</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
