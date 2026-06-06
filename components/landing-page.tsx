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
  Globe, Zap, Wrench, Lightbulb, LayoutGrid, Crown,
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
      en: "The AI Fluency assessment revealed many blind spots I didn't know I had. The gains in evaluation and judgment alone were huge!",
      zh: "AI 实力测评帮我发现了很多盲点，特别是在评估判断方面收获很大！",
    },
    name: "Sarah C.",
    role: { en: "Product Manager", zh: "产品经理" },
    avatarSeed: "SarahC",
    avatarBg: "b6e3f4",
  },
  {
    quote: {
      en: "The report is incredibly detailed, and the suggestions are very practical. I've already improved my work efficiency noticeably by following them.",
      zh: "报告非常详细，建议也很具体，已经按照建议提升了不少工作效率。",
    },
    name: "Marcus H.",
    role: { en: "Data Analyst", zh: "数据分析师" },
    avatarSeed: "MarcusH",
    avatarBg: "c0aede",
  },
  {
    quote: {
      en: "This assessment framework is truly professional and covers all the core AI competencies our team needs.",
      zh: "这个测评体系非常专业，覆盖了我们团队需要的所有 AI 核心能力。",
    },
    name: "Priya K.",
    role: { en: "Technical Director", zh: "技术总监" },
    avatarSeed: "PriyaK",
    avatarBg: "c3f4c8",
  },
];

