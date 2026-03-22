# LMS Pro - Learning Management System

LMS Pro is a production-ready Learning Management System built with a modern tech stack focusing on performance, scalability, and premium user experience.

## Tech Stack

**Frontend:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios (with Auto-token refresh)

**Backend:**
- Node.js & Express.js
- MySQL
- JWT Auth (Access + Refresh Tokens)
- Bcrypt for hashing

## Features

- **Authentication:** Secure login/register with role-based access (Student/Admin).
- **Course Discovery:** Browse and enroll in available subjects.
- **Learning Experience:** Video-based lessons with YouTube embedding and sidebar navigation.
- **Progress Tracking:** Automatic progress saving and course completion percentage.
- **Admin Tools:** Full CURD for subjects, sections, and video lessons.
- **Premium UI:** Modern, responsive design using Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL instance

### Setup Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file based on `.env.example`
4. Run schema: `mysql -u root -p < models/schema.sql`
5. Seed data: `node seed.js`
6. Start server: `npm run dev` (or `node server.js`)

### Setup Frontend
1. `cd frontend`
2. `npm install`
3. Start development server: `npm run dev`

## Default Credentials (from Seed)

**Admin:**
- Email: `admin@lms.com`
- Password: `admin123`

**Student:**
- Email: `student@lms.com`
- Password: `student123`
