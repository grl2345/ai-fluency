"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Brain, Code2, Palette, Megaphone, Briefcase, GraduationCap, User2,
  Timer, Clock, CalendarDays, Hourglass,
  Search, PenLine, Lightbulb, Wrench, Workflow, BookOpen,
  ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck, Sparkles,
} from "lucide-react";
import { useLang } from "@/contexts/language-context";
import type { PlanKey } from "@/lib/plans";

interface OnboardingFlowProps {
  onComplete: (profile: Record<string, string | string[]>) => void;
  onBack: () => void;
}

const STEPS = [
  {
    key: "role",
    title: { zh: "你目前主要的身份是？", en: "What best describes your role?" },
    subtitle: { zh: "帮助我们为你定制测评体验", en: "Help us personalize your experience" },
    multi: false,
    options: [
      { id: "dev", label: { zh: "开发 / 技术", en: "Developer / Technical" }, icon: Code2 },
      { id: "design", label: { zh: "设计 / 创意", en: "Design / Creative" }, icon: Palette },
      { id: "marketing", label: { zh: "市场 / 运营", en: "Marketing / Operations" }, icon: Megaphone },
      { id: "product", label: { zh: "产品 / 管理", en: "Product / Management" }, icon: Briefcase },
      { id: "student", label: { zh: "学生 / 求职", en: "Student / Job Seeker" }, icon: GraduationCap },
      { id: "freelance", label: { zh: "自由职业 / 创作者", en: "Freelancer / Creator" }, icon: User2 },
    ],
  },
  {
    key: "experience",
    title: { zh: "你使用 AI 工具多久了？", en: "How long have you been using AI tools?" },
    subtitle: { zh: "如 ChatGPT、Claude、Gemini 等", en: "e.g. ChatGPT, Claude, Gemini, etc." },
    multi: false,
    options: [
      { id: "never", label: { zh: "几乎没用过", en: "Barely used them" }, icon: Timer },
      { id: "lt6m", label: { zh: "半年以内", en: "Less than 6 months" }, icon: Clock },
      { id: "6m2y", label: { zh: "半年到 2 年", en: "6 months to 2 years" }, icon: CalendarDays },
      { id: "gt2y", label: { zh: "2 年以上", en: "More than 2 years" }, icon: Hourglass },
    ],
  },
  {
    key: "usage",
    title: { zh: "你最常用 AI 做什么？", en: "What do you most often use AI for?" },
    subtitle: { zh: "可多选", en: "Select all that apply" },
    multi: true,
    options: [
      { id: "research", label: { zh: "查资料 / 问答", en: "Research / Q&A" }, icon: Search },
      { id: "writing", label: { zh: "写东西", en: "Writing" }, icon: PenLine },
      { id: "planning", label: { zh: "做方案 / 决策", en: "Planning / Decisions" }, icon: Lightbulb },
      { id: "coding", label: { zh: "编程 / 做工具", en: "Coding / Tools" }, icon: Wrench },
      { id: "automation", label: { zh: "自动化流程", en: "Automating workflows" }, icon: Workflow },
      { id: "learning", label: { zh: "学习 / 研究", en: "Learning / Research" }, icon: BookOpen },
    ],
  },
];

const PLANS: { key: PlanKey; name: { zh: string; en: string }; price: string; period: { zh: string; en: string }; desc: { zh: string; en: string }; features: { zh: string[]; en: string[] }; highlighted: boolean; badge?: { zh: string; en: string } }[] = [
  {
    key: "starter",
    name: { zh: "入门版", en: "Starter" },
    price: "$9.9",
    period: { zh: "/月", en: "/month" },
    desc: { zh: "适合想了解自己 AI 水平的个人", en: "For individuals exploring their AI level" },
    features: {
      zh: ["无限次测评与重测", "六维能力雷达图", "总分与等级报告"],
      en: ["Unlimited assessments", "Six-dimension radar chart", "Overall score & level report"],
    },
    highlighted: false,
  },
  {
    key: "pro",
    name: { zh: "专业版", en: "Pro" },
    price: "$19.9",
    period: { zh: "/月", en: "/month" },
    desc: { zh: "适合想系统提升 AI 能力的专业人士", en: "For professionals leveling up their AI skills" },
    features: {
      zh: ["包含入门版全部功能", "完整学习路径", "详细维度分析", "邮件支持"],
      en: ["All Starter features", "Full learning path", "Detailed analysis", "Email support"],
    },
    highlighted: true,
    badge: { zh: "推荐", en: "Popular" },
  },
  {
    key: "team",
    name: { zh: "团队版", en: "Team" },
    price: "$99",
    period: { zh: "/月", en: "/month" },
    desc: { zh: "适合团队批量测评与管理", en: "For teams assessing together" },
    features: {
      zh: ["包含专业版全部功能", "团队看板", "成员管理", "批量导出"],
      en: ["All Pro features", "Team dashboard", "Member management", "Bulk export"],
    },
    highlighted: false,
  },
];

