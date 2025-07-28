import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Brain,
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import { GitIcon } from "@/components/icons";
import NextLink from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Easy PDF Upload",
      description:
        "Simply drag and drop your PDF documents or click to upload. Supports multiple file formats and sizes.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description:
        "Advanced AI analyzes your content and generates relevant, contextual questions automatically.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      description:
        "Get your quiz generated in seconds, not hours. Perfect for busy educators and students.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Customizable Difficulty",
      description:
        "Choose from beginner, intermediate, or advanced difficulty levels to match your needs.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Multiple Question Types",
      description:
        "Generate multiple choice, true/false, short answer, and essay questions from your content.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description:
        "Your documents are processed securely and never stored permanently on our servers.",
    },
  ];

  const advantages = [
    "Save hours of manual quiz creation",
    "Improve student engagement with varied question types",
    "Ensure comprehensive coverage of your material",
    "Generate quizzes for any subject or topic",
    "Export quizzes in multiple formats (PDF, Word, etc.)",
    "Perfect for teachers, trainers, and students",
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your PDF",
      description:
        "Choose and upload the PDF document you want to create a quiz from.",
    },
    {
      number: "02",
      title: "Generate Quiz",
      description:
        "Our AI processes your content and creates a comprehensive quiz.",
    },
    {
      number: "03",
      title: "Review & Export",
      description:
        "Review your generated quiz and export it in your preferred format.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-100 text-blue-800 border-blue-200"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI-Powered Quiz Generation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your PDFs into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Interactive Quizzes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload any PDF document and let our advanced AI create
              comprehensive quizzes in seconds. Perfect for educators, students,
              and training professionals who want to save time and improve
              learning outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                Start Creating Quizzes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create engaging quizzes from your PDF
              content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create professional quizzes in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section
        id="why-choose-us"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose QuizGen AI?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of educators and learners who have transformed
                their teaching and studying experience with our AI-powered quiz
                generator.
              </p>

              <div className="space-y-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Time Saved</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      95%
                    </div>
                    <p className="text-gray-600 mb-6">
                      reduction in quiz creation time
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          10K+
                        </div>
                        <div className="text-sm text-gray-600">
                          Active Users
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          50K+
                        </div>
                        <div className="text-sm text-gray-600">
                          Quizzes Created
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start creating engaging quizzes from your PDF content today. No
            credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NextLink
              href="/auth/login"
              className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              <GitIcon />
              Try for free
            </NextLink>
          </div>
        </div>
      </section>
      <footer className="text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-400 py-5 text-center text-gray-400">
          <p>&copy; 2025 QuizGen AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
