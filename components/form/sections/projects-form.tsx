"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore, newProject } from "@/lib/store/resume-store";
import { useSyncToStore } from "@/hooks/use-sync-to-store";
import type { Project } from "@/lib/schemas/resume.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TagInput } from "@/components/ui/tag-input";

type FormValues = { items: Project[] };

export function ProjectsForm() {
  const initial = useResumeStore((s) => s.resume.projects);
  const setProjects = useResumeStore((s) => s.setProjects);

  const { control, register, watch } = useForm<FormValues>({
    defaultValues: { items: initial },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  useSyncToStore(watch, (v) => setProjects(v.items));

  return (
    <div className="space-y-5">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-xl border border-ink/10 bg-paper/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-ink/40">Project {index + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove">
              <Trash2 className="h-4 w-4 text-clay" />
            </Button>
          </div>
          <div className="space-y-3">
            <Field label="Title">
              <Input placeholder="Realtime collaboration engine" {...register(`items.${index}.title`)} />
            </Field>
            <Field label="Technologies">
              <Controller
                control={control}
                name={`items.${index}.technologies`}
                render={({ field }) => (
                  <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="React, WebSockets…" />
                )}
              />
            </Field>
            <Field label="Description">
              <Textarea rows={3} placeholder="What it does and your role." {...register(`items.${index}.description`)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Live URL">
                <Input placeholder="https://…" {...register(`items.${index}.liveUrl`)} />
              </Field>
              <Field label="Repo URL">
                <Input placeholder="https://github.com/…" {...register(`items.${index}.repoUrl`)} />
              </Field>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={() => append(newProject())}>
        <Plus className="h-4 w-4" /> Add project
      </Button>
    </div>
  );
}
