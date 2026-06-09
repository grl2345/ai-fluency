"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { useLang } from "@/contexts/language-context";

export default function TermsPage() {
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
          {zh ? "服务条款" : "Terms of Service"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {zh ? "最后更新：2025 年 6 月" : "Last updated: June 2025"}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "1. 服务概述" : "1. Service Overview"}</h2>
            <p>
              {zh
                ? "AI Fluency Check（以下简称「本平台」）是由 AI Fluency 运营的在线 AI 素养测评服务，网站地址为 aifluencycheck.com。如有任何疑问，请通过 support@aifluency.app 联系我们。用户可以通过完成测评获取个性化的 AI 能力报告和提升建议。"
                : "AI Fluency Check (\"the Platform\") is an online AI literacy assessment service operated by AI Fluency at aifluencycheck.com. For inquiries, contact us at support@aifluency.app. Users complete assessments to receive personalized AI competency reports and improvement recommendations."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "2. 账户与资格" : "2. Accounts & Eligibility"}</h2>
            <p>
              {zh
                ? "使用本平台需注册账户。您必须年满 16 周岁，并提供真实、准确的注册信息。您有责任保护自己的账户安全，对账户下的所有活动负责。"
                : "You must register an account to use the Platform. You must be at least 16 years old and provide accurate registration information. You are responsible for maintaining the security of your account and for all activities under it."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "3. 服务与付费" : "3. Services & Payment"}</h2>
            <p>
              {zh
                ? "本平台提供免费 AI 素养测评。完成测评后，您可以通过一次性付费（$49.9 / ¥49.9）解锁完整报告，包括六维度详细分析、个性化建议和可分享证书。所有费用通过 PayPal 处理。详情请参阅我们的退款政策。"
                : "The Platform offers a free AI literacy assessment. After completing the assessment, you can unlock the full report through a one-time payment ($49.9) that includes detailed six-dimension analysis, personalized recommendations, and a shareable certificate. All payments are processed through PayPal. See our Refund Policy for details."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "4. 知识产权" : "4. Intellectual Property"}</h2>
            <p>
              {zh
                ? "本平台的测评题目、评估框架、报告模板及所有内容均为平台的知识产权。您有权查看和使用自己的报告，但不得复制、分发或商业化使用平台的测评内容。"
                : "Assessment questions, evaluation frameworks, report templates, and all Platform content are our intellectual property. You may view and use your own reports but may not copy, distribute, or commercially exploit the assessment content."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "5. 使用规范" : "5. Acceptable Use"}</h2>
            <p>
              {zh
                ? "您同意不以任何自动化方式（如爬虫、脚本）访问平台，不分享答案或转售报告，不干扰或破坏平台的正常运行。违规行为可能导致账户被暂停或终止。"
                : "You agree not to access the Platform through automated means (scrapers, bots), not to share assessment answers or resell reports, and not to interfere with the Platform's normal operation. Violations may result in account suspension or termination."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "6. 免责声明" : "6. Disclaimers"}</h2>
            <p>
              {zh
                ? '测评结果仅供参考，不构成任何职业建议或资质认证。本平台按「现状」提供服务，不对结果的绝对准确性作出保证。'
                : 'Assessment results are for informational purposes only and do not constitute professional advice or certification. The Platform is provided "as is" without warranty of absolute accuracy of results.'}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "7. 责任限制" : "7. Limitation of Liability"}</h2>
            <p>
              {zh
                ? "在适用法律允许的最大范围内，本平台不对任何间接、附带或后果性损失承担责任。我们的最大赔偿责任不超过您在事件发生前 12 个月内向我们支付的总金额。"
                : "To the maximum extent permitted by law, the Platform shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the event."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "8. 条款变更" : "8. Changes to Terms"}</h2>
            <p>
              {zh
                ? "我们可能不时更新这些条款。重大变更会通过邮件或平台通知您。继续使用平台即表示您接受更新后的条款。"
                : "We may update these terms from time to time. Material changes will be communicated via email or Platform notification. Continued use of the Platform constitutes acceptance of updated terms."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "9. 联系我们" : "9. Contact"}</h2>
            <p>
              {zh
                ? "如有任何问题，请通过 support@aifluency.app 联系我们。"
                : "For any questions, reach us at support@aifluency.app."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
