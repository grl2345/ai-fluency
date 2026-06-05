import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSubscription } from "@/lib/paypal";

// Called after user approves subscription in PayPal popup.
// Records subscription in Supabase against the authenticated user.
export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, planKey } = await req.json();

    if (!subscriptionId || !planKey) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // Verify subscription status with PayPal
    const sub = await getSubscription(subscriptionId);
    if (sub.status !== "ACTIVE" && sub.status !== "APPROVED") {
      return NextResponse.json({ error: "Subscription not active" }, { status: 400 });
    }

    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert subscription record
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
