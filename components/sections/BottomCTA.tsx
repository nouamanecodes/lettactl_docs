import Link from "next/link"
import styles from "./BottomCTA.module.css"

export default function BottomCTA() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Ready to manage your fleet?</h2>
      <p className={styles.subtitle}>
        One YAML file. One command. Your entire agent fleet deployed.
      </p>
      <div className={styles.actions}>
        <Link href="/quickstart" className="button-primary">
          Quickstart
        </Link>
        <Link href="/commands" className="button-secondary">
          View Docs
        </Link>
      </div>
      <p className={styles.disclaimer}>
        lettactl is not a Letta product. It is an independent, open source tool
        built on top of the Letta ecosystem to provide easy fleet management on
        either self-hosted or Letta Cloud instances.
      </p>
    </section>
  )
}
