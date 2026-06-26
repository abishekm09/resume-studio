"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore, newEducation } from "@/lib/store/resume-store";
import { useSyncToStore } from "@/hooks/use-sync-to-store";
import type { Education } from "@/lib/schemas/resume.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type FormValues = { items: Education[] };

export function EducationForm() {
  const initial = useResumeStore((s) => s.resume.education);
  const setEducation = useResumeStore((s) => s.setEducation);

  const { control, register, watch } = useForm<FormValues>({
    defaultValues: { items: initial.length ? initial : [newEducation()] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  useSyncToStore(watch, (v) => setEducation(v.items));

  return (
    <div className="space-y-5">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-xl border border-ink/10 bg-paper/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-ink/40">Education {index + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove">
              <Trash2 className="h-4 w-4 text-clay" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Institution">
              <Input placeholder="MIT" {...register(`items.${index}.institution`)} />
            </Field>
            <Field label="Degree">
              <Input placeholder="B.Sc." {...register(`items.${index}.degree`)} />
            </Field>
            <Field label="Field of study">
              <Input placeholder="Computer Science" {...register(`items.${index}.field`)} />
            </Field>
            <Field label="GPA (optional)">
              <Input placeholder="3.9 / 4.0" {...register(`items.${index}.gpa`)} />
            </Field>
            <Field label="Start">
              <Input type="month" {...register(`items.${index}.startDate`)} />
            </Field>
            <Field label="End">
              <Input type="month" {...register(`items.${index}.endDate`)} />
            </Field>
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" {...register(`items.${index}.current`)} className="accent-accent" />
            Currently studying here
          </label>
        </div>
      ))}
      <Button variant="outline" onClick={() => append(newEducation())}>
        <Plus className="h-4 w-4" /> Add education
      </Button>
    </div>
  );
}
