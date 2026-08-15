"use client";

import { useState } from "react";
import { scoreJobDescription, type MatchResult } from "@/lib/match";

const SAMPLE = `Senior Full-Stack Software Engineer — Wealth Management Platforms.
Strong Java and Spring Boot; React or Angular, TypeScript; REST APIs and microservices;
SQL, Oracle; Docker and Kubernetes; CI/CD; OAuth 2.0 / OpenID Connect / JWT; AWS;
AI-assisted development (Claude Code); financial services / wealth management.`;

/**
 * Interactive JD-Match tool. Scores JD COVERAGE: matched / (JD skills detected).
 * Resume-only skills are shown as non-penalizing "overflow". Uses the deployed
 * Java service when NEXT_PUBLIC_API_URL is set; otherwise scores in-browser.
 */
export default function JdMatch() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"client" | "api">("client");

  async function run() {
    const text = jd.trim() || SAMPLE;
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      if (apiUrl) {
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: text }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        setResult(await res.json());
        setSource("api");
      } else {
        setResult(scoreJobDescription(text));
        setSource("client");
      }
    } catch {
      setResult(scoreJobDescription(text));
      setSource("client");
    } finally {
      setLoading(false);
    }
  }

  const ring =
    result && result.score >= 70 ? "text-emerald-500" : result && result.score >= 40 ? "text-lgt-gold" : "text-rose-500";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
        Paste a job description to score how well this resume <b>covers the JD&apos;s skills</b>. Extra resume
        skills the JD doesn&apos;t ask for are shown as <span className="text-lgt-navy dark:text-lgt-gold font-semibold">overflow</span>{" "}
        and don&apos;t lower the score. Runs the same algorithm as the{" "}
        <span className="font-semibold text-lgt-navy dark:text-lgt-gold">Java JD-Match service</span>.
      </p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder={SAMPLE}
        rows={5}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-3 text-sm font-sans outline-none focus:ring-2 focus:ring-lgt-navy"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-lgt-navy px-4 py-2 text-sm font-semibold text-white hover:bg-lgt-navy-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Scoring…" : "Score match"}
        </button>
        <button onClick={() => setJd(SAMPLE)} className="text-sm text-lgt-navy dark:text-lgt-gold underline underline-offset-2">
          Use sample JD
        </button>
        {result && (
          <span className="ml-auto text-xs text-slate-400">scored {source === "api" ? "via REST API" : "in-browser"}</span>
        )}
      </div>

      {result && (
        <div className="mt-5 rise">
          {result.jdTotal === 0 ? (
            <p className="text-sm text-slate-500">No recognised skills detected in that job description — try one with concrete technologies.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] items-start">
              <div className="flex flex-col items-center sm:pr-4 sm:border-r border-slate-200 dark:border-slate-700">
                <div className={`text-4xl font-bold font-sans ${ring}`}>{result.score}%</div>
                <div className="text-xs text-slate-500 text-center">
                  JD coverage
                  <br />
                  {result.matched.length}/{result.jdTotal} JD skills
                </div>
              </div>
              <div className="space-y-2.5">
                <ChipRow label="Matched — JD skills you have" tone="green" items={result.matched} />
                <ChipRow label="Gaps — JD skills not on the resume" tone="red" items={result.gaps} />
                <ChipRow label="Overflow — extra skills (not required by this JD)" tone="blue" items={result.overflow} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChipRow({ label, tone, items }: { label: string; tone: "green" | "red" | "blue"; items: string[] }) {
  if (!items || items.length === 0) return null;
  const styles = {
    green: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    red: "bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    blue: "bg-lgt-mist dark:bg-slate-800 text-lgt-navy dark:text-slate-300",
  }[tone];
  const dot = { green: "text-emerald-600", red: "text-rose-500", blue: "text-lgt-navy dark:text-lgt-gold" }[tone];
  return (
    <div>
      <div className={`text-xs font-semibold mb-1 ${dot}`}>
        {label} <span className="text-slate-400 font-normal">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className={`rounded-full px-2 py-0.5 text-xs font-sans ${styles}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
