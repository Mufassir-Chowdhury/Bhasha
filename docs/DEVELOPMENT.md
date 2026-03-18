# Development Guide — Bhasha

This document is the single source of truth for how the Bhasha team works. It covers team structure, repository conventions, branching strategy, task management, CI/CD, communication rhythms, and day-to-day engineering practices.

> **Related:** See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full system architecture across Phase 1 (lean MVP) and Phase 2 (enterprise scale). It covers the component breakdown, database schemas, Kafka/Flink pipeline design, Kubernetes setup, and the planned migration path from lean to enterprise.

---

## Architecture at a Glance

The architecture lives in `ARCHITECTURE.md`. Here's the one-paragraph summary:

**Phase 1** uses a monolithic FastAPI backend on ECS Fargate, PostgreSQL as the primary database, Redis for caching and leaderboards, AWS Cognito for auth, S3 + CloudFront for media, and Lambda + API Gateway for LLM-based writing evaluation. **Phase 2** evolves this into a microservices architecture on Kubernetes (EKS), with Apache Kafka for event streaming, Apache Flink for real-time stream processing (streaks, gamification, leaderboards), and Apache Cassandra for high-write time-series data (progress events, chat history). Every migration is documented as an Architecture Decision Record (ADR).

---

## Team Structure & Ownership

Even as a 2-person team, divide ownership clearly. Ownership means one person is *accountable* for that area — not that the other can't contribute.

| Area | Owner | Notes |
|---|---|---|
| Backend (FastAPI, DB, Auth) | Unspecified | API design, schema, business logic |
| LLM Integration (Lambda, Eval) | Unspecified | Rubric design, Bedrock/OpenAI calls |
| Frontend Web (Next.js) | Unspecified | Pages, routing, state management |
| Frontend Mobile (Expo) | Unspecified | Shared components with web where possible |
| DevOps / AWS Infra | Unspecified | Terraform, ECS, CI/CD setup |
| Design / UX | Unspecified | Agree on Figma designs before implementing |

---

## Repository Structure

This is a **monorepo** managed with **Turborepo**.

```
/bhasha
├── apps/
│   ├── web/                  → Next.js web application
│   ├── mobile/               → Expo / React Native
│   └── api/                  → FastAPI backend
├── packages/
│   ├── shared-types/         → TypeScript interfaces shared by web + mobile
│   └── ui/                   → Shared React component library (optional)
├── infra/
│   ├── terraform/            → All AWS infrastructure as code
│   └── docker/               → Dockerfiles per app
├── .github/
│   └── workflows/            → GitHub Actions CI/CD pipelines
└── docs/
    ├── README.md             → Project overview (this repo's root README)
    ├── ARCHITECTURE.md       → Full architecture (Phase 1 + Phase 2)
    ├── DEVELOPMENT.md        → This file
    └── architecture/
        └── decisions/        → Architecture Decision Records (ADRs)
            └── ADR-001-redis-pubsub-for-chat.md
```

### Why a monorepo?

- Web, mobile, and API share TypeScript types — no duplication, no drift.
- A single CI pipeline sees the full picture — it can test across boundaries.
- Simpler for a 2-person team: one `git clone`, one PR review context.

---

## Branching Strategy

We use **GitHub Flow**, adapted slightly for a two-person team.

### Branch Hierarchy

```
main      →  Always deployable. Protected. Only merged to via PR from dev.
  └── dev →  Integration branch. All features merge here first.
        ├── feat/alphabet-module
        ├── feat/auth-cognito
        ├── feat/gamification-xp
        ├── feat/llm-evaluation
        └── fix/lesson-loading-bug
```

### Rules

- **Never push directly to `main` or `dev`.** Always work in a feature branch.
- Cut all branches from `dev`, not from `main`.
- Use the naming convention: `feat/<short-description>` or `fix/<short-description>`.
- Open a PR to `dev` when your feature is ready. The other person reviews before merging.
- `dev` → `main` is a deliberate release decision, not a routine merge.
- Use **squash merges** when merging feature branches to keep the git history clean.

### Branch Lifecycle Example

```bash
# Start a new feature
git checkout dev
git pull origin dev
git checkout -b feat/gamification-xp

# Work, commit, push
git add .
git commit -m "feat: add XP event model and endpoint"
git push origin feat/gamification-xp

# Open PR on GitHub: feat/gamification-xp → dev
# Other person reviews → approves → squash merge
# Delete branch after merge
```

---

## Commit Message Convention

Use **Conventional Commits**. This makes the git log readable and enables automated changelog generation later.

```
<type>: <short description>

Types:
  feat      → New feature
  fix       → Bug fix
  infra     → Infrastructure / DevOps change
  refactor  → Code change that is neither a feature nor a fix
  test      → Adding or updating tests
  docs      → Documentation only
  chore     → Dependency updates, config changes
```

