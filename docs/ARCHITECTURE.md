# Architecture — Bhasha

This document covers the full system architecture for Bhasha across two phases:
- **Phase 1** — Lean MVP: fast to ship, easy to operate, two-person team friendly.
- **Phase 2** — Enterprise Scale: microservices, event-driven pipelines, and full cloud-native orchestration.

The architecture intentionally evolves. Starting lean and documenting the migration is itself a demonstration of engineering maturity.

---

## Phase 1 — Lean MVP Architecture

### Design Philosophy

- Ship fast. Minimize operational overhead.
- Use managed AWS services wherever possible.
- Avoid premature optimization — no Kafka, no k8s, no Cassandra until they are justified by real load.
- Every component choice is swappable; the contracts (APIs, schemas) are what matter.

---

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          CLIENTS                            │
│          Web (Next.js)          Mobile (Expo/RN)            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
          ┌──────────▼──────────┐
          │   AWS CloudFront    │  ← CDN for static assets
          │   + S3 (media)      │    (audio, images, fonts)
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  AWS API Gateway    │  ← Routes to Lambda or ALB
          └────────┬────────────┘
                   │                    │
        ┌──────────▼──────┐    ┌────────▼────────┐
        │   AWS Lambda    │    │   AWS ALB        │
        │  (LLM Eval)     │    │  (Load Balancer) │
        └──────────┬──────┘    └────────┬─────────┘
                   │                    │
          ┌────────▼────────────────────▼────────┐
          │         FastAPI — ECS Fargate         │
          │         (Monolithic at MVP)           │
          └────┬──────────┬──────────────┬────────┘
               │          │              │
    ┌──────────▼──┐  ┌────▼────┐  ┌─────▼──────┐
    │  PostgreSQL │  │  Redis  │  │ AWS Cognito│
    │  (AWS RDS)  │  │ (Cache) │  │   (Auth)   │
    └─────────────┘  └─────────┘  └────────────┘
```

---

### Component Breakdown

#### Frontend

| Component | Technology | Notes |
|---|---|---|
| Web App | Next.js | SSR + SSG, hosted via CloudFront |
| Mobile App | Expo / React Native | Shares TypeScript types with web |
| Shared UI | packages/ui | Component library used by both |

#### Backend

| Component | Technology | Notes |
|---|---|---|
| API Server | FastAPI on ECS Fargate | Async, Dockerized, no k8s overhead |
| Auth | AWS Cognito | JWT tokens, user pools, groups for parental controls |
| LLM Evaluation | AWS Lambda | Triggered via API Gateway, calls OpenAI/Bedrock |

#### Data

| Component | Technology | Stores |
|---|---|---|
| Primary DB | PostgreSQL (RDS) | Users, lessons, progress, forums |
| Cache | Redis (ElastiCache) | Leaderboards, sessions, XP, static payloads |
| Object Storage | S3 | Audio files, images, exported reports |
| CDN | CloudFront | Serves S3 assets globally with low latency |

---

### PostgreSQL Schema (Core Tables)

```sql
-- Users
users (id, cognito_id, username, email, role, created_at)

-- Lessons
lessons (id, title, type, content_json, difficulty, order_index)
lesson_progress (id, user_id, lesson_id, status, completed_at, score)

-- Gamification
user_xp (id, user_id, xp_total, streak_days, last_activity_date)
xp_events (id, user_id, event_type, xp_delta, created_at)
badges (id, name, description, criteria_json)
user_badges (id, user_id, badge_id, earned_at)

-- Community
forum_posts (id, user_id, title, body, created_at)
forum_replies (id, post_id, user_id, body, created_at)
chat_rooms (id, name, type)
chat_messages (id, room_id, user_id, body, created_at)

