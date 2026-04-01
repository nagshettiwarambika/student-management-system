# 🎓 Student Management System

A full-stack MERN application for managing student records with user authentication, CRUD operations, and real-time search/filter.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose (ODM) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## ✨ Features

- **User Authentication** — Signup, Login, protected routes with JWT
- **Dashboard** — Stats overview, recent students, department breakdown
- **Student CRUD** — Create, Read, Update, Delete student records
- **Search & Filter** — Filter by name, roll no, department, year, status
- **Responsive UI** — Clean, mobile-friendly interface with Tailwind CSS

---

## 📁 Project Structure

```
student-management-system/
├── client/          ← React frontend
│   └── src/
│       ├── components/   (Layout, StudentForm)
│       ├── context/      (AuthContext)
│       ├── pages/        (Login, Signup, Dashboard, Students, Add, Edit)
│       └── utils/        (api.js - axios instance)
│
└── server/          ← Express backend
    ├── controllers/ (authController, studentController)
    ├── middleware/  (auth.js - JWT protect)
    ├── models/      (User.js, Student.js)
    └── routes/      (auth.js, students.js)
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2. Setup the Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### 3. Setup the Frontend
```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

The app will be at `http://localhost:5173`

---

## ☁️ Deployment

### MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create a free cluster
2. Create a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (allow all for deployment)
4. Copy the connection string → replace `<username>` and `<password>`

### Backend → Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo → select the `server` folder as root
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel frontend URL (add after frontend deploy)
7. Deploy → copy the Render URL (e.g. `https://your-app.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → set **Root Directory** to `client`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-app.onrender.com/api`
4. Deploy → copy the Vercel URL
5. Go back to Render → update `CLIENT_URL` with Vercel URL → redeploy

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Students (all protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students (with filters) |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/stats/overview` | Get dashboard stats |

---

## 📸 Screenshots
*(Add screenshots of your deployed app here)*

---

## 👤 Student Info
- **Name**: [Your Name]
- **Roll Number**: [Your Roll Number]
