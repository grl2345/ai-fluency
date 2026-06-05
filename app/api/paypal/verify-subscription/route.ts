import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/paypal";
import { PLAN_KEYS, type PlanKey } from "@/lib/plans";

const VALID_PLANS = new Set<PlanKey>(PLAN_KEYS);

// User session + RLS: logged-in user can only write their own subscription row.
export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, planKey } = await req.json();

    if (!subscriptionId || !planKey || !VALID_PLANS.has(planKey)) {
      return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
    }

    const sub = await getSubscription(subscriptionId);
    const allowedStatuses = new Set(["ACTIVE", "APPROVED", "APPROVAL_PENDING"]);
    if (!allowedStatuses.has(sub.status)) {
      return NextResponse.json({ error: "Subscription not active" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: dbError } = await supabase.from("subscriptions").upsert({
      user_id: user.id,
      paypal_subscription_id: subscriptionId,
      plan: planKey,
      status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (dbError) {
      console.error("DB upsert error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan: planKey });
  } catch (err) {
    console.error("verify-subscription error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
