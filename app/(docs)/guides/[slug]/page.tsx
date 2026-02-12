import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CodeBlock from "@/components/elements/CodeBlock"
import { guides, guideSlugs } from "@/content/guides"
import styles from "./page.module.css"

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = guides[slug]
  if (!guide) return {}
  return {
    title: `${guide.title} | lettactl`,
    description: guide.description,
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = guides[slug]
  if (!guide) notFound()

  return (
    <>
      <h1 className={styles.title}>{guide.title}</h1>
      <p className={styles.intro}>{guide.description}</p>

      {guide.sections.map((section) => (
        <div key={section.heading}>
          <h2 className={styles.sectionTitle}>
            {section.heading}
          </h2>
          <p className={styles.paragraph}>{section.content}</p>
          {section.code && (
            /* @ts-expect-error Async Server Component */
            <CodeBlock
              code={section.code.code}
              language={section.code.language}
              title={section.code.title}
            />
          )}
        </div>
      ))}
    </>
  )
}
