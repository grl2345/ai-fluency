"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import type { UserSubscription } from "@/lib/subscription";

type SubscriptionContextValue = {
  subscription: UserSubscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  hasActiveSubscription: boolean;
  isStarter: boolean;
  isPro: boolean;
  isTeam: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: null,
  loading: true,
  refresh: async () => {},
  hasActiveSubscription: false,
  isStarter: false,
  isPro: false,
  isTeam: false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscription");
      if (!res.ok) {
        setSubscription(null);
        return;
      }
      const data = await res.json();
      setSubscription(data.subscription ?? null);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const value = useMemo(() => {
    const active = subscription?.status === "active";
    return {
      subscription,
      loading: authLoading || loading,
      refresh,
      hasActiveSubscription: active,
      isStarter: active && subscription?.plan === "starter",
      isPro: active && subscription?.plan === "pro",
      isTeam: active && subscription?.plan === "team",
    };
  }, [subscription, authLoading, loading, refresh]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
