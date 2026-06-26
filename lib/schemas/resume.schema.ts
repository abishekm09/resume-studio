import { z } from "zod";

/** "YYYY-MM" from <input type="month">, or empty string. */
const monthString = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Use the month picker")
  .or(z.literal(""));

const optionalUrl = z.string().url("Must be a valid URL").or(z.literal(""));

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Invalid phone number"),
  location: z.string().optional().or(z.literal("")),
  linkedin: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional().or(z.literal("")),
  startDate: monthString,
  endDate: monthString,
  current: z.boolean().default(false),
  // Discrete bullets (not one blob) so the ATS optimizer can rewrite them individually.
  bullets: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  startDate: monthString,
  endDate: monthString,
  current: z.boolean().default(false),
  gpa: z.string().optional().or(z.literal("")),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category name is required"),
  skills: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  technologies: z.array(z.string()).default([]),
  description: z.string().optional().or(z.literal("")),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional().or(z.literal("")),
  date: monthString,
  url: optionalUrl,
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Language is required"),
  proficiency: z.enum([
    "Basic",
    "Conversational",
    "Professional",
    "Fluent",
    "Native",
  ]),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Section title is required"),
  items: z
    .array(
      z.object({
        id: z.string(),
        heading: z.string().optional().or(z.literal("")),
        subheading: z.string().optional().or(z.literal("")),
        date: monthString,
        description: z.string().optional().or(z.literal("")),
      })
    )
    .default([]),
});

export const templateIdSchema = z.enum(["modern", "classic", "minimalist"]);

export const resumeMetaSchema = z.object({
  id: z.string(),
  templateId: templateIdSchema.default("modern"),
  accentColor: z.string().default("#3D34D6"),
  updatedAt: z.string(),
});

export const resumeSchema = z.object({
  meta: resumeMetaSchema,
  personalInfo: personalInfoSchema,
  summary: z.string().max(2500).default(""),
  experience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

// Inferred types — import these everywhere, never hand-write interfaces.
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type ResumeMeta = z.infer<typeof resumeMetaSchema>;
export type TemplateId = z.infer<typeof templateIdSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
