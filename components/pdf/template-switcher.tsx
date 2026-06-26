"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import type { TemplateId } from "@/lib/schemas/resume.schema";
import { cn } from "@/lib/utils";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "minimalist", label: "Minimalist" },
];

const SWATCHES = ["#3D34D6", "#0F766E", "#B91C1C", "#1A1A1A", "#C2552E"];

export function TemplateSwitcher() {
  const templateId = useResumeStore((s) => s.resume.meta.templateId);
  const accentColor = useResumeStore((s) => s.resume.meta.accentColor);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-lg bg-black/5 p-1">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              templateId === t.id ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {SWATCHES.map((c) => (
          <button
            key={c}
            aria-label={`Accent ${c}`}
            onClick={() => setAccentColor(c)}
            className={cn("h-6 w-6 rounded-full border-2", accentColor === c ? "border-ink" : "border-transparent")}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
