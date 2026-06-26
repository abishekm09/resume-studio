"use client";

import { Check, Plus } from "lucide-react";
import type { ATSAnalysis } from "@/lib/schemas/ats.schema";
import { useResumeStore } from "@/lib/store/resume-store";
import { Button } from "@/components/ui/button";

export function BulletSuggestions({ analysis }: { analysis: ATSAnalysis }) {
  const applyBullet = useResumeStore((s) => s.applyOptimizedBullet);
  const experience = useResumeStore((s) => s.resume.experience);

  function companyFor(id: string) {
    const e = experience.find((x) => x.id === id);
    return e ? `${e.role || "Role"} · ${e.company || "Company"}` : "Experience";
  }

  if (!analysis.bulletSuggestions.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-ink">Bullet rewrites</h4>
      {analysis.bulletSuggestions.map((sug, i) => (
        <div key={i} className="rounded-lg border border-ink/10 bg-white p-3">
          <p className="mb-1 font-mono text-[11px] text-ink/40">{companyFor(sug.experienceId)}</p>
          {sug.bulletIndex >= 0 && sug.original && (
            <p className="text-xs text-ink/50 line-through">{sug.original}</p>
          )}
          <p className="mt-1 text-sm text-ink/90">{sug.suggested}</p>
          {sug.rationale && <p className="mt-1.5 text-xs text-ink/50">{sug.rationale}</p>}
          <Button
            size="sm"
            variant="subtle"
            className="mt-2"
            onClick={() => applyBullet(sug.experienceId, sug.bulletIndex, sug.suggested)}
          >
            {sug.bulletIndex === -1 ? <Plus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            {sug.bulletIndex === -1 ? "Add bullet" : "Apply"}
          </Button>
        </div>
      ))}
    </div>
  );
}
