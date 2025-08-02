# 🎓 QuizGen AI
> **Automated Quiz Generation from PDF Documents Using Artificial Intelligence**

QuizGen AI is a web application that enables users to upload PDF documents and automatically generate high-quality multiple-choice questions using AI technology. This project is designed to support educators, trainers, and internal training teams in creating assessments quickly, systematically, and accurately.

---

## 🧭 Project Overview

### 🎯 Objectives
Accelerate the quiz creation process from PDF content by leveraging generative AI and modern web technologies.

### 🔍 Background
- Manual quiz creation is extremely time-consuming
- Difficulty extracting important information from lengthy documents  
- Lack of automated and accurate question generation systems

### ✅ Solution
QuizGen AI utilizes Large Language Models (LLM) to:
- Extract information from PDF documents
- Generate multiple-choice questions automatically
- Store quiz results and answers for future review

---

## 🛠️ Tech Stack & Tools

### Frontend
- **Next.js 14** – Modern React Framework (with App Router, API Routes)
- **Tailwind CSS + shadcn/ui** – Elegant & responsive UI components

### Backend & Auth
- **Supabase** – Authentication, file storage (Storage), and database (PostgreSQL)

### AI Services
| Tool | Primary Function |
|------|------------------|
| **Gemini AI** (Google) | Convert PDF content into quiz questions automatically |
| **ChatGPT** | Brainstorming ideas, code review, documentation |
| **IBM Granite** | Backend logic efficiency optimization |

---

## ✨ Key Features

- 🔐 **Register & Login**  
  Support authentication via Email/Password and Google OAuth
  
- 👤 **Profile Management**  
  Edit profile & change password (depending on login method)
  
- 📄 **Generate Quiz from PDF**  
  Upload file → AI reads & generates questions automatically
  
- 📚 **Quiz History & Review**  
  Save all created quizzes and their answers for future reference

---

## 🧪 Application Flow Demo

1. User login/register
2. Upload PDF file
3. System reads PDF content → AI generates questions
4. User answers questions → score is displayed
5. Quiz history is saved and can be reviewed later


## 🚀 Installation & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/mhddanial/quiz-gen-ai.git
cd quiz-gen-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
Set up your Supabase project:
- Create authentication tables
- Configure storage buckets for PDF files
- Set up user profiles table

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📱 Usage Guide

### Getting Started
1. **Register/Login** - Create account or sign in with Google
2. **Upload PDF** - Drag and drop or select PDF file (max 10MB)
3. **Generate Quiz** - AI automatically creates multiple-choice questions
4. **Take Quiz** - Answer questions and get instant feedback
5. **Review Results** - Check scores and review answers

### File Structure
```
quizgen-ai/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
├── lib/                    # Utility functions and AI configs
├── public/screenshots/     # Application screenshots
└── supabase/              # Database schemas and configs
```

---

## 📄 License

This project is developed for educational purposes.

---