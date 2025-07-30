import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import NavbarWrapper from "@/components/navbar-wrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "QuizGen AI",
  description:
    "QuizGen AI is a platform that generates quizzes from PDF files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <ThemeProvider attribute="class" enableSystem forcedTheme="light">
          <Toaster position="top-center" richColors />
          <NavbarWrapper />
          <div className="transition-opacity duration-300 opacity-100 animate-fade-in">
            {children}
            <SpeedInsights />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
