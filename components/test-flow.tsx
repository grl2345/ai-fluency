"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { selectQuestions, dimensions } from "@/lib/test-data";
import type { Question } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import { CheckCircle, ChevronRight, Clock, ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";

interface TestFlowProps {
  onComplete: (
    answers: Record<number, string>,
    practicalTexts: Record<string, string>,
    profileData: Record<string, string | string[]>
  ) => void;
  onBack: () => void;
}

export function TestFlow({ onComplete, onBack }: TestFlowProps) {
  const { lang } = useLang();
  // Generate the question list once on mount
  const questions = useMemo(() => selectQuestions(), []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [practicalTexts, setPracticalTexts] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [rubricOpen, setRubricOpen] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentDimension = question.dimension
    ? dimensions.find((d) => d.id === question.dimension)
    : null;

  const isProfile = question.type === "profile";
  const isPractical = question.type === "practical";
  const isMulti = question.multiSelect === true;

  // Profile-type multi-select state
  const currentMulti = multiAnswers[question.id] || [];

  const canContinue =
    isPractical ||
    isProfile ||
    selectedOption !== null;

  const handleSelectOption = (optionId: string) => {
    if (isMulti) {
      setMultiAnswers((prev) => {
        const existing = prev[question.id] || [];
        if (existing.includes(optionId)) {
          return { ...prev, [question.id]: existing.filter((x) => x !== optionId) };
        }
        return { ...prev, [question.id]: [...existing, optionId] };
      });
    } else {
      setSelectedOption(optionId);
    }
  };

  const handleNext = () => {
    // Build updated answers
    const newAnswers = { ...answers };
    if (!isProfile && !isPractical && selectedOption) {
      newAnswers[question.id as unknown as number] = selectedOption;
    } else if (isProfile && !isMulti && selectedOption) {
      newAnswers[question.id as unknown as number] = selectedOption;
    }

    const newPracticals = { ...practicalTexts };
    const newProfile: Record<string, string | string[]> = {};

    // Collect profile data from all answered profile questions
    questions
      .filter((q) => q.type === "profile")
      .forEach((q) => {
        if (q.multiSelect) {
          newProfile[q.id] = multiAnswers[q.id] || [];
        } else {
          const ans = q.id === question.id ? selectedOption : (answers[q.id as unknown as number] || null);
          if (ans) newProfile[q.id] = ans;
        }
      });

    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion((prev) => prev + 1);

      // Restore state for next question
      const nextQ = questions[currentQuestion + 1];
      if (nextQ.type !== "profile" && nextQ.type !== "practical" && !nextQ.multiSelect) {
        setSelectedOption((answers[nextQ.id as unknown as number]) || null);
      } else {
        setSelectedOption(null);
      }
      setRubricOpen(false);
    } else {
      // Last question — call onComplete
      onComplete(newAnswers, newPracticals, newProfile);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      const prevQ = questions[currentQuestion - 1];
      if (prevQ.type !== "profile" && prevQ.type !== "practical" && !prevQ.multiSelect) {
        setSelectedOption((answers[prevQ.id as unknown as number]) || null);
      } else {
        setSelectedOption(null);
      }
      setRubricOpen(false);
    }
  };

  // Section label
  let sectionLabel = "";
  if (isProfile) {
    const profileIdx = questions.filter((q) => q.type === "profile").indexOf(question) + 1;
    const profileTotal = questions.filter((q) => q.type === "profile").length;
    sectionLabel = `${t(UI.test.profileSection, lang)} ${profileIdx}/${profileTotal}`;
  } else if (isPractical) {
    const prIdx = questions.filter((q) => q.type === "practical").indexOf(question) + 1;
    const prTotal = questions.filter((q) => q.type === "practical").length;
    sectionLabel = `${t(UI.test.practicalSection, lang)} ${prIdx}/${prTotal}`;
  } else if (currentDimension) {
    sectionLabel = currentDimension.name[lang];
  }

  const isLast = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                {lang === "zh"
                  ? `${t(UI.test.question, lang)}${currentQuestion + 1}${t(UI.test.of, lang)}${questions.length}${t(UI.test.total, lang)}`
                  : `${t(UI.test.question, lang)}${currentQuestion + 1}${t(UI.test.of, lang)}${questions.length}`}
              </span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                ~{Math.ceil((questions.length - currentQuestion) * 0.6)}{t(UI.test.minLeft, lang)}
              </span>
            </div>
            <button
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Exit test"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Tag */}
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                {sectionLabel}
              </span>
            </div>

            {/* Profile note */}
            {isProfile && (
              <p className="mb-6 text-sm text-muted-foreground italic">
                {t(UI.test.profileNote, lang)}
              </p>
            )}

            {/* Practical note */}
            {isPractical && (
              <p className="mb-6 text-sm text-muted-foreground italic">
                {t(UI.test.practicalNote, lang)}
              </p>
            )}

            {/* Question */}
            <h2 className="mb-8 text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl whitespace-pre-line">
              {question.question[lang]}
            </h2>

            {/* Multi-select hint */}
            {isMulti && (
              <p className="mb-4 text-sm text-muted-foreground">
                {t(UI.test.selectAll, lang)}
              </p>
            )}

            {/* Options (profile, knowledge, scenario) */}
            {!isPractical && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = isMulti
                    ? currentMulti.includes(option.id)
                    : selectedOption === option.id;
                  const optionLabel = String.fromCharCode(65 + index);

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`group relative w-full rounded-xl border-2 p-5 text-left transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground/5"
                          : "border-border/60 bg-card hover:border-foreground/30"
                      }`}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                            isSelected
                              ? "bg-foreground text-background"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className="pt-1.5 text-foreground">{option.text[lang]}</span>
                        {isSelected && (
                          <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-foreground" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Practical textarea */}
            {isPractical && (
              <div className="space-y-4">
                <textarea
                  className="w-full min-h-[180px] rounded-xl border-2 border-border/60 bg-card p-5 text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none resize-y"
                  placeholder={t(UI.test.practicalPlaceholder, lang)}
                  value={practicalTexts[question.id] || ""}
                  onChange={(e) =>
                    setPracticalTexts((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                />

                {/* Rubric collapsible */}
                {question.rubric && question.rubric.length > 0 && (
                  <div className="rounded-xl border border-border/40 overflow-hidden">
                    <button
                      onClick={() => setRubricOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <span>{lang === "zh" ? "评分标准提示" : "Scoring Criteria Hints"}</span>
                      {rubricOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {rubricOpen && (
                      <ul className="px-5 pb-4 space-y-2">
                        {question.rubric.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                              {idx + 1}
                            </span>
                            {criterion[lang]}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            {question.note && !isProfile && !isPractical && (
              <p className="mt-6 text-sm text-muted-foreground italic border-l-2 border-border/40 pl-4">
                {question.note[lang]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(UI.test.previous, lang)}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canContinue}
            className="gap-2 rounded-full px-8"
            size="lg"
          >
            {isLast ? t(UI.test.viewResults, lang) : t(UI.test.next, lang)}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