**Examples:**
```
feat: add lesson completion endpoint with XP award
fix: resolve Redis TTL not resetting on streak update
infra: add ECS task definition for FastAPI service
docs: update ARCHITECTURE.md with Cassandra schema
```

---

## Pull Request Process

PRs at this stage don't need to be exhaustive formal reviews. The goal is to keep both people aware of what's changing and to catch obvious mistakes.

**PR Checklist:**
- [ ] Branch is cut from `dev` (not `main`)
- [ ] Code runs locally without errors
- [ ] Relevant tests pass
- [ ] No secrets or credentials in the diff
- [ ] PR description explains *what* changed and *why* (one paragraph is enough)
- [ ] Tagged with a label: `feat`, `fix`, `infra`, `docs`

**Review Turnaround:** Aim to review open PRs within 24 hours. Don't let them sit.

---

## Task Management

Use **Linear** (free tier, used by real startups) or GitHub Projects if you prefer to stay in one place.

### Work in Cycles (Sprints)

- **Cycle length: 1 week**, given the 2-4 week MVP target.
- Each cycle has a single stated goal. Example: *"By end of Week 2, a user can register, complete an alphabet lesson, and earn XP."*
- Keep a **backlog** for everything else. Do not let backlog items creep into the current cycle without a deliberate decision.

### Issue Labels

| Label | Meaning |
|---|---|
| `feat` | New feature |
| `bug` | Something is broken |
| `infra` | DevOps, cloud, CI/CD |
| `research` | Needs investigation before implementation |
| `debt` | Technical debt to address later |
| `blocked` | Cannot proceed, needs input |

### Issue Format

```
Title: [feat] Alphabet module — letter card component

Description:
  What: Build the interactive letter card for the alphabet learning screen.
  Why: Core MVP feature, needed before lesson flow can be tested.
  Acceptance criteria:
    - Letter card shows Bengali script + transliteration
    - Plays audio on tap
    - Marked complete when user swipes/taps
```

---

## Communication & Sync Rhythm

You're a mix of sync and async. Here's a lightweight structure that keeps momentum without draining time.

### Daily Async Standup

Every day, post a short update in your shared WhatsApp/Discord channel:

```
📅 [Date]
✅ Done: Added XP endpoint, wired to lesson completion
🔨 Doing: Writing Redis leaderboard logic
🚫 Blocked: Nothing
```

Takes 2 minutes. Prevents silent drift. If someone is blocked, the other can unblock async.

### Weekly Sync Call

At the start of each cycle:
- 30–45 minutes
- Review what shipped last week
- Set the cycle goal for this week
- Assign issues
- Raise any architectural concerns before they become code

### Document Decisions

When you make any meaningful decision (tech choice, schema design, tradeoff), write a one-paragraph ADR in `/docs/architecture/decisions/`. Examples of things worth documenting:
- Why Next.js over SvelteKit
- Why Redis Pub/Sub for chat in Phase 1 instead of Kafka
- Why Cognito instead of rolling custom auth

Future-you and future-interviewers will thank present-you.

---

## Development Workflow (Week by Week)

### Week 1 — Foundation

**Goal:** A user can register, log in, and land on a functioning app shell.

- [ ] Monorepo setup with Turborepo
- [ ] GitHub repo + branch protection rules
- [ ] CI/CD skeleton in GitHub Actions (lint + test on PR)
- [ ] AWS account setup, IAM roles, Terraform init
- [ ] AWS Cognito user pool + groups (learner, parent, admin)
- [ ] FastAPI app scaffold with Cognito JWT validation
- [ ] PostgreSQL schema (users, lessons, progress, gamification)
- [ ] S3 bucket + CloudFront distribution for media
- [ ] Next.js app shell with auth flow (register, login, protected routes)
- [ ] ECS Fargate task definition for FastAPI

### Week 2 — Core Learning

**Goal:** A user can complete a lesson and earn XP.

- [ ] Alphabet module — data model + API + UI
- [ ] Vocabulary module — word forms, examples
- [ ] Phrases module with transliteration toggle
- [ ] Lesson flow: start → complete → mark progress in DB
- [ ] XP system: award XP on lesson complete, store in Redis + DB
- [ ] Daily streak logic (reset at midnight, bonus XP)
- [ ] Basic leaderboard (top 10 by XP, Redis sorted set)
- [ ] Mobile app scaffold (Expo), auth flow mirrored from web

### Week 3 — Advanced Features

**Goal:** Community, evaluation, and parental controls working end-to-end.

- [ ] LLM writing evaluation: Lambda function + API Gateway route + rubric schema
- [ ] IELTS/TOEFL-style scoring endpoint
- [ ] Parental controls: link parent to child via Cognito groups + DB
- [ ] Community forums: CRUD for posts + replies
- [ ] Chat rooms: Redis Pub/Sub (Phase 1 implementation)
- [ ] Admin dashboard: lesson management, user moderation, content upload

