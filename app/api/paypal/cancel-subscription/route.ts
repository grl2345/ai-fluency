import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelSubscription } from "@/lib/paypal";

// User session + RLS: user can only read/update their own subscription.
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("paypal_subscription_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!sub?.paypal_subscription_id) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    const ok = await cancelSubscription(sub.paypal_subscription_id, "User requested cancellation");
    if (!ok) {
      return NextResponse.json({ error: "PayPal cancel failed" }, { status: 500 });
    }

    const { error: dbError } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (dbError) {
      console.error("DB update error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("cancel-subscription error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
