import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/schemas/resume.schema";
import { dateRange, formatMonth } from "@/lib/utils";

export function MinimalistTemplate({ data }: { data: ResumeData }) {
  const accent = data.meta.accentColor || "#3D34D6";
  const s = StyleSheet.create({
    page: { paddingTop: 46, paddingBottom: 46, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 9.5, color: "#222", lineHeight: 1.5 },
    name: { fontSize: 18, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
    headline: { fontSize: 10, color: "#777", marginTop: 2 },
    contact: { fontSize: 8.5, color: "#888", marginTop: 5, flexDirection: "row", flexWrap: "wrap", gap: 10 },
    link: { color: accent, textDecoration: "none" },
    sectionTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#999", textTransform: "uppercase", letterSpacing: 2, marginTop: 18, marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    bold: { fontFamily: "Helvetica-Bold", color: "#111" },
    muted: { color: "#999", fontSize: 8.5 },
    item: { marginBottom: 9 },
    bullet: { flexDirection: "row", marginTop: 2 },
  });

  const p = data.personalInfo;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{p.fullName || "Your Name"}</Text>
        {p.headline ? <Text style={s.headline}>{p.headline}</Text> : null}
        <View style={s.contact}>
          {[p.email, p.phone, p.location].filter(Boolean).map((x, i) => <Text key={i}>{x}</Text>)}
          {p.linkedin ? <Link style={s.link} src={p.linkedin}>LinkedIn</Link> : null}
          {p.github ? <Link style={s.link} src={p.github}>GitHub</Link> : null}
          {p.portfolio ? <Link style={s.link} src={p.portfolio}>Portfolio</Link> : null}
        </View>

        {data.summary ? (
          <>
            <Text style={s.sectionTitle}>Profile</Text>
            <Text>{data.summary}</Text>
          </>
        ) : null}

        {data.experience.length ? (
          <>
            <Text style={s.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{e.role}</Text>
                  <Text style={s.muted}>{dateRange(e.startDate, e.endDate, e.current)}</Text>
                </View>
                <Text style={s.muted}>{e.company}{e.location ? ` — ${e.location}` : ""}</Text>
                {e.bullets.map((b, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={{ width: 10, color: accent }}>—</Text>
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
                <Text style={s.bold}>{pr.title}</Text>
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
              <Text key={g.id}><Text style={s.bold}>{g.category} — </Text>{g.skills.join(", ")}</Text>
            ))}
          </>
        ) : null}

        {data.education.length ? (
          <>
            <Text style={s.sectionTitle}>Education</Text>
            {data.education.map((ed) => (
              <View key={ed.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{ed.institution}</Text>
                  <Text style={s.muted}>{dateRange(ed.startDate, ed.endDate, ed.current)}</Text>
                </View>
                <Text style={s.muted}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.certifications.length ? (
          <>
            <Text style={s.sectionTitle}>Certifications</Text>
            {data.certifications.map((c) => (
              <Text key={c.id}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""} {c.date ? `(${formatMonth(c.date)})` : ""}</Text>
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
                  <Text style={s.bold}>{it.heading}</Text>
                  <Text style={s.muted}>{formatMonth(it.date)}</Text>
                </View>
                {it.subheading ? <Text style={s.muted}>{it.subheading}</Text> : null}
                {it.description ? <Text>{it.description}</Text> : null}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
