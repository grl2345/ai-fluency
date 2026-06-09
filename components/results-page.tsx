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
  AlertTriangle,
  Home,
  ArrowRight,
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
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * value);
        setDisplayed(start);
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
  const strengths = sortedDimensions.slice(0, 2);
  const weaknesses = sortedDimensions.slice(-3).reverse();

  const TIER_GRADIENT = [
    "from-slate-500 to-slate-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-amber-400 to-orange-500",
  ];
  const tierGrad = TIER_GRADIENT[Math.max(0, Math.min(4, mainTier - 1))];

  return (
    <div className="min-h-screen bg-[#07070d]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a16]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{lang === "zh" ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <Home className="h-3.5 w-3.5" />
              {lang === "zh" ? "首页" : "Home"}
            </a>
            <button onClick={onRetake} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <RefreshCw className="h-3.5 w-3.5" />
              {lang === "zh" ? "重测" : "Retake"}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Dark Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[160px]" />
          <div className="absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[140px]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              {t(UI.results.badge, lang)}
            </span>
          </motion.div>

          {/* Score Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="mt-10"
          >
            <div className="relative mx-auto h-48 w-48 md:h-56 md:w-56">
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
                <span className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-[56px] font-black leading-none text-transparent tabular-nums md:text-[64px]">
                  <AnimatedScore value={totalScore} delay={0.5} />
                </span>
                <span className="mt-1 text-xs font-semibold text-slate-500">/ 100</span>
              </div>
            </div>
          </motion.div>

          {/* Level */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6"
          >
            <div className={`mx-auto inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${tierGrad} px-6 py-3 shadow-lg`}>
              <span className="text-2xl font-black text-white">{currentLevel.badge}</span>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{currentLevel.name[lang]}</p>
                <div className="flex items-center gap-0.5">
                  {[0,1,2,3,4].map((i) => (
                    <Star key={i} className={`h-3 w-3 ${i < mainTier ? "fill-white/90 text-white/90" : "fill-white/20 text-white/20"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {currentLevel.description[lang]}
            </p>
          </motion.div>

          {/* Top 3 Weaknesses */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mx-auto mt-10 max-w-md"
          >
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-sm">
              <h3 className="mb-3 flex items-center justify-center gap-2 text-sm font-bold text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                {lang === "zh" ? "你的 Top 3 弱项" : "Your Top 3 Weaknesses"}
              </h3>
              <div className="space-y-2">
                {weaknesses.map((dim, i) => {
                  const fullDim = dimensions.find((d) => d.id === dim.id);
                  const Icon = iconMap[fullDim?.icon || "Brain"];
                  return (
                    <motion.div
                      key={dim.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium text-slate-200">{dim.name}</span>
                      </div>
                      <span className="text-sm font-bold text-amber-400">{dim.score}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Gap analysis */}
          {gapMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mx-auto mt-6 max-w-md rounded-2xl border border-indigo-400/15 bg-indigo-500/5 px-6 py-4 text-sm text-slate-300 backdrop-blur-sm"
            >
              {gapMessage}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-400">
              <Share2 className="h-4 w-4" />
              {t(UI.results.share, lang)}
            </button>
            <button onClick={onRetake} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white">
              <RefreshCw className="h-4 w-4" />
              {t(UI.results.retake, lang)}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Unlock CTA for free users ── */}
      {!hasPro && (
        <section className="border-t border-white/[0.06] px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 p-8 text-center backdrop-blur-sm md:p-10"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
              <Zap className="h-3.5 w-3.5" />
              {t(UI.results.proOnly, lang)}
            </span>
            <h3 className="mt-4 text-2xl font-extrabold text-white">{t(UI.results.unlockTitle, lang)}</h3>
            <p className="mt-2 text-sm text-slate-300">{t(UI.results.unlockDesc, lang)}</p>
            <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left">
              {(lang === "zh"
                ? ["六维度详细分析报告", "完整能力雷达图", "全维度学习资源推荐", "邮件支持"]
                : ["Detailed 6-Dimension Report", "Full Competency Radar Chart", "Learning Resources for All Dimensions", "Email Support"]
              ).map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPayment(true)}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-400 hover:to-violet-400 active:scale-[0.98]"
            >
              {t(UI.results.unlockCta, lang)}
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-slate-500">{t(UI.results.unlockNote, lang)}</p>
          </motion.div>
        </section>
      )}

      {/* ── Locked preview for free / Full report for Pro ── */}
      <section className="border-t border-white/[0.06] bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {hasPro ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mx-auto mb-10 grid w-full max-w-sm grid-cols-3 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <TabsTrigger value="overview" className="gap-1.5 rounded-md text-sm font-medium">
                  <Award className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t(UI.results.overview, lang)}</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-1.5 rounded-md text-sm font-medium">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t(UI.results.breakdown, lang)}</span>
                </TabsTrigger>
                <TabsTrigger value="learning" className="gap-1.5 rounded-md text-sm font-medium">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t(UI.results.learn, lang)}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-8 lg:grid-cols-2">
                  <Card className="border-border/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="h-5 w-5 text-primary" />
                        {t(UI.results.radar, lang)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensionScores}>
                            <PolarGrid stroke="#e2e8f0" strokeOpacity={0.8} />
                            <PolarAngleAxis dataKey="shortName" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} />
                            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-6">
                    <Card className="border-border/40">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-teal-600">
                          <TrendingUp className="h-5 w-5" />
                          {t(UI.results.strengths, lang)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {strengths.map((dim) => {
                          const fullDim = dimensions.find((d) => d.id === dim.id);
                          const Icon = iconMap[fullDim?.icon || "Brain"];
                          return (
                            <div key={dim.id} className="flex items-center justify-between rounded-xl bg-teal-50 p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                                  <Icon className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{dim.name}</p>
                                  <p className="text-sm text-muted-foreground">{fullDim?.description[lang]}</p>
                                </div>
                              </div>
                              <Badge className="bg-teal-500 text-white hover:bg-teal-500">{dim.score}%</Badge>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                    <Card className="border-border/40">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-amber-600">
                          <BookOpen className="h-5 w-5" />
                          {t(UI.results.growth, lang)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {weaknesses.map((dim) => {
                          const fullDim = dimensions.find((d) => d.id === dim.id);
                          const Icon = iconMap[fullDim?.icon || "Brain"];
                          return (
                            <div key={dim.id} className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                                  <Icon className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{dim.name}</p>
                                  <p className="text-sm text-muted-foreground">{fullDim?.description[lang]}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-amber-300 text-amber-600">{dim.score}%</Badge>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="grid gap-4 md:grid-cols-2">
                  {dimensionScores.map((dim, index) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    return (
                      <motion.div key={dim.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <Card className="border-border/40">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                                <Icon className="h-6 w-6 text-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-foreground">{dim.name}</h3>
                                  <span className="text-lg font-bold text-primary">{dim.score}%</span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{fullDim?.description[lang]}</p>
                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${dim.score}%` }} transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }} className="h-full rounded-full bg-primary" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="learning">
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 p-6 md:p-8">
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{t(UI.results.learningPath, lang)}</h3>
                  <p className="text-muted-foreground">{t(UI.results.learningDesc, lang)}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {sortedDimensions.map((dim) => {
                    const resources = learningResources.find((r) => r.dimension === dim.id);
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    return (
                      <Card key={dim.id} className="border-border/40">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary"><Icon className="h-5 w-5 text-foreground" /></div>
                            <div>
                              <span className="text-lg">{dim.name}</span>
                              <Badge variant="outline" className="ml-3 text-xs">{t(UI.results.priority, lang)}</Badge>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {resources?.resources.map((res, idx) => {
                            const resTitle = typeof res.title === "object" ? res.title[lang] : res.title;
                            const resDuration = typeof res.duration === "object" ? res.duration[lang] : res.duration;
                            const resUrl = (res as { url?: string }).url;
                            const typeLabel = res.type === "article" ? t(UI.results.article, lang) : res.type === "video" ? t(UI.results.video, lang) : res.type === "course" ? t(UI.results.course, lang) : res.type === "template" ? t(UI.results.template, lang) : t(UI.results.newsletter, lang);
                            const TYPE_COLORS: Record<string, string> = { article: "bg-sky-50 text-sky-700", video: "bg-rose-50 text-rose-700", course: "bg-violet-50 text-violet-700", template: "bg-emerald-50 text-emerald-700", newsletter: "bg-amber-50 text-amber-700" };
                            const inner = (
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 group-hover:text-indigo-600 leading-snug">{resTitle}</p>
                                <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TYPE_COLORS[res.type] ?? "bg-slate-100 text-slate-600"}`}>{typeLabel}</span>
                                  <span>{resDuration}</span>
                                </div>
                              </div>
                            );
                            return resUrl ? (
                              <a key={idx} href={resUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm">
                                {inner}
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </a>
                            ) : (
                              <div key={idx} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4">{inner}<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-200" /></div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="relative">
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="h-5 w-5 text-primary" />
                      {t(UI.results.radar, lang)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[320px] w-full">
                      <div className="blur-md">
                        <ResponsiveContainer width="100%" height={320}>
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensionScores}>
                            <PolarGrid stroke="#e2e8f0" strokeOpacity={0.8} />
                            <PolarAngleAxis dataKey="shortName" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} />
                            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px]">
                        <Lock className="h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm font-semibold text-slate-600">
                          {lang === "zh" ? "升级 Pro 查看完整雷达图" : "Upgrade to Pro for full radar chart"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card className="border-border/40">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-400">
                        <TrendingUp className="h-5 w-5" />
                        {t(UI.results.strengths, lang)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="space-y-3 blur-sm">
                          {strengths.map((dim) => (
                            <div key={dim.id} className="flex items-center justify-between rounded-xl bg-teal-50 p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100"><Brain className="h-5 w-5 text-teal-600" /></div>
                                <p className="font-medium text-foreground">{dim.name}</p>
                              </div>
                              <Badge className="bg-teal-500 text-white hover:bg-teal-500">{dim.score}%</Badge>
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button onClick={() => setShowPayment(true)} className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500">
                            <Lock className="h-4 w-4" />
                            {lang === "zh" ? "升级 Pro 解锁" : "Unlock with Pro"}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] bg-[#07070d] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-slate-600">
          <a href="/" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
            <Brain className="h-4 w-4" />
            <span className="font-semibold">{lang === "zh" ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <p>© {new Date().getFullYear()} AI Fluency</p>
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
