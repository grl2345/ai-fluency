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
  ArrowRight,
  ChevronRight,
  Users,
  Crown,
  Clock,
  Copy,
  Eye,
  Link2,
  QrCode,
  User,
} from "lucide-react";
import { useSubscription } from "@/components/subscription-provider";
import { useAuth } from "@/components/auth-provider";

interface ResultsPageProps {
  answers: Record<number, string>;
  practicalTexts: Record<string, string>;
  profileData: Record<string, string | string[]>;
  onRetake: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Brain, Target, MessageSquare, CheckCircle, GitMerge, Shield,
};

const DIM_COLORS = ["#818cf8", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa"];

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

function HexBadge({ level, size = 120 }: { level: number; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Sparkle decorations */}
      <div className="absolute -top-2 -right-1 h-2 w-2 rotate-45 bg-white/30" />
      <div className="absolute -top-3 right-6 h-1.5 w-1.5 rotate-45 bg-white/20" />
      <div className="absolute top-2 -right-3 h-1 w-1 rotate-45 bg-white/25" />
      <div className="absolute -bottom-1 left-4 h-1.5 w-1.5 rotate-45 bg-white/15" />
      <div className="absolute bottom-4 -left-2 h-1 w-1 rotate-45 bg-white/20" />
      {/* Hex shape via clip-path */}
      <div
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700"
        style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
      >
        <span className="text-4xl font-black text-white" style={{ fontSize: size * 0.32 }}>
          L{level}
        </span>
      </div>
      {/* Glow */}
      <div className="absolute inset-0 bg-violet-500/20 blur-2xl" style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }} />
    </div>
  );
}


function QRCodePlaceholder() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1">
      <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-[1px]">
        {Array.from({ length: 49 }).map((_, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
          const filled = isCorner || Math.random() > 0.5;
          return (
            <div key={i} className={`${filled ? "bg-gray-900" : "bg-white"}`} />
          );
        })}
      </div>
    </div>
  );
}

