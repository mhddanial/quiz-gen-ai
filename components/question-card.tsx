import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Question } from "@/lib/schemas";

type Props = {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showCorrectAnswer: boolean;
};

const answerLabels = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrectAnswer,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{question.question}</h2>
      <div className="grid gap-4">
        {question.options.map((option, index) => {
          const label = answerLabels[index];
          const isCorrect = label === question.answer;
          const isSelected = label === selectedAnswer;

          return (
            <Button
              key={label}
              variant={isSelected ? "secondary" : "outline"}
              onClick={() => onSelectAnswer(label)}
              className={`h-auto py-6 px-4 justify-start text-left whitespace-normal ${
                showCorrectAnswer && isCorrect
                  ? "bg-green-600 hover:bg-green-700"
                  : showCorrectAnswer && isSelected && !isCorrect
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
            >
              <span className="text-lg font-medium mr-4">{label}</span>
              <span className="flex-grow">{option}</span>
              {showCorrectAnswer && isCorrect && (
                <Check className="ml-2 shrink-0 text-white" size={20} />
              )}
              {showCorrectAnswer && isSelected && !isCorrect && (
                <X className="ml-2 shrink-0 text-white" size={20} />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
