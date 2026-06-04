"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { sampleQuestions, dimensions } from "@/lib/test-data";
import { CheckCircle, ChevronRight, Clock, ArrowLeft, X } from "lucide-react";

interface TestFlowProps {
  onComplete: (answers: Record<number, string>) => void;
  onBack: () => void;
}

export function TestFlow({ onComplete, onBack }: TestFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const currentDimension = dimensions.find((d) => d.id === question.dimension);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = { ...answers, [question.id]: selectedOption };
      setAnswers(newAnswers);

      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(answers[sampleQuestions[currentQuestion + 1]?.id] || null);
      } else {
        onComplete(newAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[sampleQuestions[currentQuestion - 1]?.id] || null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                ~{Math.ceil((sampleQuestions.length - currentQuestion) * 0.6)} min left
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
            {/* Dimension Tag */}
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                {currentDimension?.name}
              </span>
            </div>

            {/* Question */}
            <h2 className="mb-10 text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === option.id;
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
                      <span className="pt-1.5 text-foreground">{option.text}</span>
                      {isSelected && (
                        <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-foreground" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
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
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="gap-2 rounded-full px-8"
            size="lg"
          >
            {currentQuestion === sampleQuestions.length - 1 ? "View Results" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
