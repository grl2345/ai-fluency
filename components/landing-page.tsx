"use client";

import React from "react";
import { motion } from "framer-motion";
import { dimensions, levels } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { NavAuthMenu, redirectToSignIn } from "@/components/auth-ui";
import { useAuth } from "@/components/auth-provider";
import {
  Brain, Target, ChevronRight, Star, ArrowRight, MessageSquare,
  CheckCircle2, GitMerge, Shield, TrendingUp, Check,
  ChevronDown, ChevronUp, Play, BarChart3,
} from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { useSubscription } from "@/components/subscription-provider";
import type { PlanKey } from "@/lib/paypal";
import { planDisplayName } from "@/lib/subscription";

interface LandingPageProps {
  onStartTest: () => void;
  authLoading?: boolean;
  isAuthenticated?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Brain, Target, MessageSquare, CheckCircle: CheckCircle2, GitMerge, Shield, TrendingUp,
};

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
    q: { en: "Is the free assessment really free?", zh: "免费测评真的免费吗？" },
    a: { en: "Yes, completely. No credit card required. The free tier includes one full assessment, your radar chart, and five personalized learning recommendations.", zh: "是的，完全免费。无需信用卡。免费版包含一次完整测评、能力雷达图和五条个性化学习建议。" },
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
    a: { en: "Yes. Pro users get a shareable certificate link and a PDF report they can attach to a resume or share on LinkedIn. Free users get a summary they can screenshot.", zh: "可以。Pro 用户可获得可分享的证书链接和 PDF 报告，可附在简历或 LinkedIn 上。免费用户可截图保存摘要。" },
  },
  {
    q: { en: "What makes this different from other AI literacy tests?", zh: "这和其他 AI 测评有什么不同？" },
    a: { en: "Most quizzes only test factual recall. We test how you think — through scenario questions where all answers are plausible and practical open-ended tasks that reveal your real workflow. The result is a diagnostic, not a score.", zh: "大多数测验只考察事实记忆。我们测试你的思维方式——通过所有选项都合理的情境题，以及能揭示你真实工作流程的开放式任务。结果是诊断报告，而非单纯得分。" },
  },
];

