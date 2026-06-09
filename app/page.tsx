"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { LandingPage } from "@/components/landing-page";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { TestFlow } from "@/components/test-flow";
import { ResultsPage } from "@/components/results-page";
import { useAuth } from "@/components/auth-provider";
import { useSubscription } from "@/components/subscription-provider";
import { redirectToSignIn } from "@/components/auth-ui";

type AppState = "landing" | "onboarding" | "testing" | "results";

const START_TEST_PATH = "/?start=test";
const STATE_TO_PATH: Record<AppState, string> = {
  landing: "/",
  onboarding: "/?step=onboarding",
  testing: "/?step=test",
  results: "/?step=results",
};

function stateFromUrl(): AppState {
  if (typeof window === "undefined") return "landing";
  const params = new URLSearchParams(window.location.search);
  const step = params.get("step");
  if (step === "results") return "results";
  if (step === "test") return "testing";
  if (step === "onboarding") return "onboarding";
  if (params.get("start") === "test") return "onboarding";
  return "landing";
}

const SESSION_KEY = "ai-fluency-results";

function saveResults(data: {
  answers: Record<number, string>;
  practicalTexts: Record<string, string>;
  profileData: Record<string, string | string[]>;
}) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function loadResults(): {
  answers: Record<number, string>;
  practicalTexts: Record<string, string>;
  profileData: Record<string, string | string[]>;
} | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function Page() {
  const { user, loading } = useAuth();
  const { refresh } = useSubscription();
  const [appState, setAppState] = useState<AppState>("landing");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [practicalTexts, setPracticalTexts] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<Record<string, string | string[]>>({});
  const skipPush = useRef(false);

  // Initialize state from URL on mount
  useEffect(() => {
    const urlState = stateFromUrl();
    if (urlState === "results") {
      const saved = loadResults();
      if (saved) {
        setTestAnswers(saved.answers);
        setPracticalTexts(saved.practicalTexts);
        setProfileData(saved.profileData);
        setAppState("results");
        skipPush.current = true;
      }
    } else if (urlState === "onboarding" || urlState === "testing") {
      // These require auth flow, handled in the start=test effect below
    }
  }, []);

  // Sync URL when appState changes
  useEffect(() => {
    if (skipPush.current) {
      skipPush.current = false;
      return;
    }
    const targetPath = STATE_TO_PATH[appState];
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== targetPath) {
      window.history.pushState({ appState }, "", targetPath);
    }
  }, [appState]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      skipPush.current = true;
      const urlState = stateFromUrl();
      if (urlState === "results") {
        const saved = loadResults();
        if (saved) {
          setTestAnswers(saved.answers);
          setPracticalTexts(saved.practicalTexts);
          setProfileData(saved.profileData);
          setAppState("results");
          return;
        }
      }
      if ((urlState === "testing" || urlState === "onboarding") && !user) {
        setAppState("landing");
        return;
      }
      setAppState(urlState);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user]);

  // Handle ?start=test after login redirect
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("start") !== "test") return;
    window.history.replaceState({}, "", "/");
    if (user) {
      setAppState("onboarding");
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

  const handleStartTest = useCallback(() => {
    if (loading) return;
    if (!user) {
      redirectToSignIn(START_TEST_PATH);
      return;
    }
    setAppState("onboarding");
  }, [user, loading]);

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
    const mergedProfile = { ...profileData, ...profile };
    setProfileData(mergedProfile);
    saveResults({ answers, practicalTexts: practicals, profileData: mergedProfile });
    setAppState("results");
  };

  const handleRetake = () => {
    setTestAnswers({});
    setPracticalTexts({});
    setProfileData({});
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
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
