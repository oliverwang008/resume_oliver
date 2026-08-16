import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oliver Wang — Senior Full-Stack Software Engineer",
  description:
    "Interactive resume of Oliver Wang, Senior Full-Stack Software Engineer. Wealth-management platforms, full-stack (React/Next.js, FastAPI, Node), mobile, cloud and AI/LLM engineering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before paint: always start at the top on (re)load — disable scroll
            restoration and strip any #section hash so a refresh doesn't jump to
            the last-viewed component. In-session nav clicks (no reload) are
            unaffected. Then set theme to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history){history.scrollRestoration='manual'}if(location.hash){history.replaceState(null,'',location.pathname+location.search)}}catch(e){}try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-slate-100 text-lgt-ink dark:bg-slate-950 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
