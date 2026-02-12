import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function Folders() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Folders</h2>
      <p className={styles.paragraph}>
        Folders attach file collections to agents for RAG and context. Files
        can be local paths, glob patterns, or cloud storage references.
      </p>

      <CodeBlock
        code={`folders:
  - name: documentation
    files:
      # Local file
      - "docs/guide.md"

      # Glob pattern
      - "docs/*.txt"

      # Recursive glob
      - "knowledge/**/*.md"

      # Cloud storage
      - from_bucket:
          provider: supabase
          bucket: my-bucket
          path: "docs/important.pdf"

      # Cloud storage with glob
      - from_bucket:
          provider: supabase
          bucket: my-bucket
          path: "*.txt"`}
        language="yaml"
        title="Folders examples"
      />
    </section>
  )
}
