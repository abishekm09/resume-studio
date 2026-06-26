"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resume-store";
import { useEnhance } from "@/hooks/use-enhance";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  const { enhance, loading, error } = useEnhance();
  const [enhanced, setEnhanced] = useState<string | null>(null);

  async function handleEnhance() {
    if (!summary.trim()) return;
    const result = await enhance({ kind: "summary", text: summary });
    if (result) setEnhanced(result);
  }

  return (
    <div className="space-y-3">
      <Field label="Professional summary">
        <Textarea
          rows={5}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A results-driven engineer with 6 years building distributed systems…"
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button variant="subtle" size="sm" onClick={handleEnhance} disabled={loading || !summary.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Enhance with AI
        </Button>
        {error && <span className="text-xs text-clay">{error}</span>}
      </div>

      {enhanced && (
        <div className="rounded-lg border border-accent/30 bg-accent-soft/50 p-3">
          <p className="mb-2 text-xs font-medium text-accent">Suggested rewrite</p>
          <p className="text-sm text-ink/80">{enhanced}</p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSummary(enhanced);
                setEnhanced(null);
              }}
            >
              Use this
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEnhanced(null)}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
