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

/** Word-boundary token regex, so "java" doesn't match "javascript", etc. */
function tokenRegex(token: string): RegExp {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#.])(${esc})([^a-z0-9+#]|$)`, "i");
}

/** Canonical skills present in a block of text. */
function skillsIn(text: string): Set<string> {
  const lc = text.toLowerCase();
  const found = new Set<string>();
  for (const [name, tokens] of Object.entries(SKILL_DICT)) {
    if (tokens.some((t) => tokenRegex(t).test(lc))) found.add(name);
  }
  return found;
}

/** The resume's canonical skills, derived from resume.ts skill items. */
export function resumeSkillSet(): Set<string> {
  const text = resume.skills.flatMap((g) => g.items).join(" ; ");
  return skillsIn(text);
}

/** Each canonical skill present in the JD, with the position of its first mention. */
function orderedSkillHits(jd: string): { name: string; start: number; end: number }[] {
  const lc = jd.toLowerCase();
  const hits: { name: string; start: number; end: number }[] = [];
  for (const [name, tokens] of Object.entries(SKILL_DICT)) {
    let best = -1;
    let bestEnd = -1;
    for (const t of tokens) {
      const m = tokenRegex(t).exec(lc);
      if (m) {
        const start = m.index + m[1].length;
        if (best === -1 || start < best) {
          best = start;
          bestEnd = start + m[2].length;
        }
      }
    }
    if (best !== -1) hits.push({ name, start: best, end: bestEnd });
  }
  return hits.sort((a, b) => a.start - b.start);
}

/** Classify the text between two adjacent skill mentions. */
function connector(gap: string): "or" | "comma" | "other" {
  const core = gap.replace(/^[,\s]+/, "").replace(/[,\s]+$/, "");
  if (core === "or" || core === "/") return "or";
  if (core === "") return "comma";
  return "other";
}

/**
 * Group the JD's skills into requirements. Skills joined by "or" / "/" (an
 * alternation, e.g. "React or Angular", "A, B or C") collapse into ONE
 * requirement; comma- or otherwise-separated skills stay individual.
 */
function requirementsFromJd(jd: string): string[][] {
  const hits = orderedSkillHits(jd);
  const items = hits.map((h, i) => ({
    name: h.name,
    conn: i < hits.length - 1 ? connector(jd.substring(h.end, hits[i + 1].start)) : "other",
  }));

  // Split into segments at "other" boundaries; within a segment that contains
  // any "or", the whole segment is one alternation group.
  const groups: string[][] = [];
  let seg: typeof items = [];
  for (const it of items) {
    seg.push(it);
    if (it.conn === "other") {
      flush(seg, groups);
      seg = [];
    }
  }
  flush(seg, groups);
  return groups;
}

function flush(seg: { name: string; conn: string }[], groups: string[][]) {
  if (seg.length === 0) return;
  if (seg.some((x) => x.conn === "or")) groups.push(seg.map((x) => x.name));
  else seg.forEach((x) => groups.push([x.name]));
}

export function scoreJobDescription(jd: string): MatchResult {
  const have = resumeSkillSet();
  const groups = requirementsFromJd(jd);
  const jdSkills = new Set<string>(groups.flat());

  const matched: string[] = [];
  const gaps: string[] = [];
  for (const group of groups) {
    const covered = group.filter((s) => have.has(s));
    if (covered.length > 0) matched.push(covered.join(" / "));
    else gaps.push(group.join(" / "));
  }

  const overflow: string[] = [];
  have.forEach((s) => {
    if (!jdSkills.has(s)) overflow.push(s);
  });

  const jdTotal = groups.length;
  const score = jdTotal === 0 ? 0 : Math.round((matched.length / jdTotal) * 100);
  return { score, matched, gaps, overflow, jdTotal };
}
