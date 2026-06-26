import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/schemas/resume.schema";
import { dateRange, formatMonth } from "@/lib/utils";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const accent = data.meta.accentColor || "#3D34D6";
  const s = StyleSheet.create({
    page: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", lineHeight: 1.4 },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: accent },
    headline: { fontSize: 11, color: "#444", marginTop: 2 },
    contact: { fontSize: 8.5, color: "#555", marginTop: 6, flexDirection: "row", flexWrap: "wrap", gap: 8 },
    link: { color: accent, textDecoration: "none" },
    sectionTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5, marginTop: 14, borderBottomWidth: 1, borderBottomColor: "#e2e2e2", paddingBottom: 3 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: "#666" },
    item: { marginBottom: 8 },
    bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, color: accent },
    skillRow: { flexDirection: "row", marginBottom: 3 },
    skillCat: { width: 90, fontFamily: "Helvetica-Bold" },
  });

  const p = data.personalInfo;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{p.fullName || "Your Name"}</Text>
        {p.headline ? <Text style={s.headline}>{p.headline}</Text> : null}
        <View style={s.contact}>
          {p.email ? <Text>{p.email}</Text> : null}
          {p.phone ? <Text>{p.phone}</Text> : null}
          {p.location ? <Text>{p.location}</Text> : null}
          {p.linkedin ? <Link style={s.link} src={p.linkedin}>LinkedIn</Link> : null}
          {p.github ? <Link style={s.link} src={p.github}>GitHub</Link> : null}
          {p.portfolio ? <Link style={s.link} src={p.portfolio}>Portfolio</Link> : null}
        </View>

        {data.summary ? (
          <>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text>{data.summary}</Text>
          </>
        ) : null}

        {data.experience.length ? (
          <>
            <Text style={s.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{e.role}{e.company ? ` · ${e.company}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(e.startDate, e.endDate, e.current)}</Text>
                </View>
                {e.location ? <Text style={s.muted}>{e.location}</Text> : null}
                {e.bullets.map((b, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={{ flex: 1 }}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {data.projects.length ? (
          <>
            <Text style={s.sectionTitle}>Projects</Text>
            {data.projects.map((pr) => (
              <View key={pr.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{pr.title}</Text>
                  {pr.repoUrl ? <Link style={s.link} src={pr.repoUrl}>Repo</Link> : null}
                </View>
                {pr.technologies.length ? <Text style={s.muted}>{pr.technologies.join(" · ")}</Text> : null}
                {pr.description ? <Text>{pr.description}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        {data.skills.some((g) => g.skills.length) ? (
          <>
            <Text style={s.sectionTitle}>Skills</Text>
            {data.skills.filter((g) => g.skills.length).map((g) => (
              <View key={g.id} style={s.skillRow}>
                <Text style={s.skillCat}>{g.category}</Text>
                <Text style={{ flex: 1 }}>{g.skills.join(", ")}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.education.length ? (
          <>
            <Text style={s.sectionTitle}>Education</Text>
            {data.education.map((ed) => (
              <View key={ed.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(ed.startDate, ed.endDate, ed.current)}</Text>
                </View>
                <Text style={s.muted}>{ed.institution}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.certifications.length ? (
          <>
            <Text style={s.sectionTitle}>Certifications</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={s.row}>
                <Text>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</Text>
                <Text style={s.muted}>{formatMonth(c.date)}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.languages.length ? (
          <>
            <Text style={s.sectionTitle}>Languages</Text>
            <Text>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join("  ·  ")}</Text>
          </>
        ) : null}

        {data.customSections.map((sec) => (
          <View key={sec.id} wrap={false}>
            <Text style={s.sectionTitle}>{sec.title}</Text>
            {sec.items.map((it) => (
              <View key={it.id} style={s.item}>
                <View style={s.row}>
                  <Text style={s.bold}>{it.heading}{it.subheading ? ` · ${it.subheading}` : ""}</Text>
                  <Text style={s.muted}>{formatMonth(it.date)}</Text>
                </View>
                {it.description ? <Text>{it.description}</Text> : null}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
