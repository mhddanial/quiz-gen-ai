'use client';

import PageShell from "@/components/layouts/PageShell";
import QuickActions from "@/components/profile/QuickAction";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import QuizScore from "@/components/score";
import QuizReview from "@/components/quiz-overview";
import { Question } from "@/lib/schemas";
import { exportToPDF } from "@/lib/exportToPdf";

type QuizDetail = {
  id: string;
  doc_title: string;
  questions: Question[];
};

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: quizData, error: quizError } = await supabase
        .from("quiz_histories")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (!quizData || quizError) {
        toast.error("Quiz not found.");
        router.push("/profile/quiz-history");
        return;
      }

      setQuiz(quizData);

      const { data: answerData } = await supabase
        .from("quiz_answers")
        .select("answers, score")
        .eq("quiz_id", params.id)
        .eq("user_id", user.id)
        .single();

      if (answerData) {
        setUserAnswers(answerData.answers || []);
        setScore(answerData.score ?? 0);
      } else {
        setUserAnswers([]);
        setScore(0);
      }

      setLoading(false);
    };

    fetchQuiz();
  }, [params.id, router]);

  if (loading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }

  return (
    <PageShell
      title="Quiz Details"
      subtitle={`Review answers and score for "${quiz.doc_title}"`}
      breadcrumbs={[
        { label: "Profile", href: "/profile" },
        { label: "Quiz History", href: "/profile/quiz-history" },
        { label: `${quiz.doc_title}` },
      ]}
      rightSidebar={
        <QuickActions
          onSignOut={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
        />
      }
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Quiz Summary</CardTitle>
              <CardDescription className="text-blue-100">
                Your performance breakdown is below
              </CardDescription>
            </div>
            <button
              onClick={() => {
                if (contentRef.current) {
                  exportToPDF(contentRef.current, `quiz-${quiz.doc_title}.pdf`);
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium border border-white/30"
            >
              Export PDF
            </button>
          </div>
        </CardHeader>

        {/* Wrap semua isi dengan ref */}
        <CardContent
          ref={contentRef}
          className="p-6 sm:p-8 space-y-10 bg-white"
        >
          <QuizScore
            correctAnswers={Math.round(score * quiz.questions.length)}
            totalQuestions={quiz.questions.length}
          />

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Review Your Answers
            </h3>
            <QuizReview questions={quiz.questions} userAnswers={userAnswers} />
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
