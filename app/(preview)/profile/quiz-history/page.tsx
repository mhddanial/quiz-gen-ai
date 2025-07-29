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
import { Loader2, Eye, Calendar, FileText } from 'lucide-react';

interface QuizHistory {
  id: string;
  doc_title: string;
  questions: QuizQuestion[];
  average_score: number;
  created_at: string;
}

interface QuizQuestion {
  question: string;
  correct_answer: string;
  user_answer: string;
}

export default function QuizHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data, error } = await supabase
      .from('quiz_histories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {item.doc_title}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {item.questions.length} Questions
                      </div>
                    </div>
                  </div>

                  <Badge className="bg-blue-100 text-blue-800">
                    Score: {Math.round(item.average_score * 100)}%
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  {item.questions.map((q, idx) => (
                    <div key={idx} className="border p-3 rounded bg-gray-50">
                      <p className="font-medium text-sm text-gray-800">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="text-sm mt-1">
                        <span className="text-gray-600">Your Answer: </span>
                        <span
                          className={
                            q.user_answer === q.correct_answer
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {q.user_answer}
                        </span>
                        {q.user_answer !== q.correct_answer && (
                          <span className="ml-2 text-gray-500">
                            (Correct: {q.correct_answer})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
