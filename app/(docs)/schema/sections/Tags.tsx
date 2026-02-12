import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function Tags() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Tags</h2>
      <p className={styles.paragraph}>
        Tags enable multi-tenancy and agent filtering.
        Use <code className={styles.inlineCode}>key:value</code> format.
      </p>

      <CodeBlock
        code={`agents:
  - name: support-agent
    tags:
      - "tenant:acme-corp"
      - "role:support"
      - "env:production"`}
        language="yaml"
        title="Tags example"
      />

      <CodeBlock
        code={`# Filter by tag
lettactl get agents --tags "tenant:acme-corp"
lettactl get agents --tags "role:support,env:production"`}
        title="Filter by tags"
      />
    </section>
  )
}