export function ResultsPage({ answers, practicalTexts, profileData, onRetake }: ResultsPageProps) {
  const { lang } = useLang();
  const { isPro, isTeam } = useSubscription();
  const { user } = useAuth();
  const hasPro = isPro || isTeam;
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const zh = lang === "zh";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || (zh ? "用户" : "User");

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
    return Object.entries(scores).map(([id, data], i) => {
      const dimension = dimensions.find((d) => d.id === id)!;
      const percentage = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;
      const nameStr = dimension.name[lang];
      const shortName = lang === "zh" ? nameStr.slice(0, 4) : nameStr.slice(0, 8);
      return { id, name: nameStr, shortName, score: Math.min(100, percentage), fullMark: 100, color: DIM_COLORS[i] };
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
  const topStrength = sortedDimensions[0];
  const focusArea = sortedDimensions[sortedDimensions.length - 1];
  const weaknesses = sortedDimensions.slice(-3).reverse();

  const percentile = useMemo(() => {
    if (mainTier <= 1) return 38;
    if (mainTier === 2) return 55;
    if (mainTier === 3) return 72;
    if (mainTier === 4) return 88;
    return 95;
  }, [mainTier]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a1a]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">{zh ? "AI 素养" : "AI Fluency"}</span>
            </a>
            <div className="hidden items-center gap-1 md:flex">
              {(zh ? ["总览", "学习", "排行榜", "关于"] : ["Dashboard", "Learn", "Leaderboard", "About"]).map((item) => (
                <span key={item} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300 cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRetake} className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06]">
              <RefreshCw className="h-3 w-3" />
              {zh ? "重新测评" : "Retake Test"}
            </button>
            <button onClick={handleCopyLink} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-indigo-400 hover:to-violet-400">
              <Share2 className="h-3 w-3" />
              {zh ? "分享结果" : "Share Result"}
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* ── Row 1: Hero Identity + Share Identity Card ── */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Hero Identity Card — spans 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#16163a] via-[#12122a] to-[#1a1240] p-6 lg:col-span-3"
          >
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-[80px]" />
            <div className="absolute -right-8 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-[60px]" />

            <div className="relative flex flex-col md:flex-row md:items-start md:gap-6">
              {/* Left side: text info */}
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  {zh ? "你的 AI 身份" : "YOUR AI IDENTITY"}
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white md:text-3xl">{currentLevel.name[lang]}</h1>
                  <span className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-2.5 py-1 text-[11px] font-bold text-white">
                    LEVEL {mainTier}
                  </span>
                </div>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                  {currentLevel.description[lang]}
                  {zh ? "。继续加油——你已经超过了大多数人！" : ". Keep going — you're ahead of most people!"}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{zh ? "AI 素养得分" : "AI SCORE"}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white tabular-nums"><AnimatedScore value={totalScore} delay={0.3} /></span>
                      <span className="text-sm text-slate-500">/100</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{zh ? "超过了" : "You scored higher than"}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-emerald-400 tabular-nums">{percentile}%</span>
                      <span className="text-sm text-slate-500">{zh ? "的用户" : "of people"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side: Hex badge + Next Level info */}
              <div className="mt-6 flex flex-col items-center gap-4 md:mt-0">
                <HexBadge level={mainTier} size={110} />
                {nextLevel && (
                  <div className="w-full rounded-xl bg-white/[0.04] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{zh ? "下一等级" : "NEXT LEVEL"}</p>
                    <p className="mt-1 text-sm font-bold text-white">{nextLevel.name[lang]} ({nextLevel.badge})</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-amber-400 tabular-nums">{nextLevelGap}</span>
                      <span className="text-xs text-slate-500">{zh ? "分即可升级" : "points to go"}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalScore / (nextLevel.minScore)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      />
                    </div>
                    <p className="mt-1.5 text-right text-[10px] tabular-nums text-slate-500">{totalScore}/{nextLevel.minScore}</p>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {zh ? "提升以下关键能力即可升级！🚀" : "Keep improving in these key areas to level up! 🚀"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Share Your AI Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#12122a] p-5 lg:col-span-2"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
              {zh ? "分享你的 AI 身份" : "SHARE YOUR AI IDENTITY"}
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              {zh ? "展示你的得分，邀请好友来挑战！" : "Show off your score and challenge your friends to beat it!"}
            </p>

            {/* Identity Card Preview */}
            <div className="mt-3 flex-1 rounded-xl bg-gradient-to-br from-[#1a1a3e] to-[#0e0e28] border border-white/[0.08] p-4 relative overflow-hidden">
              {/* Mini card header */}
              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-violet-600">
                  <Brain className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-[9px] font-bold text-slate-400">{zh ? "AI 素养" : "AI Fluency"}</span>
              </div>

              {/* User name */}
              <p className="mt-2 text-sm font-extrabold text-white">{userName}</p>

              <div className="mt-1 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-300">{currentLevel.name[lang]}</p>
                  <span className="mt-1 inline-block rounded bg-gradient-to-r from-indigo-500 to-violet-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                    LEVEL {mainTier}
                  </span>
                  <div className="mt-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{zh ? "AI 得分" : "AI SCORE"}</p>
                    <p className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-black text-white tabular-nums">{totalScore}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {zh ? "超过了" : "You're ahead of"}{" "}
                    <span className="font-bold text-emerald-400">{percentile}%</span>{" "}
                    {zh ? "的用户" : "of people"}
                  </p>
                </div>
              </div>

              {/* QR Code area */}
              <div className="mt-2 flex items-end justify-between">
                <p className="text-[9px] text-slate-500 max-w-[100px] leading-tight">
                  {zh ? "扫码发现你的 AI 等级" : "Scan to discover your AI level"} ↗
                </p>
                <QRCodePlaceholder />
              </div>
            </div>

            {/* Preview button */}
            <button className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
              <Eye className="h-3.5 w-3.5" />
              {zh ? "预览身份卡" : "Preview Identity Card"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        </div>

        {/* ── CTA Buttons + Social Proof ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-400 hover:to-violet-400">
              <Award className="h-4 w-4" />
              {zh ? "生成 AI 身份卡" : "Create My AI Identity Card"}
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.06]"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
              {copied ? (zh ? "已复制" : "Copied!") : (zh ? "复制测评链接" : "Copy My Test Link")}
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((bg, i) => (
                <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0a0a1a] ${bg} text-[9px] font-bold text-white`}>
                  {["A", "M", "K", "S"][i]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">
                {zh ? "12,847 人已参加测评。" : "12,847 people have already taken the test."}
              </span>
              <button className="flex items-center gap-0.5 text-xs font-semibold text-indigo-400 underline decoration-indigo-400/30 transition-colors hover:text-indigo-300">
                {zh ? "看看排名！" : "See where you rank!"}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Row 2: AI Powers + Growth Path ── */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* AI Powers — Radar + insights */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12122a] p-6"
          >
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">{zh ? "你的 AI 能力" : "YOUR AI POWERS"}</h3>
            </div>
            <p className="mb-4 text-xs text-slate-500">{zh ? "六大核心 AI 能力分析" : "Breakdown of your core AI skills"}</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Radar with score labels */}
              <div className="relative h-[240px] w-full md:w-[55%]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="68%" data={dimensionScores}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="shortName"
                      tick={({ x, y, payload, index }: { x: number; y: number; payload: { value: string }; index: number }) => {
                        const score = dimensionScores[index]?.score ?? 0;
                        return (
                          <g>
                            <text x={x} y={y} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
                              {payload.value}
                            </text>
                            <text x={x} y={y + 14} textAnchor="middle" fill="#818cf8" fontSize={11} fontWeight={700}>
                              {score}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.12} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400">{zh ? "最强项" : "Top Strength"}</p>
                  <p className="mt-1 text-sm font-bold text-white">{topStrength.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {dimensions.find((d) => d.id === topStrength.id)?.description[lang]}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400">{zh ? "重点提升" : "Focus Area"}</p>
                  <p className="mt-1 text-sm font-bold text-white">{focusArea.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {dimensions.find((d) => d.id === focusArea.id)?.description[lang]}
                  </p>
                </div>
                {hasPro ? (
                  <button className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20">
                    <Sparkles className="h-3 w-3" />
                    {zh ? "查看改进建议" : "View Tips"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20"
                  >
                    <Lock className="h-3 w-3" />
                    {zh ? "升级查看建议" : "View Tips"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Growth Path */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12122a] p-6"
          >
            <div className="mb-1 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">{zh ? "你的 AI 成长路径" : "YOUR AI GROWTH PATH"}</h3>
            </div>
            <p className="mb-5 text-xs text-slate-500">{zh ? "通往 AI 精通之路" : "Your journey to AI mastery"}</p>

            {/* Timeline */}
            <div className="relative mb-6 flex items-center justify-between">
              {levels.map((lvl) => {
                const isActive = lvl.level === mainTier;
                const isPast = lvl.level < mainTier;
                return (
                  <div key={lvl.badge} className="z-10 flex flex-col items-center gap-1.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30"
                        : isPast
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/[0.04] text-slate-600"
                    }`}>
                      {isPast ? <CheckCircle className="h-4 w-4" /> : isActive ? <Sparkles className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-[10px] font-bold ${isActive ? "text-white" : isPast ? "text-emerald-400" : "text-slate-600"}`}>
                      {lvl.badge}
                    </span>
                    <span className={`whitespace-nowrap text-[9px] ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                      {lvl.name[lang]}
                    </span>
                  </div>
                );
              })}
              <div className="absolute left-5 right-5 top-5 h-0.5">
                <div className="absolute inset-0 bg-white/[0.06]" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-indigo-500"
                  style={{ width: `${((mainTier - 0.5) / 4.5) * 100}%` }}
                />
              </div>
            </div>

            {/* Points to next level + improvement areas */}
            {nextLevel && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm text-slate-300">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">{nextLevelGap}</span>
                  <span className="ml-1 text-slate-500">{zh ? `分即可到达 Level ${nextLevel.level}` : `points to reach Level ${nextLevel.level}`}</span>
                </p>
                <div className="space-y-2.5">
                  {weaknesses.slice(0, 3).map((dim) => {
                    const fullDim = dimensions.find((d) => d.id === dim.id);
                    const Icon = iconMap[fullDim?.icon || "Brain"];
                    const boost = Math.max(3, Math.round((100 - dim.score) * 0.12));
                    return (
                      <div key={dim.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {dim.name}
                        </div>
                        <span className="text-xs font-bold text-indigo-400">+{boost}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.06]">
              {zh ? "查看完整成长计划" : "View Full Growth Plan"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>

        {/* ── Row 3: Invite Friends + Leaderboard ── */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Invite Friends Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12122a] p-6"
          >
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">{zh ? "邀请好友，解锁奖励" : "INVITE FRIENDS, UNLOCK REWARDS"} 🎁</h3>
            </div>
            <p className="mb-4 text-xs text-slate-500">{zh ? "邀请更多好友来测试，解锁专属奖励" : "Invite more friends to unlock awesome rewards"}</p>

            {/* Progress bar */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">{zh ? "已邀请" : "Invited"} <span className="text-indigo-400">2</span> / 5 {zh ? "人" : "friends"}</span>
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>

            {/* Reward tiers */}
            <div className="mb-5 flex items-start justify-between gap-2">
              {[
                { n: 1, label: zh ? "分享结果" : "Share result", icon: CheckCircle, unlocked: true },
                { n: 3, label: zh ? "完整雷达图" : "Full Skill Radar", icon: Star, unlocked: false },
                { n: 5, label: zh ? "成长报告 PDF" : "AI Growth Report (PDF)", icon: Award, unlocked: false },
              ].map((tier) => (
                <div key={tier.n} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tier.unlocked ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.04] text-slate-600"}`}>
                    {tier.unlocked ? <CheckCircle className="h-5 w-5" /> : tier.n === 3 ? <Star className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">{tier.n} {zh ? "人" : "Friend" + (tier.n > 1 ? "s" : "")}</p>
                  <p className="text-center text-[9px] text-slate-600">{tier.label}</p>
                </div>
              ))}
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="flex-1 truncate rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
                {typeof window !== "undefined" ? `${window.location.origin}/invite?code=ABC123` : "aifluencycheck.com/invite?code=ABC123"}
              </div>
              <button
                onClick={handleCopyLink}
                className="shrink-0 rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-xs font-bold text-white transition-all hover:from-fuchsia-400 hover:to-violet-400"
              >
                {copied ? (zh ? "已复制" : "Copied") : (zh ? "复制链接" : "Copy Link")}
              </button>
            </div>

            {/* Share via icons */}
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{zh ? "分享至" : "Share via"}</p>
              <div className="flex items-center gap-2">
                {[
                  { label: "WhatsApp", color: "bg-green-500", icon: "W" },
                  { label: "Twitter", color: "bg-sky-500", icon: "𝕏" },
                  { label: "LinkedIn", color: "bg-blue-600", icon: "in" },
                  { label: "Facebook", color: "bg-blue-500", icon: "f" },
                  { label: "Email", color: "bg-slate-600", icon: "✉" },
                  { label: zh ? "更多" : "More", color: "bg-slate-700", icon: "···" },
                ].map((platform) => (
                  <button
                    key={platform.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${platform.color} text-xs font-bold text-white transition-transform hover:scale-110`}
                    title={platform.label}
                  >
                    {platform.icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12122a] p-6"
          >
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">{zh ? "AI 素养排行榜" : "AI FLUENCY LEADERBOARD"}</h3>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
                {zh ? "查看完整排行榜" : "View Full Leaderboard"}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <p className="mb-4 text-xs text-slate-500">{zh ? "看看你在同行中的排名" : "See how you rank among others"}</p>

            {/* Tab buttons */}
            <div className="mb-4 flex gap-2">
              <button className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold text-white">
                {zh ? "按行业" : "By Industry"}
              </button>
              <button className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-slate-500 transition-colors hover:text-slate-300">
                {zh ? "按城市" : "By City"}
              </button>
            </div>

            {/* Leaderboard rows */}
            <div className="space-y-2.5">
              {(zh
                ? [{ role: "开发者", score: 62 }, { role: "产品经理", score: 58 }, { role: "数据分析师", score: 51 }, { role: "市场营销", score: 44 }, { role: "设计师", score: 39 }]
                : [{ role: "Developers", score: 62 }, { role: "Product Managers", score: 58 }, { role: "Data Analysts", score: 51 }, { role: "Marketers", score: 44 }, { role: "Designers", score: 39 }]
              ).map((item, i) => (
                <div key={item.role} className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${i < 3 ? "bg-amber-400/15 text-amber-400" : "text-slate-600"}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-xs text-slate-300">{item.role}</span>
                  <div className="w-28 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="w-6 text-right text-xs font-bold tabular-nums text-slate-400">{item.score}</span>
                </div>
              ))}
            </div>

            {/* Your rank */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="text-xs font-bold text-slate-300">{zh ? "你的排名" : "Your Rank"}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Top {100 - percentile}%</span>
                <span className="text-lg font-black text-white tabular-nums">{totalScore}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Pro CTA Banner ── */}
        {!hasPro && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e1048] via-[#18103a] to-[#1e1048] border border-violet-500/20"
          >
            <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {zh ? "想解锁你的完整潜力？" : "Want to unlock your full potential?"}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {zh ? "升级 Pro 获取深度分析、个性化学习路径和高级 AI 工具" : "Upgrade to Pro and get detailed insights, personalized learning paths, and advanced AI tools."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:from-fuchsia-400 hover:to-violet-400"
              >
                <Sparkles className="h-4 w-4" />
                {t(UI.results.unlockCta, lang)}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-8 border-t border-white/[0.06] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <a href="/" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-semibold">{zh ? "AI 素养" : "AI Fluency"}</span>
          </a>
          <p className="text-xs text-slate-600">
            {zh ? "让每个人的 AI 之旅更简单" : "Making AI simple for everyone."}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="/privacy" className="transition-colors hover:text-slate-400">{zh ? "隐私政策" : "Privacy Policy"}</a>
            <a href="/terms" className="transition-colors hover:text-slate-400">{zh ? "服务条款" : "Terms of Service"}</a>
          </div>
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
