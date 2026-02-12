import {
  ScrollText,
  ArrowLeftRight,
  FlaskConical,
  Network,
  DatabaseZap,
  Blocks,
} from "lucide-react"
import FeatureCard from "@/components/elements/FeatureCard"
import styles from "./QuickFeatures.module.css"

const features = [
  {
    icon: <ScrollText size={20} />,
    title: "Declarative YAML",
    description:
      "Define your entire agent fleet in version-controlled YAML. One file, one command, done.",
    href: "/schema",
  },
  {
    icon: <ArrowLeftRight size={20} />,
    title: "Smart Diff Engine",
    description:
      "Only changes what needs changing. Detects drift between your config and the server.",
    href: "/concepts/diff-engine",
  },
  {
    icon: <FlaskConical size={20} />,
    title: "Canary Deployments",
    description:
      "Test changes on isolated canary copies before promoting to production.",
    href: "/guides/canary-deployments",
  },
  {
    icon: <Network size={20} />,
    title: "Multi-Tenancy",
    description:
      "Tag-based filtering for B2B and B2B2C. Manage thousands of agents across tenants.",
    href: "/guides/multi-tenancy",
  },
  {
    icon: <DatabaseZap size={20} />,
    title: "Self-Diagnosis",
    description:
      "Agents analyze their own memory health. Detect stale data, redundancy, and missing knowledge automatically.",
    href: "/guides/self-diagnosis",
  },
  {
    icon: <Blocks size={20} />,
    title: "Programmatic SDK",
    description:
      "TypeScript SDK for dynamic agent creation. Build SaaS on top of Letta.",
    href: "/sdk",
  },
]

export default function QuickFeatures() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} href={feature.href} />
        ))}
      </div>
    </section>
  )
}
