# Oliver Wang — Interactive Resume Web App

An interactive, LGT-themed resume web app for **Oliver Wang**, built with **Next.js + React**, a **REST API**, and a **Java (Spring Boot)** JD-match microservice, deployed to **AWS S3**.

🔗 **Live:** http://oliver-wang-resume-f9b9ac.s3-website-ap-southeast-2.amazonaws.com/

---

## Features

- **LGT-themed design** — navy `#283C83` / gold `#FFC800`, the official LGT emblem, private-bank serif type, light/dark mode.
- **Interactive**
  - Sticky section navigation with scroll-spy active highlighting
  - Expand/collapse each role and its sample projects
  - Clickable skill-category filter
  - Light/dark theme toggle (persisted)
  - One-click print / save-to-PDF
  - **JD Match tool** — paste a job description and score how well the resume's skills cover it
- **REST API**
  - `GET /api/resume` — static JSON resource served from S3 (Next.js static route handler)
  - `POST /api/match` — served by the Java or Node backend
- **Java feature** — a Spring Boot microservice (`java-match-service`) implementing the JD-match scorer as a REST API.

## Architecture

```
                    ┌─────────────────────────────┐
  Browser  ───────► │  Next.js static site (S3)    │   React UI + LGT theme
                    │  GET /api/resume  (static)   │   interactive, client-side
                    └──────────────┬──────────────┘
                                   │ POST /api/match (optional, if NEXT_PUBLIC_API_URL set)
                                   ▼
              ┌────────────────────────────────────────┐
              │  JD-Match REST backend (choose one):    │
              │   • Java Spring Boot  (java-match-service)│
              │   • Node/Express      (api-server)       │
              └────────────────────────────────────────┘
```

The front end works fully standalone (scores in-browser). Point `NEXT_PUBLIC_API_URL`
at a deployed backend to route scoring through the REST API instead.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router, static export), React 18, TypeScript, Tailwind CSS |
| REST API | Next.js static route handler (`/api/resume`), Node/Express, Java Spring Boot |
| Java service | Spring Boot 3, Java 17 (`POST /api/match`) |
| Hosting | AWS S3 static website |
| CI | GitHub Actions (build check) |

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000

# Optional REST backend (either one):
cd api-server && npm install && npm start          # Node/Express on :8080
# or
cd java-match-service && ./mvnw spring-boot:run     # Spring Boot on :8080

# then run the front end pointed at it:
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

## Deploy to AWS (S3 static hosting)

```bash
BUCKET=resume-oliver-wang REGION=ap-southeast-2 bash infra/deploy-s3.sh
```

This builds `out/`, creates/configures the bucket for public website hosting, and syncs the files.

### Tear down

```bash
aws s3 rb s3://resume-oliver-wang --force
```

## The Java JD-Match service

`java-match-service/` is a Spring Boot REST microservice:

- `GET  /api/health` → `{ "status": "ok" }`
- `POST /api/match` → `{ score, matched[], missing[], total }` for body `{ "jobDescription": "..." }`

It implements the same tokenized keyword-coverage algorithm as `lib/match.ts`, with unit
tests in `MatchServiceTest`. Build and run:

```bash
cd java-match-service
./mvnw test
./mvnw spring-boot:run
```

---

_Built with Claude Code. Resume content is the property of Oliver Wang._
