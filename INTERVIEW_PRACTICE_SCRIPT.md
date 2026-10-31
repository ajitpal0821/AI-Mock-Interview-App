# 🎤 Interview Practice Script

**Read this script aloud 3-4 times until it sounds natural.**

---

## ⏱️ Part 1: Opening & Problem (1 minute)

"Hi! I built an **AI Mock Interview Application**. It helps job candidates practice interviews by generating role-specific questions, recording their answers, and giving AI-powered feedback.

The problem it solves is that interview practice is often expensive, hard to schedule, and lacks objective feedback. My app provides an automated way to practice with personalized questions and instant evaluation."

---

## ⏱️ Part 2: Solution Overview (1-2 minutes)

"Here’s how it works:

**Step 1:** The user creates an interview by entering job position, job description, experience level, and tech stack.

**Step 2:** I send this info to Google GenAI, which returns 5 custom technical questions with model answers.

**Step 3:** The user takes the interview, hears the question through text-to-speech, and records their answer with webcam and microphone.

**Step 4:** The app sends the answer to Google GenAI again to compare it with the model answer and generate feedback.

**Step 5:** The user sees a rating, suggestions, and a comparison of their answer with the ideal response."

---

## ⏱️ Part 3: Tech Stack (1-2 minutes)

"I used React 19 and TypeScript because they provide a modern, type-safe frontend. Vite was chosen for fast development builds.

For UI, I used TailwindCSS with Radix UI and shadcn/ui to build responsive, accessible components quickly.

Firebase and Firestore power the backend, so I didn’t need to manage a custom server. Clerk handles authentication securely.

AI integration is done with Google GenAI, which generates interview questions and evaluates answers. Supporting libraries include React Router, React Hook Form, Zod, React Webcam, and a speech-to-text library."

---

## ⏱️ Part 4: Technical Challenges (1-2 minutes)

"The biggest technical challenge was handling the Google GenAI responses. Sometimes the API returned markdown or messy JSON, so I built a parser that cleans the response and safely extracts JSON data.

Another challenge was speech recognition consistency across browsers. I used `react-hook-speech-to-text` and added validation to ensure responses were long enough.

Finally, I optimized Firestore queries with compound indexes so fetching interviews and answers was efficient and cost-effective."

---

## ⏱️ Part 5: Database Design (30-45 seconds)

"The database has three main collections:
- **Users** for profile data,
- **Interviews** for the interview configuration and AI-generated questions,
- **UserAnswers** for the answers, AI feedback, and ratings.

Interviews are linked to users with `userId`, and answers link to interviews using `mockIdRef`. This keeps data organized and queryable."

---

## ⏱️ Part 6: What You Learned (1 minute)

"This project helped me learn full-stack React development, Firebase database design, and AI integration with an external API.

I also improved my problem-solving skills around handling unpredictable API formats, building robust validation, and designing a user-friendly workflow."

---

## ⏱️ Part 7: Future Improvements (30 seconds)

"If I continue working on it, I’d add:
- a performance analytics dashboard,
- difficulty levels,
- a PDF export for reports,
- job-board integration,
- and a mobile-optimized version."

---

## 💡 Pro Tips
- Speak clearly and calmly.
- Pause briefly between sections.
- Use examples from the app to support your points.
- Be honest about what you’d improve.
- Focus on the problem and the solution, not just the tools."
