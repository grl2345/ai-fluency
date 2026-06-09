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
  ChevronRight,
  Users,
  Crown,
  Clock,
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
  const nextLevel = useMemo(() => mainTier < 5 ? levels[mainTier] : null, [mainTier]);
  const totalScore = currentLevel.minScore + Math.round((currentLevel.maxScore - currentLevel.minScore) * 0.5);
  const nextLevelGap = nextLevel ? nextLevel.minScore - totalScore : 0;

  const sortedDimensions = useMemo(() => [...dimensionScores].sort((a, b) => b.score - a.score), [dimensionScores]);
  const strengths = sortedDimensions.slice(0, 2);
  const weaknesses = sortedDimensions.slice(-3).reverse();

  const gapMessage = useMemo(() => {
    const p2 = profileData["P2"] as string | undefined;
    const map: Record<string, number> = { never: 1, lt6m: 2, "6m2y": 3, gt2y: 4 };
    if (!p2 || !(p2 in map)) return null;
    const gap = map[p2] - mainTier;
    if (gap > 0) return t(UI.results.gapPositive, lang);
    if (gap < 0) return t(UI.results.gapNegative, lang);
    return t(UI.results.gapNeutral, lang);
  }, [profileData, mainTier, lang]);

  const percentile = useMemo(() => {
    if (mainTier <= 1) return 62;
    if (mainTier === 2) return 45;
    if (mainTier === 3) return 28;
    if (mainTier === 4) return 12;
    return 5;
  }, [mainTier]);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
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
              {lang === "zh" ? "重新测评" : "Retake"}
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {/* ── Greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Hi{lang === "zh" ? "，欢迎回来" : ", Welcome Back"} <span className="inline-block">&#x1F44B;</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {lang === "zh" ? "你的 AI 素养测评报告已生成" : "Your AI Fluency Assessment report is ready"}
          </p>
        </motion.div>

        {/* ── Hero Identity Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#16163a] via-[#12122a] to-[#1a1240]"
        >
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-indigo-600/15 blur-[80px]" />
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-[60px]" />

          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
            {/* Left: Avatar area with floating icons */}
            <div className="relative mx-auto flex h-52 w-52 shrink-0 items-center justify-center md:mx-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-transparent" />
              <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20">
                <Brain className="h-16 w-16 text-indigo-300/80" />
              </div>
              {/* Floating icons */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-2 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 backdrop-blur-sm"
              >
                <MessageSquare className="h-4 w-4 text-indigo-300" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-0 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-violet-300" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-2 top-10 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 backdrop-blur-sm"
              >
                <Target className="h-4 w-4 text-cyan-300" />
              </motion.div>
            </div>

            {/* Center: Level identity */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-slate-400">
                {lang === "zh" ? "你的 AI 身份" : "Your AI Identity"}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                {currentLevel.name[lang]}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                {currentLevel.description[lang]}
                {lang === "zh" ? "，但更多停留在工具层面。" : "."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <span className="text-lg font-bold text-white">{percentile}%</span>
                <span className="text-xs text-slate-400">
                  {lang === "zh" ? "的用户处于此阶段" : "of users are at this stage"}
                </span>
              </div>
            </div>

            {/* Right: Score + Level badge */}
            <div className="flex shrink-0 flex-col items-center gap-4 md:items-end">
              {/* Level badge */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-violet-500/25">
                {currentLevel.badge}
              </div>
              {/* Score box */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d22] px-6 py-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {lang === "zh" ? "AI 素养得分" : "AI Fluency Score"}
                </p>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-4xl font-black leading-none text-transparent tabular-nums">
                    <AnimatedScore value={totalScore} delay={0.5} />
                  </span>
                  <span className="text-sm text-slate-500">/100</span>
                </div>
                {nextLevel && (
                  <div className="mt-3 border-t border-white/[0.06] pt-3">
                    <p className="text-[10px] text-slate-500">
                      {lang === "zh" ? "距离下一等级还差" : "Points to next level"}
                    </p>
                    <p className="mt-0.5 flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-amber-400 tabular-nums">{nextLevelGap}</span>
                      <span className="text-xs text-slate-500">{lang === "zh" ? "分" : "pts"}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Strengths & Weaknesses ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          {/* Strengths */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              {lang === "zh" ? "你的优势" : "Your Strengths"}
            </h3>
            <div className="space-y-3">
              {strengths.map((dim) => {
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const Icon = iconMap[fullDim?.icon || "Brain"];
                return (
                  <div key={dim.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">{dim.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">{fullDim?.description[lang]}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              {lang === "zh" ? "待提升能力" : "Areas for Growth"}
            </h3>
            <div className="space-y-3">
              {weaknesses.map((dim) => {
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const Icon = iconMap[fullDim?.icon || "Brain"];
                return (
                  <div key={dim.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">{dim.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">{fullDim?.description[lang]}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Growth Path & Recommendations ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          {/* Growth Path */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-200">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              {lang === "zh" ? "你的 AI 成长路径" : "Your AI Growth Path"}
            </h3>

            {/* Level Timeline */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {levels.map((lvl, i) => {
                  const isActive = lvl.level === mainTier;
                  const isPast = lvl.level < mainTier;
                  return (
                    <div key={lvl.badge} className="flex flex-col items-center gap-1.5">
                      <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                          : isPast
                            ? "bg-indigo-500/15 text-indigo-400"
                            : "bg-white/[0.04] text-slate-600"
                      }`}>
                        <Brain className="h-4 w-4" />
                        {isActive && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#12122a] bg-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[10px] font-bold ${isActive ? "text-white" : isPast ? "text-indigo-400" : "text-slate-600"}`}>
                        {lvl.badge}
                      </span>
                      <span className={`max-w-[56px] text-center text-[9px] leading-tight ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                        {lvl.name[lang]}
                      </span>
                      {isActive && (
                        <span className="mt-0.5 rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-violet-300">
                          {lang === "zh" ? "当前阶段" : "Current"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Connection line */}
              <div className="relative mx-5 mt-[-52px] mb-8 h-0.5">
                <div className="absolute inset-0 bg-white/[0.06]" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: `${((mainTier - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Next level info */}
            {nextLevel && (
              <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {lang === "zh" ? `距离下一等级：` : "Next level: "}
                    <span className="font-bold text-white">{nextLevel.name[lang]} ({nextLevel.badge})</span>
                    {lang === "zh" ? ` 还差 ` : " — "}
                    <span className="font-bold text-amber-400">{nextLevelGap} {lang === "zh" ? "分" : "pts"}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  {weaknesses.slice(0, 3).map((dim, i) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    const boost = Math.max(3, Math.round((100 - dim.score) * 0.12));
                    return (
                      <div key={dim.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {dim.name}
                        </div>
                        <span className="font-bold text-emerald-400">+{boost}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-[10px] text-slate-500">{lang === "zh" ? "预计成长时间" : "Est. growth time"}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-lg font-bold text-white">7</span>
                    <span className="text-xs text-slate-400">{lang === "zh" ? "天" : "days"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
              <Star className="h-4 w-4 text-amber-400" />
              {lang === "zh" ? "为你推荐的下一步" : "Recommended Next Steps"}
            </h3>
            <p className="mb-5 text-xs text-slate-500">
              {lang === "zh" ? "未来 7 天优先提升" : "Priority for the next 7 days"}
            </p>
            <div className="space-y-3">
              {weaknesses.slice(0, 3).map((dim, i) => {
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const steps = {
                  zh: [
                    `学习${dim.name}方法`,
                    `掌握 ${dim.name} 技巧`,
                    `学会${dim.name}迭代`,
                  ],
                  en: [
                    `Learn ${dim.name} methods`,
                    `Master ${dim.name} techniques`,
                    `Practice ${dim.name} iteration`,
                  ],
                };
                const descs = {
                  zh: [
                    `让复杂任务变得清晰易执行`,
                    `获得更准确、更优质的输出`,
                    `持续优化 AI 输出结果`,
                  ],
                  en: [
                    `Make complex tasks clear and actionable`,
                    `Get more accurate, higher quality outputs`,
                    `Continuously optimize AI outputs`,
                  ],
                };
                return (
                  <div key={dim.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-sm font-bold text-violet-300">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">{steps[lang][i]}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{descs[lang][i]}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasPro ? (
              <a href="#learning" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 text-sm font-bold text-white transition-all hover:from-fuchsia-400 hover:to-violet-400">
                {lang === "zh" ? "查看学习资源" : "View Learning Resources"}
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                onClick={() => setShowPayment(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 text-sm font-bold text-white transition-all hover:from-fuchsia-400 hover:to-violet-400"
              >
                {lang === "zh" ? "查看学习资源" : "View Learning Resources"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Pro Unlock CTA (free users only) ── */}
        {!hasPro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-[#1e1048] via-[#18103a] to-[#1e1048]"
          >
            <div className="flex items-center justify-between gap-6 px-6 py-5 md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white md:text-lg">
                    {lang === "zh" ? "解锁完整潜力，迈向 AI 高阶玩家" : "Unlock your full potential"}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {lang === "zh" ? "升级 Pro 获取完整报告、深度分析与个性化学习计划" : "Upgrade to Pro for full report, deep analysis, and personalized learning plan"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:from-fuchsia-400 hover:to-violet-400 active:scale-[0.98]"
              >
                {t(UI.results.unlockCta, lang)}
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Pro full content ── */}
        {hasPro && (
          <div id="learning" className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Radar Chart */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                <Award className="h-4 w-4 text-indigo-400" />
                {t(UI.results.radar, lang)}
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensionScores}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="shortName" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5 md:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                <BookOpen className="h-4 w-4 text-violet-400" />
                {t(UI.results.learningPath, lang)}
              </h3>
              <div className="space-y-3">
                {sortedDimensions.slice(0, 4).map((dim) => {
                  const resources = learningResources.find((r) => r.dimension === dim.id);
                  const firstRes = resources?.resources[0];
                  if (!firstRes) return null;
                  const fullDim = dimensions.find((d) => d.id === dim.id);
                  const Icon = iconMap[fullDim?.icon || "Brain"];
                  const resTitle = typeof firstRes.title === "object" ? firstRes.title[lang] : firstRes.title;
                  const resUrl = (firstRes as { url?: string }).url;
                  return (
                    <a
                      key={dim.id}
                      href={resUrl || "#"}
                      target={resUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all hover:border-indigo-400/20 hover:bg-indigo-500/5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                        <Icon className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-300">{dim.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500 truncate">{resTitle}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:text-indigo-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Locked preview for free users ── */}
        {!hasPro && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                <Award className="h-4 w-4 text-indigo-400" />
                {t(UI.results.radar, lang)}
              </h3>
              <div className="relative h-[280px] w-full">
                <div className="blur-md opacity-50">
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
                    {lang === "zh" ? "升级 Pro 查看完整雷达图" : "Upgrade to Pro for full chart"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#12122a] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                {t(UI.results.strengths, lang)}
              </h3>
              <div className="relative">
                <div className="space-y-3 blur-sm opacity-50">
                  {strengths.map((dim) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    return (
                      <div key={dim.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                          <Icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-200">{dim.name}</p>
                          <p className="text-xs text-slate-500">{fullDim?.description[lang]}</p>
                        </div>
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
                    {lang === "zh" ? "升级 Pro 解锁更多优势" : "Upgrade Pro to unlock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-slate-600 sm:flex-row">
          <a href="/" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold">{lang === "zh" ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <p className="text-slate-500">
            {lang === "zh" ? "让每个人的 AI 之旅更简单" : "Making AI accessible for everyone"}
          </p>
          <p>&copy; {new Date().getFullYear()} AI Fluency</p>
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
