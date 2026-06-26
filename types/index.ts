// Re-export the inferred domain types so feature code imports from one place.
export type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillGroup,
  Project,
  Certification,
  Language,
  CustomSection,
  TemplateId,
  ResumeMeta,
} from "@/lib/schemas/resume.schema";

export type { ATSAnalysis } from "@/lib/schemas/ats.schema";
