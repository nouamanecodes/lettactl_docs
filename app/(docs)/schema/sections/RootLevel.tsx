import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function RootLevel() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Root Level</h2>
      <p className={styles.paragraph}>
        The top-level keys in your{" "}
        <code className={styles.inlineCode}>fleet.yaml</code> file:
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
              <code className={styles.inlineCode}>agents</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>AgentConfig[]</span></td>
            <td>Array of agent definitions. Must have at least one.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>shared_blocks</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>SharedBlock[]</span></td>
            <td>Memory blocks shared across multiple agents.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>shared_folders</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>SharedFolder[]</span></td>
            <td>Folders (file collections) shared across agents.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>mcp_servers</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>McpServer[]</span></td>
            <td>Model Context Protocol server definitions.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>root_path</code>{" "}
              <span className={styles.optional}>optional</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>
              Base directory for resolving relative file paths. Defaults to
              the config file&apos;s directory.
            </td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`root_path: ./my-fleet
shared_blocks:
  - name: company_guidelines
    description: "Shared operational guidelines"
    limit: 5000
    from_file: "guidelines.md"

shared_folders:
  - name: brand_docs
    files:
      - "docs/*.md"

mcp_servers:
  - name: firecrawl
    type: sse
    server_url: "https://sse.firecrawl.dev"

agents:
  - name: my-agent
    # ... (see AgentConfig below)`}
        language="yaml"
        title="Root structure"
      />
    </section>
  )
}
