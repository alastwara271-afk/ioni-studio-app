import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  RefreshCcw,
} from 'lucide-react';

export const SubscriptionManager: React.FC = () => {
  const { t, language, trialState, addToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('trial');

  const startDateFormatted = new Date(trialState.startDate).toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const endDateFormatted = new Date(trialState.endDate).toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    addToast(
      'info',
      language === 'ar'
        ? `تم تحديد باقة ${planName}. بوابة الدفع جاهزة للربط مع Stripe في بيئة الإنتاج.`
        : `Selected ${planName} tier. Payment gateway is ready for Stripe integration in production.`
    );
  };

  const usageMetrics = [
    {
      label: t.subscription.usage.voice,
      current: trialState.usage.voiceGenerations,
      max: trialState.usage.maxVoiceGenerations,
      unit: 'syntheses',
    },
    {
      label: t.subscription.usage.image,
      current: trialState.usage.imageGenerations,
      max: trialState.usage.maxImageGenerations,
      unit: 'images',
    },
    {
      label: t.subscription.usage.chat,
      current: trialState.usage.chatMessages,
      max: trialState.usage.maxChatMessages,
      unit: 'prompts',
    },
    {
      label: t.subscription.usage.videoPlans,
      current: trialState.usage.videoPlans,
      max: trialState.usage.maxVideoPlans,
      unit: 'blueprints',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-black shadow-md shadow-yellow-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t.subscription.title}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {t.subscription.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 1-Month Free Trial Live Status Hero Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12192E] via-[#0A0E1A] to-[#07090E] border border-yellow-500/40 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {t.subscription.trialCard.active}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Studio Access
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {trialState.daysRemaining} {t.common.daysLeft} in your 30-Day Free Trial
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.subscription.trialCard.fullAccess}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-500">{t.subscription.trialCard.startedOn}: </span>
                <span className="text-slate-200">{startDateFormatted}</span>
              </div>
              <div>•</div>
              <div>
                <span className="text-slate-500">{t.subscription.trialCard.expiresOn}: </span>
                <span className="text-yellow-400 font-bold">{endDateFormatted}</span>
              </div>
            </div>
          </div>

          {/* Radial or progress visual */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shrink-0 min-w-[180px]">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Trial Progression
            </span>
            <div className="text-3xl font-black text-white font-mono">
              {Math.round(((30 - trialState.daysRemaining) / 30) * 100)}%
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Day {Math.min(30, 30 - trialState.daysRemaining + 1)} of 30
            </span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-sky-400 rounded-full"
                style={{ width: `${Math.min(100, ((30 - trialState.daysRemaining) / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Entitlements & Usage Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">
          {t.subscription.usageTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageMetrics.map((metric, i) => {
            const pct = Math.min(100, Math.round((metric.current / metric.max) * 100));
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-2.5 shadow-lg"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{metric.label}</span>
                  <span className="font-mono text-yellow-400 font-bold">{pct}%</span>
                </div>

                <div className="text-2xl font-black text-white font-mono">
                  {metric.current}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    / {metric.max} {metric.unit}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct > 80 ? 'bg-amber-400' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-black text-2xl text-white">
            {t.subscription.tiersTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.subscription.tiersSubtitle}
          </p>

          {/* Monthly / Annual Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold mt-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.subscription.billingCycle.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.subscription.billingCycle.annual}</span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="p-6 rounded-3xl bg-[#090C15] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg text-white">
                  {t.subscription.plans.starter.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {t.subscription.plans.starter.desc}
                </p>
              </div>

              <div className="text-3xl font-black text-white">
                {billingCycle === 'annual' ? '$15' : t.subscription.plans.starter.price}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                {t.subscription.plans.starter.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Starter')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {t.subscription.upgradeBtn}
            </button>
          </div>

          {/* Creator Pro (Popular) */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#12192E] to-[#0A0D17] border-2 border-yellow-400 shadow-2xl flex flex-col justify-between space-y-6 scale-[1.02]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-yellow-400 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-md shadow-yellow-400/30">
              {t.subscription.plans.pro.badge}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg text-white">
                  {t.subscription.plans.pro.name}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {t.subscription.plans.pro.desc}
                </p>
              </div>

              <div className="text-3xl font-black text-yellow-400">
                {billingCycle === 'annual' ? '$39' : t.subscription.plans.pro.price}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                {t.subscription.plans.pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Creator Pro')}
              className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs shadow-lg shadow-yellow-400/25 transition-all"
            >
              {t.subscription.upgradeBtn}
            </button>
          </div>

          {/* Studio Master */}
          <div className="p-6 rounded-3xl bg-[#090C15] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg text-white">
                  {t.subscription.plans.master.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {t.subscription.plans.master.desc}
                </p>
              </div>

              <div className="text-3xl font-black text-white">
                {billingCycle === 'annual' ? '$79' : t.subscription.plans.master.price}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                {t.subscription.plans.master.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Studio Master')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {t.subscription.upgradeBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Security Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p>{t.subscription.paymentGatewayNotice}</p>
      </div>
    </div>
  );
};
