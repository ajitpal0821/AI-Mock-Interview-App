# 📊 Visual Explanations - Whiteboard Guide

Use these visual explanations when the interviewer asks you to draw something on a whiteboard or share a screen.

---

## 1️⃣ User Journey Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY FLOW                       │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  1. USER SIGNUP  │
    │  (Clerk Auth)    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  2. CREATE INTERVIEW         │
    │  - Job Position              │
    │  - Job Description           │
    │  - Years of Experience       │
    │  - Tech Stack                │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 3. GOOGLE GENAI API          │
    │ Generate 5 Interview         │
    │ Questions + Model Answers    │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 4. SAVE TO FIRESTORE         │
    │ "interviews" Collection      │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 5. TAKE INTERVIEW            │
    │ - Display questions          │
    │ - Text-to-speech             │
    │ - Record audio/video         │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 6. GOOGLE GENAI EVALUATION   │
    │ Compare answer with          │
    │ model answer                 │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 7. GENERATE FEEDBACK         │
    │ - Rating (0-10)              │
    │ - Feedback text              │
    │ - Suggestions                │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 8. SAVE TO FIRESTORE         │
    │ "userAnswers" Collection     │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 9. VIEW FEEDBACK             │
    │ - Your answer                │
    │ - Model answer               │
    │ - AI feedback & rating       │
    └──────────────────────────────┘
```

---

## 2️⃣ Database Schema Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    FIRESTORE DATABASE                          │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│     USERS TABLE      │  (From Clerk Auth)
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ email                │
│ imageUrl             │
│ createdAt            │
│ updatedAt            │
└──────────────────────┘
        │
        │ userId (FK)
        │
        ▼
┌──────────────────────────────────────┐
│      INTERVIEWS TABLE                │
├──────────────────────────────────────┤
│ id (PK)                              │
│ userId (FK) ──────┐                  │
│ position          │                  │
│ description       │                  │
│ experience        │                  │
│ techStack         │                  │
│ questions[]       │                  │
│   - question      │                  │
│   - answer        │                  │
│ createdAt         │                  │
│ updatedAt         │                  │
└──────────────────────────────────────┘
        │
        │ mockIdRef (FK)
        │
        ▼
┌──────────────────────────────────────┐
│     USERANSWERS TABLE                │
├──────────────────────────────────────┤
│ id (PK)                              │
│ userId (FK)                          │
│ mockIdRef (FK) ────┤                 │
│ question           │                 │
│ correctAnswer      │                 │
│ userAnswer         │                 │
│ aiFeedback         │                 │
│ aiRating           │                 │
│ createdAt          │                 │
│ updatedAt          │                 │
└──────────────────────────────────────┘
```

---

## 3️⃣ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────┐
        │   FRONTEND (React + TS)      │
        │ - Components (20+ files)     │
        │ - State Management (Hooks)   │
        │ - Routing (React Router)     │
        │ - Forms (React Hook Form)    │
        │ - Validation (Zod)           │
        └──────────┬───────────────────┘
                   │
        ┌──────────┴──────────┬────────────────┐
        │                     │                │
        ▼                     ▼                ▼
   ┌─────────────┐   ┌──────────────┐  ┌─────────────┐
   │   CLERK     │   │  FIREBASE    │  │ GOOGLE AI   │
   │   (Auth)    │   │  (Backend)   │  │  (GenAI)    │
   └─────────────┘   └──────────────┘  └─────────────┘
                            │
                            ▼
                      ┌──────────────┐
                      │  FIRESTORE   │
                      │   (Database) │
                      │  - Users     │
                      │  - Interviews│
                      │  - Answers   │
                      └──────────────┘

UI LIBRARIES: TailwindCSS + Radix UI + shadcn/ui
BUILD TOOL: Vite
```

---

## 4️⃣ Component Hierarchy

```
┌─────────────────────────────────────────────┐
│              App (Root)                     │
└──────────────────┬──────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Header  │  │  Routes  │  │  Footer  │
└──────────┘  └─────┬────┘  └──────────┘
                    │
        ┌───────────┼───────────┬──────────┐
        │           │           │          │
        ▼           ▼           ▼          ▼
    ┌─────┐   ┌─────────┐  ┌──────┐  ┌─────────┐
    │Home │   │Dashboard│  │Create│  │Interview│
    └─────┘   └────┬────┘  │ Edit │  │ Feedback│
                   │       └──────┘  └─────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌──────────┐         ┌──────────────┐
   │Interview │         │Interview     │
   │    Pin   │         │ Page         │
   └──────────┘         └────┬─────────┘
                             │
                ┌────────────┬┴─────────┐
                │            │         │
                ▼            ▼         ▼
          ┌──────────┐ ┌──────────┐ ┌───────┐
          │Questions │ │ Record   │ │Feedback
          │ Section  │ │ Answer   │ │Accordion
          └──────────┘ └──────────┘ └───────┘
