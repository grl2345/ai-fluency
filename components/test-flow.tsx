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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {currentQuestion + 1}
                <span className="font-normal text-slate-400"> / {questions.length}</span>
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:block" />
              <span className="hidden items-center gap-1.5 text-sm text-slate-400 sm:inline-flex">
                <Clock className="h-3.5 w-3.5" />
                ~{Math.ceil((questions.length - currentQuestion) * 0.6)}{t(UI.test.minLeft, lang)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:inline">
                {sectionLabel}
              </span>
              <button
                onClick={onBack}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Exit test"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {/* Section tag (mobile only — desktop shows in header) */}
            <div className="mb-5 sm:hidden">
              <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {sectionLabel}
              </span>
            </div>

            {/* Profile note */}
            {isProfile && (
              <p className="mb-5 text-sm text-slate-500 italic">
                {t(UI.test.profileNote, lang)}
              </p>
            )}

            {/* Practical note */}
            {isPractical && (
              <p className="mb-5 text-sm text-slate-500 italic">
                {t(UI.test.practicalNote, lang)}
              </p>
            )}

            {/* Question */}
            <h2 className="mb-8 text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl whitespace-pre-line">
              {question.question[lang]}
            </h2>

            {/* Multi-select hint */}
            {isMulti && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t(UI.test.selectAll, lang)}
              </p>
            )}

            {/* Options */}
            {!isPractical && question.options && (
              <div className="space-y-2.5">
                {question.options.map((option, index) => {
                  const isSelected = isMulti
                    ? currentMulti.includes(option.id)
                    : selectedOption === option.id;
                  const optionLabel = String.fromCharCode(65 + index);

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50"
                      }`}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            isSelected
                              ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className="pt-1 text-sm text-slate-700">{option.text[lang]}</span>
                        {isSelected && (
                          <CheckCircle className="ml-auto mt-0.5 h-4.5 w-4.5 shrink-0 text-indigo-600" />
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
                  className="w-full min-h-[180px] resize-y rounded-xl border-2 border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                  placeholder={t(UI.test.practicalPlaceholder, lang)}
                  value={practicalTexts[question.id] || ""}
                  onChange={(e) =>
                    setPracticalTexts((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                />

                {/* Rubric collapsible */}
                {question.rubric && question.rubric.length > 0 && (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <button
                      onClick={() => setRubricOpen((v) => !v)}
                      className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      <span>{lang === "zh" ? "评分提示" : "Scoring Hints"}</span>
                      {rubricOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    {rubricOpen && (
                      <ul className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2.5">
                        {question.rubric.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-500">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600">
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

            {/* Diagnostic note */}
            {question.note && !isProfile && !isPractical && (
              <p className="mt-6 border-l-2 border-slate-200 pl-4 text-sm italic text-slate-400">
                {question.note[lang]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(UI.test.previous, lang)}
          </button>
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-30 disabled:shadow-none"
          >
            {isLast ? t(UI.test.viewResults, lang) : t(UI.test.next, lang)}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
