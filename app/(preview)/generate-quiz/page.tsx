"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { generateQuizTitle } from "../actions";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function ChatWithFiles() {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);
    };
    checkAuth();
  }, [router]);

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: () => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: async ({ object }) => {
      if (!object || !userId || !files[0]) return;

      const generatedTitle = await generateQuizTitle(files[0].name);
      setTitle(generatedTitle);

      const { data, error } = await supabase
        .from("quiz_histories")
        .insert({
          doc_title: generatedTitle,
          questions: object,
          user_id: userId,
        })
        .select("id")
        .single();

      if (error) {
        toast.error("Gagal menyimpan quiz.");
        return;
      }

      setQuizId(data.id);
      setQuestions(object);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );
    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }
    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    submit({ files: encodedFiles });
  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
  };

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  if (questions.length === 4) {
    return (
      <Quiz
        title={title ?? "Quiz"}
        questions={questions}
        clearPDF={clearPDF}
        quizId={quizId}
      />
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <div className="text-xl font-semibold text-gray-800 text-center">
                Drop your PDF here
              </div>
              <div className="text-sm text-gray-500 text-center mt-2">
                Transform it into an interactive quiz
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center space-y-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 pb-8">
            <motion.div
              className="mx-auto flex items-center justify-center space-x-3 text-muted-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-3 shadow-lg border border-blue-200">
                <FileUp className="h-6 w-6 text-blue-600" />
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Plus className="h-5 w-5 text-gray-400" />
              </motion.div>
              <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-3 shadow-lg border border-purple-200">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
            </motion.div>

            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDF Quiz Generator
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Transform your learning materials into{" "}
                <span className="font-semibold text-blue-600">
                  interactive quizzes
                </span>{" "}
                powered by AI
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmitWithFiles} className="space-y-6">
              <motion.div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : files.length > 0
                    ? "border-green-400 bg-green-50/50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <motion.div
                  className={`p-4 rounded-full mb-4 ${
                    files.length > 0 ? "bg-green-100" : "bg-gray-100"
                  }`}
                  animate={isLoading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  <FileUp
                    className={`h-8 w-8 ${
                      files.length > 0 ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                </motion.div>

                <div className="text-center space-y-2">
                  {files.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1"
                    >
                      <p className="font-semibold text-gray-800 text-lg">
                        {files[0].name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(files[0].size / (1024 * 1024)).toFixed(1)} MB • Ready
                        to process
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              <Button
                type="submit"
                className={`w-full py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 ${
                  files.length === 0 || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
                }`}
                disabled={files.length === 0}
              >
                {isLoading ? (
                  <motion.span
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Quiz...</span>
                  </motion.span>
                ) : (
                  <motion.span
                    className="flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Interactive Quiz</span>
                  </motion.span>
                )}
              </Button>
            </form>
          </CardContent>

          {isLoading && (
            <CardFooter className="flex flex-col space-y-6 bg-gray-50/50 pt-6">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Generation Progress</span>
                  <span className="text-blue-600 font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200" />
              </div>

              <motion.div
                className="w-full bg-white rounded-xl border p-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="flex-1">
                    <span className="text-muted-foreground text-center text-sm font-medium">
                      {partialQuestions
                        ? `Crafting question ${
                            partialQuestions.length + 1
                          } of 4`
                        : "Analyzing PDF content with AI"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  ✨ Creating personalized questions based on your document
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}