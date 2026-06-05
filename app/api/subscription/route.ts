import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/paypal";
import type { BillingInfo, PlanKey, SubscriptionStatus, UserSubscription } from "@/lib/subscription";

async function fetchBillingInfo(paypalSubscriptionId: string): Promise<BillingInfo | null> {
  try {
    const paypal = await getSubscription(paypalSubscriptionId);
    const lastPayment = paypal.billing_info?.last_payment;
    return {
      nextBillingTime: paypal.billing_info?.next_billing_time ?? null,
      lastPaymentAmount: lastPayment?.amount?.value ?? null,
      lastPaymentCurrency: lastPayment?.amount?.currency_code ?? null,
      lastPaymentTime: lastPayment?.time ?? null,
    };
  } catch (err) {
    console.error("PayPal billing fetch error:", err);
    return null;
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ subscription: null }, { status: 401 });
    }

    const { data: row } = await supabase
      .from("subscriptions")
      .select("plan, status, created_at, updated_at, paypal_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!row) {
      return NextResponse.json({ subscription: null });
    }

    const billing =
      row.status === "active" && row.paypal_subscription_id
        ? await fetchBillingInfo(row.paypal_subscription_id)
        : null;

    const subscription: UserSubscription = {
      plan: row.plan as PlanKey,
      status: row.status as SubscriptionStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      paypalSubscriptionId: row.paypal_subscription_id,
      billing,
    };

    return NextResponse.json({ subscription });
  } catch (err) {
    console.error("subscription GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
