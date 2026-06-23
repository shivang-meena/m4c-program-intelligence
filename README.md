<p align="center">
  <img src="https://m4c-program-intelligence.vercel.app/favicon.svg" width="120" alt="M4C Program Intelligence Logo" />
</p>

<h1 align="center">M4C Program Intelligence</h1>

<p align="center">
  <strong>An AI-Enabled MERN Stack Dashboard for School District Analytics</strong>
</p>

<p align="center">
  <a href="https://m4c-program-intelligence.vercel.app/"><strong>View Live Dashboard (Vercel)</strong></a> · 
  <a href="https://m4c-program-intelligence.onrender.com/api"><strong>Backend API (Render)</strong></a>
</p>

---

## 📖 Overview

The **M4C Program Intelligence Dashboard** is a full-stack web application designed to analyze, classify, and report on school district performance data. It transforms raw attendance and programmatic data into actionable insights using a deterministic risk engine, fortified by strict data integrity guardrails, and enhanced by LLM-generated narrative reports.

This project demonstrates the architecture of an **AI-Enabled Product**, prioritizing strict data pipelines and deterministic facts over raw LLM outputs to prevent hallucinations in a professional reporting environment.

## ✨ Key Architectural Features

*   **Deterministic-First AI Pipeline:** Integrates the Groq API (LLaMA 3) to generate human-readable narratives. The backend strictly pre-computes all statistics and risk bands, passing only verified facts to the LLM. 
*   **The "127% Guardrail":** A robust backend data sanitation engine that intercepts manual CSV entry errors (like strings passed as numbers or physically impossible attendance rates over 100%) and normalizes the data before it hits the database.
*   **Deterministic Risk Engine (`riskEngine.js`):** A strictly typed classification service that categorizes district performance (e.g., "On Track", "At Risk") based on concrete attendance thresholds, decoupling business logic from standard route controllers.
*   **SPA Routing Integrity:** Frontend routing is seamlessly handled via React Router with custom Vercel rewrites to prevent 404 errors on direct sub-path navigation.

## 🛠 Tech Stack

**Frontend (Client)**
*   React 18
*   Vite
*   Tailwind CSS v4
*   React Router v6
*   Lucide React (Icons)
*   Deployed on **Vercel**

**Backend (Server)**
*   Node.js & Express.js
*   MongoDB & Mongoose (Aggregation Pipelines)
*   Groq API (LLaMA 3 8B/70B for text generation)
*   Deployed on **Render**

---

## 🗂 Project Structure

```text
m4c-program-intelligence/
├── frontend/                # React (Vite) Application
│   ├── public/              # Static assets (including favicon.svg)
│   ├── src/                 
│   │   ├── components/      # Reusable UI elements
│   │   ├── views/           # Page-level components
│   │   ├── context/         # React Context (UI state)
│   │   └── App.tsx          # Main Router
│   ├── vercel.json          # SPA Routing configuration for Vercel
│   └── package.json         
│
├── backend/                 # Node.js Express Application
│   ├── controllers/         # Request handling and business logic bridging
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # API Route definitions
│   ├── services/            # Core business logic (riskEngine.js, groqService.js)
│   ├── server.js            # Express entry point
│   └── package.json         
│
└── README.md                # Project documentation
🚀 Live Deployment
The application is fully deployed and accessible over the public internet.

Frontend Application: https://m4c-program-intelligence.vercel.app/

Backend API Base URL: https://m4c-program-intelligence.onrender.com/api

Note: As the backend is hosted on Render's free tier, the initial API request may take 30-50 seconds to wake the server from sleep.

💻 Local Development Setup
To run this project locally, follow these steps:

Prerequisites
Node.js (v18+ recommended)

MongoDB (Local instance or MongoDB Atlas URI)

Groq API Key

1. Clone the repository
Bash
git clone [https://github.com/yourusername/m4c-program-intelligence.git](https://github.com/yourusername/m4c-program-intelligence.git)
cd m4c-program-intelligence
2. Setup the Backend
Bash
cd backend
npm install
Create a .env file in the backend directory:

Code snippet
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
Start the backend server:

Bash
npm run dev
3. Setup the Frontend
Open a new terminal window/tab:

Bash
cd frontend
npm install
Create a .env file in the frontend directory:

Code snippet
VITE_API_URL=http://localhost:5000/api
Start the frontend development server:

Bash
npm run dev
🛡 Assumptions & Limitations
Data Structure: The application assumes incoming data follows a standard schema (e.g., valid District names, numeric attendance values).

Render Cold Starts: The backend utilizes Render's free tier, meaning prolonged periods of inactivity will cause the server to spin down, resulting in a delayed response on the first subsequent load.

AI Rate Limits: Narrative generation relies on Groq's API limits. Excessive simultaneous generations may hit rate limits.

🔮 Future Improvements
Authentication & Authorization: Implement JWT-based login (e.g., Clerk or Auth0) to secure district-specific data.

File Upload Parsing: Add a drag-and-drop CSV uploader on the frontend that sanitizes and batches database inserts directly.

Caching Layer: Implement Redis to cache frequent database aggregations and LLM responses to reduce API costs and load times.