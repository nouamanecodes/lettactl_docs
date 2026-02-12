import Link from "next/link"
import styles from "./not-found.module.css"

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>404</div>
      <p className={styles.message}>Page not found.</p>
      <Link href="/" className={styles.link}>
        Back to home
      </Link>
    </div>
  )
}
