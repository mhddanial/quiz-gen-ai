"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RefreshCw, FileText } from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import QuestionCard from "./question-card";
import { Question } from "@/lib/schemas";
import { useQuiz } from "@/hooks/useQuiz";

type Props = {
  questions: Question[];
  clearPDF: () => void;
  title: string;
  quizId: string | null;
};

export default function Quiz({ questions, clearPDF, title, quizId }: Props) {
  const {
    currentQuestionIndex,
    answers,
    isSubmitted,
    score,
    progress,
    isSaving,
    currentQuestion,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    reset,
  } = useQuiz(questions, quizId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

        <div className="relative">
          {!isSubmitted && <Progress value={progress} className="h-1 mb-8" />}

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? "results" : currentQuestionIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted ? (
                  <>
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestionIndex]}
                      onSelectAnswer={selectAnswer}
                      showCorrectAnswer={false}
                    />
                    <div className="flex justify-between items-center pt-6">
                      <Button
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <span className="text-sm font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                      </span>
                      <Button
                        onClick={nextQuestion}
                        disabled={!answers[currentQuestionIndex]}
                        variant="ghost"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Submit"
                          : "Next"}{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />
                    <QuizReview questions={questions} userAnswers={answers} />
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={reset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        onClick={clearPDF}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Try Another PDF
                      </Button>
                    </div>
                    {isSaving && (
                      <p className="text-center text-sm text-muted-foreground">
                        Saving score...
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
