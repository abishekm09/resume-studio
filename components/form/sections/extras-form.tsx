"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useResumeStore,
  newCertification,
  newLanguage,
  newCustomSection,
} from "@/lib/store/resume-store";
import { uid } from "@/lib/utils";
import type { Certification, Language, CustomSection } from "@/lib/schemas/resume.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

const PROFICIENCY: Language["proficiency"][] = [
  "Basic",
  "Conversational",
  "Professional",
  "Fluent",
  "Native",
];

export function ExtrasForm() {
  const { certifications, languages, customSections } = useResumeStore((s) => s.resume);
  const setCertifications = useResumeStore((s) => s.setCertifications);
  const setLanguages = useResumeStore((s) => s.setLanguages);
  const setCustomSections = useResumeStore((s) => s.setCustomSections);

  function patchCert(id: string, p: Partial<Certification>) {
    setCertifications(certifications.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }
  function patchLang(id: string, p: Partial<Language>) {
    setLanguages(languages.map((l) => (l.id === id ? { ...l, ...p } : l)));
  }
  function patchSection(id: string, p: Partial<CustomSection>) {
    setCustomSections(customSections.map((s) => (s.id === id ? { ...s, ...p } : s)));
  }

  return (
    <div className="space-y-8">
      {/* Certifications */}
      <section>
        <h3 className="mb-3 font-display text-lg">Certifications</h3>
        <div className="space-y-3">
          {certifications.map((c) => (
            <div key={c.id} className="grid grid-cols-1 gap-2 rounded-lg border border-ink/10 bg-paper/50 p-3 sm:grid-cols-[1fr_1fr_140px_auto]">
              <Input placeholder="Certification" value={c.name} onChange={(e) => patchCert(c.id, { name: e.target.value })} />
              <Input placeholder="Issuer" value={c.issuer} onChange={(e) => patchCert(c.id, { issuer: e.target.value })} />
              <Input type="month" value={c.date} onChange={(e) => patchCert(c.id, { date: e.target.value })} />
              <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setCertifications(certifications.filter((x) => x.id !== c.id))}>
                <Trash2 className="h-4 w-4 text-clay" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCertifications([...certifications, newCertification()])}>
            <Plus className="h-4 w-4" /> Add certification
          </Button>
        </div>
      </section>

      {/* Languages */}
      <section>
        <h3 className="mb-3 font-display text-lg">Languages</h3>
        <div className="space-y-3">
          {languages.map((l) => (
            <div key={l.id} className="grid grid-cols-1 gap-2 rounded-lg border border-ink/10 bg-paper/50 p-3 sm:grid-cols-[1fr_200px_auto]">
              <Input placeholder="Language" value={l.name} onChange={(e) => patchLang(l.id, { name: e.target.value })} />
              <select
                className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm"
                value={l.proficiency}
                onChange={(e) => patchLang(l.id, { proficiency: e.target.value as Language["proficiency"] })}
              >
                {PROFICIENCY.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setLanguages(languages.filter((x) => x.id !== l.id))}>
                <Trash2 className="h-4 w-4 text-clay" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setLanguages([...languages, newLanguage()])}>
            <Plus className="h-4 w-4" /> Add language
          </Button>
        </div>
      </section>

      {/* Custom sections */}
      <section>
        <h3 className="mb-3 font-display text-lg">Custom sections</h3>
        <div className="space-y-4">
          {customSections.map((sec) => (
            <div key={sec.id} className="rounded-xl border border-ink/10 bg-paper/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Input
                  className="max-w-xs font-medium"
                  placeholder="Section title (e.g. Awards)"
                  value={sec.title}
                  onChange={(e) => patchSection(sec.id, { title: e.target.value })}
                />
                <Button variant="ghost" size="icon" className="ml-auto" aria-label="Remove section"
                  onClick={() => setCustomSections(customSections.filter((x) => x.id !== sec.id))}>
                  <Trash2 className="h-4 w-4 text-clay" />
                </Button>
              </div>
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-ink/10 bg-white p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <Input placeholder="Heading" value={item.heading}
                        onChange={(e) => patchSection(sec.id, { items: sec.items.map((it) => it.id === item.id ? { ...it, heading: e.target.value } : it) })} />
                      <Input placeholder="Subheading" value={item.subheading}
                        onChange={(e) => patchSection(sec.id, { items: sec.items.map((it) => it.id === item.id ? { ...it, subheading: e.target.value } : it) })} />
                      <Input type="month" value={item.date}
                        onChange={(e) => patchSection(sec.id, { items: sec.items.map((it) => it.id === item.id ? { ...it, date: e.target.value } : it) })} />
                    </div>
                    <Textarea className="mt-2" rows={2} placeholder="Description" value={item.description}
                      onChange={(e) => patchSection(sec.id, { items: sec.items.map((it) => it.id === item.id ? { ...it, description: e.target.value } : it) })} />
                  </div>
                ))}
                <Button variant="ghost" size="sm"
                  onClick={() => patchSection(sec.id, { items: [...sec.items, { id: uid(), heading: "", subheading: "", date: "", description: "" }] })}>
                  <Plus className="h-3.5 w-3.5" /> Add item
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCustomSections([...customSections, newCustomSection()])}>
            <Plus className="h-4 w-4" /> Add custom section
          </Button>
        </div>
      </section>
    </div>
  );
}
