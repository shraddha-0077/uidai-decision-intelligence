<<<<<<< HEAD
# uidai-decision-intelligence
UIDAI Data Hackathon – Decision Intelligence MVP
=======

# UIDAI Decision Intelligence System

## Problem Statement
Traditional analytics dashboards in UIDAI focus on "What happened" (e.g., number of Aadhaar issued). However, policymakers need to know **"What should we do next?"**. High-volume enrolment data often hides critical gaps in child coverage, biometric degradation risks, and localized anomalies that require immediate intervention.

## Our Decision Intelligence Approach
This application moves beyond charts. It uses a **Decision Intelligence Engine** to:
1.  **Ingest** anonymized Level-3 hashed datasets.
2.  **Identify** statistical deviations and coverage gaps.
3.  **Synthesize** actionable intelligence (Why it matters & Recommended Action) using LLM-assisted reasoning (Gemini API).

## Features
-   **Role-Based Access Control**: Secure Admin/Analyst portal with mock OTP auth.
-   **Privacy-First Ingestion**: Enforces UIDAI Anonymization protocols.
-   **Intelligent Signals**: Risk indicators and coverage alerts with automated severity scoring.
-   **Executive PDF Briefing**: One-click generation of policy briefs for senior leadership.
-   **Compliance Center**: Full audit trail and ethical framework documentation.

## Architecture
```
[User Browser] <---> [React SPA (Frontend)]
                        |
                        +---> [FastAPI (Backend)]
                                |
                                +---> [PostgreSQL (Data)]
                                +---> [Gemini API (AI Insights)]
```

## Tech Stack
-   **Frontend**: React 18, Tailwind CSS, Recharts.
-   **Backend**: FastAPI (Python), SQLAlchemy.
-   **AI**: Google Gemini API (Thinking & Summarization).
-   **DevOps**: Docker, Docker Compose.

## How to Run Locally
1.  **Clone the Repository**.
2.  **Environment Setup**:
    -   Create `.env` file with `API_KEY=[Your Gemini Key]`.
3.  **Frontend**:
    -   `npm install`
    -   `npm start`
4.  **Backend** (Requires Python 3.9+):
    -   `pip install -r requirements.txt`
    -   `uvicorn backend.main:app --reload`
5.  **Docker (Production Ready)**:
    -   `docker-compose up --build`

## Compliance Disclaimer
This is an MVP for the UIDAI Data Hackathon.
-   **Aadhaar APIs are mocked** for security.
-   **No real PII is stored**.
-   **Data is anonymized** as per UIDAI standards.
>>>>>>> 3af73c8 (Initial commit: UIDAI Decision Intelligence MVP)
