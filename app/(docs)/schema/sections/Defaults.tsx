import styles from "../page.module.css"

export default function Defaults() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Defaults</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Default Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className={styles.inlineCode}>embedding</code></td>
            <td><code className={styles.inlineCode}>openai/text-embedding-3-small</code></td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>reasoning</code></td>
            <td><code className={styles.inlineCode}>true</code></td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>disable_base_prompt</code></td>
            <td><code className={styles.inlineCode}>false</code></td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>context_window</code></td>
            <td><code className={styles.inlineCode}>28000</code></td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>model</code></td>
            <td><code className={styles.inlineCode}>google_ai/gemini-2.5-pro</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
