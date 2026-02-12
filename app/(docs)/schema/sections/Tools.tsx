import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function Tools() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Tools</h2>
      <p className={styles.paragraph}>
        Tools extend what an agent can do. Reference built-in tools by name,
        custom tools by path, or auto-discover from a directory.
      </p>

      <CodeBlock
        code={`tools:
  # Built-in tool by name
  - archival_memory_insert
  - archival_memory_search

  # Custom tool from cloud storage
  - name: "web_search"
    from_bucket:
      provider: supabase
      bucket: tools
      path: "web_search.py"

  # Auto-discover all .py files in tools/ directory
  - "tools/*"`}
        language="yaml"
        title="Tools examples"
      />
    </section>
  )
}
