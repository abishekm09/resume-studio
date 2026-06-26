"use client";

import { useState } from "react";
import { atsAnalysisSchema, type ATSAnalysis } from "@/lib/schemas/ats.schema";
import type { ResumeData } from "@/lib/schemas/resume.schema";

export function useAtsAnalysis() {
  const [result, setResult] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(resume: ResumeData, jobDescription: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Analysis failed");
      const parsed = atsAnalysisSchema.safeParse(data);
      if (!parsed.success) throw new Error("The model returned an unexpected format. Try again.");
      setResult(parsed.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return { analyze, result, loading, error, reset: () => setResult(null) };
}
