"use client";

import React, { useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, Check, Loader2, ShieldCheck } from "lucide-react";
import { useLang } from "@/contexts/language-context";
interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const REPORT_DETAILS = {
  name: { en: "Full Report", zh: "完整报告" },
  price: { en: "$49.9", zh: "¥49.9" },
  features: {
    en: ["Detailed 6-dimension report", "Personalized improvement plan", "Peer benchmark comparison", "Shareable professional certificate", "Full learning path", "Email support"],
    zh: ["六维度详细报告", "个性化提升建议", "能力对标分析", "可分享专业证书", "完整学习路径", "邮件支持"],
  },
} as const;

type ModalState = "idle" | "processing" | "success" | "error";

export function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const { lang } = useLang();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_REPORT ?? "";

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
        body: JSON.stringify({ subscriptionId, planKey: "pro" }),
      });
      if (!res.ok) throw new Error("Verification failed");
      setState("success");
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch {
      setState("error");
      setErrorMsg(lang === "zh" ? "支付验证失败，请联系客服。" : "Payment verification failed. Please contact support.");
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
              {lang === "zh" ? "解锁完整报告" : "Unlock Full Report"}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === "zh" ? "一次付费 · 通过 PayPal 安全支付" : "One-time payment · Secure payment via PayPal"}
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-end gap-1">
          <span className="text-4xl font-black text-slate-900">{REPORT_DETAILS.price[lang]}</span>
        </div>

        <ul className="mb-5 space-y-2">
          {REPORT_DETAILS.features[lang].map((f) => (
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
