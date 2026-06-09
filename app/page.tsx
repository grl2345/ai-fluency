"use client";

import { useCallback, useEffect, useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { TestFlow } from "@/components/test-flow";
import { ResultsPage } from "@/components/results-page";
import { useAuth } from "@/components/auth-provider";
import { redirectToSignIn } from "@/components/auth-ui";

type AppState = "landing" | "onboarding" | "testing" | "results";

const START_TEST_PATH = "/?start=test";

export default function Page() {
  const { user, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>("landing");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [practicalTexts, setPracticalTexts] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<Record<string, string | string[]>>({});
  const [pendingStart, setPendingStart] = useState(false);

  const handleStartTest = useCallback(() => {
    if (loading) return;
    if (!user) {
      redirectToSignIn(START_TEST_PATH);
      return;
    }
    setAppState("onboarding");
  }, [user, loading]);

  // Resolve deferred start once auth loads
  useEffect(() => {
    if (!pendingStart || loading) return;
    setPendingStart(false);
    if (!user) {
      redirectToSignIn(START_TEST_PATH);
    } else {
      setAppState("onboarding");
    }
  }, [pendingStart, loading, user]);

  // Handle ?start=test after login redirect
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("start") !== "test") return;
    window.history.replaceState({}, "", "/");
    if (user) {
      setPendingStart(true);
    } else {
      redirectToSignIn(START_TEST_PATH);
    }
  }, [loading, user]);

  // Guard: kick out of testing if user signs out
  useEffect(() => {
    if (!loading && (appState === "testing" || appState === "onboarding") && !user) {
      setAppState("landing");
      redirectToSignIn(START_TEST_PATH);
    }
  }, [loading, user, appState]);

  const handleOnboardingComplete = async (profile: Record<string, string | string[]>) => {
    setProfileData(profile);
    setAppState("testing");
  };

  const handleTestComplete = (
    answers: Record<number, string>,
    practicals: Record<string, string>,
    profile: Record<string, string | string[]>
  ) => {
    setTestAnswers(answers);
    setPracticalTexts(practicals);
    setProfileData((prev) => ({ ...prev, ...profile }));
    setAppState("results");
  };

  const handleRetake = () => {
    setTestAnswers({});
    setPracticalTexts({});
    setProfileData({});
    setAppState("landing");
  };

  if (appState === "onboarding") {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onBack={() => setAppState("landing")}
      />
    );
  }

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
    />
  );
}
