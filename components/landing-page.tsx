"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dimensions, levels } from "@/lib/test-data";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Brain,
  Clock,
  Target,
  ChevronRight,
  Award,
  Users,
  Sparkles,
  BarChart3,
  ArrowRight,
  Wrench,
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
  Wrench,
  MessageSquare,
  CheckCircle: CheckCircle2,
  GitMerge,
  Shield,
  TrendingUp,
};

export function LandingPage({ onStartTest }: LandingPageProps) {
  const { data: session } = useSession();

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
              AI Fluency
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              定价
            </a>
          </div>
          <div className="flex items-center gap-3">
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
                  <span className="hidden sm:inline">退出</span>
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
                谷歌登录
              </Button>
            )}
            <Button onClick={onStartTest} className="rounded-full px-6">
              Take the Test
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
                Free Assessment
              </Badge>

              <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Discover Your
                <br />
                <span className="text-primary">AI Fluency</span> Level
              </h1>

              <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                A comprehensive assessment designed to measure your AI literacy
                across six key dimensions. Get personalized insights and a clear
                path to improvement.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={onStartTest}
                  className="h-14 gap-3 rounded-full px-8 text-base font-medium"
                >
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    10 minutes
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    10 questions
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
                    50,000+ assessments completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Join professionals worldwide
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
                        <span className="text-sm font-medium">Prompt Skills</span>
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
                        <span className="text-sm font-medium">Level 4</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        AI Expert Status
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
                    {/* Dimension dots */}
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
              Six Dimensions of AI Fluency
            </h2>
            <p className="text-lg text-muted-foreground">
              Our assessment framework evaluates your competencies across the
              critical dimensions of AI literacy in the modern workplace.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, index) => {
              const Icon = iconMap[dim.icon] || Wrench;
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
                        {dim.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {dim.description}
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
              Five Proficiency Levels
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Understand where you stand and chart your path to AI mastery
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
                      {level.name}
                    </h4>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {level.minScore}-{level.maxScore} points
                    </p>
                    <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                      {level.description}
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
              How It Works
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Three simple steps to discover your AI fluency profile
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Take the Assessment",
                description:
                  "Answer 10 scenario-based questions designed by AI education experts",
                icon: Play,
              },
              {
                step: "02",
                title: "Get Your Results",
                description:
                  "Receive a comprehensive report with your six-dimension radar chart",
                icon: BarChart3,
              },
              {
                step: "03",
                title: "Start Learning",
                description:
                  "Access personalized recommendations to advance your AI skills",
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
              简单透明的定价
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              选择适合您的方案，随时升级或降级
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "免费版",
                price: "¥0",
                period: "永久免费",
                description: "适合个人探索 AI 能力基础评估",
                features: [
                  "1次 AI 流利度测试",
                  "六维能力雷达图",
                  "基础能力报告",
                  "5 个学习建议",
                ],
                cta: "免费开始",
                highlighted: false,
                action: onStartTest,
              },
              {
                name: "专业版",
                price: "¥29",
                period: "每月",
                description: "适合持续提升 AI 技能的专业人士",
                features: [
                  "无限次测试",
                  "详细历史记录与趋势分析",
                  "完整个性化学习路径",
                  "可分享的专业证书",
                  "优先客户支持",
                ],
                cta: "升级专业版",
                highlighted: true,
                action: () => session ? null : signIn("google"),
              },
              {
                name: "团队版",
                price: "¥199",
                period: "每月 · 最多10人",
                description: "适合团队管理员和企业培训负责人",
                features: [
                  "包含全部专业版功能",
                  "团队整体能力看板",
                  "成员管理与邀请",
                  "批量导出报告 (PDF/Excel)",
                  "专属客户成功经理",
                ],
                cta: "联系销售",
                highlighted: false,
                action: () => session ? null : signIn("google"),
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
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
                        最受欢迎
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
              Ready to discover your AI potential?
            </h2>
            <p className="mb-8 text-lg text-background/70">
              Join 50,000+ professionals who have assessed their AI fluency
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onStartTest}
              className="h-14 gap-3 rounded-full px-10 text-base font-medium"
            >
              Start Your Free Assessment
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
            <span className="font-medium">AI Fluency Assessment</span>
          </div>
          <p>Helping professionals navigate the AI era</p>
        </div>
      </footer>
    </div>
  );
}
