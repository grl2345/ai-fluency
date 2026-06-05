"use client";

import React, { useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, Check, Loader2, ShieldCheck } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import type { PlanKey } from "@/lib/plans";

interface PaymentModalProps {
  plan: PlanKey;
  onClose: () => void;
  onSuccess: (plan: PlanKey) => void;
}

const PLAN_DETAILS = {
  starter: {
    name: { en: "Starter", zh: "入门版" },
    price: { en: "$9.9", zh: "¥9.9" },
    period: { en: "/month", zh: "/月" },
    features: {
      en: ["Unlimited assessments", "Six-dimension radar chart", "Basic capability report", "Assessment history"],
      zh: ["无限次测评", "六维能力雷达图", "基础能力报告", "测评历史记录"],
    },
  },
  pro: {
    name: { en: "Pro", zh: "专业版" },
    price: { en: "$19.9", zh: "¥19.9" },
    period: { en: "/month", zh: "/月" },
    features: {
      en: ["All Starter features", "History & trend analysis", "Full personalized learning path", "Shareable professional certificate", "Priority support"],
      zh: ["包含入门版全部功能", "详细历史与趋势分析", "完整个性化学习路径", "可分享的专业证书", "优先客户支持"],
    },
  },
  team: {
    name: { en: "Team", zh: "团队版" },
    price: { en: "$49.9", zh: "¥49.9" },
    period: { en: "/month", zh: "/月" },
    features: {
      en: ["All Pro features", "Team capability dashboard", "Member management (up to 10)", "Bulk report export (PDF/Excel)", "Dedicated success manager"],
      zh: ["包含专业版全部功能", "团队整体能力看板", "成员管理（最多10人）", "批量导出报告 (PDF/Excel)", "专属客户成功经理"],
    },
  },
} as const;

const PUBLIC_PLAN_IDS: Record<PlanKey, string> = {
  starter: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_STARTER ?? "",
  pro: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO ?? "",
  team: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_TEAM ?? "",
};

type ModalState = "idle" | "processing" | "success" | "error";

export function PaymentModal({ plan, onClose, onSuccess }: PaymentModalProps) {
  const { lang } = useLang();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const details = PLAN_DETAILS[plan];
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const planId = PUBLIC_PLAN_IDS[plan];

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === "zh" ? `升级至${details.name.zh}` : `Upgrade to ${details.name.en}`}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === "zh" ? "通过 PayPal 安全支付" : "Secure payment via PayPal"}
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-end gap-1">
          <span className="text-4xl font-black text-slate-900">{details.price[lang]}</span>
          <span className="mb-1 text-sm text-slate-400">{details.period[lang]}</span>
        </div>

        <ul className="mb-5 space-y-2">
          {details.features[lang].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>

        {state === "success" && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <Check className="h-4 w-4" />
            {lang === "zh" ? "订阅已激活！" : "Subscription activated!"}
          </div>
        )}

        {state === "error" && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {state === "processing" && (
          <div className="mb-4 flex items-center justify-center gap-2 py-4 text-slate-500">
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
              currency: "USD",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", shape: "rect", label: "subscribe" }}
              createSubscription={(_data, actions) =>
                actions.subscription.create({ plan_id: planId })
              }
              onApprove={async (data) => {
                if (data.subscriptionID) handleApprove(data.subscriptionID);
              }}
              onError={() => {
                setState("error");
                setErrorMsg(lang === "zh" ? "支付失败，请重试。" : "Payment failed. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        )}

        {(state === "idle" || state === "error") && (!clientId || !planId) && (
          <p className="text-center text-sm text-red-500">
            {lang === "zh" ? "支付配置未完成，请联系管理员。" : "Payment not configured. Contact support."}
          </p>
        )}
      </div>
    </div>
  );
}
