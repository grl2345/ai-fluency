"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { levels } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { NavAuthMenu, redirectToSignIn } from "@/components/auth-ui";
import { useAuth } from "@/components/auth-provider";
import {
  Brain, ChevronRight, ArrowRight, MessageSquare,
  CheckCircle2, Shield, Check,
  ChevronDown, ChevronUp, Play, Sparkles, Star, Layers, Activity, BarChart3,
  Globe, Zap, Wrench,
} from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { useSubscription } from "@/components/subscription-provider";
import { isHigherPlan, type PlanKey } from "@/lib/plans";
import { planDisplayName } from "@/lib/subscription";

interface LandingPageProps {
  onStartTest: () => void;
  authLoading?: boolean;
  isAuthenticated?: boolean;
}

const TESTIMONIALS = [
  {
    quote: {
      en: "I thought I was good at using AI until this assessment showed me exactly where my blind spots were. The dimension breakdown is eye-opening — I leveled up noticeably within two weeks.",
      zh: "我一直以为自己很擅长用 AI，直到这份测评让我清楚地看到了盲区。按维度拆解的报告令人大开眼界——两周内能力有了明显提升。",
    },
    name: "Sarah C.",
    role: { en: "Product Manager", zh: "产品经理" },
    level: "L4",
    avatarSeed: "SarahC",
    avatarBg: "b6e3f4",
  },
  {
    quote: {
      en: "My team took the assessment together. The results gave us a shared language for AI skills and a concrete roadmap for upskilling. One of the most useful exercises we've done as a team.",
      zh: "我的团队一起完成了测评。结果让我们建立了共同的 AI 能力话语体系，并有了清晰的提升路径。这是我们做过的最有价值的团队活动之一。",
    },
    name: "Marcus R.",
    role: { en: "Engineering Lead", zh: "工程主管" },
    level: "L5",
    avatarSeed: "MarcusR",
    avatarBg: "c0aede",
  },
  {
    quote: {
      en: "The practical questions are what set this apart. You can't bluff your way through — they actually test how you think. I finally have an honest, concrete picture of my AI skills.",
      zh: "实操题是这份测评与其他测验的最大区别。你没办法糊弄过去——它真的在测试你的思维方式。我终于对自己的 AI 能力有了诚实、清晰的认知。",
    },
    name: "Priya N.",
    role: { en: "Data Scientist", zh: "数据科学家" },
    level: "L5",
    avatarSeed: "PriyaN",
    avatarBg: "c3f4c8",
  },
];

const FAQS = [
  {
    q: { en: "How long does the assessment take?", zh: "测评需要多长时间？" },
    a: { en: "About 15 minutes. You can pause and come back — your answers are saved automatically.", zh: "大约 15 分钟。你可以中途暂停，答案会自动保存。" },
  },
  {
    q: { en: "Can I cancel anytime?", zh: "可以随时取消订阅吗？" },
    a: { en: "Yes. Cancel from your account page anytime. You keep access until the end of the current billing period.", zh: "可以。在账户页面随时取消，当前计费周期结束前仍可继续使用。" },
  },
  {
    q: { en: "Who designed the questions?", zh: "题目是谁设计的？" },
    a: { en: "Questions were developed by a team of AI researchers, learning scientists, and industry practitioners. The framework draws on published AI literacy research and is reviewed regularly as the AI landscape evolves.", zh: "题目由 AI 研究员、学习科学家和行业从业者联合设计，框架参考已发表的 AI 素养研究，并随 AI 领域发展定期更新。" },
  },
  {
    q: { en: "How is my level calculated?", zh: "等级是如何计算的？" },
    a: { en: "Your level is determined by three inputs: knowledge questions, scenario-based behavioral signals, and open-ended practical tasks. The combination gives a holistic picture that a simple quiz can't capture.", zh: "等级由三个维度综合计算：知识题、基于情境的行为信号、以及开放性实操任务。三者结合，形成普通测验无法捕捉的全面画像。" },
  },
  {
    q: { en: "Can I share my results with my employer?", zh: "我可以把结果分享给雇主吗？" },
    a: { en: "Yes. You can screenshot your results page and share it. Pro users get full dimension breakdowns they can share with employers or on LinkedIn.", zh: "可以。你可以截图分享结果页。Pro 用户可获取完整维度分析，分享给雇主或发布到 LinkedIn。" },
  },
  {
    q: { en: "What makes this different from other AI literacy tests?", zh: "这和其他 AI 测评有什么不同？" },
    a: { en: "Most quizzes only test factual recall. We test how you think — through scenario questions where all answers are plausible and practical open-ended tasks that reveal your real workflow. The result is a diagnostic, not a score.", zh: "大多数测验只考察事实记忆。我们测试你的思维方式——通过所有选项都合理的情境题，以及能揭示你真实工作流程的开放式任务。结果是诊断报告，而非单纯得分。" },
  },
];

