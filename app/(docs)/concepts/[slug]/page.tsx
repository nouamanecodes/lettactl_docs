import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CodeBlock from "@/components/elements/CodeBlock"
import { concepts, conceptSlugs } from "@/content/concepts"
import styles from "./page.module.css"

export function generateStaticParams() {
  return conceptSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const concept = concepts[slug]
  if (!concept) return {}
  return {
    title: `${concept.title} | lettactl`,
    description: concept.description,
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const concept = concepts[slug]
  if (!concept) notFound()

  return (
    <>
      <h1 className={styles.title}>{concept.title}</h1>
      <p className={styles.intro}>{concept.description}</p>

      {concept.sections.map((section) => (
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
