import type { PlanKey } from "@/lib/plans";

export type { PlanKey };
export type SubscriptionStatus = "active" | "cancelled" | "suspended" | "expired";

export type BillingInfo = {
  nextBillingTime: string | null;
  lastPaymentAmount: string | null;
  lastPaymentCurrency: string | null;
  lastPaymentTime: string | null;
};

export type UserSubscription = {
  plan: PlanKey;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  paypalSubscriptionId: string;
  billing: BillingInfo | null;
};

export function isActiveSubscription(sub: UserSubscription | null | undefined): boolean {
  return sub?.status === "active";
}

export function planDisplayName(_plan: PlanKey, lang: "zh" | "en"): string {
  return lang === "zh" ? "完整报告" : "Full Report";
}

export function planPrice(_plan: PlanKey, lang: "zh" | "en"): string {
  return lang === "zh" ? "¥49.9" : "$49.9";
}

export function statusDisplayName(status: SubscriptionStatus, lang: "zh" | "en"): string {
  const map: Record<SubscriptionStatus, { zh: string; en: string }> = {
    active: { zh: "生效中", en: "Active" },
    cancelled: { zh: "已取消", en: "Cancelled" },
    suspended: { zh: "已暂停", en: "Suspended" },
    expired: { zh: "已过期", en: "Expired" },
  };
  return map[status][lang];
}

export function formatBillingDate(iso: string | null, lang: "zh" | "en"): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
