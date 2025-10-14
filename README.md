# Code Clasher

> **AWS-based programming puzzles platform with LLM-enhanced test suite generation system, Next.js + Vercel frontend, and a secure & scalable pipeline for execution of arbitrary user code.**

![Code Clasher Demo](https://img.shields.io/badge/Status-Archived-red) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazon-aws&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)

**Demo (Archived):** [https://sse-team-project.vercel.app](https://sse-team-project.vercel.app)  
**GitHub Repository:** [https://github.com/AndyXIP/sse-team-project](https://github.com/AndyXIP/sse-team-project)

---

## Overview

Code Clasher is a competitive programming platform where developers solve daily coding challenges, compete on global leaderboards, and sharpen their algorithmic skills. Built as a **Software Systems Engineering group project at Imperial College London**, this platform showcases modern cloud architecture, real-time features, and secure code execution.

### Key Features

- **Daily Challenges**: Fresh easy/hard coding problems with LLM-generated test cases
- **Global Leaderboard**: Real-time rankings and progress tracking
- **In-Browser Code Editor**: Syntax highlighting, multiple language support
- **Real-Time Execution**: Secure sandboxed code evaluation with instant feedback
- **Progress Analytics**: Personal stats, streaks, and performance insights
- **Modern UI**: Dark/light mode, responsive design, seamless UX

---

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI        │    │   AWS Lambda    │
│   Frontend      │◄──►│   Main API       │◄──►│   Microservices │
│   (Vercel)      │    │   (Elastic       │    │   (Code Eval,   │
└─────────────────┘    │   Beanstalk)     │    │   Leaderboard)  │
                       └──────────────────┘    └─────────────────┘
                                │                       │
                       ┌────────▼──────────┐    ┌──────▼──────────┐
                       │   Valkey Redis    │    │   Supabase      │
                       │   (Caching)       │    │   (PostgreSQL)  │
                       └───────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- **Next.js 14** with App Router
- **TypeScript** & **Tailwind CSS**
- **React** with modern hooks
- **Vercel** deployment

**Backend Services:**
- **FastAPI** (Main API server)
- **AWS Lambda** (Serverless microservices)
- **Python 3.9+** with async/await
- **AWS SQS** (Message queuing)
- **AWS Elastic Beanstalk** (Container deployment)

**Data & Caching:**
- **Supabase** (PostgreSQL database)
- **Valkey Glide** (Redis-compatible caching)
- **HuggingFace Datasets** (Problem source)

**Infrastructure:**
- **Docker** containerization
- **AWS** cloud services
- **GitHub Actions** (CI/CD ready)

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker (optional)
- AWS CLI (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndyXIP/sse-team-project.git
   cd code-clasher
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd main-api
   pip install -r requirements.txt
   uvicorn app:app --reload
   ```

4. **Environment Variables**
   ```bash
   # Create .env files in respective directories
   cp .env.example .env
   # Configure AWS credentials, database URLs, etc.
   ```

---

## Project Structure

```
code-clasher/
├── frontend/                 # Next.js frontend application
├── main-api/                 # FastAPI central API server
├── lambda-code-evaluator-v2/ # Serverless code execution engine
├── leaderboard/              # Leaderboard processing service
├── questions/                # Question fetching & caching
├── leaderboard-updater/      # Real-time leaderboard updates
├── test-case-generation/     # LLM-powered test case creation
└── README.md                 # This file
```

Each service includes its own comprehensive README with detailed setup instructions.

---

## How It Works

1. **Daily Questions**: LLM generates test cases for coding problems from HuggingFace dataset
2. **Code Submission**: Users write solutions in the browser-based editor
3. **Secure Execution**: Code runs in isolated AWS Lambda containers
4. **Real-Time Results**: WebSocket updates provide instant feedback
5. **Leaderboard Updates**: Successful submissions update global rankings
6. **Progress Tracking**: User stats and streaks are maintained across sessions

---

## Testing & Quality

- **Unit Tests**: Comprehensive test suites for all services
- **Integration Tests**: End-to-end API testing with mocked AWS services
- **Security**: Input validation, sandboxed execution, rate limiting
- **Performance**: Caching strategies, async processing, optimized queries

---

## Deployment

**Production URLs (Archived):**
- Frontend: [https://sse-team-project.vercel.app](https://sse-team-project.vercel.app) *(No longer active)*
- Main API: [https://main-api.click](https://main-api.click) *(No longer active)*

**Infrastructure:**
- **Vercel** (Frontend hosting)
- **AWS Elastic Beanstalk** (API server)
- **AWS Lambda** (Microservices)
- **Supabase** (Managed PostgreSQL)

---

## Team

Developed as a **Software Systems Engineering group project** at **Imperial College London** by:

- **Andy**
- **Lucas**
- **Will**
- **Yile**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Application (Archived)**: [https://sse-team-project.vercel.app](https://sse-team-project.vercel.app)
- **GitHub Repository**: [https://github.com/AndyXIP/sse-team-project](https://github.com/AndyXIP/sse-team-project)
- **Problem Dataset**: [HuggingFace APPS Dataset](https://huggingface.co/datasets/codeparrot/apps)

---

*Built at Imperial College London*
