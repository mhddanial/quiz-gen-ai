'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import QuizScore from '@/components/score';
import QuizReview from '@/components/quiz-overview';
import { Question } from '@/lib/schemas';

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

    useEffect(() => {
        const fetchQuiz = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Fetch quiz_histories
        const { data: quizData, error: quizError } = await supabase
            .from('quiz_histories')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (!quizData || quizError) {
            router.push('/profile/quiz-history');
            return;
        }

        setQuiz(quizData);

        // Fetch quiz_answers
        const { data: answerData } = await supabase
            .from('quiz_answers')
            .select('answers, score')
            .eq('quiz_id', params.id)
            .eq('user_id', user.id)
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
        <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">{quiz.doc_title}</h1>
        <QuizScore
            correctAnswers={Math.round(score * quiz.questions.length)}
            totalQuestions={quiz.questions.length}
        />
        <div className="mt-10">
            <QuizReview questions={quiz.questions} userAnswers={userAnswers} />
        </div>
        </div>
    );
}
