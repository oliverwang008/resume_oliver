// Node/Express REST API for the resume app.
//   GET  /api/health   -> { status }
//   GET  /api/resume   -> full resume JSON
//   POST /api/match    -> { score, matched, missing, total }  body: { jobDescription }
//
// This is a JS-equivalent of the Java Spring Boot service (java-match-service),
// provided so the front end can point NEXT_PUBLIC_API_URL at either backend.
// Deployable to AWS Lambda (via API Gateway) or Google Cloud Run.

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Minimal skill catalog — mirrors lib/resume.ts and the Java SkillCatalog.
const SKILLS = [
  "Python", "Java", "TypeScript", "JavaScript", "Swift", "Dart", "SQL", "HTML", "CSS",
  "React", "Next.js", "Tailwind CSS", "Swift / SwiftUI (native iOS)", "Flutter / Dart",
  "FastAPI", "Node.js / Express", "REST APIs", "Microservices", "Serverless",
  "Oracle & PL/SQL (Avaloq)", "SQLite", "MongoDB", "Firebase / Firestore",
  "Docker", "Git", "Terraform (IaC)", "AWS (Lambda, API Gateway, S3)",
  "Google Cloud (Cloud Run, Functions)", "OAuth 2.0 / OpenID Connect / JWT",
  "OpenAI", "Anthropic Claude", "RAG (vector search, embeddings)", "MCP servers",
  "Evaluation", "Claude Code",
];

function tokensFor(skill) {
  return skill
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .split(/[/,&]|\s+—\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function score(jd) {
  const haystack = (jd || "").toLowerCase();
  const matched = [];
  const missing = [];
  for (const s of SKILLS) (tokensFor(s).some((t) => haystack.includes(t)) ? matched : missing).push(s);
  const total = SKILLS.length;
  return { score: total ? Math.round((matched.length / total) * 100) : 0, matched, missing, total };
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.post("/api/match", (req, res) => res.json(score(req.body?.jobDescription)));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`resume-api-server listening on :${PORT}`));
