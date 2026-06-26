# Resume Studio

An open-source **resume builder** with **AI-powered ATS optimization**. No sign-up, no database, no paid APIs — it runs on free, open-weight **Llama** models via [Groq](https://groq.com)'s free tier or a fully local [Ollama](https://ollama.com) install.

On open, the app presents two doors:

- **Build Resume** — a step-by-step editor with live PDF preview and three ATS-friendly templates.
- **ATS Optimise** — paste a job description, get a match score, missing keywords, and bullet rewrites you can apply in one click.

Your resume data lives entirely in your browser (`localStorage`). The LLM key, if you use Groq, stays server-side in a Next.js Route Handler and is never shipped to the client.

---

## Features

- Two-flow entry: build, or tailor against a job description.
- Live PDF preview with **selectable, real text** (via `@react-pdf/renderer` + built-in PDF fonts) — exactly what an ATS needs to parse you correctly.
- Three templates (Modern, Classic, Minimalist) + accent colors.
- AI "Enhance" on the summary and on individual bullets.
- ATS analysis: match score, matched vs. missing keywords (by importance), and per-bullet rewrite suggestions — with a guardrail that the model **never fabricates** experience you don't have.
- One-click "optimize" to apply all suggestions to your resume.
- No authentication, no tracking, no server-side storage.
- Provider-agnostic AI client: switch between **Groq** (hosted, free) and **Ollama** (local) with one env var.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Validation / types | Zod (single source of truth; types via `z.infer`) |
| Forms | React Hook Form + `useFieldArray` |
| State | Zustand (+ `persist`) — canonical resume state |
| PDF | `@react-pdf/renderer` (built-in Helvetica / Times fonts) |
| AI | Groq (Llama 3.3 70B) or Ollama, via an OpenAI-style client |
| Styling | Tailwind CSS, hand-written UI primitives, `lucide-react` |

## Project structure

```
resume-builder/
├─ app/
│  ├─ page.tsx                # Landing — the two doors
│  ├─ builder/page.tsx        # Build Resume flow
│  ├─ ats/page.tsx            # ATS Optimise flow
│  └─ api/ai/
│     ├─ enhance/route.ts     # POST: rewrite summary / bullet
│     └─ analyze/route.ts     # POST: ATS analysis (validated JSON)
├─ components/
│  ├─ ui/                     # button, input, textarea, field, tag-input…
│  ├─ form/                   # stepper + section forms
│  ├─ pdf/                    # preview, download, template switcher, 3 templates
│  └─ ats/                    # score gauge, keywords, suggestions, optimize
├─ hooks/                     # use-sync-to-store, use-enhance, use-ats-analysis
├─ lib/
│  ├─ schemas/                # resume.schema.ts, ats.schema.ts  (Zod)
│  ├─ store/resume-store.ts   # Zustand store
│  ├─ ai/                     # client.ts (Groq/Ollama), prompts.ts
│  └─ utils.ts
└─ types/index.ts
```

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

> The **resume builder and PDF export work with no API key at all.** A key is only needed for the AI features (Enhance + ATS analysis).

### Option A — Groq (recommended, free)

1. Create a free API key at https://console.groq.com/keys (no credit card).
2. In `.env.local`:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=your_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

### Option B — Ollama (100% local, no key, offline)

1. Install Ollama from https://ollama.com, then pull a model:
   ```bash
   ollama pull llama3.1
   ```
2. In `.env.local`:
   ```
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1
   ```

## How the AI guardrails work

ATS analysis sends a slimmed copy of your resume plus the job description to the model with a strict system prompt: return JSON only, never invent skills or experience. The response is then validated with Zod (`atsAnalysisSchema`), and any bullet suggestion referencing an experience ID that isn't in your resume is discarded server-side. Genuinely missing skills are reported under "missing keywords" rather than written into your resume.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # serve the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Contributing

This is intentionally modular so it's easy to extend:

- **New template?** Add a component under `components/pdf/templates/`, then register it in `pdf-document.tsx` and the `templateIdSchema` enum.
- **New AI provider?** Add an adapter in `lib/ai/client.ts` behind the `AI_PROVIDER` switch.
- **New resume section?** Extend `resume.schema.ts`, add a setter to the store, and a form under `components/form/sections/`.

Issues and PRs welcome.

## License

MIT — see [LICENSE](./LICENSE).
