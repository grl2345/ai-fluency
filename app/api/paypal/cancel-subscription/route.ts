import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cancelSubscription } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
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

    await supabase
      .from("subscriptions")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("cancel-subscription error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
