// PayPal REST API helpers (server-side only)

import type { PlanKey } from "@/lib/plans";

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to get PayPal access token");
  const data = await res.json();
  return data.access_token as string;
}

export async function getSubscription(subscriptionId: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}

export async function cancelSubscription(subscriptionId: string, reason: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  return res.ok;
}

export const PLAN_IDS: Record<PlanKey, string> = {
  starter: process.env.PAYPAL_PLAN_ID_STARTER ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_STARTER ?? "",
  pro: process.env.PAYPAL_PLAN_ID_PRO ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO ?? "",
  team: process.env.PAYPAL_PLAN_ID_TEAM ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_TEAM ?? "",
};

export type { PlanKey };
