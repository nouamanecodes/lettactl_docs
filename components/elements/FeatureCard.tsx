import type React from "react"
import Link from "next/link"
import styles from "./FeatureCard.module.css"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  href,
}: FeatureCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  )
}
