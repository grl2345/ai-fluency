import Link from "next/link";

const HINTS: Record<string, string> = {
  missing_env:
    "Vercel 未配置 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY，请在项目 Environment Variables 中添加后重新部署。",
  no_code:
    "OAuth 回调未携带授权码。请在 Supabase → Authentication → URL Configuration 中添加：https://www.aifluencycheck.com/auth/callback",
  oauth_start_failed:
    "无法发起 OAuth 登录。请检查 Supabase 是否已启用 Google/GitHub Provider。",
};

function hintForReason(reason: string | undefined) {
  if (!reason) {
    return "Google 或 GitHub 授权未完成。请检查 Supabase 与 OAuth 提供商的回调配置。";
  }
  if (HINTS[reason]) return HINTS[reason];
  if (reason.includes("redirect") || reason.includes("Redirect")) {
    return `回调地址未在白名单中：${reason}。请在 Supabase → URL Configuration 的 Redirect URLs 添加 https://你的域名/auth/callback`;
  }
  return reason;
}

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const hint = hintForReason(reason);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Sign-in failed</h1>
      <p className="max-w-md text-slate-600">{hint}</p>
      {reason && reason !== "missing_env" && reason !== "no_code" && (
        <p className="max-w-md break-all text-xs text-slate-400">{reason}</p>
      )}
      <Link
        href="/sign-in"
        className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Try signing in again
      </Link>
    </main>
  );
}
