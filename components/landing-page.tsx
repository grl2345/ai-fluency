"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  BarChart3,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  GitMerge,
  Shield,
  TrendingUp,
  Zap,
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

export function LandingPage({ onStartTest }: LandingPageProps) {
  const { data: session } = useSession();
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
              <Brain className="h-5 w-5 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {t(UI.nav.brand, lang)}
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(UI.nav.pricing, lang)}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>

            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="hidden text-sm font-medium text-foreground sm:block">
                  {session.user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="gap-2 rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t(UI.nav.logout, lang)}</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signIn("google")}
                className="gap-2 rounded-full"
              >
                <LogIn className="h-4 w-4" />
                {t(UI.nav.login, lang)}
              </Button>
            )}
            <Button onClick={onStartTest} className="rounded-full px-6">
              {t(UI.nav.startTest, lang)}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pb-20 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-border/60 px-4 py-1.5 text-muted-foreground"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {t(UI.hero.badge, lang)}
              </Badge>

              <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {t(UI.hero.title1, lang)}
                <br />
                <span className="text-primary">{t(UI.hero.titleHighlight, lang)}</span>{" "}
                {t(UI.hero.title2, lang)}
              </h1>

              <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t(UI.hero.desc, lang)}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={onStartTest}
                  className="h-14 gap-3 rounded-full px-8 text-base font-medium"
                >
                  {t(UI.hero.cta, lang)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    15 {t(UI.hero.minutes, lang)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    18 {t(UI.hero.questions, lang)}
                  </span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center gap-6 border-t border-border/40 pt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-secondary to-muted text-xs font-medium text-muted-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t(UI.hero.socialProof, lang)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(UI.hero.socialSub, lang)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto aspect-square max-w-md">
                {/* Floating Cards */}
                <div className="absolute left-0 top-8 z-10">
                  <Card className="w-48 shadow-lg">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                          <Zap className="h-4 w-4 text-teal-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {lang === "zh" ? "提示技能" : "Prompt Skills"}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full w-4/5 rounded-full bg-teal-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute bottom-8 right-0 z-10">
                  <Card className="w-48 shadow-lg">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                          <Award className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {lang === "zh" ? "等级 4" : "Level 4"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lang === "zh" ? "AI 协作者" : "AI Collaborator"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Central Radar Visualization */}
                <div className="flex h-full items-center justify-center">
                  <div className="relative h-72 w-72">
                    <div className="absolute inset-0 rounded-full border border-border/30" />
                    <div className="absolute inset-6 rounded-full border border-border/30" />
                    <div className="absolute inset-12 rounded-full border border-border/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <Brain className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute h-3 w-3 rounded-full bg-primary"
                        style={{
                          top: `${50 - 40 * Math.cos((angle * Math.PI) / 180)}%`,
                          left: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dimensions Section */}
      <section className="border-t border-border/40 bg-secondary/30 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t(UI.dimensions.sectionTitle, lang)}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t(UI.dimensions.sectionDesc, lang)}
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, index) => {
              const Icon = iconMap[dim.icon] || Brain;
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card className="h-full border-border/40 bg-card/50 backdrop-blur transition-all hover:border-border hover:bg-card">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {dim.name[lang]}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
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

      {/* Levels Section */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t(UI.levels.sectionTitle, lang)}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t(UI.levels.sectionDesc, lang)}
            </p>
          </motion.div>

          <div className="flex flex-wrap items-stretch justify-center gap-4">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full w-52 border-border/40 transition-all hover:border-border hover:shadow-lg">
                  <CardContent className="flex h-full flex-col p-5">
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${level.color} text-white`}
                    >
                      <span className="text-xl font-bold">{level.badge}</span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-foreground">
                      {level.name[lang]}
                    </h4>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {level.minScore}-{level.maxScore}{t(UI.levels.points, lang)}
                    </p>
                    <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                      {level.description[lang]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border/40 bg-secondary/30 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t(UI.howItWorks.title, lang)}
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              {t(UI.howItWorks.subtitle, lang)}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: t(UI.howItWorks.step1.title, lang),
                description: t(UI.howItWorks.step1.desc, lang),
                icon: Play,
              },
              {
                step: "02",
                title: t(UI.howItWorks.step2.title, lang),
                description: t(UI.howItWorks.step2.desc, lang),
                icon: BarChart3,
              },
              {
                step: "03",
                title: t(UI.howItWorks.step3.title, lang),
                description: t(UI.howItWorks.step3.desc, lang),
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative"
              >
                <div className="mb-6">
                  <span className="text-5xl font-bold text-border/60">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t border-border/40 bg-secondary/30 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t(UI.pricing.title, lang)}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t(UI.pricing.subtitle, lang)}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                key: "free" as const,
                name: t(UI.pricing.free.name, lang),
                price: t(UI.pricing.free.price, lang),
                period: t(UI.pricing.free.period, lang),
                description: t(UI.pricing.free.desc, lang),
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
                description: t(UI.pricing.pro.desc, lang),
                features: UI.pricing.pro.features[lang] as readonly string[],
                cta: t(UI.pricing.pro.cta, lang),
                highlighted: true,
                action: () => (session ? null : signIn("google")),
              },
              {
                key: "team" as const,
                name: t(UI.pricing.team.name, lang),
                price: t(UI.pricing.team.price, lang),
                period: t(UI.pricing.team.period, lang),
                description: t(UI.pricing.team.desc, lang),
                features: UI.pricing.team.features[lang] as readonly string[],
                cta: t(UI.pricing.team.cta, lang),
                highlighted: false,
                action: () => (session ? null : signIn("google")),
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.highlighted
                      ? "border-primary bg-primary/5 shadow-xl ring-2 ring-primary"
                      : "border-border/40 bg-card/50"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                        {t(UI.pricing.popular, lang)}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="flex h-full flex-col p-8">
                    <div className="mb-6">
                      <h3 className="mb-1 text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="mb-1 text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={plan.action}
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full rounded-full"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-foreground p-10 text-center md:p-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-background md:text-4xl">
              {t(UI.cta.title, lang)}
            </h2>
            <p className="mb-8 text-lg text-background/70">
              {t(UI.cta.subtitle, lang)}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onStartTest}
              className="h-14 gap-3 rounded-full px-10 text-base font-medium"
            >
              {t(UI.cta.btn, lang)}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Brain className="h-4 w-4 text-background" />
            </div>
            <span className="font-medium">{t(UI.nav.brand, lang)}</span>
          </div>
          <p>{t(UI.footer.tagline, lang)}</p>
        </div>
      </footer>
    </div>
  );
}
