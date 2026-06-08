"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { useLang } from "@/contexts/language-context";

export default function RefundPage() {
  const { lang } = useLang();
  const zh = lang === "zh";

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 antialiased">
      <nav className="border-b border-white/[0.06] bg-[#0a0a16]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Brain className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              {zh ? "AI 素养" : "AI Fluency"}
            </span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {zh ? "退款政策" : "Refund Policy"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {zh ? "最后更新：2025 年 6 月" : "Last updated: June 2025"}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "订阅取消" : "Subscription Cancellation"}</h2>
            <p>
              {zh
                ? "您可以随时从账户设置页面取消订阅，无需联系客服。取消后，您的服务将持续到当前计费周期结束。计费周期结束后，将不再扣费，且付费功能将停止使用。"
                : "You can cancel your subscription at any time from your account settings — no need to contact support. After cancellation, your service continues until the end of the current billing period. No further charges will be made, and paid features will stop at the end of the cycle."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "退款申请" : "Refund Requests"}</h2>
            <p>
              {zh
                ? "如果您在订阅后 7 天内且尚未使用测评服务（未开始任何测评），您可以申请全额退款。请发送邮件至 support@aifluency.app，附上您的注册邮箱和 PayPal 交易 ID。"
                : "If you request a refund within 7 days of subscribing and have not used the assessment service (no assessment started), you are eligible for a full refund. Email support@aifluency.app with your registered email and PayPal transaction ID."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "不予退款的情况" : "Non-Refundable Scenarios"}</h2>
            <p>
              {zh
                ? "以下情况不予退款：已完成或开始测评后；订阅超过 7 天后；因违反服务条款被终止的账户。"
                : "Refunds are not available: after an assessment has been started or completed; more than 7 days after subscribing; or for accounts terminated due to Terms of Service violations."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "退款处理" : "Refund Processing"}</h2>
            <p>
              {zh
                ? "退款将通过 PayPal 原路返回，通常在 5-10 个工作日内处理完毕。退款金额为原始支付金额，不含 PayPal 交易手续费（如有）。"
                : "Refunds are processed back to your PayPal account, typically within 5–10 business days. The refund amount is the original payment minus any PayPal transaction fees (if applicable)."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "联系我们" : "Contact"}</h2>
            <p>
              {zh
                ? "如有任何退款相关问题，请通过 support@aifluency.app 联系我们，我们将在 48 小时内回复。"
                : "For any refund-related questions, email support@aifluency.app — we respond within 48 hours."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
