import * as React from "react";
import { Label } from "./label";

/** Label + control + error message, the standard row used across all forms. */
export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-clay">{error}</p> : null}
    </div>
  );
}
