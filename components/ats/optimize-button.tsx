"use client";

import { useState } from "react";
import { Wand2, Check } from "lucide-react";
import type { ATSAnalysis } from "@/lib/schemas/ats.schema";
import { useResumeStore } from "@/lib/store/resume-store";
import { Button } from "@/components/ui/button";

/** Applies the summary rewrite + every bullet suggestion in one action. */
export function OptimizeButton({ analysis }: { analysis: ATSAnalysis }) {
  const applyBullet = useResumeStore((s) => s.applyOptimizedBullet);
  const replaceSummary = useResumeStore((s) => s.replaceSummary);
  const [done, setDone] = useState(false);

  function optimize() {
    if (analysis.summarySuggestion?.trim()) replaceSummary(analysis.summarySuggestion.trim());
    // Apply from the end so positive indices stay valid as we mutate arrays.
    [...analysis.bulletSuggestions]
      .sort((a, b) => b.bulletIndex - a.bulletIndex)
      .forEach((s) => applyBullet(s.experienceId, s.bulletIndex, s.suggested));
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <Button onClick={optimize} className="w-full">
      {done ? <Check className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
      {done ? "Applied to your resume" : "One-click optimize"}
    </Button>
  );
}
