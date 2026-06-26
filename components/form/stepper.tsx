"use client";

import { cn } from "@/lib/utils";

export const STEPS = [
  { id: "personal", label: "Personal" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "extras", label: "Extras" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export function Stepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Resume sections" className="flex flex-wrap gap-1.5">
      {STEPS.map((step, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <button
            key={step.id}
            onClick={() => onSelect(i)}
            aria-current={active ? "step" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active && "bg-accent text-white",
              done && !active && "bg-accent-soft text-accent",
              !active && !done && "bg-black/5 text-ink/60 hover:bg-black/10"
            )}
          >
            <span className="font-mono mr-1.5 opacity-60">{String(i + 1).padStart(2, "0")}</span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
