# Sivan Cloud Accelerator — Admin Dashboard (Frontend Context)

> **Purpose:** This context file defines the scope, features, routes, components, and API connections required for the Admin Dashboard frontend, built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 1. Tech stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui (for consistent UI components)
* **State management:** React Query (TanStack Query) for API data fetching/caching
* **Auth:** JWT-based (stored in httpOnly cookies or secure localStorage, depending on backend implementation)
* **Charts:** recharts (for quiz results & analytics)
* **Forms:** react-hook-form + zod for validation

---

## 2. Admin roles & capabilities

Admins (and Super Admins) should be able to:

* Manage users (students & admins)
* Manage batches (create, update, enroll students)
* Create and manage quizzes (CRUD)
* Assign quizzes to batches/students
* Monitor quiz attempts and results
* Manually grade subjective answers
* View analytics dashboards (performance by batch, quiz, student)

---

## 3. Dashboard structure (routes/pages)

### Auth

* `/login` — Admin login page
* `/logout` — Clears session and redirects

### Dashboard (protected)

* `/dashboard` — Overview with quick stats (active batches, upcoming quizzes, attempts in progress)

### Users

* `/dashboard/users` — List all users (table with filters by role)
* `/dashboard/users/create` — Create new user (student/admin)
* `/dashboard/users/[id]` — View/update user details

### Batches

* `/dashboard/batches` — List batches
* `/dashboard/batches/create` — Create batch
* `/dashboard/batches/[id]` — Batch details (students enrolled, assigned quizzes)

### Quizzes

* `/dashboard/quizzes` — List quizzes (filter by published/unpublished)
* `/dashboard/quizzes/create` — Quiz builder (form with questions array)
* `/dashboard/quizzes/[id]` — Quiz details (metadata, assigned batches/students)
* `/dashboard/quizzes/[id]/edit` — Update quiz

### Assignments

* `/dashboard/quizzes/[id]/assign` — Assign quiz to batches or students, set availability window

### Attempts & Results

* `/dashboard/attempts` — List all attempts (with filters by quiz, batch, status)
* `/dashboard/attempts/[id]` — Attempt details (answers, auto-scored results, manual grading interface)
* `/dashboard/quizzes/[id]/results` — Aggregate results view (charts: average score, top performers, question difficulty)

### Analytics

* `/dashboard/analytics` — High-level insights (average scores by batch, completion rates, upcoming deadlines)

---

## 4. UI components

* **Layout**: sidebar nav + top bar with user profile/logout
* **Tables**: DataGrid with pagination, search, filters (users, quizzes, attempts)
* **Forms**: CRUD forms for users, batches, quizzes
* **Quiz Builder**: dynamic question form (question type, choices, correct answers, marks)
* **Charts**: bar charts, pie charts, line charts for quiz analytics (recharts)
* **Notifications/Toasts**: success/error messages
* **Modal dialogs**: confirmation dialogs for delete, publish, assign