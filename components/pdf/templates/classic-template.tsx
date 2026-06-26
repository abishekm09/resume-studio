import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/schemas/resume.schema";
import { dateRange, formatMonth } from "@/lib/utils";

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const s = StyleSheet.create({
    page: { paddingTop: 40, paddingBottom: 40, paddingHorizontal: 54, fontFamily: "Times-Roman", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.35 },
    header: { textAlign: "center", marginBottom: 6 },
    name: { fontSize: 20, fontFamily: "Times-Bold", letterSpacing: 1 },
    contact: { fontSize: 9, marginTop: 4, color: "#333" },
    link: { color: "#1a1a1a", textDecoration: "none" },
    sectionTitle: { fontSize: 11, fontFamily: "Times-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 13, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 2 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Times-Bold" },
    italic: { fontFamily: "Times-Italic" },
    muted: { color: "#444" },
    item: { marginBottom: 7 },
    bullet: { flexDirection: "row", marginTop: 1.5, paddingLeft: 8 },
  });

  const p = data.personalInfo;
  const contactBits = [p.email, p.phone, p.location].filter(Boolean).join("  |  ");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{p.fullName || "Your Name"}</Text>
          {p.headline ? <Text style={s.italic}>{p.headline}</Text> : null}
          {contactBits ? <Text style={s.contact}>{contactBits}</Text> : null}
          <View style={[s.contact, { flexDirection: "row", justifyContent: "center", gap: 10 }]}>
            {p.linkedin ? <Link style={s.link} src={p.linkedin}>LinkedIn</Link> : null}
            {p.github ? <Link style={s.link} src={p.github}>GitHub</Link> : null}
            {p.portfolio ? <Link style={s.link} src={p.portfolio}>Portfolio</Link> : null}
          </View>
        </View>

        {data.summary ? (
          <>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text>{data.summary}</Text>
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
                <Text style={s.italic}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}{ed.gpa ? ` — GPA ${ed.gpa}` : ""}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.experience.length ? (
          <>
            <Text style={s.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.bold}>{e.company}</Text>
                  <Text style={s.muted}>{dateRange(e.startDate, e.endDate, e.current)}</Text>
                </View>
                <Text style={s.italic}>{e.role}{e.location ? `, ${e.location}` : ""}</Text>
                {e.bullets.map((b, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={{ width: 10 }}>•</Text>
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
                {pr.technologies.length ? <Text style={s.italic}>{pr.technologies.join(", ")}</Text> : null}
                {pr.description ? <Text>{pr.description}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        {data.skills.some((g) => g.skills.length) ? (
          <>
            <Text style={s.sectionTitle}>Skills</Text>
            {data.skills.filter((g) => g.skills.length).map((g) => (
              <Text key={g.id}><Text style={s.bold}>{g.category}: </Text>{g.skills.join(", ")}</Text>
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
            <Text>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</Text>
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
                {it.subheading ? <Text style={s.italic}>{it.subheading}</Text> : null}
                {it.description ? <Text>{it.description}</Text> : null}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
