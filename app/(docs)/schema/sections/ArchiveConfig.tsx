import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function ArchiveConfig() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>ArchiveConfig</h2>
      <p className={styles.paragraph}>
        Archives provide vector-searchable long-term memory. Max one per agent.
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code className={styles.inlineCode}>name</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Unique name within the agent.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>description</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Human-readable description.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>embedding</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Embedding model. Inherits from agent if not set.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>embedding_config</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>object</span></td>
            <td>Additional embedding settings.</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`archives:
  - name: knowledge_base
    description: "Long-term knowledge storage"
    embedding: "openai/text-embedding-3-small"`}
        language="yaml"
        title="ArchiveConfig example"
      />
    </section>
  )
}
