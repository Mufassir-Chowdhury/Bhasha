# 🇧🇩 Bhasha — Bangla Language Learning App

> A full-stack, production-grade Bangla language learning platform built with a modern, scalable architecture. Designed for learners of all levels, with gamification, community features, and AI-powered writing evaluation.

---

## Project Description

**Bhasha** (ভাষা — meaning "language") is a comprehensive Bangla language learning application targeting both native speakers looking to improve literacy and foreign learners approaching Bangla for the first time. It combines structured lesson content, spaced repetition, gamification, and LLM-powered evaluation into a single cohesive platform available on both web and mobile.

This project is intentionally architected to reflect real-world, production-grade engineering decisions — starting lean for the MVP and scaling toward a full enterprise architecture in Phase 2. It serves as a portfolio project demonstrating expertise in modern backend engineering, cloud infrastructure, real-time data pipelines, and AI integration.

---

## Team

| Name | Role |
|---|---|
| Mufassir Ahmad Chowdhury | Unspecified |
| Sajid Zakaria | Unspecified |

---

## Features

### Phase 1 — MVP

| Feature | Description |
|---|---|
| Alphabet Learning | Interactive Bangla alphabet (স্বরবর্ণ & ব্যঞ্জনবর্ণ) with stroke order and audio |
| Joint Words (যুক্তবর্ণ) | Compound consonant learning with visual decomposition |
| Vocabulary | Word forms, synonyms, antonyms with contextual examples |
| Phrases | Common everyday phrases with transliteration toggle (Bengali ↔ Roman) |
| Lesson Modules | Structured lessons with start → complete → review flow |
| Gamification | XP system, daily streaks, badges, and a global leaderboard |
| Progress Tracking | Per-user lesson completion, XP history, and skill graphs |
| Parental Controls | Role-based content restrictions via Cognito groups |
| Authentication | Secure registration, login, and session management via AWS Cognito |
| Writing Evaluation | LLM-powered writing assessment using custom rubrics |
| IELTS/TOEFL-style Scoring | Standardized language proficiency scoring |
| Community Forums | Discussion boards for learners |
| Chat Rooms | Real-time topic-based chat |
| Transliteration Toggle | Switch between Bengali script and Roman transliteration at any time |
| Admin Dashboard | Content management for lessons, rubrics, and user moderation |

### Phase 2 — Scale

| Feature | Description |
|---|---|
| Spaced Repetition (SRS) | Anki-style flashcard review scheduling for vocabulary retention |
| Reading Comprehension | Graded passages with comprehension questions |
| Offline Mode | PWA/React Native caching for low-connectivity environments |
| Voice Features | Pronunciation recording, playback, and AI evaluation |
| Advanced Analytics | Cohort analysis, retention metrics, admin reporting dashboard |

---

## Feature Roadmap

```
Week 1  ── Foundation & Auth
Week 2  ── Core Learning (Alphabet, Vocabulary, Lessons, Gamification)
Week 3  ── Advanced Features (LLM Eval, Forums, Chat, Parental Controls)
Week 4  ── Polish, Admin Dashboard & Production Deployment
  │
  └──▶ Phase 2: Microservices, Kafka, Flink, Cassandra, K8s
```

---

## Technology Stack

### Phase 1 — Lean MVP

| Layer | Technology | Reason |
|---|---|---|
| Frontend (Web) | SvelteKit | SSR, SEO, broad ecosystem |
| Frontend (Mobile) | Expo / React Native | Shared logic with web |
| Backend | FastAPI (Python) | Async performance, great DX |
| Auth | AWS Cognito | Managed, role-based, JWT |
| Primary DB | PostgreSQL (AWS RDS) | Relational, transactional data |
| Cache | Redis (ElastiCache) | Leaderboards, sessions, XP |
| Object Storage | AWS S3 | Audio, images, static assets |
| CDN | AWS CloudFront | Fast global media delivery |
| Serverless | AWS Lambda | LLM evaluation calls |
| API Management | AWS API Gateway | Routes to Lambda + FastAPI |
| Load Balancing | AWS ALB | Traffic distribution |
| Containers | Docker + AWS ECS Fargate | No k8s ops overhead at MVP |
| CI/CD | GitHub Actions | Automated test + deploy |
| Monorepo | Turborepo | Web + mobile + API in one repo |

### Phase 2 — Enterprise Scale

| Layer | Technology | Reason |
|---|---|---|
| Event Streaming | Apache Kafka | High-volume user action events |
| Stream Processing | Apache Flink | Real-time gamification, leaderboards |
| Time-series / Chat DB | Apache Cassandra | High-write, wide-column storage |
| Orchestration | Kubernetes (AWS EKS) | Container lifecycle, auto-scaling |
| Event Bus | AWS EventBridge / SNS | Cross-service async messaging |
| Microservices | FastAPI split services | User Service, Lesson Service, etc. |

---

## Repository Structure

```
/basha
├── apps/
│   ├── web/              → SvelteKit web application
│   ├── mobile/           → Expo / React Native
│   └── api/              → FastAPI backend
├── packages/
│   ├── shared-types/     → TypeScript types (web + mobile)
│   └── ui/               → Shared component library
├── infra/
│   ├── terraform/        → AWS infrastructure as code
│   └── docker/           → Dockerfiles per service
├── .github/
│   └── workflows/        → GitHub Actions CI/CD
└── docs/
    ├── ARCHITECTURE.md   → Full architecture documentation (Phase 1 & 2)
    └── DEVELOPMENT.md    → Developer workflow, conventions, and practices
```

---

## Getting Started

> Setup instructions will be added as the project scaffolding is completed.

```bash
# Clone the repo
git clone https://github.com/Mufassir-Chowdhury/bhasha.git
cd basha

# Install dependencies (Turborepo)
bun install

# Start all services locally
bun run dev
```

---

## Documentation

| Document | Description |
|---|---|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Full system architecture for Phase 1 (lean) and Phase 2 (enterprise) |
| [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) | Branching strategy, workflow, conventions, and team practices |

---

## License

MIT
