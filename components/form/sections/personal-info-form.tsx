"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfo } from "@/lib/schemas/resume.schema";
import { useResumeStore } from "@/lib/store/resume-store";
import { useSyncToStore } from "@/hooks/use-sync-to-store";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export function PersonalInfoForm() {
  const initial = useResumeStore((s) => s.resume.personalInfo);
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initial,
    mode: "onBlur",
  });

  useSyncToStore(watch, (v) => setPersonalInfo(v));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <Input placeholder="Ada Lovelace" {...register("fullName")} />
        </Field>
        <Field label="Headline" error={errors.headline?.message}>
          <Input placeholder="Senior Backend Engineer" {...register("headline")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="ada@example.com" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input placeholder="+1 555 0100" {...register("phone")} />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input placeholder="Berlin, DE" {...register("location")} />
        </Field>
        <Field label="LinkedIn" error={errors.linkedin?.message}>
          <Input placeholder="https://linkedin.com/in/…" {...register("linkedin")} />
        </Field>
        <Field label="GitHub" error={errors.github?.message}>
          <Input placeholder="https://github.com/…" {...register("github")} />
        </Field>
        <Field label="Portfolio" error={errors.portfolio?.message}>
          <Input placeholder="https://…" {...register("portfolio")} />
        </Field>
      </div>
    </div>
  );
}