// Brand wordmarks for the trust strip (rendered as styled text)
const ORGS = ["Google", "Meta", "OpenAI", "Shopify", "Microsoft", "Notion", "Canva"];

// Marketing-facing competency dimensions shown on the landing page.
const DISPLAY_DIMENSIONS = [
  { icon: MessageSquare, name: { zh: "提示工程", en: "Prompt Engineering" }, desc: { zh: "精准描述需求，引导 AI 输出高质量结果", en: "Frame requests precisely to get high-quality AI output" } },
  { icon: CheckCircle2, name: { zh: "评估判断", en: "Evaluation" }, desc: { zh: "批判性评估 AI 输出的质量与可信度", en: "Critically assess the quality and reliability of outputs" } },
  { icon: Zap, name: { zh: "自动化", en: "Automation" }, desc: { zh: "利用 AI 优化流程，提升整体效率", en: "Streamline workflows with AI to boost efficiency" } },
  { icon: Brain, name: { zh: "推理能力", en: "Reasoning" }, desc: { zh: "运用 AI 进行复杂推理与决策", en: "Use AI for complex reasoning and decision-making" } },
  { icon: Wrench, name: { zh: "工具使用", en: "Tool Usage" }, desc: { zh: "高效驾驭各类 AI 工具与生态", en: "Skillfully wield the full ecosystem of AI tools" } },
  { icon: Shield, name: { zh: "风险意识", en: "Risk Awareness" }, desc: { zh: "识别潜在风险，安全合规地使用 AI", en: "Spot risks and use AI safely and responsibly" } },
];

// Demo radar values for the hero report card (clockwise from top).
const RADAR = [
  { name: { zh: "提示工程", en: "Prompting" }, v: 94 },
  { name: { zh: "评估判断", en: "Evaluation" }, v: 90 },
  { name: { zh: "自动化", en: "Automation" }, v: 89 },
  { name: { zh: "工具使用", en: "Tool Usage" }, v: 85 },
  { name: { zh: "风险意识", en: "Risk" }, v: 91 },
  { name: { zh: "推理能力", en: "Reasoning" }, v: 88 },
];

const SCORE = 92;

function ScoreRing() {
  const R = 78;
  return (
    <div className="relative flex h-[176px] w-[176px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <motion.circle
          cx="100" cy="100" r={R} fill="none" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: SCORE / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-[44px] font-black leading-none text-transparent tabular-nums">
          {SCORE}
        </span>
      </div>
    </div>
  );
}

