"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brain, ChevronDown, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useSubscription } from "@/components/subscription-provider";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { planDisplayName } from "@/lib/subscription";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function loginHref(provider: "google" | "github", next?: string) {
  const params = new URLSearchParams({ provider });
  if (next) params.set("next", next);
  return `/auth/login?${params.toString()}`;
}

function signOut() {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/auth/logout";
  document.body.appendChild(form);
  form.submit();
}

export function OAuthButton({
  provider,
  next,
  className = "",
}: {
  provider: "google" | "github";
  next?: string;
  className?: string;
}) {
  const { lang } = useLang();
  const label =
    provider === "google"
      ? t(UI.auth.continueWithGoogle, lang)
      : t(UI.auth.continueWithGithub, lang);

  return (
    <a
      href={loginHref(provider, next)}
      className={`flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] ${className}`}
    >
      {provider === "google" ? (
        <GoogleIcon className="h-5 w-5 shrink-0" />
      ) : (
        <GitHubIcon className="h-5 w-5 shrink-0 text-slate-900" />
      )}
      {label}
    </a>
  );
}

export function SignInCard({ next = "/" }: { next?: string }) {
  const { lang } = useLang();

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t(UI.auth.title, lang)}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {t(UI.auth.subtitle, lang)}
        </p>
      </div>

      <div className="space-y-3">
        <OAuthButton provider="google" next={next} />
        <OAuthButton provider="github" next={next} />
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
        {lang === "zh" ? "登录即表示你同意我们的" : "By signing in, you agree to our "}
        <a href="/terms" className="text-indigo-500 hover:underline">{lang === "zh" ? "服务条款" : "Terms of Service"}</a>
        {lang === "zh" ? "与" : " and "}
        <a href="/privacy" className="text-indigo-500 hover:underline">{lang === "zh" ? "隐私政策" : "Privacy Policy"}</a>
        {lang === "zh" ? "。" : "."}
      </p>

      <div className="mt-6 border-t border-slate-100 pt-6 text-center">
        <p className="text-sm text-slate-500">{t(UI.auth.noAccount, lang)}</p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          {t(UI.auth.backHome, lang)}
        </Link>
      </div>
    </div>
  );
}

export function NavAuthMenu({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription } = useSubscription();
  const { lang } = useLang();
  const isDark = variant === "dark";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined);
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "User";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-1.5 transition-all ${
          isDark
            ? "border border-white/15 bg-white/8 hover:border-white/30 hover:bg-white/15"
            : "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={displayName}
        title={displayName}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
            isDark ? "bg-indigo-500/30 text-indigo-200" : "bg-indigo-100 text-indigo-700"
          }`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""} ${
          isDark ? "text-white/50" : "text-slate-400"
        }`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/60"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {t(UI.auth.signedInAs, lang)}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">{displayName}</p>
            {user.email && (
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            )}
            {hasActiveSubscription && subscription && (
              <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                {planDisplayName(subscription.plan, lang)}
              </span>
            )}
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <CreditCard className="h-4 w-4 text-slate-400" />
            {t(UI.nav.billing, lang)}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            {t(UI.nav.logout, lang)}
          </button>
        </div>
      )}
    </div>
  );
}

export function redirectToSignIn(next?: string) {
  const target = next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in";
  window.location.href = target;
}
