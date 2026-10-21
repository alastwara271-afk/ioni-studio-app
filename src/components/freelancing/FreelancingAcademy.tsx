import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Calculator,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Copy,
  GraduationCap,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const FreelancingAcademy: React.FC = () => {
  const { t, language, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'calc' | 'templates' | 'skills' | 'safety'>('calc');

  // Calculator State
  const [serviceType, setServiceType] = useState<string>('youtube-long');
  const [complexity, setComplexity] = useState<string>('medium');
  const [deliverablesCount, setDeliverablesCount] = useState<number>(4);
  const [turnaroundDays, setTurnaroundDays] = useState<number>(3);
  const [includeVoice, setIncludeVoice] = useState<boolean>(true);

  // Pricing formula
  const baseRates: Record<string, number> = {
    'youtube-long': 120, // 8-12 min video edit
    'shorts-pack': 45, // per short/reel
    'voiceover': 60, // per 5 min voiceover
    'thumbnails': 30, // per high-CTR thumbnail
    'full-package': 220, // full script + voice + edit + thumbnail
  };

  const complexityMultipliers: Record<string, number> = {
    low: 0.8,
    medium: 1.0,
    high: 1.45,
  };

  const speedMultiplier = turnaroundDays <= 1 ? 1.4 : turnaroundDays <= 2 ? 1.2 : 1.0;
  const base = baseRates[serviceType] || 100;
  const comp = complexityMultipliers[complexity] || 1.0;
  const voiceAddon = includeVoice && serviceType !== 'voiceover' && serviceType !== 'full-package' ? 35 : 0;
  const singleUnitPrice = Math.round((base * comp + voiceAddon) * speedMultiplier);
  const totalPrice = singleUnitPrice * deliverablesCount;

  const copyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', t.common.copied);
  };

  const templates = [
    {
      title: '1. Cold DM to YouTube Creators (Twitter / X & Instagram)',
      text: `Hey [Creator Name], big fan of your recent video on [Video Topic]! 

I noticed in the segment around [02:30], your audience retention could easily spike with faster pacing, dynamic zooms, and punchier sound effects. 

I actually took 45 seconds of that footage and recut it with retention-driven motion graphics and sound design. 

Here is the unlisted preview link: [Insert Loom or Google Drive Link]

If you'd like me to take editing off your plate so you can focus 100% on scripting and ideas, let's test one complete video next week. No risk on your end.

Best,
[Your Name]
Portfolio: [Portfolio Link]`,
    },
    {
      title: '2. Upwork High-Conversion Proposal',
      text: `Hi [Client Name],

I saw you're looking for a video editor who understands YouTube pacing and high click-through retention. 

Most editors just cut out silent pauses, but modern YouTube requires:
1. Visual pattern interrupts every 4-6 seconds to maintain viewer engagement.
2. Narrative audio ducking so sound effects elevate emotional beats without overpowering your voice.
3. High-CTR thumbnail and title synchronization so the opening hook delivers on the promise immediately.

Here are 2 recent videos I edited in your niche:
- [Link 1]
- [Link 2]

I can deliver your first rough cut within 48 hours. Are you available for a quick 5-minute chat to align on your timeline?

Best,
[Your Name]`,
    },
    {
      title: '3. Scope Protection & Revision Agreement',
      text: `Hi [Client Name],

Thank you for the feedback! 

Just to keep our production schedule on track:
- Rounds 1 and 2 of minor revisions (pacing trims, text typos, audio leveling) are completely included in our agreed project fee.
- If we are introducing new script sections, changing the fundamental storyline, or adding footage outside our initial creative brief, that would fall under a scope expansion at $X/hour or a flat $Y add-on.

Let me know if you would like me to implement the current feedback list right away!

Best,
[Your Name]`,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t.freelance.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t.freelance.subtitle}
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'calc'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.freelance.tabs.calculator}</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.freelance.tabs.templates}</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.freelance.tabs.paths}</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.freelance.tabs.safety}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRICING CALCULATOR */}
      {activeTab === 'calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-yellow-400" />
              {t.freelance.calc.title}
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">
                  {t.freelance.calc.serviceType}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-medium"
                >
                  <option value="youtube-long">YouTube Long-Form Video Edit (8-12 mins)</option>
                  <option value="shorts-pack">Shorts / TikTok / Reels Edit (60s)</option>
                  <option value="voiceover">Broadcast AI Voice-over Production</option>
                  <option value="thumbnails">High-CTR Custom Thumbnail Pack</option>
                  <option value="full-package">Full Production (Script + Voice + Edit + Thumbnail)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    {t.freelance.calc.complexity}
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="low">Standard / Clean Cut</option>
                    <option value="medium">Intermediate (B-roll, zooms, SFX)</option>
                    <option value="high">Advanced / High-Motion FX & 3D</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    {t.freelance.calc.turnaround}
                  </label>
                  <select
                    value={turnaroundDays}
                    onChange={(e) => setTurnaroundDays(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value={1}>Rush Delivery (24 Hours) +40%</option>
                    <option value={2}>Fast (48 Hours) +20%</option>
                    <option value={3}>Standard (3-4 Days)</option>
                    <option value={7}>Flexible (1 Week)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">
                    {t.freelance.calc.deliverables}: <span className="text-yellow-400 font-bold">{deliverablesCount} items</span>
                  </label>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={deliverablesCount}
                  onChange={(e) => setDeliverablesCount(parseInt(e.target.value, 10))}
                  className="w-full accent-yellow-400 bg-slate-800 h-1.5 rounded-lg"
                />
              </div>

              {serviceType !== 'voiceover' && serviceType !== 'full-package' && (
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeVoice}
                    onChange={(e) => setIncludeVoice(e.target.checked)}
                    className="accent-yellow-400 rounded w-4 h-4"
                  />
                  <span>Include custom IONI AI Voice-over with audio mastering (+$35/video)</span>
                </label>
              )}
            </div>
          </div>

          {/* Pricing Quote Summary */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-b from-[#101628] to-[#0A0D17] border border-yellow-500/30 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                Recommended Market Pricing Quote
              </span>

              <div className="pt-2">
                <span className="text-slate-400 text-xs block">{t.freelance.calc.recommendedFee}:</span>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight text-yellow-400 mt-1">
                  ${totalPrice}
                  <span className="text-slate-400 text-sm font-normal ml-2">
                    (${singleUnitPrice} / unit)
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Deliverables Count:</span>
                  <span className="font-semibold text-white">{deliverablesCount} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Turnaround Window:</span>
                  <span className="font-semibold text-white">{turnaroundDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Revisions Included:</span>
                  <span className="font-semibold text-white">2 rounds of minor trims</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Commercial Release:</span>
                  <span className="font-semibold text-emerald-400">100% Client Ownership</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => copyTemplate(`Project Quote: ${deliverablesCount}x ${serviceType} @ $${singleUnitPrice}/unit = $${totalPrice} Total. Delivery: ${turnaroundDays} days.`)}
                className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Quote Summary for Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPOSALS & OUTREACH TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((tpl, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-bold text-sm text-yellow-400">{tpl.title}</h4>
                <button
                  onClick={() => copyTemplate(tpl.text)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.common.copy}</span>
                </button>
              </div>
              <pre className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {tpl.text}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SKILL TRACKS */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-yellow-400 font-bold">TRACK 01</span>
            <h4 className="font-bold text-white text-base">Retention Video Editing</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Master the 4-second cut rule, dynamic sound design, J/L cuts, speed ramping, and motion graphics that keep average view duration over 50%.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <div>• CapCut Desktop & Premiere shortcuts</div>
              <div>• Sound effects layering (impacts, risers)</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-sky-400 font-bold">TRACK 02</span>
            <h4 className="font-bold text-white text-base">High-CTR Thumbnail Design</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Design thumbnails that command clicks in competitive feeds. Understand facial expressions, 3-element composition, color isolation, and typography.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <div>• Photoshop lighting & dodge/burn</div>
              <div>• AI background generation with IONI Image Studio</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">TRACK 03</span>
            <h4 className="font-bold text-white text-base">AI Content Automation Agency</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Combine IONI Voice Studio + AI Video Editing Plans to deliver 20+ viral short-form videos per month for international corporate clients.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <div>• Batch scriptwriting with IONI AI</div>
              <div>• Retainer contracts & recurring monthly revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAFETY & ANTI-SCAM GUIDE */}
      {activeTab === 'safety' && (
        <div className="p-6 rounded-2xl bg-[#090C15] border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-base text-white">
              Freelancer Protection & Anti-Scam Protocol
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
              <h5 className="font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Red Flags to Avoid
              </h5>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>Clients asking you to pay an "application fee" or buy equipment.</li>
                <li>Refusing to put funds in escrow on platforms like Upwork or Fiverr.</li>
                <li>Demanding full high-res unwatermarked exports before initial deposit.</li>
                <li>Communicating solely on Telegram without verifiable online identities.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Safe Best Practices
              </h5>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>Always request a 50% upfront deposit before rendering full video files.</li>
                <li>Send review cuts with a translucent diagonal watermark across the video.</li>
                <li>Sign a straightforward 1-page agreement specifying 2 revision rounds.</li>
                <li>Use legitimate escrow platforms or Stripe invoice links.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
