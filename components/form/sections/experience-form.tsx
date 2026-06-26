"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Sparkles, Loader2, GripVertical } from "lucide-react";
import { useResumeStore, newExperience } from "@/lib/store/resume-store";
import { useSyncToStore } from "@/hooks/use-sync-to-store";
import { useEnhance } from "@/hooks/use-enhance";
import { uid } from "@/lib/utils";
import type { WorkExperience } from "@/lib/schemas/resume.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

// The form keeps bullets as objects so they have stable keys; we map to
// string[] (the store shape) on commit.
const bulletObj = z.object({ id: z.string(), text: z.string() });
const formItem = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  bullets: z.array(bulletObj),
});
const formSchema = z.object({ items: z.array(formItem) });
type FormValues = z.infer<typeof formSchema>;

function toForm(items: WorkExperience[]): FormValues {
  return {
    items: items.map((e) => ({
      ...e,
      location: e.location ?? "",
      bullets: e.bullets.map((text) => ({ id: uid(), text })),
    })),
  };
}
function toStore(values: FormValues): WorkExperience[] {
  return values.items.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    location: e.location ?? "",
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    bullets: e.bullets.map((b) => b.text).filter((t) => t.trim().length > 0),
  }));
}

export function ExperienceForm() {
  const initial = useResumeStore((s) => s.resume.experience);
  const setExperience = useResumeStore((s) => s.setExperience);

  const { control, register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toForm(initial.length ? initial : [newExperience()]),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  useSyncToStore(watch, (v) => setExperience(toStore(v)));

  return (
    <div className="space-y-5">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-xl border border-ink/10 bg-paper/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs text-ink/40">
              <GripVertical className="h-3.5 w-3.5" /> Position {index + 1}
            </span>
            <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove position">
              <Trash2 className="h-4 w-4 text-clay" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Role" error={errors.items?.[index]?.role?.message}>
              <Input placeholder="Software Engineer" {...register(`items.${index}.role`)} />
            </Field>
            <Field label="Company" error={errors.items?.[index]?.company?.message}>
              <Input placeholder="Acme Inc." {...register(`items.${index}.company`)} />
            </Field>
            <Field label="Location">
              <Input placeholder="Remote" {...register(`items.${index}.location`)} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start">
                <Input type="month" {...register(`items.${index}.startDate`)} />
              </Field>
              <Field label="End">
                <Input type="month" {...register(`items.${index}.endDate`)} />
              </Field>
            </div>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" {...register(`items.${index}.current`)} className="accent-accent" />
            I currently work here
          </label>

          <BulletEditor control={control} register={register} expIndex={index} />
        </div>
      ))}

      <Button variant="outline" onClick={() => append(toForm([newExperience()]).items[0])}>
        <Plus className="h-4 w-4" /> Add position
      </Button>
    </div>
  );
}

function BulletEditor({
  control,
  register,
  expIndex,
}: {
  control: import("react-hook-form").Control<FormValues>;
  register: import("react-hook-form").UseFormRegister<FormValues>;
  expIndex: number;
}) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `items.${expIndex}.bullets`,
  });
  const { enhance, loading } = useEnhance();

  return (
    <div className="mt-4">
      <Label className="mb-2 block">Achievements</Label>
      <div className="space-y-2">
        {fields.map((b, bi) => (
          <div key={b.id} className="flex items-start gap-2">
            <span className="mt-2.5 text-ink/30">•</span>
            <Input
              className="flex-1"
              placeholder="Led migration that cut p95 latency by 40%"
              {...register(`items.${expIndex}.bullets.${bi}.text`)}
            />
            <Controller
              control={control}
              name={`items.${expIndex}.bullets.${bi}.text`}
              render={({ field }) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Improve bullet"
                  disabled={loading || !field.value?.trim()}
                  onClick={async () => {
                    const result = await enhance({ kind: "bullet", text: field.value });
                    if (result) update(bi, { id: b.id, text: result });
                  }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
                </Button>
              )}
            />
            <Button type="button" variant="ghost" size="icon" aria-label="Remove bullet" onClick={() => remove(bi)}>
              <Trash2 className="h-4 w-4 text-ink/40" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => append({ id: uid(), text: "" })}>
        <Plus className="h-3.5 w-3.5" /> Add bullet
      </Button>
    </div>
  );
}
