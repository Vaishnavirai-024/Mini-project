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
├── .gitignore
└── README.md
```

---



- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free)
- [Google Gemini API Key](https://makersuite.google.com/app/apikey) (free)

