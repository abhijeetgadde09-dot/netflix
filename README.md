# Netflix-Style Fullstack React App (MySQL + OMDb)

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express (REST)
- Database: MySQL (Aiven)
- Auth: JWT + bcrypt

## Features
- User can register (new customer) and login (existing customer)
- After successful login, user is redirected to main page
- Main page fetches movie rows from OMDb and displays Netflix-style landing layout
- Protected API routes with JWT

## Project Structure
- `backend/` Express API and MySQL integration
- `frontend/` React app

## Setup
1. Backend env is already created at `backend/.env`
2. Frontend env is already created at `frontend/.env`
3. Install deps:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`

## Run
Open two terminals:

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`
Backend URL: `http://localhost:5000`

## API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/movies/catalog` (Bearer token required)
- `GET /api/health`
