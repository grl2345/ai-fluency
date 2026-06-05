"use client";

import { motion } from "framer-motion";
import { dimensions, levels } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { NavAuthMenu, redirectToSignIn } from "@/components/auth-ui";
import { useAuth } from "@/components/auth-provider";
import {
  Brain,
  Clock,
  Target,
  ChevronRight,
  Star,
  BarChart3,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  GitMerge,
  Shield,
  TrendingUp,
  Play,
  Check,
  Sparkles,
} from "lucide-react";

interface LandingPageProps {
  onStartTest: () => void;
  authLoading?: boolean;
  isAuthenticated?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Target,
  MessageSquare,
  CheckCircle: CheckCircle2,
  GitMerge,
  Shield,
  TrendingUp,
};

// Coordinated cool-tone gradients (indigo / violet family)
const DIM_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
  "from-sky-500 to-blue-500",
  "from-purple-500 to-indigo-500",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
      {children}
    </span>
  );
}

export function LandingPage({ onStartTest, authLoading = false, isAuthenticated = false }: LandingPageProps) {
  const { user } = useAuth();
  const { lang, setLang } = useLang();

  const startLabel = isAuthenticated
    ? t(UI.nav.startTest, lang)
    : t(UI.nav.startTestGuest, lang);
  const startDisabled = authLoading;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Nav ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight">{t(UI.nav.brand, lang)}</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              {lang === "zh" ? "怎么测" : "How it works"}
            </a>
            <a href="#dimensions" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              {lang === "zh" ? "测什么" : "What we measure"}
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              {t(UI.nav.pricing, lang)}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>

            <NavAuthMenu />

            <button
              onClick={onStartTest}
              disabled={startDisabled}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startLabel}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Soft gradient mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-indigo-300/30 blur-[120px]" />
          <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-fuchsia-300/25 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-violet-300/20 blur-[110px]" />
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left copy */}
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Pill>
                <Sparkles className="h-3.5 w-3.5" />
                {t(UI.hero.badge, lang)}
              </Pill>

              <h1 className="mt-6 text-[44px] font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                {t(UI.hero.title1, lang)}{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {t(UI.hero.titleHighlight, lang)}
                </span>
                {t(UI.hero.title2, lang)}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                {t(UI.hero.desc, lang)}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAuthenticated ? t(UI.hero.cta, lang) : startLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onStartTest}
                  disabled={startDisabled}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {t(UI.hero.ctaSecondary, lang)}
                </button>
              </div>
              {!isAuthenticated && !authLoading && (
                <p className="mt-3 text-sm text-slate-500">{t(UI.auth.signInRequired, lang)}</p>
              )}

              {/* Trust row */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {["from-indigo-400 to-violet-500", "from-violet-400 to-fuchsia-500", "from-sky-400 to-indigo-500", "from-fuchsia-400 to-pink-500", "from-blue-400 to-indigo-500"].map((g, i) => (
                      <div key={i} className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-white`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">{t(UI.hero.socialProof, lang)}</p>
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {t(UI.hero.noCard, lang)}
                </div>
              </div>
            </motion.div>

            {/* Right: result card mockup */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md"
            >
              {/* Main report card */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lang === "zh" ? "你的 AI 素养报告" : "Your AI Fluency Report"}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    {lang === "zh" ? "已完成" : "COMPLETE"}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30">
                    <span className="text-2xl font-black leading-none">L4</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{lang === "zh" ? "AI 协作者" : "AI Collaborator"}</p>
                    <p className="text-sm text-slate-500">{lang === "zh" ? "超过 78% 的用户" : "Top 22% of users"}</p>
                  </div>
                </div>

                {/* Dimension bars */}
                <div className="mt-6 space-y-3">
                  {[
                    { n: lang === "zh" ? "提示能力" : "Prompting", v: 88, g: "from-indigo-500 to-violet-500" },
                    { n: lang === "zh" ? "输出评估" : "Evaluation", v: 74, g: "from-violet-500 to-fuchsia-500" },
                    { n: lang === "zh" ? "风险意识" : "Risk Awareness", v: 62, g: "from-blue-500 to-indigo-500" },
                  ].map((d, i) => (
                    <div key={d.n}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">{d.n}</span>
                        <span className="font-bold tabular-nums text-slate-900">{d.v}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.v}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                          className={`h-full rounded-full bg-gradient-to-r ${d.g}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent card */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-5 -left-5 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 pr-4 shadow-xl shadow-indigo-500/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
                  <TrendingUp className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-900">+2 {lang === "zh" ? "等级" : "levels"}</p>
                  <p className="text-[11px] text-slate-500">{lang === "zh" ? "成长空间" : "growth potential"}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {[
            { v: "50K+", l: lang === "zh" ? "完成测评" : "Assessments taken" },
            { v: "6", l: lang === "zh" ? "能力维度" : "Skill dimensions" },
            { v: "15 min", l: lang === "zh" ? "平均用时" : "Average time" },
            { v: "4.9★", l: lang === "zh" ? "用户评分" : "User rating" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-3xl font-extrabold text-transparent">{s.v}</div>
              <div className="mt-1 text-sm font-medium text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section id="how" className="px-5 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Pill>{lang === "zh" ? "简单三步" : "Simple 3 steps"}</Pill>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t(UI.howItWorks.title, lang)}</h2>
            <p className="mt-3 text-lg text-slate-600">{t(UI.howItWorks.subtitle, lang)}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "1", title: t(UI.howItWorks.step1.title, lang), desc: t(UI.howItWorks.step1.desc, lang), icon: Play, g: "from-indigo-500 to-violet-500" },
              { n: "2", title: t(UI.howItWorks.step2.title, lang), desc: t(UI.howItWorks.step2.desc, lang), icon: BarChart3, g: "from-violet-500 to-fuchsia-500" },
              { n: "3", title: t(UI.howItWorks.step3.title, lang), desc: t(UI.howItWorks.step3.desc, lang), icon: TrendingUp, g: "from-fuchsia-500 to-pink-500" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.n}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.g} shadow-md shadow-indigo-500/20`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute right-7 top-7 text-5xl font-black text-slate-100">{item.n}</span>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="leading-relaxed text-slate-600">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dimensions ─────────────────────────────────────────────── */}
      <section id="dimensions" className="bg-slate-50/60 px-5 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Pill>{lang === "zh" ? "测什么" : "What we measure"}</Pill>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t(UI.dimensions.sectionTitle, lang)}</h2>
            <p className="mt-3 text-lg text-slate-600">{t(UI.dimensions.sectionDesc, lang)}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, i) => {
              const Icon = iconMap[dim.icon] || Brain;
              return (
                <motion.div
                  key={dim.id}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${DIM_GRADIENTS[i]} shadow-md shadow-indigo-500/20`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{dim.name[lang]}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{dim.description[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Levels ─────────────────────────────────────────────────── */}
      <section className="px-5 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Pill>{lang === "zh" ? "你会拿到哪个等级" : "Where will you land"}</Pill>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t(UI.levels.sectionTitle, lang)}</h2>
            <p className="mt-3 text-lg text-slate-600">{t(UI.levels.sectionDesc, lang)}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {levels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${level.color} text-white shadow-md`}>
                  <span className="text-base font-black">{level.badge}</span>
                </div>
                <h4 className="mb-1 text-sm font-bold leading-tight">{level.name[lang]}</h4>
                <p className="mb-2.5 text-[11px] font-semibold text-indigo-500">{level.minScore}–{level.maxScore}{t(UI.levels.points, lang)}</p>
                <p className="text-xs leading-relaxed text-slate-500">{level.description[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-slate-50/60 px-5 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Pill>{lang === "zh" ? "定价" : "Pricing"}</Pill>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t(UI.pricing.title, lang)}</h2>
            <p className="mt-3 text-lg text-slate-600">{t(UI.pricing.subtitle, lang)}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
                  action: () => (user ? null : redirectToSignIn("/#pricing")),
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
                  action: () => (user ? null : redirectToSignIn("/#pricing")),
                },
              ] as const
            ).map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-indigo-500/30">
                      {t(UI.pricing.popular, lang)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex h-full flex-col rounded-3xl p-8 ${
                    plan.highlighted
                      ? "bg-gradient-to-b from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/30"
                      : "border border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <h3 className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className={`mt-1 text-sm ${plan.highlighted ? "text-indigo-100" : "text-slate-500"}`}>{plan.desc}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className={`text-5xl font-extrabold leading-none tracking-tight ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                    <span className={`mb-1.5 text-sm ${plan.highlighted ? "text-indigo-200" : "text-slate-400"}`}>{plan.period}</span>
                  </div>

                  <ul className="mt-7 flex-1 space-y-3.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${plan.highlighted ? "bg-white/20" : "bg-indigo-50"}`}>
                          <Check className={`h-3 w-3 ${plan.highlighted ? "text-white" : "text-indigo-600"}`} />
                        </div>
                        <span className={`text-sm ${plan.highlighted ? "text-indigo-50" : "text-slate-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={plan.action}
                    className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-white text-indigo-700 hover:bg-indigo-50"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center shadow-2xl shadow-indigo-500/30 md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white md:text-4xl">{t(UI.cta.title, lang)}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">{t(UI.cta.subtitle, lang)}</p>
              <button
                onClick={onStartTest}
                disabled={startDisabled}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAuthenticated ? t(UI.cta.btn, lang) : startLabel}
                <ChevronRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-sm text-indigo-200">{t(UI.hero.noCard, lang)} · {t(UI.hero.minutes, lang) === "minutes" ? "15 minutes" : "15 分钟"}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">{t(UI.nav.brand, lang)}</span>
          </div>
          <p className="text-sm text-slate-500">{t(UI.footer.tagline, lang)}</p>
          <p className="text-sm text-slate-400">© 2025 {t(UI.nav.brand, lang)}</p>
        </div>
      </footer>
    </div>
  );
}
