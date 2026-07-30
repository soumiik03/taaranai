# Taaran AI

**From feature request to reviewed, shipped code — automatically.**

Taaran is an AI-native software delivery platform that transforms a raw feature request into production-ready, reviewed code. It guides teams through AI-powered clarification, structured PRD generation, automatic engineering task creation, and task-grounded pull request reviews—all while keeping humans in control of the final approval.

Unlike generic AI code reviewers, Taaran reviews pull requests against the approved product requirements and Kanban tasks, ensuring feedback stays relevant to the feature being built instead of offering generic code style suggestions.

**Live Demo:** https://taaranai.vercel.app

---

# Features

* 🤖 AI-powered feature clarification
* 📝 Automatic PRD generation
* 📋 AI-generated Kanban engineering tasks
* 🔗 GitHub App integration with webhook automation
* 🔍 Task-grounded AI pull request reviews
* 🧠 Memory-aware re-reviews (resolved issues stay resolved)
* 🛑 Bounded review loops to prevent infinite AI cycles
* 🏢 Multi-tenant architecture
* 📜 Complete audit trail from request to release
* ✅ Human approval before shipping

---

# Workflow

```text
Feature Request
      ↓
AI Clarification
      ↓
PRD Generation
      ↓
Kanban Task Generation
      ↓
Developer Opens Pull Request
      ↓
GitHub Webhook
      ↓
AI Task-Grounded Review
      ↓
Developer Fixes Issues
      ↓
Re-Review (until max review limit)
      ↓
Human Approval
      ↓
Ship
```
---
# Screenshots
<img width="1885" height="867" alt="image" src="https://github.com/user-attachments/assets/fce0cfbc-907d-4bd9-8542-ffec0e58190f" />
<img width="1885" height="888" alt="image" src="https://github.com/user-attachments/assets/0cc2da24-c6bf-402f-aa53-8f08aa8d8970" />
<img width="1883" height="853" alt="image" src="https://github.com/user-attachments/assets/f3589423-8fb7-40e6-8836-7b1b08125ebf" />

---

# How It Works

### 1. Submit a Feature Request

Create a feature request with a title, description, and optional source (email, ticket, meeting notes, etc.).

### 2. AI Clarification

If the request is ambiguous, Taaran asks focused follow-up questions to gather only the information required. Clarification is capped to avoid endless conversations.

### 3. PRD Generation

Once enough context exists, Taaran generates a structured Product Requirements Document containing:

* Problem Statement
* Goals
* Non-Goals
* User Stories
* Acceptance Criteria
* Edge Cases
* Success Metrics

### 4. Task Generation

After PRD approval, AI converts the requirements into an ordered Kanban board of engineering tasks, typically following:

```
Database
    ↓
Backend/API
    ↓
Frontend/UI
```

Task generation is capped to keep work manageable.

### 5. AI Pull Request Review

When a linked GitHub Pull Request is opened, GitHub webhooks trigger an AI review.

The review is grounded only in:

* The approved PRD
* Generated engineering tasks
* Changed lines inside the pull request

No unrelated suggestions or hallucinated issues are reported.

### 6. Fix Loop

Developers push fixes.

Each new commit triggers another review.

Taaran remembers previously resolved issues and reviews only what has changed. The review cycle automatically stops after a fixed number of review passes.

### 7. Human Approval

The reviewer sees:

* Feature Request
* PRD
* Kanban Tasks
* Pull Request
* AI Review History

A human always gives the final approval before the feature is shipped.

---

# Why Taaran?

Most AI code reviewers inspect code in isolation.

Taaran reviews code in the context of **what the feature was actually supposed to do**.

Instead of asking:

> "Is this code good?"

Taaran asks:

> "Does this implementation satisfy the approved product requirements and engineering tasks?"

That keeps reviews focused, actionable, and aligned with the intended outcome.

---

# Tech Stack

| Layer              | Technology                 |
| ------------------ | -------------------------- |
| Framework          | Next.js (App Router)       |
| Language           | TypeScript                 |
| Database           | PostgreSQL (Neon)          |
| ORM                | Prisma                     |
| Authentication     | Better Auth (GitHub OAuth) |
| AI                 | Vercel AI SDK + OpenRouter |
| Background Jobs    | Inngest                    |
| GitHub Integration | GitHub App + Octokit       |
| UI                 | Tailwind CSS + shadcn/ui   |
| Validation         | React Hook Form + Zod      |
| Deployment         | Vercel                     |

---

# Getting Started

## Prerequisites

* Node.js 18+
* Neon PostgreSQL database
* OpenRouter API Key
* GitHub App
* Inngest account

---

## Installation

```bash
git clone https://github.com/soumiik03/taaranai.git

cd taaranai

npm install

cp .env.example .env

npx prisma migrate dev

npm run dev
```

Start the local Inngest development server in another terminal:

```bash
npx inngest-cli dev
```

The application runs at:

```
http://localhost:3000
```

Local Inngest Dashboard:

```
http://localhost:8288
```

For local GitHub webhook testing, expose your application using a tunnel such as ngrok or Cloudflare Tunnel and configure the GitHub App webhook URL accordingly.

---

# Environment Variables

See `.env.example` for all required variables, including:

* Database
* Better Auth
* OpenRouter
* GitHub App
* Inngest

Every required variable is validated during startup so configuration issues fail fast.

---

# Project Structure

```text
app/
├── (auth)
├── (onboarding)
├── (protected)
└── api/

features/
├── workspace/
├── requests/
├── prd/
├── tasks/
├── github/
├── reviews/
└── approval/

lib/
├── auth.ts
├── prisma.ts
├── github/
├── inngest/
└── prompts/

prisma/
└── schema.prisma
```

---

# Deployment

Taaran is deployed on:

* **Frontend:** Vercel
* **Database:** Neon PostgreSQL
* **Background Jobs:** Inngest Cloud

Development follows a simple workflow:

```
Build
   ↓
Test Locally
   ↓
Deploy
   ↓
Verify in Production
```

---

# Roadmap

* [ ] Slack integration
* [ ] Jira integration
* [ ] Linear integration
* [ ] Release Notes generation
* [ ] Multiple AI model support
* [ ] Team analytics dashboard
* [ ] Self-hosted deployment

---

# Contributing

Contributions are welcome.

If you're planning a significant change, please open an issue first to discuss the proposed approach before submitting a pull request.

---

# License

MIT

---

## Author

Built with ❤️ by **Soumik Talukder**

GitHub: https://github.com/soumiik03
