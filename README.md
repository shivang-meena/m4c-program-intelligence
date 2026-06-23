# M4C Program Intelligence Dashboard

An enterprise-grade, deterministic analytics and reporting dashboard built for evaluating PBL program performance across school districts. Processes multi-month CSV data, applies deterministic risk classification, and generates donor-ready grant reports with optional AI narrative support.

---

## 🚀 Architecture Overview

**Decoupled client-server architecture:**

- **Frontend:** React.js + Vite + Tailwind CSS v4. State managed via React Context API (`FilterContext` + `UIContext`).
- **Backend:** Node.js + Express.js REST API. Modular controller-service pattern separates business logic from routes.
- **Database:** MongoDB Atlas. Heavy aggregations handled via **MongoDB Aggregation Pipelines** directly at the database layer to offload the Node.js thread.

---

## 🗄️ Data Model

4 primary MongoDB collections:

| Model | Source CSV | Purpose |
|-------|-----------|---------|
| `SchoolResponse` | PBL_School_Response_Data (x3) | Monthly school telemetry |
| `GrantProfile` | 01_Grant_Profile_and_Finance | Donor budget & finance |
| `GrantPerformance` | 02_Grant_Performance_and_Report_Material | Monthly grant outcomes |
| `EvidenceMedia` | 03_Evidence_and_Media_Index | Images & media records |

**Key indexed fields:** `reporting_month`, `district`, `block`

---

## 🚦 Risk Classification Logic

Deterministic thresholds applied via `riskEngine.js` (no AI involved in classification):

| Status | Attendance Threshold |
|--------|---------------------|
| 🟢 **On Track** | >= 75% |
| 🟡 **Behind** | 60% – 74.9% |
| 🟠 **At Risk** | 35% – 59.9% |
| 🔴 **Critical** | < 35% |

Applied at: district level, block level, and grant performance level.

---

## 🛡️ Problem Solved: Data Guardrail Engine

During development, edge-case testing revealed raw CSV data contained attendance rates exceeding 100% due to manual entry errors. Fixed via:

1. **Strict Typecasting:** `Number()` parsing ensures all raw CSV fields are treated mathematically before any calculation.
2. **Boundary Capping:** `attendance > enrollment ? enrollment : attendance` evaluated per record before aggregation — guarantees no individual row skews the aggregate above 100%.

---

## 🤖 AI Workflow Explanation

**Preferred flow: Deterministic calculations → Structured insights → Generated narrative**

- Dashboard metrics, risk classifications, and grant fact summaries work fully **without AI** (toggle off to see raw facts).
- When AI is enabled, the **Groq API (LLaMA 3)** generates narratives using *only* pre-computed facts passed in the prompt.
- **Hallucination Guardrail:** No raw CSV data is sent to AI — only structured computed facts (completion %, evidence %, attendance %, milestones, utilization rate).
- **Graceful Fallback:** If AI is disabled or the Groq API fails, deterministic raw facts are displayed automatically — the dashboard never breaks.

---

## ⚙️ Setup Instructions

**Prerequisites:** Node.js v18+, MongoDB Atlas URI, Groq API Key.

**1. Clone the repository:**
```bash
git clone <repository-url>
cd m4c-program-intelligence
2. Backend setup:

Bash
cd backend
npm install
Create a .env file in the backend directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
3. Seed the database (run once):

Bash
node scripts/seedDatabase.js
4. Start backend:

Bash
npm run dev
# Server running on port 5000
# MongoDB Connected: cluster.mongodb.net
5. Frontend setup:

Bash
cd ../frontend
npm install
npm run dev
# App running on http://localhost:5173
🛠️ Assumptions
CSV headers match the provided synthetic dataset structure exactly.

total_enrollment is used as the absolute mathematical ceiling for attendance calculations.

Risk thresholds are applied uniformly across all districts and blocks.

Synthetic images are served from frontend/public/assets/.

All data is synthetic and for assessment use only.

⚠️ Limitations
Data ingestion is batch-based via seed script — no real-time streaming (WebSockets not implemented).

Risk thresholds are hardcoded in riskEngine.js — require redeployment to adjust.

No authentication — all views are publicly accessible.

Export to PDF/DOCX not implemented (copy-to-clipboard available).

🏭 Production-Readiness Notes
Global error handling middleware (notFoundHandler, validationHandler, globalErrorHandler) prevents API crashes.

MongoDB Aggregation Pipelines handle large-scale data efficiently.

.env excluded from repository via .gitignore.

CORS configured for frontend-backend communication.

Tailwind CSS v4 with PostCSS integration avoids legacy directive deprecation.

In production: would add JWT auth, rate limiting, helmet.js, and environment-specific configs.

🔮 Future Improvements
Auth & RBAC: JWT-based login separating Program Manager and Donor views.

PDF Export: Node microservice to convert Review Summary to downloadable PDF.

Dynamic Thresholds: Admin UI to configure risk boundaries without redeployment.

Real-time Updates: WebSocket integration for live data entry monitoring.

Block-level AI Narratives: Extend AI reporting to block and school level.