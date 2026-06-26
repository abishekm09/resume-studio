import { NextResponse } from "next/server";
import { analyzeRequestSchema, atsAnalysisSchema } from "@/lib/schemas/ats.schema";
import { chat, extractJson } from "@/lib/ai/client";
import { ATS_SYSTEM_PROMPT, buildAtsUserPrompt } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { resume, jobDescription } = parsed.data;

  // Send a slimmed resume so the model focuses on what matters and stays in budget.
  const slim = {
    summary: resume.summary,
    experience: resume.experience.map((e) => ({
      id: e.id,
      role: e.role,
      company: e.company,
      bullets: e.bullets,
    })),
    skills: resume.skills.flatMap((g) => g.skills),
    projects: resume.projects.map((p) => ({ title: p.title, technologies: p.technologies })),
    education: resume.education.map((ed) => ({ degree: ed.degree, field: ed.field })),
  };

  try {
    const raw = await chat(
      [
        { role: "system", content: ATS_SYSTEM_PROMPT },
        { role: "user", content: buildAtsUserPrompt(JSON.stringify(slim, null, 2), jobDescription) },
      ],
      { json: true, temperature: 0.2 }
    );

    const json = extractJson(raw);
    const validated = atsAnalysisSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: "The model returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    // Guard: drop any bulletSuggestion whose experienceId the model invented.
    const validIds = new Set(resume.experience.map((e) => e.id));
    validated.data.bulletSuggestions = validated.data.bulletSuggestions.filter((s) =>
      validIds.has(s.experienceId)
    );

    return NextResponse.json(validated.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
