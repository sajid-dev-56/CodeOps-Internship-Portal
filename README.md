# Internship Portal (Next.js + MongoDB)

An MVP for offering internships, assigning tasks, student submissions, and teacher reviews.

## Features
- Auth with NextAuth (Credentials, JWT sessions)
- Roles: TEACHER and STUDENT
- Tasks: create (teacher), assign to students
- Submissions: submit links/notes (student), review status/feedback (teacher)
- Simple UI (no CSS framework) and REST APIs

## Setup

1. Clone and install
```bash
pnpm i # or npm i or yarn
```

2. Env
Copy `.env.example` to `.env.local` and set:
- `MONGODB_URI` (MongoDB Atlas or local)
- `NEXTAUTH_SECRET` (generate a strong random string)
- `NEXTAUTH_URL` (http://localhost:3000 for local dev)

3. Run
```bash
pnpm dev
```
Open http://localhost:3000

4. Create accounts
- Register a TEACHER account (choose role on /register)
- Register STUDENT accounts
- As TEACHER: create tasks (Dashboard)
- Assign tasks to students via API (temporary, use curl or Postman):
```bash
curl -X POST http://localhost:3000/api/tasks/TASK_ID/assign \
 -H "content-type: application/json" \
 -b "<your auth cookie>" \
 -d '{"studentIds":["STUDENT_OBJECT_ID"]}'
```
(You can add a simple assign UI later.)

- As STUDENT: submit links/notes for assigned tasks

## Next
- Add cohorts/batches, comments, notifications
- File uploads (Cloudinary/S3)
- Better UI (Tailwind + shadcn/ui)
- Email (for invites/notifications)
- Teacher-side UI to assign students

## Deploy
- Vercel for frontend/API
- MongoDB Atlas for DB
- Set env vars in Vercel dashboard
