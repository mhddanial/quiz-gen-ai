import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Question } from "@/lib/schemas";

export function useQuiz(questions: Question[], quizId: string | null) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(null));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setProgress((currentQuestionIndex / questions.length) * 100);
    }, [currentQuestionIndex, questions.length]);

    const selectAnswer = (answer: string) => {
        if (!isSubmitted) {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
        submit();
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const reset = () => {
        setAnswers(Array(questions.length).fill(null));
        setIsSubmitted(false);
        setScore(null);
        setCurrentQuestionIndex(0);
        setProgress(0);
    };

    const submit = async () => {
        setIsSubmitted(true);

    const correctAnswers = questions.reduce((acc, question, index) => {
        return acc + (question.answer === answers[index] ? 1 : 0);
    }, 0);

    const averageScore = correctAnswers / questions.length;
    setScore(correctAnswers);

    if (!quizId) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { error } = await supabase.from("quiz_answers").insert({
        quiz_id: quizId,
        user_id: userId,
        answers: answers,
        score: averageScore,
    });

    if (error) {
        console.error("Failed to save quiz answers:", error.message);
    }
    };

    return {
        currentQuestionIndex,
        answers,
        isSubmitted,
        score,
        progress,
        isSaving,
        currentQuestion: questions[currentQuestionIndex],
        selectAnswer,
        nextQuestion,
        previousQuestion,
        reset,
    };
}
