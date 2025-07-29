'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Calendar, FileText, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface QuizHistory {
  id: string;
  doc_title: string;
  questions: {
    question: string;
    answer: string;
    options: string[];
  }[];
  created_at: string;
  quiz_answers: { score: number }[];
}

export default function QuizHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (quizId: string) => {
    const toastId = toast.loading("Deleting quiz...");

    try {
      await supabase.from("quiz_answers").delete().eq("quiz_id", quizId);

      const { error } = await supabase
        .from("quiz_histories")
        .delete()
        .eq("id", quizId);

      if (error) {
        toast.error("Failed to delete quiz", { id: toastId });
        return;
      }

      setHistory((prev) => prev.filter((item) => item.id !== quizId));
      toast.success("Quiz deleted successfully", { id: toastId });
    } catch (e) {
      toast.error("Unexpected error occurred", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const fetchHistory = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("quiz_histories")
      .select("id, doc_title, questions, created_at, quiz_answers(score)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setHistory(data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
        </CardHeader>
      </Card>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">No quiz history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold">{item.doc_title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {item.questions.length} Questions
                      </span>
                    </div>
                  </div>
                  {item.quiz_answers?.length === 0 ? (
                    <Badge variant="secondary">Not Answered</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800">
                      Score: {Math.round(item.quiz_answers[0].score * 100)}%
                    </Badge>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/profile/quiz-history/${item.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeletingId(item.id)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the quiz and its answers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId !== item.id}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
