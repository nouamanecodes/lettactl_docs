import type React from "react"
import styles from "./SectionContainer.module.css"

export default function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`${styles.section} ${className || ""}`}
    >
      {children}
    </section>
  )
}
