<<<<<<< HEAD
# ResumeAI — ATS Resume Analyzer & Builder

> Beat ATS Bots. Get Hired Faster.

A full-stack MERN application that analyzes resumes against job descriptions using an ATS scoring engine, and provides an Overleaf-style split resume builder with live preview.

---

## 🗂️ Project Structure

```
resumeai/
├── client/                     # React + Vite + Tailwind frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ui/
│   │   │       ├── ATSScoreCard.jsx
│   │   │       ├── EditorSection.jsx
│   │   │       ├── FeatureCard.jsx
│   │   │       ├── PageWrapper.jsx
│   │   │       ├── ResumePreview.jsx
│   │   │       └── TemplateCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useScrollReveal.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AnalyzerPage.jsx
│   │   │   ├── BuilderPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── analyzeController.js
│   │   └── resumeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── analyze.js
│   │   ├── resume.js
│   │   └── templates.js
│   ├── uploads/               # Auto-created, gitignored
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json               # Root — concurrently scripts
=======
# Mini-project
# 🎯 AI-Powered ATS Resume Analyzer & Resume Builder

<div align="center">

![Banner](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<br/>


</div>

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Team & Work Division](#-team--work-division)
- [API Endpoints](#-api-endpoints)
- [Contributing (Team Guide)](#-contributing-team-guide)
- [Roadmap](#-roadmap)

---

## 🧠 About The Project

This is a full-stack **MERN application** built as a team project. It solves a real-world problem — most resumes get rejected by **ATS (Applicant Tracking Systems)** before a human ever reads them.

Our app gives job seekers an unfair advantage by:

1. **Analyzing** their resume against any job description using Google Gemini AI
2. **Building** a professional resume from scratch using beautiful templates — and exporting it as a PDF

---

## ✨ Features

### 🔍 ATS Resume Analyzer
- 📄 Upload resume as **PDF**
- 📋 Paste any **Job Description**
- 🤖 **AI calculates a match score** (0–100)
- 🔑 Shows **Top 5 missing keywords** from the JD
- 💡 Gives **one specific improvement tip**
- 🕓 Saves analysis **history** to MongoDB

### 📝 Resume Builder *(Overleaf-style)*
- 🎨 Choose from **3+ professional templates**
- ✏️ Fill in your details with a **live preview**
- 📥 **Download as PDF** instantly
- 💾 Save and edit resumes anytime

### 🔐 Bonus Features
- User **Login / Register** (JWT Auth)
- **History tab** for past analyses
- Fully **mobile responsive** UI

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI** | Google Gemini 1.5 Flash API |
| **PDF Parse** | pdf-parse, Multer |
| **PDF Export** | react-to-pdf |
| **Auth** | JWT, bcryptjs |
| **Routing** | React Router DOM |

---

## 📁 Project Structure

```
Mini-project/
│
├── 📂 backend/
│   ├── server.js               # Express entry point
│   ├── .env                    # API keys (DO NOT COMMIT)
│   ├── 📂 routes/
│   │   ├── analyzeRoutes.js    # ATS analyzer endpoints
│   │   └── resumeRoutes.js     # Resume builder endpoints
│   ├── 📂 controllers/
│   │   ├── analyzeController.js
│   │   └── resumeController.js
│   ├── 📂 models/
│   │   ├── Analysis.js         # MongoDB schema
│   │   └── Resume.js
│   └── 📂 middleware/
│       └── upload.js           # Multer config
│
├── 📂 frontend/
│   └── 📂 src/
│       ├── App.jsx             # Routes
│       ├── 📂 pages/
│       │   ├── AnalyzerPage.jsx
│       │   ├── BuilderPage.jsx
│       │   └── HistoryPage.jsx
│       ├── 📂 components/
│       │   ├── FileUpload.jsx
│       │   ├── ResultCard.jsx
│       │   ├── ResumeForm.jsx
│       │   ├── ResumePreview.jsx
│       │   └── TemplateSelector.jsx
│       └── 📂 services/
│           └── api.js          # All Axios calls
│
>>>>>>> 693793310943e0cce51428bb411857ddd123d2b7
├── .gitignore
└── README.md
```

---

<<<<<<< HEAD
## 🚀 Quick Start

### 1. Install dependencies

```bash
# From root
npm run install:all
```

Or manually:
```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run development servers

```bash
# From root — starts both client (5173) and server (5000)
npm run dev
```

Or separately:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### 4. Open app

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 🔐 Demo Login

| Field    | Value                |
|----------|----------------------|
| Email    | demo@resumeai.com    |
| Password | 123456               |

The demo account works even without a MongoDB connection.

---

## 🛠️ Tech Stack

### Frontend
| Tech              | Purpose                          |
|-------------------|----------------------------------|
| React 18          | UI framework                     |
| React Router v6   | Client-side routing              |
| Tailwind CSS v3   | Utility-first styling            |
| Framer Motion     | Animations & page transitions    |
| Axios             | HTTP client with interceptors    |
| react-to-print    | Print / PDF export               |
| react-hot-toast   | Notifications                    |
| lucide-react      | Icon library                     |

### Backend
| Tech              | Purpose                          |
|-------------------|----------------------------------|
| Node.js + Express | REST API server                  |
| MongoDB + Mongoose| Database & ODM                   |
| bcryptjs          | Password hashing                 |
| JWT               | Authentication tokens            |
| Multer            | File upload handling             |
| pdf-parse         | PDF text extraction              |

---

## 📡 API Routes

### Auth
```
POST /api/auth/register   — Create account
POST /api/auth/login      — Login (returns JWT)
GET  /api/auth/me         — Get current user (protected)
```

### Analyze
```
POST /api/analyze/text    — Analyze pasted resume text
POST /api/analyze/upload  — Analyze uploaded file (multipart)
```

### Resume (all protected)
```
GET    /api/resume        — Get all user resumes
POST   /api/resume        — Create resume
GET    /api/resume/:id    — Get single resume
PUT    /api/resume/:id    — Update resume
DELETE /api/resume/:id    — Delete resume
```

### Templates
```
GET /api/templates        — Get all templates
GET /api/templates/:id    — Get single template
```

---

## 📄 Pages

| Route        | Page                    |
|--------------|-------------------------|
| `/`          | Landing Page            |
| `/analyzer`  | ATS Resume Analyzer     |
| `/builder`   | Resume Builder          |
| `/templates` | Template Gallery        |
| `/auth`      | Login / Register        |

---

## 🏗️ Building for Production

```bash
# Build frontend
npm run build

# Serve static files from Express (add to server/index.js)
# app.use(express.static(path.join(__dirname, '../client/dist')))
```

---

## 📝 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resumeai
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
=======


- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free)
- [Google Gemini API Key](https://makersuite.google.com/app/apikey) (free)

>>>>>>> 693793310943e0cce51428bb411857ddd123d2b7
