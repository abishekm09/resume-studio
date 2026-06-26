"use client";

import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resume-store";
import { uid } from "@/lib/utils";
import type { SkillGroup } from "@/lib/schemas/resume.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { Label } from "@/components/ui/label";

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills);
  const setSkills = useResumeStore((s) => s.setSkills);

  function update(id: string, patch: Partial<SkillGroup>) {
    setSkills(skills.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  return (
    <div className="space-y-4">
      {skills.map((group) => (
        <div key={group.id} className="rounded-xl border border-ink/10 bg-paper/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Label className="sr-only">Category</Label>
            <Input
              className="max-w-[220px] font-medium"
              value={group.category}
              onChange={(e) => update(group.id, { category: e.target.value })}
              placeholder="Category (e.g. Technical)"
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              aria-label="Remove category"
              onClick={() => setSkills(skills.filter((g) => g.id !== group.id))}
            >
              <Trash2 className="h-4 w-4 text-clay" />
            </Button>
          </div>
          <TagInput
            value={group.skills}
            onChange={(next) => update(group.id, { skills: next })}
            placeholder="Add a skill, press Enter"
          />
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => setSkills([...skills, { id: uid(), category: "", skills: [] }])}
      >
        <Plus className="h-4 w-4" /> Add category
      </Button>
    </div>
  );
}
