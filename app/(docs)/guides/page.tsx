import type { Metadata } from "next"
import Link from "next/link"
import { guides, guideSlugs } from "@/content/guides"
import styles from "../shared/index-page.module.css"

export const metadata: Metadata = {
  title: "Guides | lettactl",
  description:
    "Step-by-step guides for canary deployments, multi-tenancy, self-diagnosis, and more.",
}

export default function GuidesPage() {
  return (
    <>
      <h1 className={styles.title}>Guides</h1>
      <p className={styles.intro}>
        Step-by-step guides for common workflows.
      </p>

      <div className={styles.grid}>
        {guideSlugs.map((slug) => {
          const guide = guides[slug]
          return (
            <Link
              key={slug}
              href={`/guides/${slug}`}
              className={styles.card}
            >
              <div className={styles.cardTitle}>{guide.title}</div>
              <div className={styles.cardDesc}>{guide.description}</div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
