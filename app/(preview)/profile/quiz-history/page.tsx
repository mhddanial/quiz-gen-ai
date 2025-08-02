'use client';

import PageShell from "@/components/layouts/PageShell";
import QuickActions from "@/components/profile/QuickAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signOutUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import {
  Calendar,
  Eye,
  FileText,
  Loader2,
  Search,
  Trash,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
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

type FilterStatus = "all" | "answered" | "unanswered";
type SortBy =
  | "date_desc"
  | "date_asc"
  | "score_desc"
  | "score_asc"
  | "title_asc"
  | "title_desc";

export default function QuizHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date_desc");
  const [showFilters, setShowFilters] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Error signing out");
    }
  }, [router]);

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

  // Filtered and sorted history
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.doc_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => {
        const isAnswered = item.quiz_answers?.length > 0;
        return filterStatus === "answered" ? isAnswered : !isAnswered;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "date_desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "title_asc":
          return a.doc_title.localeCompare(b.doc_title);
        case "title_desc":
          return b.doc_title.localeCompare(a.doc_title);
        case "score_asc":
          const scoreA = a.quiz_answers?.[0]?.score ?? -1;
          const scoreB = b.quiz_answers?.[0]?.score ?? -1;
          return scoreA - scoreB;
        case "score_desc":
          const scoreA2 = a.quiz_answers?.[0]?.score ?? -1;
          const scoreB2 = b.quiz_answers?.[0]?.score ?? -1;
          return scoreB2 - scoreA2;
        default:
          return 0;
      }
    });

    return sorted;
  }, [history, searchTerm, filterStatus, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setSortBy("date_desc");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm || filterStatus !== "all" || sortBy !== "date_desc";

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Profile", href: "/profile" },
        { label: "Quiz History" },
      ]}
      rightSidebar={<QuickActions onSignOut={handleSignOut} />}
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Quiz History</h2>
              <p className="text-blue-100 text-sm">
                View all your past quizzes and scores (
                {filteredAndSortedHistory.length} of {history.length})
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search quiz titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    Active
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </label>
                  <Select
                    value={filterStatus}
                    onValueChange={(value: FilterStatus) =>
                      setFilterStatus(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quizzes</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="unanswered">Not Answered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortBy) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date_desc">Newest First</SelectItem>
                      <SelectItem value="date_asc">Oldest First</SelectItem>
                      <SelectItem value="title_asc">Title A-Z</SelectItem>
                      <SelectItem value="title_desc">Title Z-A</SelectItem>
                      <SelectItem value="score_desc">Highest Score</SelectItem>
                      <SelectItem value="score_asc">Lowest Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Quiz History List */}
          {filteredAndSortedHistory.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              {history.length === 0 ? (
                "No quiz history found."
              ) : (
                <div>
                  <p>No quizzes match your current filters.</p>
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2 text-blue-600"
                  >
                    Clear filters to see all quizzes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {item.doc_title}
                        </h4>
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
                              This will permanently delete the quiz and its
                              answers.
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
        </CardContent>
      </Card>
    </PageShell>
  );
}