import { Question } from "@/lib/schemas";
import { Check, X } from "lucide-react";

type Props = {
  questions: Question[];
  userAnswers: string[];
};

const answerLabels = ["A", "B", "C", "D"];

export default function QuizReview({ questions, userAnswers }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = q.answer;

        return (
          <div
            key={index}
            className="border rounded-md p-4 space-y-2 bg-white shadow-sm"
          >
            <p className="font-bold text-gray-800">
              {index + 1}. {q.question}
            </p>

            <div className="grid gap-2">
              {q.options.map((option, i) => {
                const label = answerLabels[i];
                const isCorrect = label === correctAnswer;
                const isUserSelected = label === userAnswer;

                let bg = "bg-white";
                if (isCorrect) bg = "bg-green-100 border-green-500";
                if (isUserSelected && !isCorrect)
                  bg = "bg-red-100 border-red-500";

                return (
                  <div
                    key={label}
                    className={`flex items-center justify-between border p-3 rounded ${bg}`}
                  >
                    <span className="flex gap-2 items-center">
                      <span className="font-bold">{label}.</span> {option}
                    </span>

                    {/* ICON */}
                    {isUserSelected &&
                      (isCorrect ? (
                        <Check className="text-green-600 w-5 h-5" />
                      ) : (
                        <X className="text-red-600 w-5 h-5" />
                      ))}
                  </div>
                );
              })}
            </div>

            {userAnswer !== correctAnswer && (
              <p className="text-sm text-red-600 mt-1">
                ❌ Jawaban Anda Salah!
              </p>
            )}
            {userAnswer === correctAnswer && (
              <p className="text-sm text-green-600 mt-1">
                ✅ Jawaban Anda benar!
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
