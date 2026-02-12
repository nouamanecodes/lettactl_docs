import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function PromptConfig() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>PromptConfig</h2>
      <p className={styles.paragraph}>
        The agent&apos;s system instructions. Provide content via exactly one
        source:
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
            <td><code className={styles.inlineCode}>value</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Inline prompt text.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>from_file</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Path to a prompt file (relative to root_path).</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>from_bucket</code></td>
            <td><span className={styles.type}>FromBucket</span></td>
            <td>Load from cloud storage.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>disable_base_prompt</code></td>
            <td><span className={styles.type}>boolean</span></td>
            <td>
              Skip Letta base instructions. Default:{" "}
              <code className={styles.inlineCode}>false</code>.
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.note}>
        Must provide exactly one of{" "}
        <code className={styles.inlineCode}>value</code>,{" "}
        <code className={styles.inlineCode}>from_file</code>, or{" "}
        <code className={styles.inlineCode}>from_bucket</code>. If none
        specified, falls back to{" "}
        <code className={styles.inlineCode}>config/base-letta-system.md</code>.
      </div>

      <CodeBlock
        code={`# Inline
system_prompt:
  value: "You are a helpful assistant."

# From file
system_prompt:
  from_file: "prompts/system.md"

# From cloud storage
system_prompt:
  from_bucket:
    provider: supabase
    bucket: my-bucket
    path: "prompts/system.md"

# Skip Letta base instructions
system_prompt:
  from_file: "prompts/custom.md"
  disable_base_prompt: true`}
        language="yaml"
        title="PromptConfig examples"
      />
    </section>
  )
}
