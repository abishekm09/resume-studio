import type { ResumeData } from "@/lib/schemas/resume.schema";
import { ModernTemplate } from "./templates/modern-template";
import { ClassicTemplate } from "./templates/classic-template";
import { MinimalistTemplate } from "./templates/minimalist-template";

/** Picks the active template. Used by both the live preview and the download. */
export function ResumeDocument({ data }: { data: ResumeData }) {
  switch (data.meta.templateId) {
    case "classic":
      return <ClassicTemplate data={data} />;
    case "minimalist":
      return <MinimalistTemplate data={data} />;
    case "modern":
    default:
      return <ModernTemplate data={data} />;
  }
}
