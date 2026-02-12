import Image from "next/image"
import styles from "./DemoShowcase.module.css"

export default function DemoShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.demoWrapper}>
          <Image
            src="/assets/lettactl_demo.gif"
            alt="lettactl CLI demo"
            width={1280}
            height={720}
            unoptimized
          />
        </div>

      </div>
    </section>
  )
}
