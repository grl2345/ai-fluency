"use client";

import { useMemo, useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment-modal";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  allQuestions,
  dimensions,
  levels,
  learningResources,
  scorePractical,
} from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import {
  Share2,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Award,
  MessageSquare,
  CheckCircle,
  GitMerge,
  Shield,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Brain,
  Target,
  Lock,
  Zap,
  Star,
  Home,
  ArrowRight,
  Eye,
  ClipboardCheck,
} from "lucide-react";
import { useSubscription } from "@/components/subscription-provider";

interface ResultsPageProps {
  answers: Record<number, string>;
  practicalTexts: Record<string, string>;
  profileData: Record<string, string | string[]>;
  onRetake: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Brain, Target, MessageSquare, CheckCircle, GitMerge, Shield,
};

const DIM_COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function AnimatedScore({ value, delay = 0.5 }: { value: number; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return <>{displayed}</>;
}

export function ResultsPage({ answers, practicalTexts, profileData, onRetake }: ResultsPageProps) {
  const { lang } = useLang();
  const { isPro, isTeam } = useSubscription();
  const hasPro = isPro || isTeam;
  const [showPayment, setShowPayment] = useState(false);

  const dimensionScores = useMemo(() => {
    const scores: Record<string, { total: number; max: number }> = {};
    dimensions.forEach((dim) => { scores[dim.id] = { total: 0, max: 0 }; });
    allQuestions.forEach((q) => {
      if (!q.dimension || q.type === "profile" || q.type === "practical") return;
      const answerId = answers[q.id as unknown as number];
      if (!answerId) return;
      const selectedOption = q.options?.find((opt) => opt.id === answerId);
      const maxScore = q.options ? Math.max(...q.options.map((opt) => opt.score)) : 0;
      if (selectedOption) {
        scores[q.dimension].total += selectedOption.score * q.weight;
        scores[q.dimension].max += maxScore * q.weight;
      }
    });
    allQuestions.filter((q) => q.type === "practical" && q.dimension).forEach((q) => {
      const text = practicalTexts[q.id] || "";
      const prScore = scorePractical(q.id, text);
      scores[q.dimension!].total += prScore * q.weight;
      scores[q.dimension!].max += 5 * q.weight;
    });
    return Object.entries(scores).map(([id, data]) => {
      const dimension = dimensions.find((d) => d.id === id)!;
      const percentage = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;
      const nameStr = dimension.name[lang];
      const shortName = lang === "zh" ? nameStr.slice(0, 4) : nameStr.slice(0, 8);
      return { id, name: nameStr, shortName, score: Math.min(100, percentage), fullMark: 100 };
    });
  }, [answers, practicalTexts, lang]);

  const behavioralTier = useMemo(() => {
    const signals: number[] = [];
    allQuestions.filter((q) => q.type === "scenario").forEach((q) => {
      const answerId = answers[q.id as unknown as number];
      if (!answerId) return;
      const opt = q.options?.find((o) => o.id === answerId);
      if (opt?.tierSignal) signals.push(opt.tierSignal);
    });
    if (signals.length === 0) return 1;
    signals.sort((a, b) => a - b);
    const mid = Math.floor(signals.length / 2);
    return signals.length % 2 !== 0 ? signals[mid] : Math.round((signals[mid - 1] + signals[mid]) / 2);
  }, [answers]);

  const practicalTier = useMemo(() => {
    const total = scorePractical("PR1", practicalTexts["PR1"] || "") + scorePractical("PR2", practicalTexts["PR2"] || "") + scorePractical("PR3", practicalTexts["PR3"] || "");
    if (total <= 5) return 2;
    if (total <= 10) return 3;
    return 4;
  }, [practicalTexts]);

  const mainTier = Math.min(behavioralTier, practicalTier);
  const currentLevel = useMemo(() => levels[Math.max(0, Math.min(4, mainTier - 1))], [mainTier]);
  const totalScore = currentLevel.minScore + Math.round((currentLevel.maxScore - currentLevel.minScore) * 0.5);

  const gapMessage = useMemo(() => {
    const p2 = profileData["P2"] as string | undefined;
    const map: Record<string, number> = { never: 1, lt6m: 2, "6m2y": 3, gt2y: 4 };
    if (!p2 || !(p2 in map)) return null;
    const gap = map[p2] - mainTier;
    if (gap > 0) return t(UI.results.gapPositive, lang);
    if (gap < 0) return t(UI.results.gapNegative, lang);
    return t(UI.results.gapNeutral, lang);
  }, [profileData, mainTier, lang]);

  const sortedDimensions = useMemo(() => [...dimensionScores].sort((a, b) => b.score - a.score), [dimensionScores]);
  const strengths = sortedDimensions.slice(0, 3);
  const weaknesses = sortedDimensions.slice(-3).reverse();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{lang === "zh" ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <div className="flex items-center gap-1">
            <a href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <Home className="h-3.5 w-3.5" />
              {lang === "zh" ? "首页" : "Home"}
            </a>
            <button onClick={onRetake} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <RefreshCw className="h-3.5 w-3.5" />
              {lang === "zh" ? "测评" : "Retake"}
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {/* ── Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-6 md:p-8"
        >
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white md:text-2xl">
              Hi{lang === "zh" ? "，欢迎回来" : ", Welcome back"} <span className="inline-block">&#x1F44B;</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {lang === "zh" ? "你的 AI 素养水平" : "Your AI Fluency Level"}
            </p>
          </div>

          {/* Main content: 3-column layout */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            {/* Left column: badge + description */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle className="h-3 w-3" />
                  {t(UI.results.badge, lang)}
                </span>
                <span className="text-xs text-slate-500">{today}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                {lang === "zh"
                  ? "你已完成 AI 素养测评，系统已根据你的表现生成专属报告。"
                  : "You’ve completed the AI Fluency Assessment. Your personalized report is ready."}
              </p>
            </div>

            {/* Center: Score Ring */}
            <div className="flex flex-col items-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {lang === "zh" ? "AI 素养得分" : "AI Fluency Score"}
              </p>
              <div className="relative h-40 w-40 md:h-48 md:w-48">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <motion.circle
                    cx="100" cy="100" r="82" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: totalScore / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-5xl font-black leading-none text-transparent tabular-nums md:text-6xl">
                    <AnimatedScore value={totalScore} delay={0.5} />
                  </span>
                  <span className="mt-1 text-xs font-semibold text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Right: Level badge */}
            <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-lg font-black text-emerald-400">
                  {currentLevel.badge}
                </div>
                <div>
                  <p className="text-base font-bold text-white">{currentLevel.name[lang]}</p>
                  <div className="flex items-center gap-0.5">
                    {[0,1,2,3,4].map((i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < mainTier ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="max-w-[220px] text-center text-xs leading-relaxed text-slate-400 md:text-left">
                {currentLevel.description[lang]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Top 3 Strengths ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-300">
            <ClipboardCheck className="h-4 w-4 text-indigo-400" />
            {lang === "zh" ? "你的 Top 3 强项" : "Your Top 3 Strengths"}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {strengths.map((dim, i) => {
              const fullDim = dimensions.find((d) => d.id === dim.id);
              const Icon = iconMap[fullDim?.icon || "Brain"];
              const color = DIM_COLORS[i % DIM_COLORS.length];
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#12122a] px-4 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{dim.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.score}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-slate-300">{dim.score}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Gap analysis ── */}
        {gapMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-sm text-slate-400"
          >
            {gapMessage}
          </motion.p>
        )}

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          <button className="flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-6 py-2.5 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20">
            <Share2 className="h-4 w-4" />
            {t(UI.results.share, lang)}
          </button>
          <button onClick={onRetake} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
            <RefreshCw className="h-4 w-4" />
            {t(UI.results.retake, lang)}
          </button>
        </motion.div>

        {/* ── Pro Unlock CTA ── */}
        {!hasPro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#12122a]"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 md:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
                  <Zap className="h-3.5 w-3.5" />
                  {t(UI.results.proOnly, lang)}
                </span>
                <h3 className="mt-4 text-2xl font-extrabold text-white">{t(UI.results.unlockTitle, lang)}</h3>
                <p className="mt-2 text-sm text-slate-400">{t(UI.results.unlockDesc, lang)}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {(lang === "zh"
                    ? ["六维度详细分析报告", "完整能力雷达图", "全维度学习资源推荐", "邮件支持"]
                    : ["Detailed 6-Dimension Report", "Full Competency Radar Chart", "Learning Resources for All Dimensions", "Email Support"]
                  ).map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-sm text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-400 active:scale-[0.98]"
                >
                  {t(UI.results.unlockCta, lang)}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-3 text-xs text-slate-500">{t(UI.results.unlockNote, lang)}</p>
              </div>
              {/* Illustration placeholder */}
              <div className="hidden items-center justify-center p-8 md:flex">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                      <ClipboardCheck className="h-10 w-10 text-indigo-400" />
                    </div>
                    <Lock className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Radar + Strengths (locked for free, full for Pro) ── */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Radar Chart Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
              <Award className="h-4 w-4 text-indigo-400" />
              {t(UI.results.radar, lang)}
            </h3>
            {hasPro ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensionScores}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="shortName" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="relative h-[280px] w-full">
                <div className="blur-md opacity-60">
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensionScores}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="shortName" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Lock className="h-6 w-6 text-slate-500" />
                  <button
                    onClick={() => setShowPayment(true)}
                    className="mt-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/[0.08]"
                  >
                    <Lock className="h-3 w-3" />
                    {lang === "zh" ? "升级 Pro 查看完整雷达图" : "Upgrade to Pro for full radar chart"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Strengths Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              {t(UI.results.strengths, lang)}
            </h3>
            {hasPro ? (
              <div className="space-y-3">
                {strengths.map((dim) => {
                  const fullDim = dimensions.find((d) => d.id === dim.id);
                  const Icon = iconMap[fullDim?.icon || "Brain"];
                  return (
                    <div key={dim.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                          <Icon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{dim.name}</p>
                          <p className="text-xs text-slate-500">{fullDim?.description[lang]}</p>
                        </div>
                      </div>
                      <button className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
                        {lang === "zh" ? "查看" : "View"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <div className="space-y-3 blur-sm opacity-60">
                  {strengths.map((dim) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    return (
                      <div key={dim.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Icon className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{dim.name}</p>
                            <p className="text-xs text-slate-500">{fullDim?.description[lang]}</p>
                          </div>
                        </div>
                        <span className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-slate-400">{lang === "zh" ? "查看" : "View"}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setShowPayment(true)}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-400"
                  >
                    <Lock className="h-4 w-4" />
                    {lang === "zh" ? "升级 Pro 解锁更多优势" : "Upgrade to Pro for more"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Pro full report content (tabs) ── */}
        {hasPro && (
          <div className="mt-8 rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-8 grid w-full max-w-sm grid-cols-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
                <TabsTrigger value="details" className="gap-1.5 rounded-lg text-sm font-medium text-slate-300 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {t(UI.results.breakdown, lang)}
                </TabsTrigger>
                <TabsTrigger value="learning" className="gap-1.5 rounded-lg text-sm font-medium text-slate-300 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white">
                  <BookOpen className="h-3.5 w-3.5" />
                  {t(UI.results.learn, lang)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid gap-4 md:grid-cols-2">
                  {dimensionScores.map((dim, index) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    const color = DIM_COLORS[index % DIM_COLORS.length];
                    return (
                      <motion.div key={dim.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
                              <Icon className="h-5 w-5" style={{ color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-200">{dim.name}</h4>
                                <span className="text-lg font-bold tabular-nums" style={{ color }}>{dim.score}%</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">{fullDim?.description[lang]}</p>
                              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${dim.score}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="learning">
                <div className="mb-6 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-5">
                  <h3 className="text-lg font-semibold text-white">{t(UI.results.learningPath, lang)}</h3>
                  <p className="mt-1 text-sm text-slate-400">{t(UI.results.learningDesc, lang)}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {sortedDimensions.map((dim) => {
                    const resources = learningResources.find((r) => r.dimension === dim.id);
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    return (
                      <div key={dim.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                            <Icon className="h-4 w-4 text-indigo-400" />
                          </div>
                          <span className="font-semibold text-slate-200">{dim.name}</span>
                        </div>
                        <div className="space-y-2">
                          {resources?.resources.map((res, idx) => {
                            const resTitle = typeof res.title === "object" ? res.title[lang] : res.title;
                            const resDuration = typeof res.duration === "object" ? res.duration[lang] : res.duration;
                            const resUrl = (res as { url?: string }).url;
                            const typeLabel = res.type === "article" ? t(UI.results.article, lang) : res.type === "video" ? t(UI.results.video, lang) : res.type === "course" ? t(UI.results.course, lang) : res.type === "template" ? t(UI.results.template, lang) : t(UI.results.newsletter, lang);
                            const TYPE_COLORS: Record<string, string> = { article: "bg-sky-500/15 text-sky-400", video: "bg-rose-500/15 text-rose-400", course: "bg-violet-500/15 text-violet-400", template: "bg-emerald-500/15 text-emerald-400", newsletter: "bg-amber-500/15 text-amber-400" };
                            const inner = (
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 leading-snug">{resTitle}</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[res.type] ?? "bg-slate-500/15 text-slate-400"}`}>{typeLabel}</span>
                                  <span>{resDuration}</span>
                                </div>
                              </div>
                            );
                            return resUrl ? (
                              <a key={idx} href={resUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/[0.06] p-3 transition-all hover:border-indigo-400/20 hover:bg-indigo-500/5">
                                {inner}
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:text-indigo-400" />
                              </a>
                            ) : (
                              <div key={idx} className="group flex items-center gap-3 rounded-xl border border-white/[0.06] p-3">{inner}</div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-slate-600">
          <a href="/" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold">{lang === "zh" ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <p>&copy; {new Date().getFullYear()} AI Fluency &middot; {lang === "zh" ? "保留所有权利" : "All rights reserved"}</p>
        </div>
      </footer>

      {showPayment && (
        <PaymentModal
          plan="pro"
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); window.location.href = "/account"; }}
        />
      )}
    </div>
  );
}
