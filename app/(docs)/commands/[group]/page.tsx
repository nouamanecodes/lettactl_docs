import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { commandGroups, groupSlugs } from "@/content/commands"
import CommandSignature from "@/components/elements/CommandSignature"
import styles from "./page.module.css"

export function generateStaticParams() {
  return groupSlugs.map((group) => ({ group }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>
}): Promise<Metadata> {
  const { group: slug } = await params
  const group = commandGroups[slug]
  if (!group) return {}
  return {
    title: `${group.groupTitle} Commands | lettactl`,
    description: group.groupDescription,
  }
}

export default async function CommandGroupPage({
  params,
}: {
  params: Promise<{ group: string }>
}) {
  const { group: slug } = await params
  const group = commandGroups[slug]
  if (!group) notFound()

  return (
    <>
      <h1 className={styles.title}>{group.groupTitle}</h1>
      <p className={styles.description}>
        {group.groupDescription}
      </p>

      {group.commands.map((cmd) => (
        <CommandSignature key={cmd.name} command={cmd} />
      ))}
    </>
  )
}
