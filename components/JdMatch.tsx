"use client";

import { useState } from "react";
import { scoreJobDescription, type MatchResult } from "@/lib/match";

const SAMPLE = `Senior Full-Stack Software Engineer — Wealth Management Platforms.
Strong Java and Spring Boot; React or Angular, TypeScript; REST APIs and microservices;
SQL, Oracle; Docker and Kubernetes; CI/CD; OAuth 2.0 / OpenID Connect / JWT; AWS;
AI-assisted development (Claude Code); financial services / wealth management (Avaloq).`;

/**
 * Interactive JD-Match tool. Runs the same scoring algorithm as the Java
 * Spring Boot service. If NEXT_PUBLIC_API_URL is configured it POSTs to that
 * REST backend; otherwise it scores in-browser so the static site works alone.
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
      // graceful fallback to in-browser scoring
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
        Paste a job description to see how this resume&apos;s skills match it. Runs the same algorithm as the{" "}
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
        <button
          onClick={() => {
            setJd(SAMPLE);
          }}
          className="text-sm text-lgt-navy dark:text-lgt-gold underline underline-offset-2"
        >
          Use sample JD
        </button>
        {result && (
          <span className="ml-auto text-xs text-slate-400">
            scored {source === "api" ? "via REST API" : "in-browser"}
          </span>
        )}
      </div>

      {result && (
        <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] items-center rise">
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold font-sans ${ring}`}>{result.score}%</div>
            <div className="text-xs text-slate-500">
              {result.matched.length}/{result.total} skills
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-xs font-semibold text-emerald-600 mb-1">Matched</div>
              <div className="flex flex-wrap gap-1.5">
                {result.matched.map((s) => (
                  <span key={s} className="rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-xs font-sans">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {result.missing.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Not detected in this JD</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 text-xs font-sans">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
