"use client";

import { useCallback, useEffect, useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { TestFlow } from "@/components/test-flow";
import { ResultsPage } from "@/components/results-page";
import { useAuth } from "@/components/auth-provider";
import { useSubscription } from "@/components/subscription-provider";
import { redirectToSignIn } from "@/components/auth-ui";

type AppState = "landing" | "testing" | "results";

const START_TEST_PATH = "/?start=test";

export default function Page() {
  const { user, loading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const [appState, setAppState] = useState<AppState>("landing");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [practicalTexts, setPracticalTexts] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<Record<string, string | string[]>>({});
  // Set when the user wants to start the test but we still need to confirm
  // their auth/subscription state before deciding where to send them.
  const [pendingStart, setPendingStart] = useState(false);
  // Toggled when a logged-in, non-subscribed user is nudged toward pricing.
  const [subscribePrompt, setSubscribePrompt] = useState(false);

  const scrollToPricing = useCallback(() => {
    setSubscribePrompt(true);
    requestAnimationFrame(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const handleStartTest = useCallback(() => {
    if (loading) return;
    if (!user) {
      redirectToSignIn(START_TEST_PATH);
      return;
    }
    // Logged in — gate the test behind an active subscription.
    if (subLoading) {
      setPendingStart(true);
      return;
    }
    if (!hasActiveSubscription) {
      scrollToPricing();
      return;
    }
    setAppState("testing");
  }, [user, loading, subLoading, hasActiveSubscription, scrollToPricing]);

  // Resolve a deferred start once subscription state is known.
  useEffect(() => {
    if (!pendingStart || loading || subLoading) return;
    setPendingStart(false);
    if (!user) {
      redirectToSignIn(START_TEST_PATH);
    } else if (hasActiveSubscription) {
      setAppState("testing");
    } else {
      scrollToPricing();
    }
  }, [pendingStart, loading, subLoading, user, hasActiveSubscription, scrollToPricing]);

  useEffect(() => {
    if (loading) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("start") !== "test") return;

    window.history.replaceState({}, "", "/");

    if (user) {
      // Defer to the subscription gate before entering the test.
      setPendingStart(true);
    } else {
      redirectToSignIn(START_TEST_PATH);
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading && appState === "testing" && !user) {
      setAppState("landing");
      redirectToSignIn(START_TEST_PATH);
    }
  }, [loading, user, appState]);

  const handleTestComplete = (
    answers: Record<number, string>,
    practicals: Record<string, string>,
    profile: Record<string, string | string[]>
  ) => {
    setTestAnswers(answers);
    setPracticalTexts(practicals);
    setProfileData(profile);
    setAppState("results");
  };

  const handleRetake = () => {
    setTestAnswers({});
    setPracticalTexts({});
    setProfileData({});
    setAppState("landing");
  };

  if (appState === "testing") {
    if (loading || !user) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-slate-500">Loading…</p>
        </main>
      );
    }
    return <TestFlow onComplete={handleTestComplete} onBack={handleRetake} />;
  }

  if (appState === "results") {
    return (
      <ResultsPage
        answers={testAnswers}
        practicalTexts={practicalTexts}
        profileData={profileData}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <LandingPage
      onStartTest={handleStartTest}
      authLoading={loading}
      isAuthenticated={!!user}
      subscribePrompt={subscribePrompt}
      onDismissSubscribePrompt={() => setSubscribePrompt(false)}
    />
  );
}
