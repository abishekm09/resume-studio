/**
 * Provider-agnostic chat client. Server-side only (reads process.env).
 * Switch providers with AI_PROVIDER = "groq" | "ollama".
 *
 * Both providers expose an OpenAI-style chat completions endpoint, so we keep
 * one request shape and one return type.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface ChatOptions {
  /** Force JSON-object output where the provider supports it. */
  json?: boolean;
  temperature?: number;
}

const PROVIDER = (process.env.AI_PROVIDER ?? "groq").toLowerCase();

export function getProviderName(): string {
  return PROVIDER;
}

/** Returns the raw assistant text content. */
export async function chat(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<string> {
  if (PROVIDER === "ollama") return chatOllama(messages, opts);
  return chatGroq(messages, opts);
}

// ── Groq (free hosted Llama, OpenAI-compatible) ────────────────────────────
async function chatGroq(messages: ChatMessage[], opts: ChatOptions): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to .env.local (free key: https://console.groq.com/keys), or set AI_PROVIDER=ollama."
    );
  }
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.3,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${detail.slice(0, 400)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

// ── Ollama (fully local, no key) ───────────────────────────────────────────
async function chatOllama(messages: ChatMessage[], opts: ChatOptions): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.1";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      format: opts.json ? "json" : undefined,
      options: { temperature: opts.temperature ?? 0.3 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Ollama request failed (${res.status}). Is Ollama running and is "${model}" pulled? ${detail.slice(0, 200)}`
    );
  }

  const data = await res.json();
  return data?.message?.content ?? "";
}

/**
 * Best-effort JSON extraction. Llama models sometimes wrap JSON in prose or
 * code fences even when asked not to; this salvages the object.
 */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // strip code fences
    const fenced = trimmed.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    try {
      return JSON.parse(fenced);
    } catch {
      // grab the first {...} block
      const start = fenced.indexOf("{");
      const end = fenced.lastIndexOf("}");
      if (start !== -1 && end > start) {
        return JSON.parse(fenced.slice(start, end + 1));
      }
      throw new Error("Model did not return parseable JSON.");
    }
  }
}