export function LandingPage({ onStartTest, authLoading = false, isAuthenticated = false }: LandingPageProps) {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, refresh } = useSubscription();
  const { lang, setLang } = useLang();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [paymentPlan, setPaymentPlan] = React.useState<PlanKey | null>(null);
  const [subscribeToast, setSubscribeToast] = React.useState<PlanKey | null>(null);

  const startLabel = isAuthenticated ? t(UI.nav.startTest, lang) : t(UI.nav.startTestGuest, lang);
  const startDisabled = authLoading;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/8 bg-[#080810]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Brain className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">{t(UI.nav.brand, lang)}</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {[
              { href: "#how", label: lang === "zh" ? "如何运作" : "How it works" },
              { href: "#dimensions", label: lang === "zh" ? "测什么" : "What we measure" },
              { href: "#pricing", label: t(UI.nav.pricing, lang) },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="rounded px-2.5 py-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-300"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
            <NavAuthMenu />
            <button
              onClick={onStartTest}
              disabled={startDisabled}
              className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/15 disabled:opacity-50"
            >
              {startLabel}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero (dark) ── */}
      <section className="relative overflow-hidden bg-[#080810] pt-16">
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Glow */}
        <div className="pointer-events-none absolute left-[30%] top-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-700/20 blur-[130px]" />
        <div className="pointer-events-none absolute right-[10%] top-[40%] h-[360px] w-[360px] rounded-full bg-indigo-900/20 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-0 pt-20 md:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">

            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
                {lang === "zh" ? "AI 素养评估" : "AI Fluency Assessment"}
              </span>

              <h1 className="mt-5 text-[46px] font-black leading-[0.96] tracking-tight text-white md:text-[72px]">
                {lang === "zh" ? (
                  <>你真的懂<br /><span className="text-indigo-400">AI</span><br />吗？</>
                ) : (
                  <>How good<br />are you<br />with <span className="text-indigo-400">AI</span>?</>
                )}
              </h1>

              <p className="mt-7 max-w-[420px] text-lg leading-relaxed text-slate-400">
                {lang === "zh"
                  ? "15 分钟。六大维度。一份诚实的诊断报告。不靠感觉——靠数据。"
                  : "15 minutes. 6 dimensions. An honest diagnostic. Stop guessing — get a precise, personalized report."}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-slate-900 transition-all hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60"
                >
                  {isAuthenticated ? t(UI.hero.cta, lang) : startLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 px-7 text-[15px] font-semibold text-white/65 transition-all hover:border-white/25 hover:text-white/90 disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {t(UI.hero.ctaSecondary, lang)}
                </button>
              </div>

              {!isAuthenticated && !authLoading && (
                <p className="mt-4 text-sm text-slate-600">{t(UI.auth.signInRequired, lang)}</p>
              )}

              {/* Social proof */}
              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/6 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      { seed: "Alex7", bg: "b6e3f4" },
                      { seed: "Jordan3", bg: "c0aede" },
                      { seed: "Riley9", bg: "ffd5dc" },
                      { seed: "Morgan5", bg: "c3f4c8" },
                      { seed: "Taylor2", bg: "fde68a" },
                    ].map(({ seed, bg }) => (
                      <img
                        key={seed}
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=${bg}&radius=50`}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-[#080810]"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[0,1,2,3,4].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{t(UI.hero.socialProof, lang)}</p>
                  </div>
                </div>
                <div className="h-5 w-px bg-white/8" />
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {t(UI.hero.noCard, lang)}
                </div>
              </div>
            </motion.div>

            {/* Right: report card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative mx-auto w-full max-w-sm pb-10"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {lang === "zh" ? "你的 AI 素养报告" : "Your AI Fluency Report"}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {lang === "zh" ? "已完成" : "COMPLETE"}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <span className="text-2xl font-black leading-none text-amber-400">L4</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{lang === "zh" ? "AI 协作者" : "AI Collaborator"}</p>
                    <p className="text-sm text-slate-500">{lang === "zh" ? "超过 78% 的用户" : "Top 22% of users"}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { n: lang === "zh" ? "提示能力" : "Prompting", v: 88 },
                    { n: lang === "zh" ? "输出评估" : "Evaluation", v: 74 },
                    { n: lang === "zh" ? "风险意识" : "Risk Awareness", v: 62 },
                  ].map((d, i) => (
                    <div key={d.n}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-slate-400">{d.n}</span>
                        <span className="font-bold tabular-nums text-white">{d.v}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.v}%` }}
                          transition={{ duration: 1.2, delay: 0.7 + i * 0.15, ease: "easeOut" }}
                          className="h-full rounded-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="absolute -bottom-1 -right-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.06] px-3.5 py-2.5 backdrop-blur-sm"
              >
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">+2 {lang === "zh" ? "等级" : "levels"}</p>
                  <p className="text-[10px] text-slate-500">{lang === "zh" ? "成长空间" : "growth potential"}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Fade to white */}
        <div className="h-24 bg-gradient-to-b from-[#080810] to-white" />
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-slate-100 px-5 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { v: "50K+", l: lang === "zh" ? "已完成测评" : "Assessments taken" },
            { v: "6", l: lang === "zh" ? "能力维度" : "Skill dimensions" },
            { v: "15 min", l: lang === "zh" ? "平均用时" : "Avg. completion time" },
            { v: "4.9 ★", l: lang === "zh" ? "用户评分" : "User rating" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-[32px] font-black tabular-nums text-slate-900">{s.v}</div>
              <div className="mt-1 text-sm text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
              {lang === "zh" ? "简单三步" : "How it works"}
            </span>
            <h2 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight md:text-5xl">
              {t(UI.howItWorks.title, lang)}
            </h2>
          </div>

          <div className="grid gap-px bg-slate-100 md:grid-cols-3">
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
                className="bg-white px-8 py-10"
              >
                <span className="block text-[52px] font-black leading-none tabular-nums text-slate-100 select-none">
                  {item.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dimensions ── */}
      <section id="dimensions" className="border-y border-slate-100 bg-slate-50/40 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 grid gap-6 md:grid-cols-2">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
                {lang === "zh" ? "评估框架" : "Assessment framework"}
              </span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                {t(UI.dimensions.sectionTitle, lang)}
              </h2>
            </div>
            <p className="self-end text-[15px] leading-relaxed text-slate-500 md:pt-8">
              {t(UI.dimensions.sectionDesc, lang)}
            </p>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {dimensions.map((dim, i) => {
              const Icon = iconMap[dim.icon] || Brain;
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="group flex items-start gap-5 px-6 py-5 transition-colors hover:bg-slate-50/70"
                >
                  <span className="mt-0.5 w-7 shrink-0 text-sm font-bold tabular-nums text-slate-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all group-hover:border-indigo-200 group-hover:text-indigo-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {dim.name[lang]}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{dim.description[lang]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Levels ── */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
              {lang === "zh" ? "你会落在哪里" : "Proficiency levels"}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              {t(UI.levels.sectionTitle, lang)}
            </h2>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {levels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className="flex items-center gap-5 bg-white px-6 py-4 transition-colors hover:bg-slate-50/60"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white ${level.color}`}>
                  {level.badge}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-semibold text-slate-900">{level.name[lang]}</span>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {level.minScore}–{level.maxScore}{t(UI.levels.points, lang)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 leading-snug">{level.description[lang]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-slate-100 bg-slate-50/40 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
              {t(UI.testimonials.sectionPill, lang)}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
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
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 text-3xl font-black leading-none text-slate-200 select-none">&ldquo;</div>
                <p className="flex-1 text-[15px] leading-relaxed text-slate-600">
                  {item.quote[lang]}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${item.avatarSeed}&backgroundColor=${item.avatarBg}&radius=50`}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full border border-slate-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.role[lang]}</p>
                  </div>
                  <span className="ml-auto rounded border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                    {item.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-400">
            {lang === "zh"
              ? "以上评价来自真实用户，姓名已缩写以保护隐私。头像为插画形象，与真实用户无关。"
              : "Reviews from real users; names abbreviated for privacy. Avatars are illustrated characters."}
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
              {t(UI.nav.pricing, lang)}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              {t(UI.pricing.title, lang)}
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">{t(UI.pricing.subtitle, lang)}</p>
            {subscribeToast && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                <Check className="h-4 w-4 shrink-0" />
                {t(UI.billing.subscribeSuccess, lang)} {planDisplayName(subscribeToast, lang)}!
                <a href="/account" className="ml-1 font-semibold underline hover:no-underline">
                  {t(UI.billing.manageSubscription, lang)} →
                </a>
              </div>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {(
              [
                {
                  key: "free" as const,
                  name: t(UI.pricing.free.name, lang),
                  price: t(UI.pricing.free.price, lang),
                  period: t(UI.pricing.free.period, lang),
                  desc: t(UI.pricing.free.desc, lang),
                  features: UI.pricing.free.features[lang] as readonly string[],
                  cta: t(UI.pricing.free.cta, lang),
                  highlighted: false,
                  isCurrent: !hasActiveSubscription,
                  disabled: false,
                  action: onStartTest,
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
                  disabled: hasActiveSubscription && subscription?.plan === "team",
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
                    if (!user) redirectToSignIn("/#pricing");
                    else if (hasActiveSubscription && subscription?.plan === "team") window.location.href = "/account";
                    else setPaymentPlan("team");
                  },
                },
              ] as const
            ).map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative flex flex-col rounded-xl p-7 ${
                  plan.highlighted
                    ? "border-2 border-indigo-600 bg-[#080810]"
                    : "border border-slate-200 bg-white"
                }`}
              >
                {plan.highlighted && !plan.isCurrent && (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    {t(UI.pricing.popular, lang)}
                  </span>
                )}
                {plan.isCurrent && (
                  <span className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    {t(UI.billing.planBadge, lang)}
                  </span>
                )}
                <div>
                  <h3 className={`text-base font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-1 text-sm ${plan.highlighted ? "text-slate-500" : "text-slate-500"}`}>
                    {plan.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className={`text-5xl font-black leading-none tracking-tight ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`mb-1.5 text-sm ${plan.highlighted ? "text-slate-600" : "text-slate-400"}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-indigo-400" : "text-indigo-500"}`} />
                      <span className={`text-[14px] ${plan.highlighted ? "text-slate-400" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.action}
                  disabled={plan.disabled}
                  className={`mt-8 w-full rounded-full py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    plan.isCurrent
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : plan.highlighted
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "border border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {plan.isCurrent
                    ? t(UI.billing.manageSubscription, lang)
                    : plan.disabled && plan.key === "pro"
                      ? t(UI.billing.includedInTeam, lang)
                      : (plan.key === "pro" || plan.key === "team") && user
                        ? t(UI.billing.upgradePlan, lang)
                        : plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-slate-100 bg-slate-50/40 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
              {t(UI.faq.sectionPill, lang)}
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              {t(UI.faq.sectionTitle, lang)}
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900">{faq.q[lang]}</span>
                  {openFaq === i
                    ? <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    : <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  }
                </button>
                {openFaq === i && (
                  <div className="pb-5 text-[15px] leading-relaxed text-slate-500">
                    {faq.a[lang]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (dark) ── */}
      <section className="relative overflow-hidden bg-[#080810] px-5 py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700/20 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
            {lang === "zh" ? "现在就开始" : "Get started today"}
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            {t(UI.cta.title, lang)}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-500">{t(UI.cta.subtitle, lang)}</p>
          <button
            onClick={onStartTest}
            disabled={startDisabled}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-bold text-slate-900 transition-all hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60"
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
      <footer className="border-t border-white/6 bg-[#080810] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">{t(UI.nav.brand, lang)}</span>
          </div>
          <p className="text-slate-600">{t(UI.footer.tagline, lang)}</p>
          <p className="text-slate-700">© 2025 {t(UI.nav.brand, lang)}</p>
        </div>
      </footer>

    </div>
  );
}
