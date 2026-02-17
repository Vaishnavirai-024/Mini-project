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
├── .gitignore
└── README.md
```

---

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
