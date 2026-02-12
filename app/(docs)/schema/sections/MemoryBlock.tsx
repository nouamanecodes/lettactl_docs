import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function MemoryBlock() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>MemoryBlock</h2>
      <p className={styles.paragraph}>
        Memory blocks give agents persistent, structured memory. Each block is a
        named text buffer the agent can read and (if{" "}
        <code className={styles.inlineCode}>agent_owned</code>) write to.
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
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Human-readable description.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>limit</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>integer</span></td>
            <td>Max character limit. Must be a positive integer.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>agent_owned</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>boolean</span></td>
            <td>
              <code className={styles.inlineCode}>true</code>: agent can
              modify this block, YAML won&apos;t overwrite it on apply.{" "}
              <code className={styles.inlineCode}>false</code>: YAML syncs
              content on every apply.
            </td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>value</code> /{" "}
              <code className={styles.inlineCode}>from_file</code> /{" "}
              <code className={styles.inlineCode}>from_bucket</code>
            </td>
            <td><span className={styles.type}>string / string / FromBucket</span></td>
            <td>
              Content source. Exactly one required. Falls back to{" "}
              <code className={styles.inlineCode}>memory-blocks/&#123;name&#125;.md</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>version</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>User-defined version tag (e.g., &quot;1.0.0&quot;).</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`memory_blocks:
  # Agent can modify this block — YAML won't overwrite
  - name: user_preferences
    description: "What I know about the user"
    limit: 5000
    value: "No preferences yet."
    agent_owned: true

  # YAML controls this block — syncs on every apply
  - name: brand_guidelines
    description: "Brand voice and visual identity"
    limit: 3000
    from_file: "brand/guidelines.md"
    agent_owned: false
    version: "2.1.0"`}
        language="yaml"
        title="MemoryBlock examples"
      />
    </section>
  )
}
