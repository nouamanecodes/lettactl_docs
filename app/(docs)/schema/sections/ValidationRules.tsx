import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function ValidationRules() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Validation Rules</h2>
      <p className={styles.paragraph}>
        lettactl validates your config before applying. Here are the rules:
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unique agent names</td>
            <td>No two agents can share a name.</td>
          </tr>
          <tr>
            <td>Unique block names</td>
            <td>Memory block names must be unique within an agent.</td>
          </tr>
          <tr>
            <td>Max 1 archive</td>
            <td>Each agent can have at most one archive.</td>
          </tr>
          <tr>
            <td>Single content source</td>
            <td>
              Prompts and blocks must use exactly one of{" "}
              <code className={styles.inlineCode}>value</code>,{" "}
              <code className={styles.inlineCode}>from_file</code>, or{" "}
              <code className={styles.inlineCode}>from_bucket</code>.
            </td>
          </tr>
          <tr>
            <td>Context window range</td>
            <td>Must be between 1,000 and 200,000 tokens.</td>
          </tr>
          <tr>
            <td>No unknown fields</td>
            <td>Strict validation — typos and unknown keys are rejected.</td>
          </tr>
          <tr>
            <td>No reserved names</td>
            <td>
              Agent names cannot be:{" "}
              <code className={styles.inlineCode}>agents</code>,{" "}
              <code className={styles.inlineCode}>blocks</code>,{" "}
              <code className={styles.inlineCode}>archives</code>,{" "}
              <code className={styles.inlineCode}>tools</code>,{" "}
              <code className={styles.inlineCode}>folders</code>,{" "}
              <code className={styles.inlineCode}>files</code>,{" "}
              <code className={styles.inlineCode}>mcp-servers</code>,{" "}
              <code className={styles.inlineCode}>archival</code>.
            </td>
          </tr>
          <tr>
            <td>Tags format</td>
            <td>Tags cannot contain commas. Non-empty strings.</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`# Always preview before applying
lettactl apply -f fleet.yaml --dry-run`}
        title="Validate your config"
      />
    </section>
  )
}
