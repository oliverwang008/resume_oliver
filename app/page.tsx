"use client";

import { useEffect, useState } from "react";
import { resume } from "@/lib/resume";
import LgtLogo from "@/components/LgtLogo";
import JdMatch from "@/components/JdMatch";

const NAV = [
  { id: "summary", label: "Summary" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "match", label: "JD Match" },
  { id: "education", label: "Education" },
];

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };
  return { dark, toggle };
}

export default function Page() {
  const { dark, toggle } = useTheme();
  const [active, setActive] = useState("summary");
  const [openRole, setOpenRole] = useState<number | null>(0);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const LINE = 110; // px from top: a section is "active" once its top passes this line
    const onScroll = () => {
      const doc = document.documentElement;
      // At the very bottom, the last (short) section can't reach the line — force it active.
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActive(ids[ids.length - 1]);
        return;
      }
      // Otherwise: the last section whose top has scrolled above the line. Defaults to the
      // first section at the top of the page.
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= LINE) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      {/* Sticky nav */}
      <nav className="a-slide-down no-print sticky top-0 z-20 -mx-4 sm:-mx-6 mb-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/85 dark:bg-slate-950/85 backdrop-blur px-4 sm:px-6 py-2">
        <div className="flex items-center gap-4 text-sm">
          <LgtLogo className="w-7 h-7" />
          <div className="flex gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setActive(n.id)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 font-sans transition-colors ${
                  active === n.id
                    ? "bg-lgt-navy text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-lgt-mist dark:hover:bg-slate-800"
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} aria-label="Toggle theme" className="rounded-md border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-sans hover:bg-lgt-mist dark:hover:bg-slate-800">
              {dark ? "☀︎ Light" : "☾ Dark"}
            </button>
            <button onClick={() => window.print()} className="rounded-md bg-lgt-gold px-2.5 py-1.5 text-xs font-semibold font-sans text-lgt-ink hover:brightness-95">
              ⤓ PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Card */}
      <div className="a-card print-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
        {/* Header */}
        <header className="relative border-b-2 border-lgt-navy px-6 sm:px-10 pt-8 pb-6">
          <div className="flex items-center gap-5">
            <span className="a-pop shrink-0" style={{ animationDelay: "0.2s" }}>
              <LgtLogo className="w-16 h-16" />
            </span>
            <div className="flex-1 text-center">
              <h1 className="a-rise font-head text-3xl sm:text-4xl font-bold tracking-wide text-lgt-navy dark:text-white" style={{ animationDelay: "0.34s" }}>
                {resume.name.toUpperCase()}
              </h1>
              <p className="a-rise font-head italic font-bold text-sm sm:text-base mt-1" style={{ animationDelay: "0.46s" }}>{resume.title}</p>
              <p className="a-rise text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans" style={{ animationDelay: "0.56s" }}>
                {resume.location} &nbsp;|&nbsp; {resume.phone} &nbsp;|&nbsp; {resume.email}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="profile_pic.jpeg" alt="Oliver Wang" className="a-zoom w-20 h-20 rounded-full object-cover border-2 border-lgt-navy shrink-0" style={{ animationDelay: "0.44s" }} />
          </div>
          <div className="relative mt-4 h-0.5 w-full overflow-hidden">
            <div className="a-grow h-full w-full bg-lgt-gold" style={{ animationDelay: "0.64s" }} />
            <div className="gold-sheen absolute inset-0" />
          </div>
        </header>

        <div className="px-6 sm:px-10 py-8 space-y-10">
          {/* Summary */}
          <Section id="summary" title="Professional Summary" delay={0.72}>
            <p className="text-[15px] leading-relaxed text-justify">{resume.summary}</p>
          </Section>

          {/* Skills — interactive filter */}
          <Section id="skills" title="Technical Skills" delay={0.82}>
            <div className="no-print mb-4 flex flex-wrap gap-2 font-sans text-xs">
              <button
                onClick={() => setSkillFilter(null)}
                className={`rounded-full px-3 py-1 ${skillFilter === null ? "bg-lgt-navy text-white" : "bg-lgt-mist dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                All
              </button>
              {resume.skills.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setSkillFilter(g.label)}
                  className={`rounded-full px-3 py-1 ${skillFilter === g.label ? "bg-lgt-navy text-white" : "bg-lgt-mist dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {resume.skills
                .filter((g) => !skillFilter || g.label === skillFilter)
                .map((g) => (
                  <div key={g.label} className="rounded-lg border-l-[3px] border-lgt-navy bg-lgt-mist dark:bg-slate-800/60 p-3">
                    <div className="font-head font-bold text-lgt-navy dark:text-lgt-gold text-sm mb-1.5">{g.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.items.map((s) => (
                        <span key={s} className="rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs font-sans">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Section>

          {/* Experience — expandable */}
          <Section id="experience" title="Professional Experience" delay={0.92}>
            <div className="space-y-3">
              {resume.experience.map((role, i) => {
                const open = openRole === i;
                return (
                  <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => setOpenRole(open ? null : i)}
                      className="w-full flex items-baseline justify-between gap-3 px-4 py-3 text-left hover:bg-lgt-mist dark:hover:bg-slate-800/60"
                    >
                      <span>
                        <span className="font-bold">{role.title}</span>{" "}
                        <span className="italic text-slate-600 dark:text-slate-300">
                          | {role.org}
                          {role.location ? ` | ${role.location}` : ""}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-500 font-sans whitespace-nowrap">
                          {role.start} – {role.end}
                        </span>
                        <span className={`no-print transition-transform ${open ? "rotate-90" : ""}`}>›</span>
                      </span>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 rise">
                        <ul className="list-disc pl-5 space-y-1 text-[14px] leading-relaxed">
                          {role.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                        {role.projects && (
                          <div className="mt-3">
                            <div className="font-head font-bold uppercase tracking-wide text-lgt-navy dark:text-lgt-gold text-xs mb-1.5">
                              Sample Projects
                            </div>
                            <ul className="space-y-1.5 text-[14px]">
                              {role.projects.map((p) => (
                                <li key={p.name}>
                                  <span className="font-bold">{p.name}</span> — {p.blurb}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* JD Match tool */}
          <Section id="match" title="Interactive: JD Match" delay={1.02}>
            <JdMatch />
          </Section>

          {/* Education */}
          <Section id="education" title="Education & Certifications" delay={1.12}>
            <div className="space-y-2 text-[14px]">
              {resume.education.map((e) => (
                <p key={e.degree}>
                  <span className="font-bold">{e.degree}</span> — {e.institution}. {e.detail}
                </p>
              ))}
              <p>
                <span className="font-bold">Certifications:</span> {resume.certifications.join("  ·  ")}
              </p>
            </div>
          </Section>
        </div>
      </div>

      <footer className="no-print mt-6 text-center text-xs text-slate-400 font-sans">
        Built with Next.js · React · REST API · Java (Spring Boot) · deployed on AWS S3 · LGT-themed
      </footer>
    </main>
  );
}

function Section({
  id,
  title,
  delay = 0,
  children,
}: {
  id: string;
  title: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 a-rise" style={{ animationDelay: `${delay}s` }}>
      <h2 className="accent-rule font-head uppercase tracking-wide text-lgt-navy dark:text-lgt-gold text-lg font-bold mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
