package com.oliverwang.match;

import java.util.List;

/**
 * The resume's skill keywords — the ground truth the JD is scored against.
 * Mirrors the `skills` in lib/resume.ts. Kept as a small in-code catalog so the
 * service has no external dependency; in production this could be loaded from
 * the /api/resume endpoint or a shared config.
 */
public final class SkillCatalog {

    private SkillCatalog() {}

    public static final List<String> SKILLS = List.of(
            // Languages
            "Python", "Java", "TypeScript", "JavaScript", "Swift", "Dart", "SQL", "HTML", "CSS",
            // Frontend & Mobile
            "React", "Next.js", "Tailwind CSS", "Swift / SwiftUI (native iOS)", "Flutter / Dart",
            // Backend & APIs
            "FastAPI", "Node.js / Express", "REST APIs", "Microservices", "Serverless",
            // Databases & Data
            "Oracle & PL/SQL (Avaloq)", "SQLite", "MongoDB", "Firebase / Firestore",
            // Cloud, DevOps & Security
            "Docker", "Git", "Terraform (IaC)", "AWS (Lambda, API Gateway, S3)",
            "Google Cloud (Cloud Run, Functions)", "OAuth 2.0 / OpenID Connect / JWT",
            // AI & LLM Engineering
            "OpenAI", "Anthropic Claude", "RAG (vector search, embeddings)", "MCP servers",
            "Evaluation", "Claude Code"
    );
}
