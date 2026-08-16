// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for Oliver Wang's resume.
// Consumed by the React UI, the static GET REST endpoint (/api/resume),
// the Node/Express REST service, and mirrored by the Java JD-match service.
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Project {
  name: string;
  blurb: string;
  url?: string;
}

export interface Role {
  title: string;
  org: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
  projects?: Project[];
}

export interface Education {
  degree: string;
  institution: string;
  detail: string;
}

export interface Resume {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  summary: string;
  skills: SkillGroup[];
  experience: Role[];
  education: Education[];
  certifications: string[];
}

export const resume: Resume = {
  name: "Oliver Wang",
  title: "Senior Full-Stack Software Engineer — Wealth Management Platforms",
  location: "Melbourne, Australia",
  phone: "+61 408 732 133",
  email: "oliver.wang@lgt.com",
  summary:
    "Software engineer with 10+ years in wealth-management and core-banking technology, currently delivering platform initiatives at LGT Wealth Management. Separately, through independent venture OliTech AI (outside LGT), builds full-stack products end-to-end — backend services (Python/FastAPI, Node.js/Express), modern web (React, Next.js, TypeScript), native iOS (Swift/SwiftUI) and cross-platform mobile (Flutter), and cloud-native infrastructure (Docker, Terraform, AWS, Google Cloud, Firebase) with secure authentication and third-party/financial-data integrations — including investment-recommendation, portfolio-data, RAG and AI-assisted platforms on OpenAI and Anthropic Claude. An effective adopter of AI-assisted engineering (Claude Code). Avaloq Certified Professional with deep knowledge of portfolio, account and investment-data workflows.",
  skills: [
    { label: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "Swift", "Dart", "SQL", "HTML", "CSS"] },
    { label: "Frontend & Mobile", items: ["React", "Next.js", "Tailwind CSS", "Swift / SwiftUI (native iOS)", "Flutter / Dart"] },
    { label: "Backend & APIs", items: ["FastAPI", "Node.js / Express", "REST APIs", "Microservices", "Serverless"] },
    { label: "Databases & Data", items: ["Oracle & PL/SQL (Avaloq)", "SQLite", "MongoDB", "Firebase / Firestore"] },
    { label: "Cloud, DevOps & Security", items: ["Docker", "Git", "Terraform (IaC)", "AWS (Lambda, API Gateway, S3)", "Google Cloud (Cloud Run, Functions)", "OAuth 2.0 / OpenID Connect / JWT"] },
    { label: "AI & LLM Engineering", items: ["OpenAI", "Anthropic Claude", "RAG (vector search, embeddings)", "MCP servers", "Evaluation", "Claude Code"] },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      org: "LGT Wealth Management",
      location: "Melbourne",
      start: "Feb 2024",
      end: "Present",
      bullets: [
        "Lead analysis, design and delivery of technology initiatives across enterprise wealth-management platforms in a regulated environment.",
        "Partner with product owners, architects, engineers and business stakeholders to translate requirements into scalable, maintainable technical solutions.",
        "Drive system and data transformation and migration initiatives supporting a corporate acquisition.",
        "Contribute to agile delivery — backlog refinement, sprint planning and cross-functional release planning — with a focus on reliability and continuous improvement.",
      ],
    },
    {
      title: "Founder & Full-Stack Engineer",
      org: "OliTech AI",
      start: "May 2023",
      end: "Present",
      bullets: [
        "Founded an independent software venture and shipped multiple full-stack web, mobile and AI products end-to-end — from concept through cloud deployment, app-store release and production operation.",
        "Built React/Next.js/TypeScript front ends with REST APIs and microservices in Python (FastAPI) and Node.js/Express, plus serverless functions on Google Cloud Functions and AWS Lambda; delivered mobile in native iOS (Swift/SwiftUI) and cross-platform Flutter, published to the App Store with a working Android build.",
        "Deployed across AWS (Lambda, API Gateway, S3, CloudFront, Bedrock) and Google Cloud (Cloud Run, Functions) with Docker and Terraform (IaC); built LLM features on OpenAI and Anthropic Claude — including a serverless RAG engine (vector search, Titan embeddings, grounded citations), an MCP server and evaluation harnesses — with Firebase Auth (OAuth/JWT) and subscription billing.",
      ],
      projects: [
        { name: "AInvestor", url: "http://ainvestor-web-7b61b8.s3-website-ap-southeast-2.amazonaws.com/", blurb: "AI investment-recommendation & portfolio-research platform: FastAPI REST microservice with external market-data integrations and LLM-ranked picks, over a SQLAlchemy portfolio database and React/Next.js UI." },
        { name: "AIOffer.me", url: "https://aioffer.me/", blurb: "AI interview & resume platform: Next.js app with Firebase Auth, REST API routes and Dockerised PDF/DOCX microservices on Google Cloud Run, and text-to-speech via Google Cloud." },
        { name: "BiteWise", url: "https://apps.apple.com/au/app/calorie-tracker-bitewise/id6760708018", blurb: "Cross-platform AI nutrition app (Flutter), published to the App Store with a working Android build, consuming a Dockerised FastAPI REST backend on Cloud Run with AI meal analysis and subscriptions." },
        { name: "IMMI-Web", url: "https://auvtracker.web.app/", blurb: "AI immigration-guidance platform with a serverless document-RAG engine on AWS (Terraform, API Gateway REST API, Lambda, S3 vector store, Bedrock/Titan, Anthropic Claude) plus an MCP server." },
      ],
    },
    {
      title: "Principal Consultant, Financial Technology",
      org: "Syncordis Consulting",
      location: "Melbourne & Sydney",
      start: "Jun 2019",
      end: "Sep 2023",
      bullets: [
        "Led the development team to design, build and test core banking system (Temenos) customisations against business and technical requirements.",
        "Performed requirement analysis and functional gap identification; authored functional and technical design documentation.",
        "Ran agile delivery — sprint planning, reviews and retrospectives — and conducted system testing, release activities and end-user training.",
      ],
    },
    {
      title: "Senior Consultant, Financial Technology",
      org: "Synpulse Consulting",
      location: "Sydney / Singapore / Hong Kong",
      start: "Jun 2014",
      end: "May 2019",
      bullets: [
        "Led multiple wealth-management platform implementation projects, including system migrations, release upgrades and financial-product rollouts.",
        "Facilitated workshops with business users to define target operating processes; led end-user training and user acceptance testing across banking and investment modules.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Computer Science (part-time, in progress, expected 2026)",
      institution: "University of Illinois Urbana-Champaign (UIUC)",
      detail: "GPA 3.85/4.0. Coursework: Software Engineering, Database Systems, Cloud Networking, Applied Machine Learning.",
    },
    {
      degree: "Bachelor of Science, Information Systems Management",
      institution: "Singapore Management University",
      detail: "Second major: Advanced Business Technology. GPA 3.45/4.0; Tanoto Foundation Scholarship.",
    },
  ],
  certifications: [
    "Claude Certified Architect (2026)",
    "Avaloq Certified Professional (2014)",
    "Agile Scrum Master (2020)",
  ],
};

/** Flat, de-duplicated list of every skill keyword — used by the JD-match scorer. */
export function allSkillKeywords(r: Resume = resume): string[] {
  const set = new Set<string>();
  r.skills.forEach((g) => g.items.forEach((s) => set.add(s)));
  return Array.from(set);
}
