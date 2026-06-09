"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Brain, ChevronRight, CreditCard, Loader2, LogOut,
  Calendar, Receipt, Shield, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { NavAuthMenu, redirectToSignIn } from "@/components/auth-ui";
import { useSubscription } from "@/components/subscription-provider";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import {
  formatBillingDate,
  planDisplayName,
  planPrice,
  statusDisplayName,
} from "@/lib/subscription";

function signOut() {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/auth/logout";
  document.body.appendChild(form);
  form.submit();
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, refresh, hasActiveSubscription } = useSubscription();
  const { lang, setLang } = useLang();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      redirectToSignIn("/account");
    }
  }, [authLoading, user]);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch("/api/paypal/cancel-subscription", { method: "POST" });
      if (!res.ok) throw new Error("cancel failed");
      setShowCancelConfirm(false);
      await refresh();
    } catch {
      setCancelError(t(UI.billing.cancelError, lang));
    } finally {
      setCancelling(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const billing = subscription?.billing;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Brain className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">{t(UI.nav.brand, lang)}</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="rounded px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
            <NavAuthMenu />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            {t(UI.billing.sectionPill, lang)}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{t(UI.billing.title, lang)}</h1>
          <p className="mt-2 text-slate-500">{t(UI.billing.subtitle, lang)}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Current plan */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Shield className="h-4 w-4" />
              {t(UI.billing.currentPlan, lang)}
            </div>

            {subLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t(UI.billing.loading, lang)}
              </div>
            ) : hasActiveSubscription && subscription ? (
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{planDisplayName(subscription.plan, lang)}</h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {statusDisplayName(subscription.status, lang)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{planPrice(subscription.plan, lang)}</p>
                <p className="mt-4 text-sm text-slate-600">
                  {t(UI.billing.memberSince, lang)}{" "}
                  <span className="font-medium">{formatBillingDate(subscription.createdAt, lang)}</span>
                </p>
              </div>
            ) : subscription && subscription.status === "cancelled" ? (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{planDisplayName(subscription.plan, lang)}</h2>
                <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {statusDisplayName(subscription.status, lang)}
                </span>
                <p className="mt-3 text-sm text-amber-700">{t(UI.billing.cancelledNote, lang)}</p>
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{lang === "zh" ? "未订阅" : "No plan"}</h2>
                <p className="mt-1 text-sm text-slate-500">{t(UI.billing.noPlanDesc, lang)}</p>
                <Link
                  href="/#pricing"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  {t(UI.billing.upgradeCta, lang)}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          {/* Billing details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <CreditCard className="h-4 w-4" />
              {t(UI.billing.billingInfo, lang)}
            </div>

            {subLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t(UI.billing.loading, lang)}
              </div>
            ) : hasActiveSubscription && billing ? (
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {t(UI.billing.nextBilling, lang)}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {formatBillingDate(billing.nextBillingTime, lang)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Receipt className="h-3.5 w-3.5" />
                    {t(UI.billing.lastPayment, lang)}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {billing.lastPaymentAmount
                      ? `${billing.lastPaymentCurrency ?? ""} ${billing.lastPaymentAmount}`
                      : "—"}
                    {billing.lastPaymentTime && (
                      <span className="ml-2 font-normal text-slate-500">
                        · {formatBillingDate(billing.lastPaymentTime, lang)}
                      </span>
                    )}
                  </dd>
                </div>
                <p className="text-xs text-slate-400">{t(UI.billing.paypalNote, lang)}</p>
              </dl>
            ) : hasActiveSubscription ? (
              <p className="mt-5 text-sm text-slate-500">{t(UI.billing.billingPending, lang)}</p>
            ) : (
              <p className="mt-5 text-sm text-slate-500">{t(UI.billing.noBilling, lang)}</p>
            )}
          </section>
        </div>

        {/* Actions */}
        {hasActiveSubscription && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">{t(UI.billing.manageTitle, lang)}</h3>
            <p className="mt-1 text-sm text-slate-500">{t(UI.billing.manageDesc, lang)}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {subscription?.plan === "starter" && (
                <Link
                  href="/#pricing"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {lang === "zh" ? "升级专业版" : "Upgrade to Pro"}
                </Link>
              )}
              {subscription?.plan === "pro" && (
                <Link
                  href="/#pricing"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t(UI.billing.upgradeToTeam, lang)}
                </Link>
              )}
              {!showCancelConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="inline-flex items-center rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  {t(UI.billing.cancelPlan, lang)}
                </button>
              ) : (
                <div className="w-full rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{t(UI.billing.cancelConfirm, lang)}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={cancelling}
                          onClick={handleCancel}
                          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                        >
                          {cancelling ? t(UI.billing.cancelling, lang) : t(UI.billing.confirmCancel, lang)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCancelConfirm(false)}
                          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-white"
                        >
                          {t(UI.billing.keepPlan, lang)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {cancelError && (
              <p className="mt-3 text-sm text-red-600">{cancelError}</p>
            )}
          </section>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            ← {t(UI.billing.backHome, lang)}
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <LogOut className="h-4 w-4" />
            {t(UI.nav.logout, lang)}
          </button>
        </div>
      </main>
    </div>
  );
}
