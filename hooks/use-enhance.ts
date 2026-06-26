"use client";

import { useState } from "react";
import type { EnhanceRequest } from "@/lib/schemas/ats.schema";

export function useEnhance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enhance(payload: EnhanceRequest): Promise<string | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Enhancement failed");
      return data.text as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enhancement failed");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { enhance, loading, error };
}
