# 🎯 AI Mock Interview App

An intelligent AI-powered mock interview platform built with React and Firebase. This application helps job candidates practice interviews with AI-generated questions, real-time feedback, and personalized performance reports.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Project Workflow](#project-workflow)
- [Key Components Explained](#key-components-explained)

---

## 🎯 Overview

The AI Mock Interview App is a web-based platform that enables users to:
- Create custom mock interview scenarios
- Answer AI-generated interview questions
- Record video and audio responses
- Receive AI-powered feedback and ratings
- View comprehensive interview reports

This application leverages Google's Generative AI to create realistic interview questions based on job positions, descriptions, tech stacks, and experience levels, providing candidates with authentic interview practice.

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library for building interactive components
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 6.4.1** - Lightning-fast build tool and dev server
- **React Router DOM 7.13.1** - Client-side routing
- **React Hook Form 7.72.1** - Efficient form state management
- **Zod 4.3.6** - TypeScript-first schema validation

### UI & Styling
- **TailwindCSS 4.2.1** - Utility-first CSS framework
- **Radix UI 1.4.3** - Unstyled, accessible components
- **shadcn/ui** - High-quality React components
- **Lucide React 0.575.0** - Beautiful icon library
- **Next Themes 0.4.6** - Theme management (dark/light mode)

### Backend & Database
- **Firebase 12.11.0** - Backend services including Firestore database
- **Firestore** - NoSQL cloud database for data persistence

### AI & APIs
- **Google GenAI 1.50.1** - Google's generative AI for question generation
- **Clerk 6.0.1** - Authentication and user management

### Utilities
- **React Webcam 7.2.0** - Webcam capture
- **React Speech to Text 0.8.0** - Speech recognition
- **React Fast Marquee 1.6.5** - Scrolling animation component
- **Sonner 2.0.7** - Toast notifications
- **Class Variance Authority 0.7.1** - CSS-in-JS component styling
- **Tailwind Merge 3.5.0** - Merge Tailwind CSS classes

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **Vite React Plugin** - React integration for Vite

---

## 📊 Database Schema

The application uses **Firebase Firestore** with three main collections:

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **Users** | User profile information | id, name, email, imageUrl, createdAt, updatedAt |
| **Interviews** | Interview configurations & AI-generated questions | id, position, description, experience, userId, techStack, questions[], createdAt, updatedAt |
| **UserAnswers** | User responses, AI feedback & performance ratings | id, mockIdRef, question, correctAnswer, userAnswer, aiFeedback, aiRating, userId, createdAt, updatedAt |

---

## 📁 Project Structure

```
ai-mock-interview-app/
├── public/                          # Static assets
│   └── assets/
│       ├── img/
│       │   └── logo/               # Logo images
│       └── svg/                    # SVG icons
│
├── src/
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── form.tsx            # Form wrapper
│   │   │   ├── input.tsx           # Input fields
│   │   │   ├── textarea.tsx        # Text area component
│   │   │   ├── card.tsx            # Card layouts
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── footer.tsx          # Footer component
│   │   │   ├── form-mock-interview.tsx    # Interview creation form
│   │   │   ├── question-section.tsx       # Question display & interaction
│   │   │   ├── Record-Answer.tsx          # Audio/video recording
│   │   │   ├── InterviewPin.tsx           # Interview card component
│   │   │   ├── skeleton.tsx        # Loading skeletons
│   │   │   ├── tabs.tsx            # Tab component
│   │   │   ├── dialog.tsx          # Dialog/modal
│   │   │   ├── alert.tsx           # Alert messages
│   │   │   ├── tooltip.tsx         # Tooltips
│   │   │   ├── custom-breadcrumb.tsx      # Breadcrumb navigation
│   │   │   └── ...other UI components
│   │   ├── NavigationRoutes.tsx    # Route configuration
│   │   └── marquee-img.tsx         # Scrolling marquee
│   │
│   ├── layouts/
│   │   ├── main-layout.tsx         # Main layout wrapper
│   │   ├── auth-layout.tsx         # Authentication layout
│   │   ├── public-layout.tsx       # Public page layout
│   │   └── protected-routes.tsx    # Route protection logic
│   │
│   ├── routes/
│   │   ├── home.tsx                # Landing/home page
│   │   ├── sign-in.tsx             # Login page
│   │   ├── sign-up.tsx             # Registration page
│   │   ├── dashboard.tsx           # User interview dashboard
│   │   ├── create-edit-page.tsx    # Create/edit interview form
│   │   ├── mock-interview-page.tsx # Interview taking page
│   │   ├── feedback.tsx            # Feedback/results page
│   │   ├── loader-page.tsx         # Loading page
│   │   └── mock-load-page.tsx      # Interview loading page
│   │
│   ├── handlers/
│   │   └── auth-handlers.tsx       # Authentication logic
│   │
│   ├── lib/
│   │   ├── helpers.ts              # Utility functions
│   │   ├── utils.ts                # General utilities
│   │   └── constants.ts            # App constants
│   │
│   ├── config/
│   │   └── firebase.config.ts      # Firebase configuration
│   │
│   ├── provider/
│   │   └── toast-provider.tsx      # Toast notification provider
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │
│   ├── scripts/
│   │   └── index.ts                # Google GenAI configuration
│   │
│   ├── App.tsx                     # Root component
│   ├── App.css                     # Global styles
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global CSS
│
├── .env.local                      # Environment variables (not committed)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── components.json                 # shadcn/ui configuration
└── README.md                       # This file
```

---

## 🏃 Running the Project

### Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Lint Code

```bash
npm run lint
# or
yarn lint
```

---

## 🔄 Project Workflow

### 1. **User Authentication**
- Users sign up/login via Clerk
- User profile stored in Firebase Firestore `users` collection

### 2. **Create Mock Interview**
- User fills form with:
  - Job Position (e.g., "Senior Frontend Developer")
  - Job Description
  - Years of Experience Required
  - Tech Stack (e.g., "React, TypeScript, Firebase")
- Form data sent to Google Generative AI
- AI generates 5 interview questions with model answers
- Interview saved to `interviews` collection

### 3. **Take Interview**
- User opens interview from dashboard
- Questions displayed one at a time
- User can:
  - Hear question via text-to-speech
  - Enable webcam to record video
  - Enable microphone to record audio
  - Type or speak their answer

### 4. **AI Evaluation**
- User's answer sent to Google Generative AI
- AI compares with model answer
- AI generates:
  - Detailed feedback
  - Rating (0-10)
  - Suggestions for improvement
- Response stored in `userAnswers` collection

### 5. **View Feedback**
- User can review all answers and feedback
- See ratings and performance metrics
- Compare their answers with model answers

---

## 🎓 Key Components Explained

### Form Mock Interview Component
Handles interview creation with AI integration:
- Validates form inputs using Zod
- Generates 5 interview questions via Google GenAI
- Saves to Firestore
- Supports edit functionality

### Question Section Component
Displays interview questions with features:
- Tab-based navigation between questions
- Text-to-speech for questions
- Webcam toggle
- Answer recording capability

### Record Answer Component
Manages user response recording:
- Audio/video recording
- Webcam integration
- Speech-to-text conversion
- Answer submission to Firestore

---

---

**Last Updated**: January 2024
**Version**: 1.0.0

