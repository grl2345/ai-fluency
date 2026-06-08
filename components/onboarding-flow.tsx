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

      {/* Right panel — decorative preview */}
      <div className="hidden items-center justify-center bg-gradient-to-br from-indigo-950 via-[#0d0b1a] to-violet-950 lg:flex lg:w-1/2">
        <div className="relative w-[360px]">
          <div className="pointer-events-none absolute -inset-12 rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              <div className="h-3 w-3 rounded-full bg-green-400/60" />
              <div className="ml-auto h-2.5 w-20 rounded-full bg-white/10" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10">
                  <Sparkles className="h-7 w-7 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{zh ? "AI 实力报告" : "AI Fluency Report"}</div>
                  <div className="text-xs text-slate-500">{zh ? "即将为你生成" : "Coming up next"}</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { w: "w-[85%]", c: "bg-cyan-400/40" },
                  { w: "w-[72%]", c: "bg-indigo-400/40" },
                  { w: "w-[90%]", c: "bg-violet-400/40" },
                  { w: "w-[65%]", c: "bg-fuchsia-400/40" },
                  { w: "w-[78%]", c: "bg-blue-400/40" },
                  { w: "w-[82%]", c: "bg-purple-400/40" },
                ].map((bar, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-16 rounded-full bg-white/5" />
                    <div className="flex-1">
                      <div className={`h-2.5 rounded-full ${bar.c} ${bar.w}`} />
                    </div>
                    <div className="h-2 w-6 rounded-full bg-white/5" />
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="h-2 w-24 rounded-full bg-white/10" />
                <div className="mt-2 h-2 w-full rounded-full bg-white/5" />
                <div className="mt-1.5 h-2 w-[80%] rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