const FAQS = [
  {
    q: { en: "How long does the assessment take?", zh: "测评需要多长时间？" },
    a: { en: "About 15 minutes. You can pause and come back — your answers are saved automatically.", zh: "大约 15 分钟。你可以中途暂停，答案会自动保存。" },
  },
  {
    q: { en: "How accurate are the results?", zh: "测评结果的准确性如何？" },
    a: { en: "Our framework combines knowledge, scenario, and practical questions to assess real competency — not just recall. Results reflect how you actually think and work with AI.", zh: "我们的框架结合知识题、情境题和实操题来评估真实能力——而非单纯记忆。结果反映你实际运用 AI 的思维方式。" },
  },
  {
    q: { en: "Can I pause and resume later?", zh: "可以随时暂停继续吗？" },
    a: { en: "Yes. Your progress is saved automatically. You can close the browser and pick up right where you left off.", zh: "可以。你的进度会自动保存，关闭浏览器后也能从上次的位置继续。" },
  },
  {
    q: { en: "Will my data be shared?", zh: "我的数据会被分享吗？" },
    a: { en: "No. Your answers and results are private. We never share individual data with third parties.", zh: "不会。你的作答和结果完全私密，我们绝不会将个人数据分享给第三方。" },
  },
  {
    q: { en: "How many questions are there?", zh: "题目数量有多少？" },
    a: { en: "The assessment includes about 18 questions across three formats: knowledge, scenario-based, and practical open-ended tasks.", zh: "测评包含约 18 道题，涵盖知识题、情境题和开放式实操题三种题型。" },
  },
  {
    q: { en: "How can I get more help?", zh: "如何获得更多帮助？" },
    a: { en: "Pro subscribers get email support. You can also reach us at support@aifluency.app for any questions.", zh: "Pro 用户可获得邮件支持。你也可以通过 support@aifluency.app 联系我们。" },
  },
  {
    q: { en: "How long are reports kept?", zh: "报告会保存多久？" },
    a: { en: "Your reports are stored permanently in your account. You can revisit them anytime.", zh: "你的报告会永久保存在账户中，随时可以回顾。" },
  },
  {
    q: { en: "Do you support team or org assessments?", zh: "支持团队或组织测评吗？" },
    a: { en: "Yes! Our Team plan includes a team dashboard, member management, and bulk report exports. Contact us for details.", zh: "支持！团队版包含团队看板、成员管理和批量导出报告等功能，欢迎联系我们了解详情。" },
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

const STEP_NAMES = [
  { zh: "初学者", en: "Beginner" },
  { zh: "工具用户", en: "Tool User" },
  { zh: "应用者", en: "Prompter" },
  { zh: "精通者", en: "Advanced" },
  { zh: "专家", en: "Expert" },
];

// Per-level face palette (blue → teal → cyan → indigo → violet)
const STEP_PALETTE = [
  { topA: "#6f8bff", topB: "#3f56d4", fA: "#4d63e6", fB: "#26329e", lA: "#2b389e", lB: "#19206a", edge: "#bccaff", halo: "#4f6bf0", badge: "#3a52d6", icon: "#dbe6ff" },
  { topA: "#4fe9d7", topB: "#13b3a1", fA: "#1ec9b6", fB: "#0b8074", lA: "#0c8174", lB: "#06564f", edge: "#a8f6ec", halo: "#17c4b2", badge: "#0e9e8e", icon: "#d4fff9" },
  { topA: "#67caff", topB: "#2897e4", fA: "#33a4ec", fB: "#146eb2", lA: "#135d9a", lB: "#0b4069", edge: "#bce6ff", halo: "#37a5ec", badge: "#1f8ad6", icon: "#ddf1ff" },
  { topA: "#948fff", topB: "#5851e6", fA: "#6760ef", fB: "#3a35ad", lA: "#312a90", lB: "#1f1a60", edge: "#cfcbff", halo: "#6760ef", badge: "#4f48d6", icon: "#e3e0ff" },
  { topA: "#d4a0ff", topB: "#9656f6", fA: "#a96cf9", fB: "#6c30c6", lA: "#5a28a8", lB: "#3c1a76", edge: "#eddaff", halo: "#b06cf9", badge: "#8e4ef0", icon: "#f4e9ff" },
];

const STEP_ICONS = [Lightbulb, Layers, Wrench, LayoutGrid, Crown];

function Staircase({ lang }: { lang: "zh" | "en" }) {
  // Isometric projection ─ blocks advance +1 in X and +1 in base Z per step,
  // so the staircase reads as rising up-and-to-the-right.
  const U = 50;
  const OX = 70, OY = 352;
  const VBW = 360, VBH = 460;
  const K = 0.866;
  const proj = (x: number, y: number, z: number): [number, number] => [
    OX + (x - y) * K * U,
    OY + (x + y) * 0.5 * U - z * U,
  ];
  const pt = (x: number, y: number, z: number) => proj(x, y, z).map((n) => n.toFixed(1)).join(",");
  const poly = (...pts: [number, number, number][]) => pts.map((p) => pt(...p)).join(" ");
  const pctOf = (x: number, y: number, z: number) => {
    const [sx, sy] = proj(x, y, z);
    return { left: `${(sx / VBW) * 100}%`, top: `${(sy / VBH) * 100}%` };
  };

  // Geometry per block (front-to-back index i)
  const blocks = Array.from({ length: 5 }).map((_, i) => {
    const x0 = i, x1 = i + 1, y0 = 0, y1 = 1;
    const bz = i;                         // base rises one unit per step
    const h = 2.0 + i * 0.45;             // blocks grow taller toward the top
    const tz = bz + h;
    return { i, x0, x1, y0, y1, bz, tz };
  });

  return (
    <div className="relative mx-auto aspect-[360/460] w-full max-w-[440px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-[6%] top-[8%] h-[55%] w-[60%] rounded-full bg-violet-600/30 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[10%] h-[40%] w-[55%] rounded-full bg-indigo-600/20 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-[24%] right-[28%] h-[24%] w-[30%] rounded-full bg-cyan-400/15 blur-[60px]" />

      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="relative h-full w-full overflow-visible drop-shadow-[0_8px_40px_rgba(124,58,237,0.35)]"
      >
        <defs>
          {STEP_PALETTE.map((p, i) => (
            <React.Fragment key={`grad${i}`}>
              <linearGradient id={`top${i}`} x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor={p.topA} />
                <stop offset="100%" stopColor={p.topB} />
              </linearGradient>
              <linearGradient id={`front${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={p.fA} stopOpacity="0.96" />
                <stop offset="100%" stopColor={p.fB} stopOpacity="0.92" />
              </linearGradient>
              <linearGradient id={`left${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={p.lA} stopOpacity="0.95" />
                <stop offset="100%" stopColor={p.lB} stopOpacity="0.92" />
              </linearGradient>
            </React.Fragment>
          ))}
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="swoosh" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="55%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
          </linearGradient>
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floor reflection */}
        <ellipse cx="160" cy="396" rx="150" ry="34" fill="url(#floorGlow)" />

        {/* Sweeping base path */}
        <path
          d="M 60 392 C 150 418, 268 404, 322 318"
          fill="none"
          stroke="url(#swoosh)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#edgeGlow)"
        />

        {/* Particle dots */}
        {[
          [300, 120], [322, 168], [338, 210], [286, 96], [250, 70],
          [120, 360], [86, 392], [196, 374], [44, 300], [340, 250],
        ].map(([cx, cy], k) => (
          <circle key={k} cx={cx} cy={cy} r={k % 3 === 0 ? 2 : 1.3} fill="#c4b5fd" opacity={0.5} />
        ))}

        {/* Blocks — drawn back (highest index) to front for correct overlap */}
        {[...blocks].reverse().map(({ i, x0, x1, y0, y1, bz, tz }) => {
          const p = STEP_PALETTE[i];
          const top = poly([x0, y0, tz], [x1, y0, tz], [x1, y1, tz], [x0, y1, tz]);
          const front = poly([x1, y0, bz], [x1, y1, bz], [x1, y1, tz], [x1, y0, tz]);
          const left = poly([x0, y1, bz], [x1, y1, bz], [x1, y1, tz], [x0, y1, tz]);
          const isTop = i === 4;
          const apex: [number, number, number] = [(x0 + x1) / 2, (y0 + y1) / 2, tz + 1.7];

          return (
            <g key={i}>
              {/* Left (icon-side) face */}
              <polygon points={left} fill={`url(#left${i})`} stroke={p.edge} strokeOpacity="0.25" strokeWidth="0.8" />
              {/* Front (label) face */}
              <polygon points={front} fill={`url(#front${i})`} stroke={p.edge} strokeOpacity="0.3" strokeWidth="0.8" />
              {/* Top face */}
              <polygon points={top} fill={`url(#top${i})`} stroke={p.edge} strokeOpacity="0.55" strokeWidth="1" />

              {/* Glowing top edges */}
              <polyline
                points={`${pt(x0, y1, tz)} ${pt(x0, y0, tz)} ${pt(x1, y0, tz)} ${pt(x1, y1, tz)}`}
                fill="none" stroke={p.edge} strokeOpacity="0.85" strokeWidth="1.4"
                strokeLinejoin="round" filter="url(#edgeGlow)"
              />
              {/* Bright front vertical edge */}
              <line
                x1={pt(x1, y0, bz).split(",")[0]} y1={pt(x1, y0, bz).split(",")[1]}
                x2={pt(x1, y0, tz).split(",")[0]} y2={pt(x1, y0, tz).split(",")[1]}
                stroke={p.edge} strokeOpacity="0.5" strokeWidth="1"
              />

              {/* Peaked roof on the top level (L5) */}
              {isTop && (
                <g filter="url(#edgeGlow)">
                  <polygon
                    points={poly([x1, y0, tz], [x1, y1, tz], apex)}
                    fill={`url(#top${i})`} stroke={p.edge} strokeOpacity="0.6" strokeWidth="1"
                  />
                  <polygon
                    points={poly([x0, y1, tz], [x1, y1, tz], apex)}
                    fill={p.fB} fillOpacity="0.92" stroke={p.edge} strokeOpacity="0.45" strokeWidth="1"
                  />
                  <polyline
                    points={`${pt(x1, y0, tz)} ${pt(...apex)} ${pt(x0, y1, tz)}`}
                    fill="none" stroke={p.edge} strokeOpacity="0.9" strokeWidth="1.4" strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* HTML overlay: icon badges + labels (crisp text & icons) */}
      {blocks.map(({ i, x0, x1, y0, y1, bz, tz }) => {
        const p = STEP_PALETTE[i];
        const Icon = STEP_ICONS[i];
        const badge = pctOf((x0 + x1) / 2, y1, tz - 0.62);
        const label = pctOf(x1, (y0 + y1) / 2, bz + (tz - bz) * 0.4);
        return (
          <React.Fragment key={`ov${i}`}>
            {/* Hexagonal icon badge on the left face */}
            <div
              className="pointer-events-none absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                left: badge.left,
                top: badge.top,
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                background: `linear-gradient(160deg, ${p.topA}, ${p.badge})`,
                boxShadow: `0 0 18px ${p.halo}99`,
              }}
            >
              <Icon className="h-[18px] w-[18px]" style={{ color: p.icon }} strokeWidth={2.2} />
            </div>

            {/* L# + name on the front face */}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight"
              style={{ left: label.left, top: label.top }}
            >
              <div
                className="text-[19px] font-black text-white"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.55)" }}
              >
                L{i + 1}
              </div>
              <div
                className="text-[11px] font-medium text-white/90"
                style={{ textShadow: "0 1px 5px rgba(0,0,0,0.6)" }}
              >
                {STEP_NAMES[i][lang]}
              </div>
            </div>
          </React.Fragment>
        );
      })}
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
                {lang === "zh" ? "AI 实力测评" : "AI Fluency Assessment"}
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
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-10 lg:grid-cols-[0.35fr_1fr]">
            <div className="lg:sticky lg:top-28">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
                {lang === "zh" ? "简单三步" : "Three steps"}
              </span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {lang === "zh" ? "如何\n运作" : "How it\nworks"}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: lang === "zh" ? "完成测评" : "Take the Assessment",
                  desc: lang === "zh" ? "回答 42 道题，全面评估你的 AI 实力" : "Answer 42 questions for a complete assessment of your AI skills",
                },
                {
                  n: "02",
                  title: lang === "zh" ? "获得报告" : "Get Your Report",
                  desc: lang === "zh" ? "即刻获得个性化的 AI 实力报告" : "Instantly receive your personalized AI Fluency report",
                },
                {
                  n: "03",
                  title: lang === "zh" ? "开始提升" : "Start Improving",
                  desc: lang === "zh" ? "获取个性化建议，提升你的 AI 能力" : "Get personalized recommendations to advance your AI skills",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-8 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <span className="block text-[48px] font-black leading-none tabular-nums text-indigo-500/20 select-none">
                    {item.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
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
            <p className="mt-3 text-[15px] text-slate-400">
              {lang === "zh"
                ? "从入门到精通，清晰了解你的 AI 实力水平"
                : "From beginner to expert — understand your AI proficiency clearly"}
            </p>
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
              <Staircase lang={lang} />
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
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative overflow-hidden border-t border-white/[0.06] px-6 py-28 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {lang === "zh" ? "准备透明的定价" : "Simple, Transparent Pricing"}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              {lang === "zh" ? "选择适合你的方案，开始提升 AI 实力" : "Choose the plan that fits you, and start building your AI edge"}
            </p>
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
                  : plan.key === "team"
                    ? (lang === "zh" ? "联系我们" : "Contact Us")
                    : (lang === "zh" ? "立即测评" : "Start Now");

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
                      <h3 className="text-xl font-semibold tracking-tight text-white">{plan.name}</h3>
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
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
            {lang === "zh" ? "准备好发现你的 AI 潜力了吗？" : "Ready to discover your AI potential?"}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-400">
            {lang === "zh" ? "现在就开始 AI 实力测评之旅" : "Start your AI Fluency assessment journey now"}
          </p>
          <button
            onClick={onStartTest}
            disabled={startDisabled}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/50 active:scale-[0.98] disabled:opacity-60"
          >
            {lang === "zh" ? "开始你的测评" : "Start Your Assessment"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-sm text-slate-500">
            {lang === "zh" ? "15 分钟即可获得你的 AI 实力报告" : "Get your AI Fluency report in just 15 minutes"}
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
