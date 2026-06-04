"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { TestFlow } from "@/components/test-flow";
import { ResultsPage } from "@/components/results-page";

type AppState = "landing" | "testing" | "results";

export default function Page() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});

  const handleStartTest = () => {
    setAppState("testing");
  };

  const handleTestComplete = (answers: Record<number, string>) => {
    setTestAnswers(answers);
    setAppState("results");
  };

  const handleRetake = () => {
    setTestAnswers({});
    setAppState("landing");
  };

  if (appState === "testing") {
    return <TestFlow onComplete={handleTestComplete} onBack={handleRetake} />;
  }

  if (appState === "results") {
    return <ResultsPage answers={testAnswers} onRetake={handleRetake} />;
  }

  return <LandingPage onStartTest={handleStartTest} />;
}
