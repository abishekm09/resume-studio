import { NextResponse } from "next/server";
import { enhanceRequestSchema } from "@/lib/schemas/ats.schema";
import { chat } from "@/lib/ai/client";
import { ENHANCE_SUMMARY_PROMPT, ENHANCE_BULLET_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = enhanceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { kind, text, context } = parsed.data;
  const system = kind === "summary" ? ENHANCE_SUMMARY_PROMPT : ENHANCE_BULLET_PROMPT;
  const ctx = context?.role ? `\n\nContext: role "${context.role}"${context.company ? ` at "${context.company}"` : ""}.` : "";

  try {
    const raw = await chat(
      [
        { role: "system", content: system },
        { role: "user", content: `${text}${ctx}` },
      ],
      { temperature: 0.4 }
    );
    const cleaned = raw.trim().replace(/^["']|["']$/g, "").replace(/^[-•]\s*/, "");
    return NextResponse.json({ text: cleaned });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Enhancement failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
