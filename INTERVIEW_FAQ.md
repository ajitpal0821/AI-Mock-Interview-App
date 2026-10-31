# ❓ Interview FAQ - Likely Questions & Answers

**Prepare your answers to these questions. Practice saying them naturally.**

---

## 🎯 Project Questions

### Q1: What problem does your app solve?

**Answer:**
"It helps job candidates practice interviews with personalized AI-generated questions and instant feedback. It solves the need for realistic, scalable mock interview practice without the cost or scheduling burden of a live interviewer."

---

### Q2: Who is the target user?

**Answer:**
"The target user is a job seeker preparing for technical interviews, including career switchers and people re-entering the workforce. It can also be extended for companies offering interview prep support to employees."

---

### Q3: Why 5 questions?

**Answer:**
"Five questions are enough to evaluate multiple dimensions—technical skill, communication, problem-solving, experience, and follow-up discussion—without making the session too long."

---

### Q4: What if a user gives a poor answer?

**Answer:**
"The app validates answer length and then uses AI feedback to provide constructive guidance. Even poor answers receive useful suggestions for improvement rather than simply rejecting the response."

---

## 🛠️ Technical Questions

### Q5: Why Firebase?

**Answer:**
"Firebase removes backend complexity and provides authentication, Firestore, and real-time data synchronization. It enabled me to focus on core functionality instead of server infrastructure."

---

### Q6: Why React?

**Answer:**
"React provides reusable components and efficient state management. It is ideal for building interactive UIs with a complex workflow like this app."

---

### Q7: How do you use AI?

**Answer:**
"I use Google GenAI for two purposes: generating interview questions from user input, and evaluating user answers to return ratings and feedback. The AI is prompted with structured input and the app parses the output safely."

---

### Q8: How do you handle errors?

**Answer:**
"I use try/catch for API and database calls, toast notifications for user-facing errors, and validation at the form level with Zod. I also keep sensitive keys secure in environment variables."

---

## 🏗️ Architecture Questions

### Q9: How is data modeled?

**Answer:**
"Three Firestore collections: Users, Interviews, and UserAnswers. Interviews reference users with userId, and answers reference interviews with mockIdRef. This keeps the data normalized and easy to query."

---

### Q10: How do you secure the app?

**Answer:**
"Clerk handles authentication, Firestore security rules restrict access to authorized users only, and API keys are stored in `.env.local`. Sensitive data is never committed to git."

---

## 🎓 Learning Questions

### Q11: What was the hardest part?

**Answer:**
"Parsing Google GenAI responses consistently was the hardest part. I fixed it with a cleaning layer that removes formatting and safely extracts JSON."

---

### Q12: What would you do differently?

**Answer:**
"I would add testing earlier, consider a unified framework like Next.js, and set up monitoring and error tracking from the beginning."

---

### Q13: What did you learn about development?

**Answer:**
"I learned how to integrate frontend, backend, and AI systems in a cohesive product. I also learned that defensive programming is key when working with external APIs."

---

## 💼 Business Questions

### Q14: Would this be a paid product?

**Answer:**
"Yes, I'd start with a freemium model: limited free interviews, plus paid plans for unlimited practice, advanced feedback, and analytics. Enterprise plans could offer team access and reporting."

---

### Q15: Who are competitors?

**Answer:**
"Competitors include interview prep platforms and peer-practice services. My app’s advantage is instant AI feedback and a lower-cost, accessible solution."

---

## ✅ Preparation Tips

- Practice the answers out loud.
- Keep explanations concise.
- Use specific examples from the app.
- Be ready to explain the tech stack and architecture.
- Show that you understand both the product and implementation."
