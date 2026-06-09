"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { selectQuestions, dimensions } from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
} from "lucide-react";

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
  const currentMulti = multiAnswers[question.id] || [];

  const canContinue = isPractical || isProfile || selectedOption !== null;

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
    const newAnswers = { ...answers };
    if (!isProfile && !isPractical && selectedOption) {
      newAnswers[question.id as unknown as number] = selectedOption;
    } else if (isProfile && !isMulti && selectedOption) {
      newAnswers[question.id as unknown as number] = selectedOption;
    }

    const newPracticals = { ...practicalTexts };
    const newProfile: Record<string, string | string[]> = {};

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
      const nextQ = questions[currentQuestion + 1];
      if (nextQ.type !== "profile" && nextQ.type !== "practical" && !nextQ.multiSelect) {
        setSelectedOption((answers[nextQ.id as unknown as number]) || null);
      } else {
        setSelectedOption(null);
      }
      setRubricOpen(false);
    } else {
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
  const isMilestone = currentQuestion === Math.floor(questions.length / 2);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0a0a1a]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                  <Brain className="h-3.5 w-3.5 text-white" />
                </div>
              </a>
              <div className="h-4 w-px bg-white/[0.08]" />
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold tabular-nums text-white">
                  {String(currentQuestion + 1).padStart(2, "0")}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-xs tabular-nums text-slate-500">{questions.length}</span>
              </div>
              <span className="hidden items-center gap-1 text-xs text-slate-500 sm:inline-flex">
                <Clock className="h-3 w-3" />
                ~{Math.ceil((questions.length - currentQuestion) * 0.6)}{t(UI.test.minLeft, lang)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                {sectionLabel}
              </span>
              <button
                onClick={onBack}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Exit"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* Milestone */}
            {isMilestone && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2.5 rounded-xl border border-indigo-400/15 bg-indigo-500/5 px-4 py-2.5"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
                <p className="text-xs font-medium text-indigo-300">{t(UI.test.milestone50, lang)}</p>
              </motion.div>
            )}

            {/* Profile note */}
            {isProfile && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
                <span className="mt-0.5 text-sm">👋</span>
                <p className="text-xs text-slate-400">{t(UI.test.profileNote, lang)}</p>
              </div>
            )}

            {/* Practical note */}
            {isPractical && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
                <span className="mt-0.5 text-sm">✍️</span>
                <p className="text-xs text-amber-300/80">{t(UI.test.practicalNote, lang)}</p>
              </div>
            )}

            {/* Question */}
            <h2 className="mb-5 text-lg font-bold leading-snug text-white md:text-xl whitespace-pre-line">
              {question.question[lang]}
            </h2>

            {/* Multi-select hint */}
            {isMulti && (
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {t(UI.test.selectAll, lang)}
              </p>
            )}

            {/* Options */}
            {!isPractical && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isSelected = isMulti
                    ? currentMulti.includes(option.id)
                    : selectedOption === option.id;
                  const optionLabel = String.fromCharCode(65 + index);

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`group relative w-full rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-indigo-500/50 bg-indigo-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
                              : "bg-white/[0.06] text-slate-500"
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className={`text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>
                          {option.text[lang]}
                        </span>
                        {isSelected && (
                          <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-indigo-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Practical textarea */}
            {isPractical && (
              <div className="space-y-3">
                <textarea
                  className="w-full min-h-[160px] resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:outline-none"
                  placeholder={t(UI.test.practicalPlaceholder, lang)}
                  value={practicalTexts[question.id] || ""}
                  onChange={(e) =>
                    setPracticalTexts((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                />

                {question.rubric && question.rubric.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <button
                      onClick={() => setRubricOpen((v) => !v)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:bg-white/[0.03]"
                    >
                      <span>{lang === "zh" ? "评分提示" : "Scoring Hints"}</span>
                      {rubricOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    {rubricOpen && (
                      <ul className="border-t border-white/[0.06] px-4 pb-3 pt-2.5 space-y-2">
                        {question.rubric.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/[0.06] text-[10px] font-bold text-slate-500">
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
              <p className="mt-4 border-l-2 border-white/[0.08] pl-3 text-xs italic text-slate-500">
                {question.note[lang]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation - fixed at bottom */}
      <div className="sticky bottom-0 border-t border-white/[0.06] bg-[#0a0a1a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-all hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t(UI.test.previous, lang)}
          </button>
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-400 hover:to-violet-400 active:scale-[0.98] disabled:opacity-20 disabled:shadow-none"
          >
            {isLast ? t(UI.test.viewResults, lang) : t(UI.test.next, lang)}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
