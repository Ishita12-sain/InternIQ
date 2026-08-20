# InternIQ — Internship & Placement Management Portal

InternIQ is a full-stack internship and placement intelligence platform built with React, TypeScript, Vite, TailwindCSS, Node.js, Express, and PostgreSQL.

---

## Project Structure

```
InternIQ/
├── backend/                # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── config/         # Environment, database, and JWT configs
│   │   ├── controllers/    # Request controllers
│   │   ├── middleware/     # Auth, error, and logger middlewares
│   │   ├── repositories/   # PostgreSQL data access layer
│   │   ├── routes/         # Express API routes
│   │   ├── server.ts       # Server entry point
│   │   └── app.ts          # Express application setup
│   ├── .env.example        # Backend environment variables template
│   └── package.json
├── src/                    # React + Vite Frontend Application
│   ├── components/         # Reusable UI, student, company, admin components
│   ├── config/             # api.ts (centralized API_URL) & role definitions
│   ├── context/            # AuthContext, NotificationContext, SettingsContext
│   ├── pages/              # Role-specific dashboard & auth pages
│   ├── services/           # auth.service.ts API client
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Root router & layout
├── .env.example            # Frontend environment variables template
├── package.json
└── README.md
```

---

## Developer Setup Guide (Cloning on Another PC)

Follow these steps to set up and run InternIQ on any local development machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (v9 or later)
- [PostgreSQL](https://www.postgresql.org/) (v14 or later) installed and running locally

---

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd InternIQ
```

---

### Step 2: Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

### Step 3: Configure Frontend Environment Variables

Create the frontend `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Verify that `.env` contains:

```env
VITE_API_URL=http://localhost:5000
```

---

### Step 4: Configure Backend Environment Variables

Navigate to the `backend` folder and create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

---

### Step 5: Configure PostgreSQL Database

Ensure your local PostgreSQL server is running, and create the database if needed:

```sql
CREATE DATABASE internship_management;
```

In `backend/.env`, update the `DATABASE_URL` with your local PostgreSQL credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Allowed Frontend Origins (CORS)
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/internship_management
```

---

### Step 6: Install Backend Dependencies & Start Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 InternIQ Server running in [development] mode on port 5000
👉 Health check URL: http://localhost:5000/api/health
✅ PostgreSQL database connected successfully
```

---

### Step 7: Start Frontend Dev Server

In a new terminal window, return to the project root:

```bash
npm run dev
```

---

### Step 8: Open Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Available Scripts

### Frontend (Root)

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm run build` | Builds TypeScript and Vite production bundle |
| `npm run preview` | Previews production build locally |

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Starts Express development server with hot reload on port `5000` |
| `npm run build` | Compiles TypeScript into JavaScript in `dist/` |
| `npm run start` | Runs compiled production server from `dist/server.js` |
| `npm run type-check` | Runs TypeScript type checking without emitting files |

---

## API Endpoints Overview

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/health` | Backend health check status | No |
| `POST` | `/api/auth/register` | Register new student/company account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer JWT) |

---

## Git & Environment Safety

- All `.env` files containing real local passwords and credentials are automatically ignored by `.gitignore`.
- Only `.env.example` templates with safe placeholder values are committed to the Git repository.
