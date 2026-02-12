import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { commandGroups, groupSlugs } from "@/content/commands"
import styles from "../shared/index-page.module.css"
import local from "./page.module.css"

export const metadata: Metadata = {
  title: "Commands | lettactl",
  description: "Complete CLI command reference for lettactl.",
}

export default function CommandsIndexPage() {
  return (
    <>
      <h1 className={styles.title}>Commands</h1>
      <p className={styles.intro}>
        Complete CLI reference, organized by workflow.
      </p>

      <div className={local.overview}>
        <Image
          src="/assets/main.png"
          alt="lettactl command overview"
          width={1100}
          height={860}
        />
      </div>

      <div className={styles.grid}>
        {groupSlugs.map((slug) => {
          const group = commandGroups[slug]
          return (
            <Link
              key={slug}
              href={`/commands/${slug}`}
              className={styles.card}
            >
              <div className={styles.cardTitle}>
                {group.groupTitle}
              </div>
              <div className={styles.cardDesc}>
                {group.groupDescription}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
