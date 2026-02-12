import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function LLMConfig() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>LLMConfig</h2>
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
              <code className={styles.inlineCode}>model</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>
              Model identifier in{" "}
              <code className={styles.inlineCode}>provider/model-name</code>{" "}
              format.
            </td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>context_window</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>integer</span></td>
            <td>
              Context window size in tokens. Must be between 1,000 and 200,000.
            </td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`llm_config:
  model: "google_ai/gemini-2.5-pro"
  context_window: 128000`}
        language="yaml"
        title="LLMConfig example"
      />

      <div className={styles.note}>
        Common models:{" "}
        <code className={styles.inlineCode}>google_ai/gemini-2.5-pro</code>,{" "}
        <code className={styles.inlineCode}>google_ai/gemini-2.0-flash-lite</code>,{" "}
        <code className={styles.inlineCode}>openai/gpt-4o</code>,{" "}
        <code className={styles.inlineCode}>openai/gpt-4o-mini</code>
      </div>
    </section>
  )
}
