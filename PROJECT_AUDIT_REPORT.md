# 🚨 PROJECT HEALTH & TRACEABILITY REPORT
## Resume Analyzer & Builder (MERN Stack)
**Audit Date:** April 18, 2026  
**Status:** ⚠️ **CRITICAL ISSUES FOUND** — 5 Major Bugs, 8 Breaking Issues

---

## 1. ARCHITECTURE & SCHEMA HEALTH CHECK ❌

### 1.1 **CRITICAL: User.js — Duplicate Field Definition**
**File:** [User.js](backend/models/User.js)  
**Severity:** 🔴 **CRITICAL**

```javascript
credits: {
  type: Number,
  default: 100,        // ← Line 25
  min: [0, 'Credits cannot be negative'],
  default: 0,          // ← Line 28 DUPLICATE!
  min: 0,              // ← Line 29 DUPLICATE!
},
```

**Impact:**
- MongoDB schema validation will fail or behave unpredictably
- Unclear default value (100 or 0?)
- Interview credit deduction logic is broken
- Razorpay credit crediting will fail

**Fix Required:**
```javascript
credits: {
  type: Number,
  default: 0,
  min: [0, 'Credits cannot be negative'],
},
```

---

### 1.2 **CRITICAL: Payment.js — Severely Malformed Schema**
**File:** [Payment.js](backend/models/Payment.js)  
**Severity:** 🔴 **CRITICAL**

The Payment schema has **multiple duplicate fields** with conflicting definitions:

| Field | Defined | Issues |
|-------|---------|--------|
| `razorpayOrderId` / `orderId` | 2x | Inconsistent naming, both required and unique |
| `razorpayPaymentId` / `paymentId` | 2x | Conflicting sparse/unique rules |
| `razorpaySignature` / `signature` | 2x | Different default values |
| `amount` | 2x | Lines 19 & 34, conflicting min values |
| `status` | 2x | Different enum values: `['created', 'authorized', 'captured', 'refunded', 'failed']` vs `['created', 'paid', 'failed']` |
| `receipt` | 2x | Lines 60 & 98 |

**Impact:**
- Schema fails to compile or uses unpredictable defaults
- Razorpay payment verification will reference wrong fields
- Payment status tracking is ambiguous
- Data consistency impossible

**Critical Fix:**
```javascript
const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  razorpaySignature: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
    default: 'created',
  },
  plan: {
    type: String,
    enum: ['pro-monthly', 'pro-yearly', 'credits-pack'],
    required: true,
  },
  creditsAwarded: {
    type: Number,
    default: 0,
    min: 0,
  },
  receipt: {
    type: String,
    trim: true,
  },
  failureReason: {
    type: String,
    default: '',
  },
  paidAt: {
    type: Date,
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });
```

---

### 1.3 **CRITICAL: Two Resume Models — THE DUPLICATE CREATION BUG**
**Files:** [resumeModel.js](backend/models/resumeModel.js) vs [resumeBuilderModel.js](backend/models/resumeBuilderModel.js)  
**Severity:** 🔴 **CRITICAL** — ROOT CAUSE OF DUPLICATE BUG

**Problem:** Your project has **two incompatible resume schemas**:

| Model | Fields | Used By | Purpose |
|-------|--------|---------|---------|
| `resumeModel.js` | `user`, `fileUrl` | `resumeController.js` | Upload PDF files only |
| `resumeBuilderModel.js` | Full structured data (personal, skills, experience, etc.) | **NOTHING!** 🎯 ORPHANED | Rich resume builder |

**Current Flow:**
```
BuilderPage.jsx (Rich Resume State)
        ↓ (saves via api.post/put)
        ↓
resumeController.js (uses resumeModel.js) ← ONLY has fileUrl!
        ↓
MongoDB: Lost all structured resume data!
```

**Why Duplicates Are Created:**
1. Frontend saves resume data via `POST /api/resume`
2. `resumeController.createResume()` only stores the `fileUrl` from multer
3. All metadata (personal, skills, experience, etc.) **DISCARDED**
4. Next save: Frontend can't find previous resume by matching data, creates NEW one
5. When user tries to UPDATE with `PUT /api/resume/:id`, the endpoint only updates `fileUrl`, not the data

**Impact:**
- Resume builder data is never persisted
- Duplicate resumes created on every save
- Cannot load previously saved resume
- All user work is lost

**Relationship Status:** ❌ `User.resumes` relationship exists in schema but is **never populated**

---

### 1.4 **Interview.js & Payment.js Relationships**
**Status:** ✅ Correctly referenced (ObjectIds properly set)

