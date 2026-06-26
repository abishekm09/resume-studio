"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { useResumeStore } from "@/lib/store/resume-store";
import { ResumeDocument } from "./pdf-document";
import { cn } from "@/lib/utils";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

export function DownloadButton() {
  const resume = useResumeStore((s) => s.resume);
  const fileName = `${(resume.personalInfo.fullName || "resume").replace(/\s+/g, "_")}.pdf`;

  return (
    <PDFDownloadLink
      document={<ResumeDocument data={resume} />}
      fileName={fileName}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm hover:bg-accent/90"
      )}
    >
      {({ loading }) => (
        <>
          <Download className="h-4 w-4" />
          {loading ? "Preparing…" : "Download PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
}
