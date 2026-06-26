"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useResumeStore } from "@/lib/store/resume-store";
import { ResumeDocument } from "./pdf-document";

// PDFViewer touches the DOM/iframe — load it client-side only.
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <PreviewSkeleton /> }
);

export function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  // Re-key on updatedAt so the viewer re-renders when (debounced) data changes.
  const key = resume.meta.updatedAt + resume.meta.templateId;
  const doc = useMemo(() => <ResumeDocument data={resume} />, [resume]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-ink/10 bg-white">
      <PDFViewer key={key} showToolbar={false} style={{ width: "100%", height: "100%", border: "none" }}>
        {doc}
      </PDFViewer>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-ink/40">
      Rendering preview…
    </div>
  );
}
