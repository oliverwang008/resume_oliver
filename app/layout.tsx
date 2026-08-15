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
        {/* Set theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-slate-100 text-lgt-ink dark:bg-slate-950 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
