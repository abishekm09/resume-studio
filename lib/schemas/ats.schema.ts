import { z } from "zod";
import { resumeSchema } from "./resume.schema";

/** The exact JSON shape the LLM must return for ATS analysis. */
export const atsAnalysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(
    z.object({
      keyword: z.string(),
      importance: z.enum(["critical", "recommended", "nice-to-have"]),
    })
  ),
  bulletSuggestions: z.array(
    z.object({
      experienceId: z.string(),
      bulletIndex: z.number(), // -1 = brand-new suggested bullet
      original: z.string(),
      suggested: z.string(),
      rationale: z.string(),
    })
  ),
  summarySuggestion: z.string().optional().default(""),
  overallFeedback: z.string(),
});

export type ATSAnalysis = z.infer<typeof atsAnalysisSchema>;

/** POST body for /api/ai/analyze */
export const analyzeRequestSchema = z.object({
  resume: resumeSchema,
  jobDescription: z.string().min(20, "Job description is too short"),
});
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

/** POST body for /api/ai/enhance */
export const enhanceRequestSchema = z.object({
  kind: z.enum(["summary", "bullet"]),
  text: z.string().min(3),
  context: z
    .object({
      role: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),
});
export type EnhanceRequest = z.infer<typeof enhanceRequestSchema>;
