# 📊 Visual Explanations - Whiteboard Guide

Use these diagrams when an interviewer asks you to draw or explain architecture.

---

## 1️⃣ User Journey Flow

```
USER SIGNUP
   │
   ▼
CREATE INTERVIEW
   │
   ▼
GENERATE QUESTIONS (Google GenAI)
   │
   ▼
SAVE INTERVIEW (Firestore)
   │
   ▼
TAKE INTERVIEW
   │
   ▼
EVALUATE ANSWER (Google GenAI)
   │
   ▼
SAVE FEEDBACK (Firestore)
   │
   ▼
VIEW RESULTS
```

---

## 2️⃣ Database Schema Diagram

```
USERS
- id
- name
- email
- imageUrl
- timestamps
   │
   └── userId
        ▼
INTERVIEWS
- id
- userId
- position
- description
- experience
- techStack
- questions[]
- timestamps
   │
   └── mockIdRef
        ▼
USERANSWERS
- id
- userId
- mockIdRef
- question
- correctAnswer
- userAnswer
- aiFeedback
- aiRating
- timestamps
```

---

## 3️⃣ Architecture Diagram

```
FRONTEND (React + TS)
   │
   ├─ Clerk (Auth)
   ├─ Firebase (Firestore)
   └─ Google GenAI

FIRESTORE COLLECTIONS:
- Users
- Interviews
- UserAnswers
```

---

## 4️⃣ Component Hierarchy

```
App
├─ Header
├─ Routes
│  ├─ Home
│  ├─ Dashboard
│  ├─ Create/Edit
│  ├─ Interview
│  └─ Feedback
└─ Footer
```

---

## 5️⃣ Data Flow for Interview

```
Load interview → Display question → Record answer → Send answer to GenAI → Receive feedback → Save feedback → Show rating
```

---

## 6️⃣ Challenge Visuals

**AI Parsing**
```
Raw GenAI text
   │
   ├─ remove markdown
   ├─ extract JSON
   └─ parse safely
```

**Speech-to-Text**
```
User speech
   │
   └─ react-hook-speech-to-text
         │
         └─ validated text answer
```

**Firestore Optimization**
```
Query user interviews
   │
   └─ use userId + createdAt index
```
```

---

## 7️⃣ How to Draw It

1. Start with the user path.
2. Add the database collections.
3. Show external API connections.
4. Keep it simple and label everything.

---

**Tip:** Draw in 3 sections: user flow, data structure, and system architecture. It makes your explanation easier to follow.
