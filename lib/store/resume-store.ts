"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type ResumeData,
  type WorkExperience,
  type Education,
  type SkillGroup,
  type Project,
  type Certification,
  type Language,
  type CustomSection,
  type TemplateId,
} from "@/lib/schemas/resume.schema";
import { uid } from "@/lib/utils";

function emptyResume(): ResumeData {
  return {
    meta: {
      id: uid(),
      templateId: "modern",
      accentColor: "#3D34D6",
      updatedAt: new Date().toISOString(),
    },
    personalInfo: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [
      { id: uid(), category: "Technical", skills: [] },
      { id: uid(), category: "Tools", skills: [] },
      { id: uid(), category: "Soft", skills: [] },
    ],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

export function newExperience(): WorkExperience {
  return {
    id: uid(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  };
}

export function newEducation(): Education {
  return {
    id: uid(),
    institution: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
  };
}

export function newProject(): Project {
  return { id: uid(), title: "", technologies: [], description: "", liveUrl: "", repoUrl: "" };
}

export function newCertification(): Certification {
  return { id: uid(), name: "", issuer: "", date: "", url: "" };
}

export function newLanguage(): Language {
  return { id: uid(), name: "", proficiency: "Professional" };
}

export function newCustomSection(): CustomSection {
  return { id: uid(), title: "", items: [{ id: uid(), heading: "", subheading: "", date: "", description: "" }] };
}

interface ResumeStore {
  resume: ResumeData;

  // section setters (partial merge, touches updatedAt)
  setPersonalInfo: (data: Partial<ResumeData["personalInfo"]>) => void;
  setSummary: (summary: string) => void;
  setExperience: (experience: WorkExperience[]) => void;
  setEducation: (education: Education[]) => void;
  setSkills: (skills: SkillGroup[]) => void;
  setProjects: (projects: Project[]) => void;
  setCertifications: (certifications: Certification[]) => void;
  setLanguages: (languages: Language[]) => void;
  setCustomSections: (sections: CustomSection[]) => void;

  // meta
  setTemplate: (templateId: TemplateId) => void;
  setAccentColor: (color: string) => void;

  // bulk ops used by the ATS optimizer
  applyOptimizedBullet: (experienceId: string, bulletIndex: number, text: string) => void;
  replaceSummary: (text: string) => void;

  loadResume: (data: ResumeData) => void;
  reset: () => void;
}

function touch(resume: ResumeData): ResumeData {
  return { ...resume, meta: { ...resume.meta, updatedAt: new Date().toISOString() } };
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: emptyResume(),

      setPersonalInfo: (data) =>
        set((s) => touch({ ...s.resume, personalInfo: { ...s.resume.personalInfo, ...data } })),
      setSummary: (summary) => set((s) => touch({ ...s.resume, summary })),
      setExperience: (experience) => set((s) => touch({ ...s.resume, experience })),
      setEducation: (education) => set((s) => touch({ ...s.resume, education })),
      setSkills: (skills) => set((s) => touch({ ...s.resume, skills })),
      setProjects: (projects) => set((s) => touch({ ...s.resume, projects })),
      setCertifications: (certifications) => set((s) => touch({ ...s.resume, certifications })),
      setLanguages: (languages) => set((s) => touch({ ...s.resume, languages })),
      setCustomSections: (customSections) => set((s) => touch({ ...s.resume, customSections })),

      setTemplate: (templateId) =>
        set((s) => touch({ ...s.resume, meta: { ...s.resume.meta, templateId } })),
      setAccentColor: (accentColor) =>
        set((s) => touch({ ...s.resume, meta: { ...s.resume.meta, accentColor } })),

      applyOptimizedBullet: (experienceId, bulletIndex, text) =>
        set((s) => {
          const experience = s.resume.experience.map((exp) => {
            if (exp.id !== experienceId) return exp;
            const bullets = [...exp.bullets];
            if (bulletIndex === -1 || bulletIndex >= bullets.length) {
              bullets.push(text);
            } else {
              bullets[bulletIndex] = text;
            }
            return { ...exp, bullets };
          });
          return touch({ ...s.resume, experience });
        }),

      replaceSummary: (text) => set((s) => touch({ ...s.resume, summary: text })),

      loadResume: (data) => set(() => ({ resume: touch(data) })),
      reset: () => set(() => ({ resume: emptyResume() })),
    }),
    {
      name: "resume-builder-store",
      version: 1,
    }
  )
);