### Week 4 — Polish & Deploy

**Goal:** Deployed to production, demo-ready.

- [ ] End-to-end testing (Playwright for web, Detox for mobile)
- [ ] Bug fixing sprint
- [ ] Load balancer (ALB) configuration
- [ ] Production ECS deployment
- [ ] CloudFront cache invalidation in CI/CD
- [ ] Environment variables audit (no secrets in code)
- [ ] Architecture diagram finalized in `ARCHITECTURE.md`
- [ ] Demo video recorded
- [ ] README polished

---

## CI/CD Pipeline

Managed via **GitHub Actions** in `.github/workflows/`.

### On Push to Any Feature Branch

```yaml
- Lint (ESLint for Next.js/Expo, Ruff/Pyflakes for FastAPI)
- Type check (tsc --noEmit)
- Unit tests
```

### On PR to `dev`

```yaml
- Full test suite (unit + integration)
- Docker build (verify image builds cleanly)
- Deploy to STAGING environment (ECS staging task)
```

### On Merge to `main`

```yaml
- Deploy to PRODUCTION (ECS production task)
- CloudFront cache invalidation
- Team notification (Discord webhook or Slack)
```

**Rule:** Do not spend more than one day on CI/CD setup in Week 1. Get it working, then improve it iteratively.

---

## Secrets & Environment Management

- **Never commit secrets to git.** Use `.env.local` (gitignored) locally.
- In CI/CD, use **GitHub Actions Secrets** for staging and production credentials.
- In production, use **AWS Secrets Manager** — all services pull secrets at runtime.
- Rotate credentials immediately if accidentally exposed.

### Environment File Structure

```bash
apps/api/.env.local         # FastAPI local dev
apps/web/.env.local         # Next.js local dev
apps/mobile/.env.local      # Expo local dev
infra/terraform/.env        # Terraform vars (gitignored)
```

---

## Testing Strategy

| Type | Tool | Coverage Target |
|---|---|---|
| Unit (backend) | Pytest | Core business logic (XP, streaks, auth) |
| Unit (frontend) | Vitest + React Testing Library | Component behaviour |
| Integration | Pytest + TestClient | API endpoint contracts |
| E2E (web) | Playwright | Critical user flows (register → lesson → XP) |
| E2E (mobile) | Detox | Core mobile flows |

At MVP stage: prioritize integration tests for the API and E2E for the critical user path. Don't over-invest in unit test coverage this early.

---

## Code Conventions

### Python (FastAPI)

- Formatter: **Black**
- Linter: **Ruff**
- Type hints: required on all function signatures
- Use **Pydantic v2** for request/response models
- Organize routes by domain: `routers/lessons.py`, `routers/users.py`, etc.

### TypeScript (Next.js / Expo)

- Formatter: **Prettier**
- Linter: **ESLint** (with `@typescript-eslint`)
- Strict mode: `"strict": true` in tsconfig
- No `any` types — use proper interfaces from `packages/shared-types`

### General

- No commented-out code in PRs
- Every new API endpoint needs a docstring and Pydantic schema
- Every DB schema change needs a migration file (use **Alembic** for FastAPI)

---

## Monitoring & Observability (Phase 1)

- **Logs:** All FastAPI logs go to AWS CloudWatch via the ECS log driver
- **Errors:** Use **Sentry** (free tier) for both backend and frontend error tracking
- **Uptime:** Set up a CloudWatch alarm on 5XX error rate > 1%
- **Metrics:** Track lesson completion rate, DAU, and XP events from day one — even just in PostgreSQL

---

## Portfolio Notes

This project is intentionally built to demonstrate architectural thinking across phases. Here's how to present it:

1. **Tell the growth story.** "We started with a monolith and Redis Pub/Sub. As load grew, we migrated chat to Kafka and progress storage to Cassandra. Here's the ADR documenting why." This is more impressive than just listing Kafka in a tech stack.

2. **The ADRs are portfolio artifacts.** Each decision document in `/docs/architecture/decisions/` shows you reason about tradeoffs, not just tools.

3. **The migration itself is the demo.** Showing ECS → EKS, or Redis Pub/Sub → Kafka, with working code and a documented rationale, demonstrates seniority that most junior portfolios don't have.

4. **Keep a changelog.** After each weekly cycle, write two sentences in a `CHANGELOG.md` about what shipped. It becomes a narrative of progress.

---

## Quick References

| Resource | Link |
|---|---|
| Architecture | [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) |
| ADRs | [`docs/architecture/decisions/`](./architecture/decisions/) |
| Linear Board | [add link] |
| Staging URL | [add link] |
| Production URL | [add link] |
| AWS Console | [add link] |
| Figma Designs | [add link] |
