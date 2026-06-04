"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { TestFlow } from "@/components/test-flow";
import { ResultsPage } from "@/components/results-page";

type AppState = "landing" | "testing" | "results";

export default function Page() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [practicalTexts, setPracticalTexts] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<Record<string, string | string[]>>({});

  const handleStartTest = () => {
    setAppState("testing");
  };

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

  return <LandingPage onStartTest={handleStartTest} />;
}
