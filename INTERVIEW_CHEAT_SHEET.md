# 📝 Interview Cheat Sheet - Quick Reference

## 🎯 30-Second Elevator Pitch
"I built an **AI Mock Interview App** using React and Firebase. It generates personalized interview questions using Google's GenAI, lets users record video and audio responses, and provides AI-powered feedback with ratings. The goal is to help job candidates practice interviews efficiently before their actual interviews."

---

## 🛠️ Tech Stack (Say This)
- **Frontend:** React 19 + TypeScript + Vite
- **UI:** TailwindCSS + Radix UI + shadcn/ui
- **Backend:** Firebase + Firestore
- **AI:** Google GenAI API
- **Auth:** Clerk
- **Key Libraries:** React Router, React Hook Form, Zod, React Webcam, Web Speech API

---

## 💾 Database (3 Collections)
| Collection | What it stores |
|-----------|----------------|
| **Users** | User profile |
| **Interviews** | Interview config + AI questions |
| **UserAnswers** | User responses + AI feedback |

---

## 🔄 How It Works (5 Steps)
1. User creates interview with position, description, experience, and tech stack.
2. GenAI generates 5 interview questions and model answers.
3. User records an answer using webcam/microphone.
4. GenAI evaluates the answer and generates feedback.
5. Results are saved and displayed in the dashboard.

---

## 🔥 Top 3 Challenges & Solutions

### 1. AI Response Parsing
- Problem: Response included markdown or malformed JSON.
- Solution: Clean the response with regex and parse safely.

### 2. Speech Recognition Consistency
- Problem: Web Speech API varies across browsers.
- Solution: Use `react-hook-speech-to-text` and validate answer length.

### 3. Firestore Query Optimization
- Problem: Too many database reads.
- Solution: Use compound queries and indexes.

---

## ❓ Quick Answers

**Q: Why Firebase?**
A: Fast setup, managed backend, real-time database, and auto-scaling.

**Q: Why React?**
A: Component reuse, efficient rendering, and strong ecosystem.

**Q: How is security handled?**
A: Clerk handles auth, Firestore rules protect data, and keys stay in .env.

**Q: What would you improve?**
A: Analytics, difficulty levels, PDF export, mobile support, and job-board integration.

**Q: How would you scale it?**
A: Use CDN/static caching, optimize Firestore queries, and add caching for AI results.

---

## 🎬 Demo Points
- Sign in
- Create interview
- Take interview
- View feedback
- Show dashboard

---

## 📊 Key Numbers
- Questions per interview: 5
- Collections: 3
- Main tables: Users, Interviews, UserAnswers
- AI features: question generation + feedback

---

## 💡 Emphasize These
- Full-stack development
- AI integration
- Real-time feedback
- Serverless backend
- Clear problem-solution fit

---

## ✅ Ready Checklist
- GitHub link
- Demo/screenshots
- Database schema clear
- Key challenges and solutions ready
- Answers to common follow-ups

---

**Practice this cheat sheet until you can say it without reading.**
