"use client";

import { useEffect, useRef } from "react";
import type { UseFormWatch, FieldValues } from "react-hook-form";

/**
 * Pushes RHF form values into the Zustand store on change, debounced.
 * The store is the canonical source for the live preview + PDF; the form owns
 * validation. We only sync form -> store (the form is initialized from the
 * store once, on mount), which avoids feedback loops.
 */
export function useSyncToStore<T extends FieldValues>(
  watch: UseFormWatch<T>,
  commit: (values: T) => void,
  delay = 350
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sub = watch((values) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => commit(values as T), delay);
    });
    return () => {
      sub.unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
    // commit identity is stable (zustand action); watch identity is stable per form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