-- Parental Controls
parental_links (id, parent_user_id, child_user_id)
content_restrictions (id, user_id, restriction_type, value)
```

---

### Caching Strategy (Redis)

| Key Pattern | Data | TTL |
|---|---|---|
| `leaderboard:global:daily` | Sorted set of top XP users | 5 min |
| `session:{cognito_id}` | User session context | 1 hour |
| `lesson:{id}:content` | Lesson JSON payload | 1 hour |
| `alphabet:payload` | Full alphabet dataset | 24 hours |
| `user:{id}:streak` | Current streak count | Until midnight |

---

### CI/CD Pipeline

```
Push to feat/* or fix/*
    → ESLint + Pyflakes
    → Type check (tsc)
    → Unit tests

PR merged to dev
    → Full test suite
    → Docker build
    → Deploy to STAGING (ECS)

PR merged to main
    → Deploy to PRODUCTION
    → CloudFront cache invalidation
    → Notify team (Discord/Slack)
```

---

## Phase 2 — Enterprise Architecture

### Design Philosophy

Phase 2 is triggered by growth, not by ambition. The migrations from Phase 1 to Phase 2 are themselves portfolio artifacts — document every migration decision in `/docs/architecture/decisions/`.

The guiding principles of Phase 2:
- **Event-driven**: Every significant user action is a first-class event.
- **Polyglot persistence**: Use the right database for each data shape.
- **Independent scalability**: Each microservice scales on its own axis.
- **Observable**: Every service emits structured logs, metrics, and traces.

---

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           CLIENTS                               │
│            Web (Next.js)            Mobile (Expo/RN)            │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS
             ┌──────────▼──────────┐
             │    AWS CloudFront   │
             │    + S3 (media)     │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │   AWS API Gateway   │
             └──┬──────────────┬───┘
                │              │
     ┌──────────▼──┐    ┌──────▼──────────┐
     │ AWS Lambda  │    │  AWS ALB / EKS  │
     │ (LLM Eval)  │    │  Ingress        │
     └─────────────┘    └──┬──────────┬───┘
                           │          │
              ┌────────────▼──┐  ┌────▼──────────────┐
              │  User Service │  │  Lesson Service   │
              │  (FastAPI)    │  │  (FastAPI)        │
              └────────┬──────┘  └────────┬──────────┘
                       │                  │
              ┌────────▼──────────────────▼────────┐
              │           Apache Kafka              │
              │  Topics: user_actions, xp_events,  │
              │  lesson_completed, streaks          │
              └────────────────┬───────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Apache Flink      │
                    │  Stream Processing  │
                    │  - Streak calc      │
                    │  - XP aggregation   │
                    │  - Leaderboards     │
                    └──────┬──────┬───────┘
                           │      │
               ┌───────────▼──┐  ┌▼──────────────┐
               │  Cassandra   │  │  PostgreSQL   │
               │ (time-series │  │  (relational) │
               │  progress,   │  │               │
               │  chat logs)  │  │               │
               └──────────────┘  └───────────────┘
                           │
                    ┌──────▼──────┐
                    │    Redis    │
                    │   (Cache)   │
                    └─────────────┘
```

---

### 1. Microservices Split

Instead of one monolithic FastAPI app, split into independently deployable services:

| Service | Responsibility | DB |
|---|---|---|
| **User Service** | Profiles, auth (Cognito), parental controls, friends | PostgreSQL |
| **Lesson Service** | Syllabus, alphabet, vocabulary, phrases, content | PostgreSQL + Redis |
| **Progress Service** | Lesson completion, XP events, streak tracking | Cassandra (writes) + Redis (reads) |
| **Community Service** | Forums, chat rooms, moderation | PostgreSQL + Cassandra (chat history) |
| **Evaluation Service** | Writing assessment, LLM calls, scoring | Lambda (stateless) |
| **Notification Service** | Streak reminders, badges, push notifications | SNS / SES |

Each service:
- Has its own Docker image and Kubernetes Deployment
- Exposes a versioned REST API (`/api/v1/...`)
- Publishes and/or consumes Kafka topics
- Is independently scalable via HPA (Horizontal Pod Autoscaler) in K8s

---

### 2. Event-Driven Pipeline (Kafka + Flink)

**The Problem:** Every user interaction (completing a lesson, answering a flashcard, earning XP) generates data that needs to update multiple systems — the leaderboard, the streak counter, the progress history, potentially a notification. Doing all of this synchronously in the request path creates latency and tight coupling.

**The Solution:** Publish every significant user action as an event to Kafka. Downstream systems consume and react independently.

#### Kafka Topics

| Topic | Published By | Consumed By |
|---|---|---|
| `user.lesson.completed` | Lesson Service | Flink, Progress Service |
| `user.xp.earned` | Progress Service | Flink (leaderboard), Notification Service |
| `user.streak.updated` | Flink output | Notification Service, User Service |
| `user.flashcard.answered` | Lesson Service | Flink (SRS scheduling) |
| `chat.message.sent` | Community Service | Cassandra sink connector |

#### Flink Jobs

| Job | Input Topic | Output |
|---|---|---|
| `StreakCalculator` | `user.lesson.completed` | Updates `user_streaks` in Cassandra + publishes `user.streak.updated` |
| `LeaderboardAggregator` | `user.xp.earned` | Writes sorted scores to Redis sorted set |
| `XPRollup` | `user.xp.earned` | Aggregates hourly/daily XP into Cassandra |
| `SRSScheduler` | `user.flashcard.answered` | Calculates next review date, writes to PostgreSQL |

---

### 3. Polyglot Database Layer

**PostgreSQL (RDS)** — structured, transactional, relational data:
- User profiles, auth links, roles
- Lesson content and curriculum structure
- Forum posts and replies
- Friend/follower relationships
- Parental control rules

**Apache Cassandra** — high-write, time-series, append-heavy data:
- Raw progress event logs (`user_id, event_type, timestamp, metadata`)
- Chat message history (partitioned by `room_id`, clustered by `timestamp`)
- Historical XP gain records
- Granular clickstream data from the Kafka/Flink pipeline

Example Cassandra table design:
```cql
CREATE TABLE progress_events (
    user_id UUID,
    event_date DATE,
    event_time TIMESTAMP,
    event_type TEXT,
    metadata MAP<TEXT, TEXT>,
    PRIMARY KEY ((user_id, event_date), event_time)
) WITH CLUSTERING ORDER BY (event_time DESC);

CREATE TABLE chat_messages (
    room_id UUID,
    sent_at TIMESTAMP,
    user_id UUID,
    body TEXT,
    PRIMARY KEY (room_id, sent_at)
) WITH CLUSTERING ORDER BY (sent_at DESC);
```

**Redis (ElastiCache)** — cache layer in front of PostgreSQL, and primary store for real-time derived data:
- Global and friend leaderboards (sorted sets, written by Flink)
- User session tokens
- Lesson content cache
- Rate limiting counters

---

### 4. Infrastructure & Orchestration (AWS EKS + K8s)

**AWS EKS** hosts all containerized services. Key K8s concepts used:

| K8s Resource | Used For |
|---|---|
| `Deployment` | Each microservice |
| `HorizontalPodAutoscaler` | Scale services under load |
| `ConfigMap` | Environment-specific config |
| `Secret` | DB credentials, API keys (via AWS Secrets Manager) |
| `Ingress` | Route external traffic to services |
| `CronJob` | Scheduled tasks (daily streak resets, SRS batch) |

**AWS Services Used in Phase 2:**

| Service | Role |
|---|---|
| EKS | Kubernetes cluster host |
| ECS Fargate | Retired (migrated to EKS) |
| MSK (Managed Kafka) | Hosted Kafka cluster |
| ElastiCache | Redis |
| RDS | PostgreSQL |
| S3 + CloudFront | Static assets, audio files |
| Lambda | LLM evaluation (still stateless, stays Lambda) |
| API Gateway | External entry point |
| Cognito | Auth (unchanged) |
| SNS | Push notifications |
| SES | Email notifications |
| CloudWatch | Logs, metrics, alarms |
| AWS Secrets Manager | Credentials for all services |
| Terraform | All infra provisioned as code |

---

### 5. Migration Path from Phase 1 → Phase 2

Each migration should be documented as an Architecture Decision Record (ADR) in `/docs/architecture/decisions/`.

| Migration | Trigger | What Changes |
|---|---|---|
| ECS → EKS | Need independent service scaling | Redeploy all services as K8s Deployments |
| Redis Pub/Sub → Kafka (MSK) | Chat rooms growing, need durability | Add Kafka, update Community Service to produce/consume |
| Monolith → Microservices | Services need independent deploy cadence | Split FastAPI app, add service discovery |
| PostgreSQL (progress) → Cassandra | Progress write volume spikes | Add Cassandra cluster, migrate progress_events table |
| Manual gamification → Flink | Streak/leaderboard logic becomes complex | Write Flink jobs, connect to Kafka |
| Single region → Multi-region | User base expands geographically | EKS multi-region, RDS read replicas, CloudFront origins |

---

### Architecture Decision Records (ADRs)

Store in `/docs/architecture/decisions/`. Template:

```markdown
# ADR-001: Use Redis Pub/Sub for Chat in Phase 1

## Status
Accepted

## Context
We need real-time chat for MVP. Full Kafka setup is 3-5 days of ops work for a 2-person team.

## Decision
Use Redis Pub/Sub for MVP chat. Plan to migrate to Kafka when concurrent users exceed ~500.

## Consequences
- Fast to implement (1 day)
- Not durable (messages not persisted if subscriber is down)
- Migration path to Kafka is well-documented (same producer/consumer interface abstraction)
```

---

## Summary

| Dimension | Phase 1 | Phase 2 |
|---|---|---|
| Backend | Monolithic FastAPI | Microservices (User, Lesson, Progress, etc.) |
| Containers | ECS Fargate | Kubernetes (EKS) |
| Events | Synchronous | Kafka + Flink |
| Chat | Redis Pub/Sub | Kafka → Cassandra |
| Progress storage | PostgreSQL | Cassandra (time-series) |
| Leaderboards | Redis (manual update) | Flink → Redis (stream-computed) |
| Infra provisioning | Terraform (basic) | Terraform (full EKS, MSK, Cassandra) |
