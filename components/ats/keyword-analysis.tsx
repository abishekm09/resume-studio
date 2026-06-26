"use client";

import type { ATSAnalysis } from "@/lib/schemas/ats.schema";

const IMPORTANCE_STYLES: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  recommended: "bg-amber-50 text-amber-700 border-amber-200",
  "nice-to-have": "bg-black/5 text-ink/60 border-ink/10",
};

export function KeywordAnalysis({ analysis }: { analysis: ATSAnalysis }) {
  return (
    <div className="space-y-5">
      {analysis.matchedKeywords.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Matched keywords</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedKeywords.map((k) => (
              <span key={k} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.missingKeywords.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Missing keywords</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords.map((m) => (
              <span
                key={m.keyword}
                className={`rounded-md border px-2 py-1 text-xs ${IMPORTANCE_STYLES[m.importance] ?? IMPORTANCE_STYLES["nice-to-have"]}`}
                title={m.importance}
              >
                {m.keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
