import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const HANDLED_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "PAYMENT.SALE.COMPLETED",
]);

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json();
    const eventType: string = body.event_type ?? "";

    if (!HANDLED_EVENTS.has(eventType)) {
      return NextResponse.json({ received: true });
    }

    const resource = body.resource ?? {};
    const subscriptionId: string = resource.id ?? resource.billing_agreement_id ?? "";

    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    let status: "active" | "cancelled" | "suspended" | "expired" = "active";
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") status = "cancelled";
    else if (eventType === "BILLING.SUBSCRIPTION.SUSPENDED") status = "suspended";
    else if (eventType === "BILLING.SUBSCRIPTION.EXPIRED") status = "expired";
    else if (eventType === "PAYMENT.SALE.COMPLETED") {
      // Just ensure status stays active on successful payment
      status = "active";
    }

    await supabaseAdmin
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("paypal_subscription_id", subscriptionId);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
