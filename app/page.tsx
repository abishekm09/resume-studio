import Link from "next/link";
import { FileText, Target, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Masthead */}
      <header className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight">Resume Studio</span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            open source · no sign-up
          </span>
        </div>
      </header>

      {/* Hero thesis: a fork in the road, not a generic banner */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Two ways in</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Write the resume, or <span className="italic text-accent">beat the bots</span>.
        </h1>
        <p className="mt-4 max-w-xl text-ink/60">
          Build a clean, ATS-safe resume from scratch, or paste a job description and see exactly how
          a tracking system would score you. Pick a door.
        </p>
      </section>

      {/* The two doors */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 px-0 md:grid-cols-2">
        <DoorCard
          href="/builder"
          eyebrow="01 — Create"
          title="Build Resume"
          body="Step through each section with live preview and three ATS-friendly templates. Export selectable-text PDF."
          icon={<FileText className="h-6 w-6" />}
        />
        <DoorCard
          href="/ats"
          eyebrow="02 — Tailor"
          title="ATS Optimise"
          body="Paste a job description. Get a match score, missing keywords, and bullet rewrites you can apply in one click."
          icon={<Target className="h-6 w-6" />}
        />
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12 text-sm text-ink/50">
        Runs on free open-source Llama models via Groq or local Ollama. Your data stays in your browser.
      </footer>
    </main>
  );
}

function DoorCard({
  href,
  eyebrow,
  title,
  body,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[260px] flex-col justify-between bg-paper p-8 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">{eyebrow}</span>
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:-translate-y-0.5">
          {icon}
        </div>
        <h2 className="mt-5 font-display text-2xl font-medium">{title}</h2>
        <p className="mt-2 max-w-sm text-sm text-ink/60">{body}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Enter
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
