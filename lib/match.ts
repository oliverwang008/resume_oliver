// ─────────────────────────────────────────────────────────────────────────────
// JD-match scorer. Given a pasted job description, score how well the resume's
// skills cover it. This TypeScript version powers the client-side interactive
// tool; the Java Spring Boot service (java-match-service) implements the SAME
// algorithm as a REST endpoint for a production backend.
// ─────────────────────────────────────────────────────────────────────────────

import { resume, allSkillKeywords, type Resume } from "./resume";

export interface MatchResult {
  score: number; // 0..100
  matched: string[];
  missing: string[];
  total: number;
}

/** Split a skill label into searchable tokens, e.g. "Node.js / Express" -> ["node.js","express"]. */
function tokensFor(skill: string): string[] {
  return skill
    .toLowerCase()
    .replace(/\(.*?\)/g, " ") // drop parenthetical notes
    .split(/[\/,&]|\s+—\s+/) // split on separators
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

/** Score a job description against the resume's skill keywords. */
export function scoreJobDescription(jd: string, r: Resume = resume): MatchResult {
  const haystack = jd.toLowerCase();
  const keywords = allSkillKeywords(r);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    const hit = tokensFor(kw).some((tok) => haystack.includes(tok));
    (hit ? matched : missing).push(kw);
  }

  const total = keywords.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);
  return { score, matched, missing, total };
}
