// ─────────────────────────────────────────────────────────────────────────────
// JD-match scorer (JD-coverage model).
//
// The score answers: "of the skills THIS JOB asks for, how many does the resume
// have?"  = matched / (all JD skills detected).  Resume skills that the JD does
// NOT ask for are "overflow" — extra strengths that are surfaced but do NOT
// lower the score.
//
// To detect what a JD is asking for (including skills the resume may lack), we
// scan the JD against a broad skill dictionary. The Java Spring Boot service
// implements the same model.
// ─────────────────────────────────────────────────────────────────────────────

import { resume } from "./resume";

export interface MatchResult {
  score: number; // 0..100 — JD coverage
  matched: string[]; // JD skills the resume has
  gaps: string[]; // JD skills the resume is missing (these lower the score)
  overflow: string[]; // resume skills the JD didn't ask for (bonus, non-penalizing)
  jdTotal: number; // number of JD skills detected
}

// Canonical skill -> lowercase match tokens. Includes common skills a JD might
// ask for even if this resume lacks them, so "gaps" are detectable.
export const SKILL_DICT: Record<string, string[]> = {
  Python: ["python"],
  Java: ["java"],
  TypeScript: ["typescript"],
  JavaScript: ["javascript"],
  Swift: ["swift", "swiftui"],
  Kotlin: ["kotlin"],
  Dart: ["dart"],
  Go: ["golang", "go"],
  "C#": ["c#"],
  ".NET": [".net", "dotnet"],
  "C++": ["c++"],
  Ruby: ["ruby"],
  PHP: ["php"],
  Scala: ["scala"],
  Rust: ["rust"],
  SQL: ["sql"],
  HTML: ["html"],
  CSS: ["css"],
  React: ["react"],
  Angular: ["angular"],
  Vue: ["vue"],
  "Next.js": ["next.js", "nextjs"],
  "Tailwind CSS": ["tailwind"],
  Flutter: ["flutter"],
  FastAPI: ["fastapi"],
  "Node.js": ["node.js", "nodejs", "node"],
  Express: ["express"],
  "Spring Boot": ["spring boot", "springboot", "spring"],
  "REST APIs": ["rest api", "restful", "rest"],
  GraphQL: ["graphql"],
  gRPC: ["grpc"],
  SOAP: ["soap"],
  Microservices: ["microservice"],
  Serverless: ["serverless"],
  Kafka: ["kafka"],
  RabbitMQ: ["rabbitmq"],
  ActiveMQ: ["activemq"],
  JMS: ["jms"],
  Oracle: ["oracle"],
  "PL/SQL": ["pl/sql", "plsql"],
  PostgreSQL: ["postgresql", "postgres"],
  MySQL: ["mysql"],
  SQLite: ["sqlite"],
  MongoDB: ["mongodb", "mongo"],
  Redis: ["redis"],
  Firebase: ["firebase", "firestore"],
  Snowflake: ["snowflake"],
  Databricks: ["databricks"],
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  OpenShift: ["openshift"],
  Helm: ["helm"],
  Terraform: ["terraform"],
  Ansible: ["ansible"],
  Git: ["git"],
  GitLab: ["gitlab"],
  "CI/CD": ["ci/cd", "cicd", "continuous integration"],
  Jenkins: ["jenkins"],
  Maven: ["maven"],
  Gradle: ["gradle"],
  JUnit: ["junit"],
  Playwright: ["playwright"],
  Selenium: ["selenium"],
  AWS: ["aws", "amazon web services"],
  Lambda: ["lambda"],
  "API Gateway": ["api gateway"],
  S3: ["s3"],
  Azure: ["azure"],
  "Google Cloud": ["gcp", "google cloud"],
  "Cloud Run": ["cloud run"],
  OAuth: ["oauth"],
  "OpenID Connect": ["openid", "oidc"],
  JWT: ["jwt"],
  Splunk: ["splunk"],
  Grafana: ["grafana"],
  Prometheus: ["prometheus"],
  Kibana: ["kibana"],
  Elasticsearch: ["elasticsearch", "elastic search"],
  Hibernate: ["hibernate"],
  JPA: ["jpa"],
  JDBC: ["jdbc"],
  Nginx: ["nginx"],
  OpenAI: ["openai", "gpt"],
  "Anthropic Claude": ["claude", "anthropic"],
  RAG: ["rag", "retrieval-augmented", "retrieval augmented"],
  MCP: ["mcp", "model context protocol"],
  "Agile / Scrum": ["agile", "scrum"],
  Jira: ["jira"],
  Confluence: ["confluence"],
};

/** Word-boundary token match, so "java" doesn't match "javascript", etc. */
function hasToken(text: string, token: string): boolean {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#.])${esc}([^a-z0-9+#]|$)`, "i").test(text);
}

/** Canonical skills present in a block of text. */
function skillsIn(text: string): Set<string> {
  const lc = text.toLowerCase();
  const found = new Set<string>();
  for (const [name, tokens] of Object.entries(SKILL_DICT)) {
    if (tokens.some((t) => hasToken(lc, t))) found.add(name);
  }
  return found;
}

/** The resume's canonical skills, derived from resume.ts skill items. */
export function resumeSkillSet(): Set<string> {
  const text = resume.skills.flatMap((g) => g.items).join(" ; ");
  return skillsIn(text);
}

export function scoreJobDescription(jd: string): MatchResult {
  const jdSkills = skillsIn(jd);
  const have = resumeSkillSet();

  const matched: string[] = [];
  const gaps: string[] = [];
  jdSkills.forEach((s) => (have.has(s) ? matched : gaps).push(s));

  const overflow: string[] = [];
  have.forEach((s) => {
    if (!jdSkills.has(s)) overflow.push(s);
  });

  const jdTotal = jdSkills.size;
  const score = jdTotal === 0 ? 0 : Math.round((matched.length / jdTotal) * 100);
  return { score, matched, gaps, overflow, jdTotal };
}