// Isometric 3D staircase illustrating the five proficiency levels.
function Staircase() {
  const N = 5;
  const U = 26;          // unit size in px
  const D = 2.3;         // step depth (in units)
  const OX = 70, OY = 250;
  const P = (x: number, y: number, z: number) =>
    `${(OX + (x - y) * 0.866 * U).toFixed(1)},${(OY + (x + y) * 0.5 * U - z * U).toFixed(1)}`;

  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[360px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-[80px]" />
      <svg viewBox="0 0 360 300" className="relative h-full w-full">
        {Array.from({ length: N }).map((_, i) => {
          const x0 = i, x1 = i + 1, y0 = 0, y1 = D, h = i + 1;
          const top = `${P(x0, y0, h)} ${P(x1, y0, h)} ${P(x1, y1, h)} ${P(x0, y1, h)}`;
          const right = `${P(x1, y0, 0)} ${P(x1, y1, 0)} ${P(x1, y1, h)} ${P(x1, y0, h)}`;
          const left = `${P(x0, y1, 0)} ${P(x1, y1, 0)} ${P(x1, y1, h)} ${P(x0, y1, h)}`;
          const labelX = OX + (x0 + 0.5 - (y0 + D / 2)) * 0.866 * U;
          const labelY = OY + (x0 + 0.5 + y0 + D / 2) * 0.5 * U - h * U + 4;
          return (
            <g key={i}>
              <polygon points={left} fill="#4c1d95" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
              <polygon points={right} fill="#6d28d9" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
              <polygon points={top} fill="#a78bfa" stroke="rgba(221,214,254,0.6)" strokeWidth="1" />
              <text x={labelX} y={labelY} textAnchor="middle" className="fill-white font-black" style={{ fontSize: 15 }}>
                L{i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LandingPage({ onStartTest, authLoading = false, isAuthenticated = false }: LandingPageProps) {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, refresh } = useSubscription();
  const { lang, setLang } = useLang();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [paymentPlan, setPaymentPlan] = React.useState<PlanKey | null>(null);
  const [subscribeToast, setSubscribeToast] = React.useState<PlanKey | null>(null);

  const startLabel = isAuthenticated ? t(UI.nav.startTest, lang) : t(UI.nav.startTestGuest, lang);
  const startDisabled = authLoading;

  const radarData = RADAR.map((r) => ({ dim: r.name[lang], v: r.v }));

  const navLinks = [
    { href: "#how", label: lang === "zh" ? "如何测评" : "How it works" },
    { href: "#dimensions", label: lang === "zh" ? "测评内容" : "What we measure" },
    { href: "#pricing", label: t(UI.nav.pricing, lang) },
    { href: "#faq", label: lang === "zh" ? "资源" : "Resources" },
  ];

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 antialiased">

      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a16]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Brain className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">{t(UI.nav.brand, lang)}</span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Globe className="h-4 w-4" />
              {lang === "zh" ? "中文" : "EN"}
            </button>
            {user && <NavAuthMenu variant="dark" />}
            <button
              onClick={onStartTest}
              disabled={startDisabled}
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50"
            >
              {startLabel}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute left-[8%] top-[6%] h-[460px] w-[460px] rounded-full bg-indigo-600/20 blur-[150px]" />
        <div className="pointer-events-none absolute right-[4%] top-[30%] h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute left-[45%] top-[60%] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">

            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-200 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                {lang === "zh" ? "AI 素养评估" : "AI Fluency Assessment"}
              </span>

              <h1 className="mt-6 text-[52px] font-black leading-[0.98] tracking-tight text-white md:text-[68px]">
                {lang === "zh" ? (
                  <>看清你的<br /><span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI 实力</span></>
                ) : (
                  <>Know Your<br /><span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI Edge</span></>
                )}
              </h1>

              <p className="mt-6 max-w-[440px] text-lg leading-relaxed text-slate-400">
                {lang === "zh"
                  ? "发现你的优势，识别你的 AI 盲点，让 AI 真正成为你的竞争力。"
                  : "Discover your strengths, spot your AI blind spots, and turn AI into your real competitive edge."}
              </p>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-3.5">
                <div className="flex -space-x-2.5">
                  {["AvA", "BvB", "CvC", "DvD"].map((seed, i) => (
                    <img
                      key={seed}
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&radius=50`}
                      alt=""
                      className="h-9 w-9 rounded-full border-2 border-[#0a0a16] bg-slate-700"
                      style={{ zIndex: 10 - i }}
                    />
                  ))}
                  <div className="z-0 flex h-9 items-center justify-center rounded-full border-2 border-[#0a0a16] bg-indigo-500/20 px-2.5 text-[11px] font-bold text-indigo-200">
                    12K+
                  </div>
                </div>
                <p className="text-sm leading-tight text-slate-400">
                  {lang === "zh" ? <>超过 12,000+ 专业人士<br />已完成测评</> : <>12,000+ professionals<br />have taken the test</>}
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 text-[15px] font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/50 active:scale-[0.98] disabled:opacity-60"
                >
                  {lang === "zh" ? "开始测评" : "Start Assessment"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 text-[15px] font-semibold text-white/80 transition-all hover:border-white/25 hover:bg-white/[0.07] hover:text-white disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {t(UI.hero.ctaSecondary, lang)}
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" />{lang === "zh" ? "约 15 分钟" : "~15 minutes"}</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" />{lang === "zh" ? "即时生成报告" : "Instant report"}</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400" />{lang === "zh" ? "安全保密" : "Secure & private"}</span>
              </div>
            </motion.div>

            {/* Right: report card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent blur-2xl" />
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-2xl shadow-black/50 backdrop-blur-md md:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {lang === "zh" ? "你的 AI 实力报告" : "Your AI Fluency Report"}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                    {lang === "zh" ? "优秀" : "EXCELLENT"}
                  </span>
                </div>

                <div className="mt-6 grid items-center gap-4 sm:grid-cols-2">
                  {/* Score ring */}
                  <div className="flex flex-col items-center">
                    <ScoreRing />
                    <p className="mt-1 text-xs font-medium text-slate-400">{lang === "zh" ? "AI 实力得分" : "AI Fluency Score"}</p>
                    <p className="text-[11px] text-indigo-300">{lang === "zh" ? "超过 92% 的用户" : "Top 8% of users"}</p>
                  </div>

                  {/* Radar */}
                  <div className="h-[210px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="72%">
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis
                          dataKey="dim"
                          tick={{ fill: "#94a3b8", fontSize: 9 }}
                        />
                        <Radar
                          dataKey="v"
                          stroke="#a78bfa"
                          strokeWidth={2}
                          fill="#818cf8"
                          fillOpacity={0.3}
                          isAnimationActive
                          animationDuration={1200}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insight */}
                <div className="mt-2 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-400/20">
                    <Star className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{lang === "zh" ? "卓越的 AI 思维" : "Exceptional AI Mindset"}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-slate-400">
                      {lang === "zh"
                        ? "你在提示工程、评估判断、自动化方面表现出色，建议继续保持。"
                        : "You excel at prompt engineering, evaluation, and automation — keep it up."}
                    </p>
                  </div>
                  <button
                    onClick={onStartTest}
                    className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-white/25 hover:bg-white/10 lg:flex"
                  >
                    {lang === "zh" ? "查看详细分析" : "View Details"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Framework ── */}
          <div className="mt-24">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-400">
              {lang === "zh" ? "测评体系概览" : "The Assessment Framework"}
            </p>
            <div className="relative mt-8 grid gap-5 md:grid-cols-3 md:gap-0">
              {[
                { icon: Layers, v: "6", t: lang === "zh" ? "大维度" : "Dimensions", d: lang === "zh" ? "核心 AI 能力评估" : "Core AI competency areas" },
                { icon: Activity, v: "42", t: lang === "zh" ? "个信号" : "Signals", d: lang === "zh" ? "行为指标深度分析" : "Behavioral indicators analyzed" },
                { icon: BarChart3, v: "1", t: lang === "zh" ? "份报告" : "AI Fluency Score", d: lang === "zh" ? "全面解读 AI 实力" : "Your overall AI Fluency Index" },
              ].map((c, i) => (
                <React.Fragment key={c.t}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:mx-2"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/15 ring-1 ring-white/10">
                      <c.icon className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black tabular-nums text-white">{c.v}</span>
                        <span className="text-base font-bold text-white">{c.t}</span>
                      </div>
                      <p className="text-[13px] text-slate-400">{c.d}</p>
                    </div>
                  </motion.div>
                  {i < 2 && (
                    <div className="hidden items-center justify-center md:flex">
                      <div className="h-px w-full border-t border-dashed border-white/15" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Org logos ── */}
          <div className="mt-20 border-t border-white/[0.06] pt-12">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {lang === "zh" ? "受到全球领先团队和组织的信任" : "Trusted by leading teams & organizations"}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {ORGS.map((org) => (
                <span
                  key={org}
                  className="text-xl font-semibold tracking-tight text-slate-500/80 transition-colors hover:text-slate-300"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="border-t border-white/[0.06] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
              {lang === "zh" ? "简单三步" : "How it works"}
            </span>
            <h2 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {t(UI.howItWorks.title, lang)}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { n: "01", title: t(UI.howItWorks.step1.title, lang), desc: t(UI.howItWorks.step1.desc, lang) },
              { n: "02", title: t(UI.howItWorks.step2.title, lang), desc: t(UI.howItWorks.step2.desc, lang) },
              { n: "03", title: t(UI.howItWorks.step3.title, lang), desc: t(UI.howItWorks.step3.desc, lang) },
            ].map((item, i) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-7 py-9 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
              >
                <span className="block text-[48px] font-black leading-none tabular-nums text-white/10 select-none">
                  {item.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dimensions ── */}
      <section id="dimensions" className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t(UI.dimensions.sectionTitle, lang)}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate-400">
              {lang === "zh" ? "我们的测评基于全球领先的 AI 素养框架" : t(UI.dimensions.sectionDesc, lang)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-6">
            {DISPLAY_DIMENSIONS.map((dim, i) => {
              const Icon = dim.icon;
              return (
                <motion.div
                  key={dim.name.en}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-indigo-400/30 hover:bg-white/[0.04]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/15 text-indigo-300 ring-1 ring-white/10 transition-all group-hover:from-indigo-500/35 group-hover:to-violet-500/25">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white transition-colors group-hover:text-indigo-200">{dim.name[lang]}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{dim.desc[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Levels ── */}
      <section className="border-t border-white/[0.06] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
              {lang === "zh" ? "能力梯度" : "Proficiency levels"}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {t(UI.levels.sectionTitle, lang)}
            </h2>
            <p className="mt-3 text-[15px] text-slate-400">{t(UI.levels.sectionDesc, lang)}</p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              {levels.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  className="flex items-center gap-5 border-b border-white/[0.06] bg-white/[0.02] px-6 py-4 transition-colors last:border-0 hover:bg-white/[0.05]"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white ${level.color}`}>
                    {level.badge}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-semibold text-white">{level.name[lang]}</span>
                      <span className="text-xs tabular-nums text-slate-500">
                        {level.minScore}–{level.maxScore}{t(UI.levels.points, lang)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm leading-snug text-slate-400">{level.description[lang]}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <Staircase />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
              {t(UI.testimonials.sectionPill, lang)}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {t(UI.testimonials.sectionTitle, lang)}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
              >
                <div className="mb-3 text-3xl font-black leading-none text-white/15 select-none">&ldquo;</div>
                <p className="flex-1 text-[15px] leading-relaxed text-slate-300">{item.quote[lang]}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${item.avatarSeed}&backgroundColor=${item.avatarBg}&radius=50`}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role[lang]}</p>
                  </div>
                  <span className="ml-auto rounded border border-white/15 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                    {item.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-600">
            {lang === "zh"
              ? "以上评价来自早期测试用户，姓名已缩写以保护隐私。头像为插画形象。"
              : "Feedback from early beta testers; names abbreviated for privacy. Avatars are illustrated."}
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative overflow-hidden border-t border-white/[0.06] px-6 py-28 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-300">
              {t(UI.nav.pricing, lang)}
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-[2.75rem] md:leading-tight">
              {t(UI.pricing.title, lang)}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{t(UI.pricing.subtitle, lang)}</p>
            {subscribeToast && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                {t(UI.billing.subscribeSuccess, lang)} {planDisplayName(subscribeToast, lang)}!
                <a href="/account" className="font-semibold text-emerald-200 hover:underline">
                  {t(UI.billing.manageSubscription, lang)} →
                </a>
              </div>
            )}
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {(
              [
                {
                  key: "starter" as const,
                  name: t(UI.pricing.starter.name, lang),
                  price: t(UI.pricing.starter.price, lang),
                  period: t(UI.pricing.starter.period, lang),
                  desc: t(UI.pricing.starter.desc, lang),
                  features: UI.pricing.starter.features[lang] as readonly string[],
                  cta: t(UI.pricing.starter.cta, lang),
                  highlighted: false,
                  isCurrent: hasActiveSubscription && subscription?.plan === "starter",
                  disabled: hasActiveSubscription && subscription ? isHigherPlan(subscription.plan, "starter") : false,
                  action: () => {
                    if (!user) redirectToSignIn("/#pricing");
                    else if (hasActiveSubscription && subscription?.plan === "starter") window.location.href = "/account";
                    else setPaymentPlan("starter");
                  },
                },
                {
                  key: "pro" as const,
                  name: t(UI.pricing.pro.name, lang),
                  price: t(UI.pricing.pro.price, lang),
                  period: t(UI.pricing.pro.period, lang),
                  desc: t(UI.pricing.pro.desc, lang),
                  features: UI.pricing.pro.features[lang] as readonly string[],
                  cta: t(UI.pricing.pro.cta, lang),
                  highlighted: true,
                  isCurrent: hasActiveSubscription && subscription?.plan === "pro",
                  disabled: hasActiveSubscription && subscription ? isHigherPlan(subscription.plan, "pro") : false,
                  action: () => {
                    if (!user) redirectToSignIn("/#pricing");
                    else if (hasActiveSubscription && subscription?.plan === "pro") window.location.href = "/account";
                    else setPaymentPlan("pro");
                  },
                },
                {
                  key: "team" as const,
                  name: t(UI.pricing.team.name, lang),
                  price: t(UI.pricing.team.price, lang),
                  period: t(UI.pricing.team.period, lang),
                  desc: t(UI.pricing.team.desc, lang),
                  features: UI.pricing.team.features[lang] as readonly string[],
                  cta: t(UI.pricing.team.cta, lang),
                  highlighted: false,
                  isCurrent: hasActiveSubscription && subscription?.plan === "team",
                  disabled: false,
                  action: () => {
                    if (hasActiveSubscription && subscription?.plan === "team") {
                      window.location.href = "/account";
                    } else {
                      window.location.href = "mailto:support@aifluency.app?subject=Team%20Plan%20Inquiry";
                    }
                  },
                },
              ] as const
            ).map((plan, i) => {
              const priceMatch = plan.price.match(/^([¥$])([\d.]+)$/);
              const currency = priceMatch?.[1] ?? "";
              const amount = priceMatch?.[2] ?? plan.price;
              const ctaLabel = plan.isCurrent
                ? t(UI.billing.manageSubscription, lang)
                : plan.disabled
                  ? t(UI.billing.includedInHigher, lang)
                  : user
                    ? t(UI.billing.upgradePlan, lang)
                    : plan.cta;

              const tierIndex = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col ${plan.highlighted ? "lg:-mt-4 lg:mb-4" : ""}`}
                >
                  {plan.highlighted && (
                    <div className="pointer-events-none absolute -inset-px -z-10 rounded-[1.4rem] bg-gradient-to-b from-indigo-400/50 via-violet-500/25 to-transparent blur-sm" />
                  )}

                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-[1.3rem] p-7 md:p-8 ${
                      plan.highlighted
                        ? "bg-gradient-to-br from-[#15122b] via-[#120f24] to-[#0c0a18] shadow-[0_24px_80px_-12px_rgba(99,70,229,0.5)] ring-1 ring-indigo-400/30"
                        : "border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
                    )}

                    {(plan.highlighted && !plan.isCurrent) || plan.isCurrent ? (
                      <span
                        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${
                          plan.isCurrent
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25"
                            : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30"
                        }`}
                      >
                        {plan.isCurrent ? t(UI.billing.planBadge, lang) : t(UI.pricing.popular, lang)}
                      </span>
                    ) : null}

                    <div className="mb-8">
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${plan.highlighted ? "text-indigo-300/70" : "text-slate-500"}`}>
                        {tierIndex}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{plan.name}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{plan.desc}</p>
                    </div>

                    <div className={`mb-8 border-b pb-8 ${plan.highlighted ? "border-white/[0.08]" : "border-white/[0.06]"}`}>
                      <div className="flex items-end gap-0.5">
                        {currency && (
                          <span className="mb-2 text-lg font-medium text-slate-400">{currency}</span>
                        )}
                        <span className={`text-[3.25rem] font-semibold leading-none tracking-tight tabular-nums ${
                          plan.highlighted ? "bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent" : "text-white"
                        }`}>
                          {amount}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{plan.period}</p>
                    </div>

                    <ul className="flex-1 space-y-3.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span className={`mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                            plan.highlighted ? "bg-indigo-400/15 ring-1 ring-indigo-400/25" : "bg-white/[0.06] ring-1 ring-white/10"
                          }`}>
                            <Check className="h-2.5 w-2.5 stroke-[3] text-indigo-300" />
                          </span>
                          <span className="text-[13px] leading-relaxed text-slate-300">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={plan.action}
                      disabled={plan.disabled}
                      className={`mt-8 w-full rounded-full py-3 text-[13px] font-semibold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                        plan.isCurrent
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          : plan.disabled
                            ? "border border-white/10 bg-white/[0.03] text-slate-500"
                            : plan.highlighted
                              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-400"
                              : "border border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      {ctaLabel}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t(UI.faq.sectionTitle, lang)}
            </h2>
            <p className="mt-3 text-[15px] text-slate-400">{t(UI.faq.sectionDesc, lang)}</p>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="h-fit overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-[15px] font-semibold text-white">{faq.q[lang]}</span>
                  {openFaq === i
                    ? <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    : <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-[14px] leading-relaxed text-slate-400">{faq.a[lang]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-white/[0.06] px-6 py-28 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
            {lang === "zh" ? "现在就开始" : "Get started today"}
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            {t(UI.cta.title, lang)}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-400">{t(UI.cta.subtitle, lang)}</p>
          <button
            onClick={onStartTest}
            disabled={startDisabled}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/50 active:scale-[0.98] disabled:opacity-60"
          >
            {isAuthenticated ? t(UI.cta.btn, lang) : startLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-sm text-slate-500">
            {t(UI.hero.noCard, lang)} · {lang === "zh" ? "15 分钟" : "15 minutes"}
          </p>
        </div>
      </section>

      {/* ── Payment Modal ── */}
      {paymentPlan && (
        <PaymentModal
          plan={paymentPlan}
          onClose={() => setPaymentPlan(null)}
          onSuccess={async (plan) => {
            setPaymentPlan(null);
            setSubscribeToast(plan);
            await refresh();
            document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Brain className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="font-bold text-white">{t(UI.nav.brand, lang)}</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="mailto:support@aifluency.app" className="transition-colors hover:text-white">{lang === "zh" ? "帮助中心" : "Help Center"}</a>
            <a href="#" className="transition-colors hover:text-white">{lang === "zh" ? "隐私政策" : "Privacy Policy"}</a>
            <a href="#" className="transition-colors hover:text-white">{lang === "zh" ? "服务条款" : "Terms of Service"}</a>
          </div>
          <p className="text-slate-600">
            © 2024 {t(UI.nav.brand, lang)}. {lang === "zh" ? "保留所有权利" : "All rights reserved"}
          </p>
        </div>
      </footer>

    </div>
  );
}