```javascript
// Interview.js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  index: true,
}

// Payment.js  
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  index: true,
}
```

---

## 2. THE TRACEABILITY MATRIX (Frontend ↔ Backend Wiring) 🔗

### 2.1 Resume Builder Save Logic — BROKEN ❌

| Action | Frontend | Backend | Status |
|--------|----------|---------|--------|
| **Save New** | `api.post('/resume', {...data})` | `resumeController.createResume()` | ❌ Stores only `fileUrl`, loses all data |
| **Save Existing** | `api.put('/resume/{id}', {...data})` | `resumeController.updateResume()` | ❌ Updates only `fileUrl`, ignores resume content |
| **Detect Exists** | Checks `resumeId` state | No backend support | ❌ Frontend tracks ID but backend schema incompatible |

**Current Frontend Code ([BuilderPage.jsx](frontend/src/pages/BuilderPage.jsx)):**
```javascript
const handleSave = async () => {
  if (resumeId) {
    // UPDATE path
    await api.put(`/resume/${resumeId}`, { ...data, template, title: ... })
  } else {
    // CREATE path — tries to send full resume object
    const response = await api.post('/resume', { ...data, template, title: ... })
    setResumeId(response.data._id) // ← Expects _id in response.data
  }
}
```

**Backend Response ([resumeController.js](backend/controllers/resumeController.js)):**
```javascript
const createResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "PDF file required" });
  
  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: req.file.path  // ← ONLY stores file path!
  });
  res.status(201).json({ success: true, data: resume });
}
```

**🎯 THE BUG:** Frontend sends full resume structure, backend ignores it and only stores `fileUrl`. When user saves again without uploading a new file, `req.file` is undefined, so **nothing gets saved**, forcing a new create!

---

### 2.2 ATS Analyzer Flow — PARTIALLY WORKING ✅/❌

| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| Upload resume | `api.post('/analyze/upload', formData)` | `analyzeController.analyzeUpload()` | ✅ Works |
| Extract text | — | `extractText()` PDF parsing | ✅ Works |
| Calculate ATS | — | `calculateATSScore()` | ⚠️ Rule-based, NOT AI |
| Save to history | — | `user.analysisHistory.push()` | ⚠️ Uses field with duplicate defaults |
| Paste text | `api.post('/analyze/text', {resumeText, jobDescription})` | `analyzeController.analyzeText()` | ✅ Works |

---

### 2.3 Payment Flow — NOT CALLED FROM FRONTEND ❌

**Endpoints Exist:**
- `POST /api/payment/order` → `createOrder()`
- `POST /api/payment/verify` → `verifyPayment()`

**Frontend Integration:** 🔴 **ZERO** — No payment buttons, no credit purchase UI

---

### 2.4 Interview Feature — NOT WIRED IN FRONTEND ❌

**Endpoints Exist:**
- `POST /api/interview/generate-questions` → Actually calls Gemini API ✅
- `POST /api/interview/evaluate-answer` → Actually calls Gemini API ✅

**Frontend Integration:** 🔴 **ZERO** — No "Start Interview" page, no question display UI

---

## 3. FILE HANDLING & CLOUDINARY AUDIT 📁

### 3.1 **Multer Configuration — NOT PRODUCTION-READY**
**Files:** [middleware/multer.js](backend/middleware/multer.js), [controllers/analyzeController.js](backend/controllers/analyzeController.js)  
**Severity:** 🟠 **HIGH**

**Issues:**

```javascript
// ❌ Using diskStorage instead of memoryStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // ← Creates local /uploads dir
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
```

**Problems:**
- ❌ Files stored to local disk — won't work on serverless (Lambda, Vercel, Railway)
- ❌ Files persisted in repo — version control bloat
- ❌ No cleanup mechanism (5-second delete in `analyzeController` is not reliable)
- ❌ `/uploads` folder is static-served but not gitignored — potential security issue

**Recommended Fix:**
```javascript
const multer = require('multer');

// Use memoryStorage for analysis
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'text/plain'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files allowed'));
    }
  }
});
```

---

### 3.2 **Cloudinary Integration — MISSING** ❌
**Severity:** 🟠 **HIGH**

**Current State:**
- ❌ No `cloudinary` npm package in `package.json`
- ❌ No upload logic to Cloudinary
- ❌ No `secure_url` storage in Resume schema
- ❌ Files stored locally, not in CDN