```

---

## 5️⃣ Tech Stack Pyramid

```
                    ┌─────────────────┐
                    │  DEPLOYMENT     │  (Vercel/Firebase)
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
        ┌───────┐    ┌──────────────┐    ┌────────┐
        │ React │    │ React Router │    │Tailwind│
        │  19   │    │    DOM 7     │    │CSS 4   │
        └───────┘    └──────────────┘    └────────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
        ┌──────────┐  ┌─────────────┐  ┌──────────┐
        │TypeScript│  │ Vite Build  │  │   Zod    │
        │   5.9    │  │   6.4       │  │ Validation
        └──────────┘  └─────────────┘  └──────────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
        ┌──────────┐  ┌─────────────┐  ┌──────────┐
        │ Firebase │  │  Google     │  │ Clerk    │
        │Firestore │  │  GenAI API  │  │  Auth    │
        └──────────┘  └─────────────┘  └──────────┘
```

---

## 6️⃣ Data Flow for Taking Interview

```
┌─────────────────────────────────────────────────────────────┐
│         DATA FLOW: TAKING AN INTERVIEW                      │
└─────────────────────────────────────────────────────────────┘

USER INTERFACE                   BACKEND
─────────────────                ───────────

Display Question ◄──────────────── Firestore
     │                          (Interview data)
     │ [text-to-speech]
     │
Display Question Audio
     │
     ▼
Enable Webcam?
     │
     ├─► YES ──┐
     │         │ Record video
     │ NO      │
     │         │
     ├─────────┘
     │
     ▼
Start Recording
(Audio + Speech-to-text)
     │
User Speaks/Types Answer
     │
     ▼
Submit Answer ──────────────────► Process Answer
                                      │
                                      ▼
                              Google GenAI API
                                      │
                              Compare with model
                                      │
                              Generate Rating
                                      │
                              Generate Feedback
                                      │
                                      ▼
Show Feedback ◄──────────────── Save to Firestore
- Rating                      (UserAnswers table)
- Feedback
- Suggestions
```

---

## 7️⃣ Challenges & Solutions (Visual)

```
CHALLENGE #1: AI RESPONSE PARSING
─────────────────────────────────

Problem:
API Response from Google GenAI
    ↓
Response includes markdown (```, ```json)
    ↓
JSON.parse() fails
    ↓
ERROR: SyntaxError

Solution:
Raw Response
    ↓
Regex removes markdown
    ↓
Extract { ... } pattern
    ↓
Try JSON.parse()
    ↓
Success OR Fallback Handler
    ↓
Clean JSON object


CHALLENGE #2: SPEECH RECOGNITION
─────────────────────────────────

Problem:
Web Speech API (Raw)
    ↓
Different behavior in Chrome, Firefox, Safari
    ↓
Inconsistent results

Solution:
Web Speech API (Raw)
    ↓
react-hook-speech-to-text (Wrapper)
    ↓
Consistent behavior across browsers
    ↓
+ Validation (min 30 characters)
    ↓
Reliable Speech-to-Text


CHALLENGE #3: FIRESTORE QUERIES
──────────────────────────────

Problem:
SELECT * FROM interviews WHERE userId = X
    ↓
Firestore charges per read
    ↓
No pagination = expensive

Solution:
Create compound index: (userId, createdAt)
    ↓
Query with: userId + createdAt
    ↓
Implement pagination
    ↓
Efficient, cost-effective reads
```

---

## 💡 How to Draw These on a Whiteboard

### Step 1: Start with the User Journey
- Draw boxes for each step
- Use arrows to show flow
- Label each step

### Step 2: Move to Database
- Draw 3 rectangles for collections
- Show relationships with arrows and FK labels
- List 2-3 key fields in each

### Step 3: Explain Architecture
- Frontend, Backend, Database
- Show API connections
- Mention authentication flow

### Step 4: Draw Component Tree
- Start with App at top
- Branch down to main routes
- Show nested components

### Step 5: Explain Data Flow
- Draw the path data takes
- Show where validation happens
- Mark where errors could occur

---

## 🎯 What Each Diagram Shows Interviewers

| Diagram | What It Shows |
|---------|--------------|
| User Journey | You understand the complete user experience |
| Database Schema | You can design data structures |
| Architecture | You know how components communicate |
| Component Hierarchy | You understand React structure |
| Tech Stack | You chose appropriate tools |
| Data Flow | You understand data movement |
| Challenges | You solved real problems |

---

**Tip: Practice drawing these on paper first before the interview. It helps you talk while drawing, which is a valuable skill!**

