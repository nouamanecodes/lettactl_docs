import { commandGroups } from "@/content/commands"
import { guides } from "@/content/guides"
import { concepts } from "@/content/concepts"

export interface SearchEntry {
  title: string
  category: "Commands" | "Guides" | "Concepts"
  parentTitle?: string
  href: string
  content: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  // Index commands — each command + each flag as a separate entry
  for (const [groupSlug, group] of Object.entries(commandGroups)) {
    for (const cmd of group.commands) {
      entries.push({
        title: cmd.name,
        category: "Commands",
        parentTitle: group.groupTitle,
        href: `/commands/${groupSlug}`,
        content: `${cmd.description} ${cmd.usage} ${cmd.flags.map(f => `${f.flag} ${f.description}`).join(" ")} ${cmd.examples.map(e => `${e.title} ${e.code}`).join(" ")}`,
      })
    }
  }

  // Index guides — each section as a separate entry
  for (const [slug, guide] of Object.entries(guides)) {
    // Page-level entry
    entries.push({
      title: guide.title,
      category: "Guides",
      href: `/guides/${slug}`,
      content: guide.description,
    })

    // Section-level entries
    for (const section of guide.sections) {
      entries.push({
        title: section.heading,
        category: "Guides",
        parentTitle: guide.title,
        href: `/guides/${slug}#${slugify(section.heading)}`,
        content: `${section.content} ${section.code?.code || ""}`,
      })
    }
  }

  // Index concepts — each section as a separate entry
  for (const [slug, concept] of Object.entries(concepts)) {
    entries.push({
      title: concept.title,
      category: "Concepts",
      href: `/concepts/${slug}`,
      content: concept.description,
    })

    for (const section of concept.sections) {
      entries.push({
        title: section.heading,
        category: "Concepts",
        parentTitle: concept.title,
        href: `/concepts/${slug}#${slugify(section.heading)}`,
        content: `${section.content} ${section.code?.code || ""}`,
      })
    }
  }

  return entries
}