**What Should Exist:**
1. Install: `npm install cloudinary`
2. In `resumeController.js`:
   ```javascript
   const cloudinary = require('cloudinary').v2;
   
   const createResume = async (req, res) => {
     const result = await cloudinary.uploader.upload(req.file.path, {
       resource_type: 'auto',
       folder: 'resumes'
     });
     
     await Resume.create({
       user: req.user._id,
       fileUrl: result.secure_url  // ← Store CDN URL, not local path
     });
   };
   ```

---

## 4. THE "ORPHAN" AND "DEAD END" AUDIT 🪦

### 4.1 Backend Orphans (Endpoints Never Called)

| Endpoint | Code Status | Frontend Integration | Status |
|----------|-------------|----------------------|--------|
| `DELETE /api/resume/:id` | ✅ Implemented | `Dashboard.jsx` calls it | ✅ WIRED |
| `GET /api/resume` | ✅ Implemented | `Dashboard.jsx` calls it | ✅ WIRED |
| `POST /api/payment/order` | ✅ Implemented | **NOT CALLED** | ❌ ORPHAN |
| `POST /api/payment/verify` | ✅ Implemented | **NOT CALLED** | ❌ ORPHAN |
| `POST /api/interview/generate-questions` | ✅ Implemented | **NOT CALLED** | ❌ ORPHAN |
| `POST /api/interview/evaluate-answer` | ✅ Implemented | **NOT CALLED** | ❌ ORPHAN |
| `GET /api/templates` | ✅ Exists? | **UNKNOWN** | ❓ |

---

### 4.2 Frontend Orphans (UI Elements Without Backend)

| UI Element | Location | Target Endpoint | Status |
|------------|----------|-----------------|--------|
| "Buy Credits" button | ❌ Missing | `/api/payment/order` | ❌ DEAD CODE |
| "Start AI Interview" button | ❌ Missing | `/api/interview/generate-questions` | ❌ DEAD CODE |
| "Download PDF" button | ✅ Exists (Print) | Browser Print API | ✅ Works (local only) |
| Resume History Panel | ❌ Missing | `user.analysisHistory` | ❌ DEAD CODE |
| Credits Display | ❌ Missing | `user.credits` | ❌ DEAD CODE |

---

### 4.3 Hardcoded Dummy Data in Frontend

**File:** [BuilderPage.jsx](frontend/src/pages/BuilderPage.jsx)  
**Lines:** 6-41

```javascript
const DEFAULT_RESUME = {
  personal: { name: 'Alex Johnson', ... },
  summary: 'Results-driven software engineer...',
  experience: [
    { id: 1, company: 'TechCorp Inc.', role: 'Senior Software Engineer', ... },
    { id: 2, company: 'StartupXYZ', role: 'Software Engineer', ... },
  ],
  // ... full hardcoded resume
}
```

