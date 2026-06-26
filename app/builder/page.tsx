"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { STEPS, Stepper } from "@/components/form/stepper";
import { PersonalInfoForm } from "@/components/form/sections/personal-info-form";
import { SummaryForm } from "@/components/form/sections/summary-form";
import { ExperienceForm } from "@/components/form/sections/experience-form";
import { EducationForm } from "@/components/form/sections/education-form";
import { SkillsForm } from "@/components/form/sections/skills-form";
import { ProjectsForm } from "@/components/form/sections/projects-form";
import { ExtrasForm } from "@/components/form/sections/extras-form";
import { ResumePreview } from "@/components/pdf/resume-preview";
import { TemplateSwitcher } from "@/components/pdf/template-switcher";
import { DownloadButton } from "@/components/pdf/download-button";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/store/resume-store";

const SECTION_TITLES = [
  "Personal information",
  "Professional summary",
  "Work experience",
  "Education",
  "Skills",
  "Projects",
  "Certifications, languages & more",
];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const reset = useResumeStore((s) => s.reset);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span className="font-display text-lg font-medium">Build Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/ats">
            <Button variant="outline" size="sm">Run ATS check</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Clear all resume data?")) {
                reset();
                setStep(0);
              }
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <div className="flex flex-col overflow-y-auto border-r border-ink/10 px-6 py-6">
          <Stepper current={step} onSelect={setStep} />

          <div className="mt-6 flex-1">
            <h2 className="mb-4 font-display text-2xl font-medium">{SECTION_TITLES[step]}</h2>
            {step === 0 && <PersonalInfoForm />}
            {step === 1 && <SummaryForm />}
            {step === 2 && <ExperienceForm />}
            {step === 3 && <EducationForm />}
            {step === 4 && <SkillsForm />}
            {step === 5 && <ProjectsForm />}
            {step === 6 && <ExtrasForm />}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-4">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <span className="font-mono text-xs text-ink/40">
              {step + 1} / {STEPS.length}
            </span>
            <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right: preview */}
        <div className="flex flex-col gap-3 bg-black/[0.02] px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TemplateSwitcher />
            <DownloadButton />
          </div>
          <div className="min-h-[60vh] flex-1 lg:min-h-0">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
