import type { Metadata } from "next"
import Link from "next/link"
import { concepts, conceptSlugs } from "@/content/concepts"
import styles from "../shared/index-page.module.css"

export const metadata: Metadata = {
  title: "Concepts | lettactl",
  description:
    "Core concepts behind lettactl: declarative config, resource types, and the diff engine.",
}

export default function ConceptsPage() {
  return (
    <>
      <h1 className={styles.title}>Concepts</h1>
      <p className={styles.intro}>
        Core concepts behind lettactl fleet management.
      </p>

      <div className={styles.grid}>
        {conceptSlugs.map((slug) => {
          const concept = concepts[slug]
          return (
            <Link
              key={slug}
              href={`/concepts/${slug}`}
              className={styles.card}
            >
              <div className={styles.cardTitle}>{concept.title}</div>
              <div className={styles.cardDesc}>{concept.description}</div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
