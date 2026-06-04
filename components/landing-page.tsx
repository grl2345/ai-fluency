"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dimensions, levels } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Brain,
  Clock,
  Target,
  ChevronRight,
  Award,
  BarChart3,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  GitMerge,
  Shield,
  TrendingUp,
  Play,
  Check,
  LogIn,
  LogOut,
} from "lucide-react";

interface LandingPageProps {
  onStartTest: () => void;
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

const DIM_ICON_STYLES = [
  "bg-blue-50 text-blue-600",
  "bg-violet-50 text-violet-600",
  "bg-teal-50 text-teal-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-emerald-50 text-emerald-600",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px w-7 bg-amber-500" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">
        {children}
      </span>
    </div>
  );
}

function SectionLabelCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-3">
      <div className="h-px w-7 bg-amber-500" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">
        {children}
      </span>
      <div className="h-px w-7 bg-amber-500" />
    </div>
  );
}

export function LandingPage({ onStartTest }: LandingPageProps) {
  const { data: session } = useSession();
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-950">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                {t(UI.nav.brand, lang)}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                Assessment
              </span>
            </div>
          </div>

          {/* Center nav */}
          <div className="hidden items-center gap-7 md:flex">
            <a href="#framework" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {lang === "zh" ? "评估框架" : "Framework"}
            </a>
            <a href="#levels" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {lang === "zh" ? "等级体系" : "Levels"}
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {t(UI.nav.pricing, lang)}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="rounded border border-slate-200 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 transition-all hover:border-slate-400 hover:text-slate-800"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img src={session.user.image} alt={session.user.name ?? "User"} className="h-7 w-7 rounded-full ring-2 ring-slate-200" />
                )}
                <span className="hidden text-sm font-medium text-slate-700 sm:block">{session.user?.name}</span>
                <button onClick={() => signOut()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => signIn("google")} className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 sm:flex">
                <LogIn className="h-3.5 w-3.5" />
                {t(UI.nav.login, lang)}
              </button>
            )}

            <Button
              onClick={onStartTest}
              size="sm"
              className="rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t(UI.nav.startTest, lang)}
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── Dark, authoritative ────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-28 pt-24 md:pb-36 md:pt-32">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Ambient glows */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-[480px] w-[560px] -translate-y-1/2 rounded-full bg-blue-700/12 blur-[110px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-[360px] w-[440px] translate-y-1/2 rounded-full bg-violet-700/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8 bg-amber-400/70" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
              {lang === "zh" ? "专业 AI 素养认证平台" : "Professional AI Literacy Certification"}
            </span>
            <div className="h-px w-8 bg-amber-400/70" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 text-5xl font-bold leading-[1.06] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {lang === "zh" ? (
              <>
                量化你真实的
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                  AI 素养水平
                </span>
              </>
            ) : (
              <>
                The Standard for
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                  AI Literacy
                </span>
              </>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
          >
            {t(UI.hero.desc, lang)}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={onStartTest}
              className="inline-flex h-12 items-center gap-2.5 rounded-md bg-white px-8 text-base font-semibold text-slate-950 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl active:scale-[0.98]"
            >
              {t(UI.hero.cta, lang)}
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                15 {t(UI.hero.minutes, lang)}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                18 {t(UI.hero.questions, lang)}
              </span>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mt-20 grid grid-cols-2 gap-8 border-t border-white/8 pt-12 md:grid-cols-4"
          >
            {[
              { value: "50,000+", label: lang === "zh" ? "已完成测评" : "Assessments" },
              { value: "6", label: lang === "zh" ? "核心维度" : "Dimensions" },
              { value: "5", label: lang === "zh" ? "专业等级" : "Levels" },
              { value: "18", label: lang === "zh" ? "道精选题目" : "Questions" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black tabular-nums text-white">{s.value}</div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Framework ──────────────────────────────────────────────── */}
      <section id="framework" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <SectionLabel>
              {lang === "zh" ? "评估框架" : "Assessment Framework"}
            </SectionLabel>
            <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {t(UI.dimensions.sectionTitle, lang)}
            </h2>
            <p className="max-w-2xl text-lg text-slate-500">
              {t(UI.dimensions.sectionDesc, lang)}
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, i) => {
              const Icon = iconMap[dim.icon] || Brain;
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <Card className="group h-full border border-slate-200 bg-white shadow-none transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${DIM_ICON_STYLES[i]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-black tabular-nums text-slate-100">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mb-1.5 text-sm font-bold text-slate-900">
                        {dim.name[lang]}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {dim.description[lang]}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Levels ─────────────────────────────────────────────────── */}
      <section id="levels" className="border-y border-slate-100 bg-slate-50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <SectionLabelCenter>
              {lang === "zh" ? "认证等级体系" : "Certification Levels"}
            </SectionLabelCenter>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {t(UI.levels.sectionTitle, lang)}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              {t(UI.levels.sectionDesc, lang)}
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-slate-200 md:block" />
            <div className="grid gap-8 md:grid-cols-5">
              {levels.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.09 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={`relative z-10 mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border-4 border-white shadow-md ${level.color} text-white`}>
                    <span className="text-sm font-bold">{level.badge}</span>
                  </div>
                  <h4 className="mb-1 text-sm font-bold text-slate-900">{level.name[lang]}</h4>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {level.minScore}–{level.maxScore}{t(UI.levels.points, lang)}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">{level.description[lang]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <SectionLabelCenter>
              {lang === "zh" ? "测评流程" : "The Process"}
            </SectionLabelCenter>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {t(UI.howItWorks.title, lang)}
            </h2>
            <p className="mx-auto max-w-xl text-lg text-slate-500">
              {t(UI.howItWorks.subtitle, lang)}
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {[
              { step: "01", title: t(UI.howItWorks.step1.title, lang), desc: t(UI.howItWorks.step1.desc, lang), icon: Play },
              { step: "02", title: t(UI.howItWorks.step2.title, lang), desc: t(UI.howItWorks.step2.desc, lang), icon: BarChart3 },
              { step: "03", title: t(UI.howItWorks.step3.title, lang), desc: t(UI.howItWorks.step3.desc, lang), icon: TrendingUp },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.14 }}
              >
                <div className="mb-5 leading-none">
                  <span className="text-7xl font-black tabular-nums text-slate-100">{item.step}</span>
                </div>
                <h3 className="mb-2.5 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-slate-100 bg-slate-50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <SectionLabelCenter>
              {lang === "zh" ? "定价方案" : "Pricing"}
            </SectionLabelCenter>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {t(UI.pricing.title, lang)}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              {t(UI.pricing.subtitle, lang)}
            </p>
          </motion.div>

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
                  dark: false,
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
                  dark: true,
                  action: () => (session ? null : signIn("google")),
                },
                {
                  key: "team" as const,
                  name: t(UI.pricing.team.name, lang),
                  price: t(UI.pricing.team.price, lang),
                  period: t(UI.pricing.team.period, lang),
                  desc: t(UI.pricing.team.desc, lang),
                  features: UI.pricing.team.features[lang] as readonly string[],
                  cta: t(UI.pricing.team.cta, lang),
                  dark: false,
                  action: () => (session ? null : signIn("google")),
                },
              ] as const
            ).map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                {plan.dark && (
                  <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                    <span className="rounded-full bg-amber-400 px-4 py-1 text-[11px] font-black uppercase tracking-wide text-slate-900">
                      {t(UI.pricing.popular, lang)}
                    </span>
                  </div>
                )}
                <div className={`h-full rounded-xl p-8 ${plan.dark ? "bg-slate-950 shadow-2xl" : "border border-slate-200 bg-white shadow-sm"}`}>
                  <h3 className={`mb-1 text-base font-bold ${plan.dark ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-6 text-sm ${plan.dark ? "text-slate-500" : "text-slate-500"}`}>{plan.desc}</p>
                  <div className="mb-8 flex items-end gap-1.5">
                    <span className={`text-5xl font-black leading-none tabular-nums ${plan.dark ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`mb-1.5 text-sm ${plan.dark ? "text-slate-500" : "text-slate-400"}`}>{plan.period}</span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${plan.dark ? "bg-amber-400" : "bg-slate-100"}`}>
                          <Check className={`h-2.5 w-2.5 ${plan.dark ? "text-slate-900" : "text-slate-600"}`} />
                        </div>
                        <span className={`text-sm ${plan.dark ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={plan.action}
                    className={`w-full rounded-md py-2.5 text-sm font-bold transition-all ${
                      plan.dark
                        ? "bg-amber-400 text-slate-900 hover:bg-amber-300"
                        : "bg-slate-950 text-white hover:bg-slate-800"
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
      <section className="bg-slate-950 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-amber-400/60" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                {lang === "zh" ? "免费开始" : "Get Started Free"}
              </span>
              <div className="h-px w-8 bg-amber-400/60" />
            </div>
            <h2 className="mb-5 text-3xl font-bold text-white md:text-5xl">
              {t(UI.cta.title, lang)}
            </h2>
            <p className="mb-10 text-lg text-slate-400">{t(UI.cta.subtitle, lang)}</p>
            <button
              onClick={onStartTest}
              className="inline-flex h-12 items-center gap-2.5 rounded-md bg-amber-400 px-10 text-base font-bold text-slate-900 shadow-lg transition-all hover:bg-amber-300 active:scale-[0.98]"
            >
              {t(UI.cta.btn, lang)}
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-800">
              <Brain className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-400">{t(UI.nav.brand, lang)}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-700">Assessment</span>
          </div>
          <p className="text-slate-700">{t(UI.footer.tagline, lang)}</p>
          <span className="text-slate-700">© 2025</span>
        </div>
      </footer>
    </div>
  );
}