const PUBLIC_PLAN_IDS: Record<PlanKey, string> = {
  starter: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_STARTER ?? "",
  pro: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO ?? "",
  team: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_TEAM ?? "",
};

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const { lang } = useLang();
  const zh = lang === "zh";
  const totalSteps = STEPS.length + 1; // profile steps + payment step

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro");
  const [payState, setPayState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [payError, setPayError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const planId = PUBLIC_PLAN_IDS[selectedPlan];

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isProfileStep = step < STEPS.length;
  const currentStep = isProfileStep ? STEPS[step] : null;

  const currentAnswer = currentStep ? answers[currentStep.key] : null;
  const canNext = isProfileStep
    ? currentStep!.multi
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : !!currentAnswer
    : false;

  const handleSelect = (optionId: string) => {
    if (!currentStep) return;
    if (currentStep.multi) {
      const prev = (answers[currentStep.key] as string[]) || [];
      const next = prev.includes(optionId)
        ? prev.filter((x) => x !== optionId)
        : [...prev, optionId];
      setAnswers({ ...answers, [currentStep.key]: next });
    } else {
      setAnswers({ ...answers, [currentStep.key]: optionId });
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  const handleApprove = async (subscriptionId: string) => {
    setPayState("processing");
    try {
      const res = await fetch("/api/paypal/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, planKey: selectedPlan }),
      });
      if (!res.ok) throw new Error("Verification failed");
      setPayState("success");
      // Build profile data matching the test-data profile question IDs
      const profile: Record<string, string | string[]> = {
        P1: answers.role ?? "",
        P2: answers.experience ?? "",
        P3: answers.usage ?? [],
      };
      setTimeout(() => onComplete(profile), 1500);
    } catch {
      setPayState("error");
      setPayError(zh ? "订阅验证失败，请重试或联系客服。" : "Verification failed. Please retry or contact support.");
    }
  };

  // Auto-advance after selecting single-choice option
  const handleSingleSelect = (optionId: string) => {
    if (!currentStep || currentStep.multi) return;
    setAnswers({ ...answers, [currentStep.key]: optionId });
    setTimeout(() => setStep(step + 1), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#07070d]">
      {/* Left panel */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{zh ? "AI 素养" : "AI Fluency"}</span>
          </div>
          <button onClick={onBack} className="text-xs text-slate-500 transition-colors hover:text-white">
            {zh ? "返回首页" : "Back to home"}
          </button>
        </div>

        {/* Progress */}
        <div className="px-6">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-indigo-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-12">
          <AnimatePresence mode="wait">
            {isProfileStep && currentStep && (
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  {currentStep.title[lang]}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{currentStep.subtitle[lang]}</p>

                <div className="mt-8 space-y-3">
                  {currentStep.options.map((opt) => {
                    const Icon = opt.icon;
                    const selected = currentStep.multi
                      ? ((currentAnswer as string[]) || []).includes(opt.id)
                      : currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          currentStep.multi
                            ? handleSelect(opt.id)
                            : handleSingleSelect(opt.id)
                        }
                        className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                          selected
                            ? "border-indigo-400/60 bg-indigo-500/10 text-white"
                            : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-indigo-400" : "text-slate-500"}`} />
                        <span className="text-[15px] font-medium">{opt.label[lang]}</span>
                        {selected && currentStep.multi && (
                          <Check className="ml-auto h-4 w-4 text-indigo-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {currentStep.multi && (
                  <button
                    onClick={handleNext}
                    disabled={!canNext}
                    className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-400 active:scale-[0.98] disabled:opacity-40"
                  >
                    {zh ? "继续" : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            )}

            {!isProfileStep && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  {zh ? "选择你的套餐" : "Choose your plan"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {zh ? "订阅后即可开始 AI 实力测评" : "Subscribe to start your AI assessment"}
                </p>

                <div className="mt-8 space-y-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => setSelectedPlan(plan.key)}
                      className={`relative flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                        selectedPlan === plan.key
                          ? "border-indigo-400/60 bg-indigo-500/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selectedPlan === plan.key
                            ? "border-indigo-400 bg-indigo-500"
                            : "border-slate-600"
                        }`}
                      >
                        {selectedPlan === plan.key && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-white">{plan.name[lang]}</span>
                          {plan.badge && (
                            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                              {plan.badge[lang]}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{plan.desc[lang]}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white">{plan.price}</span>
                        <span className="text-xs text-slate-400">{plan.period[lang]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Features of selected plan */}
                <ul className="mt-6 space-y-2">
                  {PLANS.find((p) => p.key === selectedPlan)!.features[lang].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* PayPal button */}
                <div className="mt-8">
                  {payState === "success" && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                      <Check className="h-4 w-4" />
                      {zh ? "订阅成功！正在进入测评…" : "Subscribed! Starting assessment…"}
                    </div>
                  )}

                  {payState === "processing" && (
                    <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">{zh ? "验证中…" : "Verifying…"}</span>
                    </div>
                  )}

                  {payState === "error" && (
                    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {payError}
                    </div>
                  )}

                  {(payState === "idle" || payState === "error") && clientId && planId && (
                    <PayPalScriptProvider
                      options={{ clientId, vault: true, intent: "subscription", currency: "USD" }}
                    >
                      <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "subscribe", color: "blue" }}
                        createSubscription={(_data, actions) =>
                          actions.subscription.create({ plan_id: planId })
                        }
                        onApprove={async (data) => {
                          if (data.subscriptionID) handleApprove(data.subscriptionID);
                        }}
                        onError={() => {
                          setPayState("error");
                          setPayError(zh ? "支付失败，请重试。" : "Payment failed. Please try again.");
                        }}
                      />
                    </PayPalScriptProvider>
                  )}

                  {(payState === "idle" || payState === "error") && (!clientId || !planId) && (
                    <p className="text-center text-sm text-red-400">
                      {zh ? "支付配置未完成，请联系管理员。" : "Payment not configured. Contact support."}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {zh ? "通过 PayPal 安全支付 · 随时取消" : "Secure PayPal payment · Cancel anytime"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {zh ? "返回" : "Back"}
          </button>
          <span className="text-xs text-slate-600">
            {zh ? `步骤 ${step + 1} / ${totalSteps}` : `STEP ${step + 1} OF ${totalSteps}`}
          </span>
        </div>
      </div>

      {/* Right panel — dynamic preview */}
      <div className="hidden items-center justify-center bg-gradient-to-br from-indigo-950 via-[#0d0b1a] to-violet-950 lg:flex lg:w-1/2">
        <div className="pointer-events-none absolute right-[8%] top-[12%] h-[300px] w-[300px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[15%] right-[25%] h-[250px] w-[250px] rounded-full bg-violet-600/15 blur-[100px]" />
        <OnboardingPreview step={step} answers={answers} selectedPlan={selectedPlan} lang={lang} />
      </div>
    </div>
  );
}

/* ── Dynamic right-panel preview ── */

const DIM_NAMES = [
  { zh: "提示工程", en: "Prompting" },
  { zh: "评估判断", en: "Evaluation" },
  { zh: "自动化", en: "Automation" },
  { zh: "推理能力", en: "Reasoning" },
  { zh: "工具使用", en: "Tools" },
  { zh: "风险意识", en: "Risk" },
];

const DIM_COLORS = [
  "from-cyan-400 to-cyan-500",
  "from-indigo-400 to-indigo-500",
  "from-violet-400 to-violet-500",
  "from-fuchsia-400 to-fuchsia-500",
  "from-blue-400 to-blue-500",
  "from-purple-400 to-purple-500",
];

function OnboardingPreview({
  step,
  answers,
  selectedPlan,
  lang,
}: {
  step: number;
  answers: Record<string, string | string[]>;
  selectedPlan: PlanKey;
  lang: "zh" | "en";
}) {
  const zh = lang === "zh";
  const role = answers.role as string | undefined;
  const experience = answers.experience as string | undefined;
  const usage = (answers.usage as string[]) || [];

  const roleLabel = role
    ? STEPS[0].options.find((o) => o.id === role)?.label[lang]
    : null;
  const expLabel = experience
    ? STEPS[1].options.find((o) => o.id === experience)?.label[lang]
    : null;
  const usageLabels = usage
    .map((id) => STEPS[2].options.find((o) => o.id === id)?.label[lang])
    .filter(Boolean);

  // Simulate dimension scores that grow with each step
  const baseScores = [65, 58, 72, 50, 68, 55];
  const stepBoost = step * 8;

  return (
    <div className="relative w-[380px]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
          <div className="h-3 w-3 rounded-full bg-green-400/60" />
          <div className="ml-auto h-2.5 w-24 rounded-full bg-white/10" />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-violet-500/25 ring-1 ring-white/10">
              <Sparkles className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {zh ? "AI 实力报告" : "AI Fluency Report"}
              </div>
              <div className="text-xs text-slate-500">
                {zh ? "正在为你定制…" : "Customizing for you…"}
              </div>
            </div>
          </div>

          {/* Profile card — builds up with selections */}
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {zh ? "测评者档案" : "Your Profile"}
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Role */}
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${roleLabel ? "bg-emerald-400" : "bg-white/15"}`} />
                <span className="text-xs text-slate-500">{zh ? "身份" : "Role"}</span>
                <AnimatePresence mode="wait">
                  {roleLabel ? (
                    <motion.span
                      key={roleLabel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-auto rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300"
                    >
                      {roleLabel}
                    </motion.span>
                  ) : (
                    <span className="ml-auto h-4 w-20 rounded bg-white/5" />
                  )}
                </AnimatePresence>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${expLabel ? "bg-emerald-400" : "bg-white/15"}`} />
                <span className="text-xs text-slate-500">{zh ? "经验" : "Experience"}</span>
                <AnimatePresence mode="wait">
                  {expLabel ? (
                    <motion.span
                      key={expLabel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-auto rounded-md bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-300"
                    >
                      {expLabel}
                    </motion.span>
                  ) : (
                    <span className="ml-auto h-4 w-20 rounded bg-white/5" />
                  )}
                </AnimatePresence>
              </div>

              {/* Usage tags */}
              <div className="flex items-start gap-2">
                <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${usageLabels.length > 0 ? "bg-emerald-400" : "bg-white/15"}`} />
                <span className="mt-0.5 shrink-0 text-xs text-slate-500">{zh ? "用途" : "Uses"}</span>
                <div className="ml-auto flex flex-wrap justify-end gap-1">
                  <AnimatePresence>
                    {usageLabels.length > 0 ? usageLabels.map((label) => (
                      <motion.span
                        key={label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300"
                      >
                        {label}
                      </motion.span>
                    )) : (
                      <span className="h-4 w-20 rounded bg-white/5" />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension bars — animate as steps progress */}
          <div className="mt-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {zh ? "能力预测" : "Skill Forecast"}
            </div>
            <div className="mt-3 space-y-2">
              {DIM_NAMES.map((dim, i) => {
                const score = Math.min(95, baseScores[i] + stepBoost + (i % 2 === 0 ? 5 : 0));
                return (
                  <div key={dim.en} className="flex items-center gap-2">
                    <span className="w-14 text-right text-[10px] text-slate-500">{dim[lang]}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${DIM_COLORS[i]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                    <motion.span
                      className="w-7 text-right text-[10px] tabular-nums text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                    >
                      {score}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan badge — shows on step 4 */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3"
              >
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {PLANS.find((p) => p.key === selectedPlan)?.name[lang]} {zh ? "套餐" : "Plan"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {zh ? "解锁完整测评 & 报告" : "Unlock full assessment & report"}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-emerald-400" : "animate-pulse bg-amber-400"}`} />
            <span className="text-[10px] text-slate-500">
              {step >= 3
                ? (zh ? "准备就绪" : "Ready")
                : (zh ? "正在配置…" : "Configuring…")}
            </span>
          </div>
          <span className="text-[10px] font-medium tabular-nums text-slate-600">
            {step + 1}/4
          </span>
        </div>
      </div>
    </div>
  );
}
