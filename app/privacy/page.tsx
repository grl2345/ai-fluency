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
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "1. 运营主体" : "1. Data Controller"}</h2>
            <p>
              {zh
                ? "AI Fluency Check 由 AI Fluency 运营（以下简称「我们」）。数据控制者联系方式：support@aifluency.app。我们负责您的个人数据的处理和保护。"
                : "AI Fluency Check is operated by AI Fluency (\"we\", \"us\"). Data controller contact: support@aifluency.app. We are responsible for the processing and protection of your personal data."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "2. 我们收集的信息" : "2. Information We Collect"}</h2>
            <p>
              {zh
                ? "注册信息：邮箱地址、显示名称（通过 Google 或 GitHub 第三方登录获取）。测评数据：您的答题记录、测评结果和报告。使用数据：访问时间、页面浏览、设备信息等基础分析数据。付款信息：通过 PayPal 处理，我们不直接存储您的信用卡或银行卡信息。"
                : "Registration data: email address, display name (obtained via Google or GitHub sign-in). Assessment data: your answers, results, and reports. Usage data: visit times, page views, device information, and basic analytics. Payment data: processed through PayPal — we do not store your credit card or bank details directly."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "3. 法律依据与信息用途" : "3. Legal Basis & How We Use Your Information"}</h2>
            <p>
              {zh
                ? "我们基于以下法律依据处理您的数据：合同履行（提供测评服务、生成报告、处理付款）；合法利益（改善产品、防止滥用）；法律义务（当法律要求时）。我们使用您的信息来：提供和改进测评服务，生成个性化报告和建议，处理付款，发送重要的服务通知，以及进行匿名化的统计分析。"
                : "We process your data under the following legal bases: contractual necessity (providing assessment services, generating reports, processing payments); legitimate interests (improving our product, preventing abuse); and legal obligations (when required by law). We use your information to: deliver and improve the assessment service, generate personalized reports and recommendations, process payments, send important service notices, and perform anonymized statistical analysis."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "4. 数据共享与第三方服务" : "4. Data Sharing & Third-Party Services"}</h2>
            <p>
              {zh
                ? "我们不会将您的个人数据出售给第三方。我们仅与以下服务提供商共享必要数据：PayPal（付款处理）、Supabase（数据库与身份验证）、Vercel（网站托管与匿名分析）。这些服务均作为数据处理者，受其各自的数据处理协议（DPA）约束。当法律要求时，我们也可能披露数据。"
                : "We do not sell your personal data to third parties. We share necessary data only with the following service providers: PayPal (payment processing), Supabase (database and authentication), and Vercel (website hosting and anonymous analytics). These services act as data processors and are bound by their respective Data Processing Agreements (DPAs). We may also disclose data when required by law."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "5. 跨境数据传输" : "5. International Data Transfers"}</h2>
            <p>
              {zh
                ? "您的数据可能会被传输到您所在国家/地区以外的服务器进行处理（包括美国）。我们通过使用符合 GDPR 标准的服务提供商及其数据处理协议来保护您的数据安全。"
                : "Your data may be transferred to and processed on servers located outside your country/region, including the United States. We protect your data by using service providers that comply with GDPR standards and maintain appropriate Data Processing Agreements."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "6. 数据安全" : "6. Data Security"}</h2>
            <p>
              {zh
                ? "我们使用行级安全性（RLS）确保用户只能访问自己的数据。所有通信通过 HTTPS 加密传输。付款通过 PayPal 的安全基础设施处理。但请注意，没有任何在线传输方式是 100% 安全的。"
                : "We use row-level security (RLS) to ensure users can only access their own data. All communications are encrypted via HTTPS. Payments are processed through PayPal's secure infrastructure. However, no method of online transmission is 100% secure."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "7. Cookie 与分析" : "7. Cookies & Analytics"}</h2>
            <p>
              {zh
                ? "我们使用必要的 Cookie 来维持登录状态。我们使用 Vercel Analytics 收集匿名的网站使用统计数据，不追踪个人身份信息。您可以通过浏览器设置管理 Cookie 偏好。"
                : "We use essential cookies to maintain your login session. We use Vercel Analytics to collect anonymous site usage statistics; no personally identifiable information is tracked. You can manage cookie preferences through your browser settings."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "8. 数据保留" : "8. Data Retention"}</h2>
            <p>
              {zh
                ? "您的测评报告在账户有效期间永久保留。如果您删除账户，我们将在 30 天内删除您的个人数据。匿名化的统计数据可能会被保留。"
                : "Your assessment reports are retained permanently while your account is active. If you delete your account, your personal data will be removed within 30 days. Anonymized statistical data may be retained."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "9. 您的权利（GDPR）" : "9. Your Rights (GDPR)"}</h2>
            <p>
              {zh
                ? "根据 GDPR 及其他适用法律，您有权：访问您的个人数据（知情权）；更正不准确的信息（更正权）；删除您的个人数据（被遗忘权）；限制或反对处理；请求数据可移植性（以结构化格式导出您的数据）；撤回同意。请通过 support@aifluency.app 联系我们行使这些权利，我们将在 30 天内响应。您也有权向您所在地的数据保护机构投诉。"
                : "Under the GDPR and other applicable laws, you have the right to: access your personal data (right of access); correct inaccurate information (right to rectification); delete your personal data (right to erasure / right to be forgotten); restrict or object to processing; request data portability (export your data in a structured format); and withdraw consent. Contact us at support@aifluency.app to exercise these rights — we will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "10. 加州消费者隐私权利（CCPA）" : "10. California Consumer Privacy Rights (CCPA)"}</h2>
            <p>
              {zh
                ? "如果您是加州居民，您有权：了解我们收集、使用和共享您的哪些个人信息；请求删除您的个人信息；拒绝出售个人信息。我们不出售您的个人信息。如需行使这些权利，请发送邮件至 support@aifluency.app。"
                : "If you are a California resident, you have the right to: know what personal information we collect, use, and share; request deletion of your personal information; and opt out of the sale of personal information. We do not sell your personal information. To exercise these rights, email support@aifluency.app."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "11. 儿童隐私" : "11. Children's Privacy"}</h2>
            <p>
              {zh
                ? "本平台不面向 16 岁以下的儿童。我们不会有意收集未成年人的个人信息。"
                : "The Platform is not directed at children under 16. We do not knowingly collect personal information from minors."}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-white">{zh ? "12. 联系我们" : "12. Contact"}</h2>
            <p>
              {zh
                ? "如对隐私政策有任何疑问，或需要行使您的数据权利，请通过 support@aifluency.app 联系我们。"
                : "For privacy-related questions or to exercise your data rights, reach us at support@aifluency.app."}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
