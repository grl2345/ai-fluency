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

export function planDisplayName(plan: PlanKey, lang: "zh" | "en"): string {
  const names: Record<PlanKey, { zh: string; en: string }> = {
    starter: { zh: "入门版", en: "Starter" },
    pro: { zh: "专业版", en: "Pro" },
    team: { zh: "团队版", en: "Team" },
  };
  return names[plan][lang];
}

export function planPrice(plan: PlanKey, lang: "zh" | "en"): string {
  const prices: Record<PlanKey, { zh: string; en: string }> = {
    starter: { zh: "¥9.9/月", en: "$9.9/month" },
    pro: { zh: "¥19.9/月", en: "$19.9/month" },
    team: { zh: "¥49.9/月", en: "$49.9/month" },
  };
  return prices[plan][lang];
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