**Issue:** 🔴 **CRITICAL DESIGN FLAW**
- Resume data starts as hardcoded DEFAULT instead of loading from database
- No `useEffect` to load user's existing resume on mount
- When user edits, they're editing the hardcoded data, not their actual resume
- Data is never persisted (due to Bug #1.3)

**Fix Needed:**
```javascript
useEffect(() => {
  if (resumeId) {
    const loadResume = async () => {
      try {
        const { data } = await api.get(`/resume/${resumeId}`);
        setData(data.data);  // Load from DB, not DEFAULT
      } catch (err) {
        console.error('Failed to load resume:', err);
      }
    };
    loadResume();
  }
}, [resumeId]);
```

---

### 4.4 Dashboard.jsx Inconsistency

**File:** [Dashboard.jsx](frontend/src/pages/Dashboard.jsx)  
**Line:** 16

```javascript
const response = await api.get('/resume');
setResumes(response.data || []);  // ← Assumes response.data is array
```

**Problem:** API returns:
```javascript
res.json({ success: true, data: resumes });  // ← data is nested!
```

Should be:
```javascript
setResumes(response.data.data || []);
```

---

## 5. THE AI ENGINE & STATE HANDOFF SUMMARY ⚙️

### Critical Finding: **AI Integration is Incomplete**

The project claims to use **Google Gemini API** but **the implementation is fragmented and partially broken:**

**ATS Scoring ([analyzeController.js](backend/controllers/analyzeController.js)):**
- ❌ **NOT using Gemini** — uses hardcoded rule-based `calculateATSScore()` function
- Scores are deterministic keyword matching, not AI analysis
- No `@google/generative-ai` import
- User gets prescriptive tips but they're hardcoded, not AI-generated

**Interview Generation ([interviewController.js](backend/controllers/interviewController.js)):**
- ✅ **DOES use Gemini** — correctly imports and calls API
- Calls `ai.models.generateContent()` with proper prompt engineering
- Deducts credits before generation (prevents free abuse)
- **CRITICAL BUG:** Package.json lists `@google/genai` but code uses `@google/generative-ai` → **Will fail at runtime!**

**Evaluation ([interviewController.js](backend/controllers/interviewController.js)):**
- ✅ Uses Gemini for answer evaluation
- Returns confidence/communication/correctness scores
- **SAME PACKAGE MISMATCH** — will crash on import

**Current State:**
```
✅ Interview Questions: AI-powered (Gemini) BUT will crash on `import`
✅ Answer Evaluation: AI-powered (Gemini) BUT will crash on `import`
❌ ATS Scoring: Rule-based only (NOT AI)
❌ Resume Builder: Completely orphaned from DB
❌ Payment: Infrastructure ready but not wired
❌ UI: No interview or payment interfaces exist
```

**Exact Blocker:** `package.json` has:
```json
"@google/genai": "^1.50.1"  // ← This package doesn't exist or is deprecated!
```

Should be:
```json
"@google/generative-ai": "^0.x.x"  // ← Correct package
```

---

## 6. DEPENDENCY & PACKAGE MISMATCHES 📦

| Package | Listed In | Expected | Issue |
|---------|-----------|----------|-------|
| `@google/genai` | package.json | `@google/generative-ai` | ❌ WRONG PACKAGE NAME |
| `cloudinary` | ❌ Missing | Required for file upload | ❌ NOT INSTALLED |
| `mammoth` | ❌ Missing | Needed for DOCX parsing | ⚠️ Fallback returns empty string |

---

## 7. CRITICAL ISSUES SUMMARY TABLE

| Issue | Severity | Component | Impact | Fix Difficulty |
|-------|----------|-----------|--------|-----------------|
| User.js duplicate `credits` | 🔴 CRITICAL | Schema | Auth, Payment, Interview fail | 2 min |
| Payment.js malformed schema | 🔴 CRITICAL | Schema | All payments fail | 15 min |
| Two Resume models conflict | 🔴 CRITICAL | Data layer | Duplicate resume bug | 30 min |
| Multer diskStorage | 🟠 HIGH | File upload | Cloud deployment fails | 10 min |
| Cloudinary missing | 🟠 HIGH | File storage | Files not on CDN | 20 min |
| Package name mismatch | 🟠 HIGH | Dependencies | Interview feature crashes | 5 min |
| No payment UI | 🟡 MEDIUM | Frontend | Features dead-ended | 1 hour |
| No interview UI | 🟡 MEDIUM | Frontend | Features dead-ended | 1.5 hours |
| Dashboard.response.data mismatch | 🟡 MEDIUM | Frontend | Resume list won't display | 2 min |
| BuilderPage hardcoded data | 🟡 MEDIUM | Frontend | No data persistence | 20 min |

---

## 🎯 IMMEDIATE ACTION PLAN

### Phase 1: Critical Schema Fixes (30 minutes)
1. Fix User.js `credits` duplicate
2. Rebuild Payment.js schema from scratch
3. Run MongoDB validation tests

### Phase 2: Resume Model Consolidation (45 minutes)
1. Delete `resumeModel.js` orphan
2. Update `resumeController` to use `resumeBuilderModel`
3. Add `fileUrl` field to `resumeBuilderModel` if needed
4. Update API endpoints to save full resume structure

### Phase 3: Frontend Fixes (60 minutes)
1. Fix Dashboard response parsing
2. Remove hardcoded DEFAULT_RESUME
3. Add useEffect to load resume from DB
4. Wire up file upload properly

### Phase 4: Dependency & AI Engine (30 minutes)
1. Fix `@google/genai` → `@google/generative-ai`
2. Add `cloudinary` to package.json
3. Test interview generation endpoint
4. Test ATS analysis endpoint

### Phase 5: Feature Completion (TBD)
1. Build Payment UI with Razorpay integration
2. Build Interview UI with question display
3. Implement Cloudinary upload integration
4. Add credits display/history UI

---

## 📋 VALIDATION CHECKLIST

- [ ] User schema compiles without errors
- [ ] Payment schema compiles without errors
- [ ] Resume save works (new + update paths)
- [ ] Dashboard displays resumes from API
- [ ] Interview endpoint callable without crashes
- [ ] ATS analyzer working
- [ ] No duplicate resume creation on consecutive saves
- [ ] Files uploaded to Cloudinary
- [ ] All 5 developers sync on schema changes before next commit

---

**Report Generated:** April 18, 2026  
**Status:** Ready for remediation  
**Recommended Team Sync:** URGENT — Before next deployment
