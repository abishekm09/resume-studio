"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Loader2, AlertCircle } from "lucide-react";
import { useResumeStore } from "@/lib/store/resume-store";
import { useAtsAnalysis } from "@/hooks/use-ats-analysis";
import { MatchScore } from "@/components/ats/match-score";
import { KeywordAnalysis } from "@/components/ats/keyword-analysis";
import { BulletSuggestions } from "@/components/ats/bullet-suggestions";
import { OptimizeButton } from "@/components/ats/optimize-button";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AtsPage() {
  const resume = useResumeStore((s) => s.resume);
  const { analyze, result, loading, error } = useAtsAnalysis();
  const [jd, setJd] = useState("");

  const hasResume = resume.personalInfo.fullName || resume.experience.length > 0;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span className="font-display text-lg font-medium">ATS Optimise</span>
        </div>
        <Link href="/builder">
          <Button variant="outline" size="sm">Edit resume</Button>
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-2">
        {/* Left: input */}
        <div>
          <h1 className="font-display text-2xl font-medium">Paste the job description</h1>
          <p className="mt-1 text-sm text-ink/60">
            We score your current resume against it and surface the gaps. Nothing is fabricated —
            missing skills are reported, not invented.
          </p>

          {!hasResume && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Your resume looks empty. <Link href="/builder" className="underline">Build it first</Link> for a meaningful analysis.
              </span>
            </div>
          )}

          <Textarea
            className="mt-4 min-h-[320px]"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…"
          />
          <Button
            className="mt-4"
            disabled={loading || jd.trim().length < 20}
            onClick={() => analyze(resume, jd)}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {loading ? "Analyzing…" : "Analyze match"}
          </Button>
          {error && <p className="mt-3 text-sm text-clay">{error}</p>}
        </div>

        {/* Right: results */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          {!result && !loading && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-ink/40">
              <Target className="mb-3 h-10 w-10" />
              <p className="text-sm">Your match score and recommendations will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[300px] items-center justify-center text-ink/40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <MatchScore score={result.matchScore} />
              </div>
              <p className="rounded-lg bg-paper p-3 text-sm text-ink/70">{result.overallFeedback}</p>
              <OptimizeButton analysis={result} />
              <KeywordAnalysis analysis={result} />
              <BulletSuggestions analysis={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
