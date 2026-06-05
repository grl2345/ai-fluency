"use client";

import React, { useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, Check, Loader2, ShieldCheck } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import type { PlanKey } from "@/lib/paypal";

interface PaymentModalProps {
  plan: PlanKey;
  onClose: () => void;
  onSuccess: (plan: PlanKey) => void;
}

const PLAN_DETAILS = {
  pro: {
    name: { en: "Pro", zh: "专业版" },
    price: { en: "$9", zh: "¥29" },
    period: { en: "/month", zh: "/月" },
    features: {
      en: ["Unlimited assessments", "History & trend analysis", "Full personalized learning path", "Shareable professional certificate", "Priority support"],
      zh: ["无限次测评", "历史记录与趋势分析", "完整个性化学习路径", "可分享的专业证书", "优先客户支持"],
    },
  },
  team: {
    name: { en: "Team", zh: "团队版" },
    price: { en: "$49", zh: "¥199" },
    period: { en: "/month", zh: "/月" },
    features: {
      en: ["All Pro features", "Team capability dashboard", "Member management (up to 10)", "Bulk report export (PDF/Excel)", "Dedicated success manager"],
      zh: ["包含全部专业版功能", "团队整体能力看板", "成员管理（最多10人）", "批量导出报告 (PDF/Excel)", "专属客户成功经理"],
    },
  },
} as const;

type ModalState = "idle" | "processing" | "success" | "error";

export function PaymentModal({ plan, onClose, onSuccess }: PaymentModalProps) {
  const { lang } = useLang();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const details = PLAN_DETAILS[plan];
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const planId = plan === "pro"
    ? (process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO ?? "")
    : (process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_TEAM ?? "");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleApprove = async (subscriptionId: string) => {
    setState("processing");
    try {
      const res = await fetch("/api/paypal/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, planKey: plan }),
      });
      if (!res.ok) throw new Error("Verification failed");
      setState("success");
      setTimeout(() => { onSuccess(plan); onClose(); }, 2000);
    } catch {
      setState("error");
      setErrorMsg(lang === "zh" ? "订阅验证失败，请联系客服。" : "Subscription verification failed. Please contact support.");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === "zh" ? `升级到${details.name.zh}` : `Upgrade to ${details.name.en}`}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {lang === "zh" ? "通过 PayPal 安全支付" : "Secure payment via PayPal"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Plan summary */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-black text-slate-900">{details.price[lang === "zh" ? "zh" : "en"]}</span>
            <span className="mb-1 text-sm text-slate-400">{details.period[lang === "zh" ? "zh" : "en"]}</span>
          </div>
          <ul className="space-y-2">
            {details.features[lang === "zh" ? "zh" : "en"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment area */}
        <div className="px-6 py-6">
          {state === "success" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Check className="h-7 w-7 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-900">
                {lang === "zh" ? "订阅成功！" : "Subscription activated!"}
              </p>
              <p className="text-sm text-slate-500">
                {lang === "zh" ? "欢迎使用专业版功能。" : "Welcome to your new plan."}
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {state === "processing" && (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">{lang === "zh" ? "验证订阅中…" : "Verifying subscription…"}</span>
            </div>
          )}

          {(state === "idle" || state === "error") && clientId && planId && (
            <PayPalScriptProvider
              options={{
                clientId,
                vault: true,
                intent: "subscription",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical", shape: "pill", label: "subscribe" }}
                createSubscription={(_data, actions) =>
                  actions.subscription.create({ plan_id: planId })
                }
                onApprove={(data) => {
                  if (data.subscriptionID) handleApprove(data.subscriptionID);
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  setState("error");
                  setErrorMsg(lang === "zh" ? "支付过程中出现错误，请重试。" : "An error occurred during payment. Please try again.");
                }}
                onCancel={() => setState("idle")}
              />
            </PayPalScriptProvider>
          )}

          {(state === "idle" || state === "error") && (!clientId || !planId) && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {lang === "zh"
                ? "支付功能尚未配置。请管理员添加 PayPal 环境变量。"
                : "Payment is not configured yet. Please add PayPal environment variables."}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {lang === "zh"
              ? "由 PayPal 加密保护 · 随时取消 · 无隐藏费用"
              : "Encrypted by PayPal · Cancel anytime · No hidden fees"}
          </div>
        </div>
      </div>
    </div>
  );
}
