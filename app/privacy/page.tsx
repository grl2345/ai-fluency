"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { useLang } from "@/contexts/language-context";

export default function PrivacyPage() {
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
          {zh ? "隐私政策" : "Privacy Policy"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {zh ? "最后更新：2025 年 6 月" : "Last updated: June 2025"}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "1. 我们收集的信息" : "1. Information We Collect"}</h2>
            <p>
              {zh
                ? "注册信息：邮箱地址、显示名称（通过 Google 或 GitHub 第三方登录获取）。测评数据：您的答题记录、测评结果和报告。使用数据：访问时间、页面浏览、设备信息等基础分析数据。付款信息：通过 PayPal 处理，我们不直接存储您的信用卡或银行卡信息。"
                : "Registration data: email address, display name (obtained via Google or GitHub sign-in). Assessment data: your answers, results, and reports. Usage data: visit times, page views, device information, and basic analytics. Payment data: processed through PayPal — we do not store your credit card or bank details directly."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "2. 信息用途" : "2. How We Use Your Information"}</h2>
            <p>
              {zh
                ? "我们使用您的信息来：提供和改进测评服务，生成个性化报告和建议，处理订阅和付款，发送重要的服务通知，以及进行匿名化的统计分析以改善产品。"
                : "We use your information to: deliver and improve the assessment service, generate personalized reports and recommendations, process subscriptions and payments, send important service notices, and perform anonymized statistical analysis to improve the product."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "3. 数据共享" : "3. Data Sharing"}</h2>
            <p>
              {zh
                ? "我们不会将您的个人数据出售给第三方。我们仅在以下情况下共享数据：与 PayPal 共享必要的交易信息以处理付款；与 Supabase（我们的数据库提供商）共享以存储您的账户和测评数据；当法律要求时。"
                : "We do not sell your personal data to third parties. We share data only: with PayPal to process payments (necessary transaction data); with Supabase (our database provider) to store your account and assessment data; and when required by law."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "4. 数据安全" : "4. Data Security"}</h2>
            <p>
              {zh
                ? "我们使用行级安全性（RLS）确保用户只能访问自己的数据。所有通信通过 HTTPS 加密传输。付款通过 PayPal 的安全基础设施处理。但请注意，没有任何在线传输方式是 100% 安全的。"
                : "We use row-level security (RLS) to ensure users can only access their own data. All communications are encrypted via HTTPS. Payments are processed through PayPal's secure infrastructure. However, no method of online transmission is 100% secure."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "5. Cookie 与分析" : "5. Cookies & Analytics"}</h2>
            <p>
              {zh
                ? "我们使用必要的 Cookie 来维持登录状态。我们使用 Vercel Analytics 收集匿名的网站使用统计数据，不追踪个人身份信息。"
                : "We use essential cookies to maintain your login session. We use Vercel Analytics to collect anonymous site usage statistics; no personally identifiable information is tracked."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "6. 数据保留" : "6. Data Retention"}</h2>
            <p>
              {zh
                ? "您的测评报告在账户有效期间永久保留。如果您删除账户，我们将在 30 天内删除您的个人数据。匿名化的统计数据可能会被保留。"
                : "Your assessment reports are retained permanently while your account is active. If you delete your account, your personal data will be removed within 30 days. Anonymized statistical data may be retained."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "7. 您的权利" : "7. Your Rights"}</h2>
            <p>
              {zh
                ? "您有权访问、更正或删除您的个人数据，取消订阅通知邮件，以及申请导出您的数据。请通过 support@aifluency.app 联系我们行使这些权利。"
                : "You have the right to access, correct, or delete your personal data, unsubscribe from notification emails, and request a data export. Contact us at support@aifluency.app to exercise these rights."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "8. 儿童隐私" : "8. Children's Privacy"}</h2>
            <p>
              {zh
                ? "本平台不面向 16 岁以下的儿童。我们不会有意收集未成年人的个人信息。"
                : "The Platform is not directed at children under 16. We do not knowingly collect personal information from minors."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "9. 联系我们" : "9. Contact"}</h2>
            <p>
              {zh
                ? "如对隐私政策有任何疑问，请通过 support@aifluency.app 联系我们。"
                : "For privacy-related questions, reach us at support@aifluency.app."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
