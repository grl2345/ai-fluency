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
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "退款申请" : "Refund Requests"}</h2>
            <p>
              {zh
                ? "如果您在付费后 14 天内且尚未查看完整报告，您可以申请全额退款。请发送邮件至 support@aifluency.app，附上您的注册邮箱和 PayPal 交易 ID。"
                : "If you request a refund within 14 days of payment and have not viewed the full report, you are eligible for a full refund. Email support@aifluency.app with your registered email and PayPal transaction ID."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "不予退款的情况" : "Non-Refundable Scenarios"}</h2>
            <p>
              {zh
                ? "以下情况不予退款：已查看完整报告后；付费超过 14 天后；因违反服务条款被终止的账户。"
                : "Refunds are not available: after the full report has been viewed; more than 14 days after payment; or for accounts terminated due to Terms of Service violations."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "退款处理" : "Refund Processing"}</h2>
            <p>
              {zh
                ? "退款将通过 PayPal 原路返回，通常在 5-10 个工作日内处理完毕。退款金额为原始支付金额，不含 PayPal 交易手续费（如有）。"
                : "Refunds are processed back to your PayPal account, typically within 5-10 business days. The refund amount is the original payment minus any PayPal transaction fees (if applicable)."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "欧盟消费者权利" : "EU Consumer Rights"}</h2>
            <p>
              {zh
                ? "根据欧盟消费者权利指令，您有 14 天的冷静期可以无理由退款。如果您在冷静期内已查看完整报告（即开始使用数字内容），您确认放弃冷静期退款权利。"
                : "Under the EU Consumer Rights Directive, you have a 14-day cooling-off period during which you may request a refund without reason. If you have viewed the full report (i.e., started using the digital content) within the cooling-off period, you acknowledge that you waive your right to withdraw."}
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
