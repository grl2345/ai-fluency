import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const HANDLED_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "PAYMENT.SALE.COMPLETED",
]);

// Service role: PayPal server callbacks have no user session, so RLS is bypassed.
export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
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

    const { error: dbError } = await supabaseAdmin
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("paypal_subscription_id", subscriptionId);

    if (dbError) {
      console.error("Webhook DB update error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
