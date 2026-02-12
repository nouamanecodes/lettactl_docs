import Link from "next/link"
import CopyButton from "@/components/elements/CopyButton"
import styles from "./Hero.module.css"

const INSTALL_CMD = "npx lettactl apply -f fleet.yaml"

export default function Hero() {
  return (
    <section className={styles.hero}>
      <span className={styles.badge}>Open Source CLI + SDK ❤️ Letta</span>

      <h1 className={styles.headline}>
        <span className={styles.accent}>kubectl</span> for Stateful
        AI Agent Fleets
      </h1>

      <p className={styles.subtitle}>
        Declarative YAML. Per-agent memory powered by Letta.
        Git-native versioning. Canary deployments. One command
        to deploy your entire fleet.
      </p>

      <div className={styles.install}>
        <span className={styles.installText}>
          <span className={styles.prompt}>$</span>{" "}
          {INSTALL_CMD}
        </span>
        <CopyButton text={INSTALL_CMD} />
      </div>

      <div className={styles.actions}>
        <Link href="/quickstart" className="button-primary">
          Quickstart
        </Link>
        <Link href="/commands" className="button-secondary">
          View Docs
        </Link>
      </div>

      <a
        href="https://docs.letta.com/guides/community/lettactl/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.communityLink}
      >
        Official community tool — featured in Letta docs →
      </a>
    </section>
  )
}
