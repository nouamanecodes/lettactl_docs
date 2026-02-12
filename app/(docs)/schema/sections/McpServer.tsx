import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function McpServer() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>McpServer</h2>
      <p className={styles.paragraph}>
        Model Context Protocol servers provide tools to agents via external
        services.
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
            <td>Unique server identifier.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>type</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>
              <code className={styles.inlineCode}>sse</code>,{" "}
              <code className={styles.inlineCode}>stdio</code>, or{" "}
              <code className={styles.inlineCode}>streamable_http</code>.
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className={styles.subsectionTitle}>SSE / Streamable HTTP</h3>
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
            <td><code className={styles.inlineCode}>server_url</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Server endpoint URL.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>auth_header</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Custom auth header name.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>auth_token</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Auth token value. Supports <code className={styles.inlineCode}>$&#123;ENV_VAR&#125;</code> expansion.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>custom_headers</code></td>
            <td><span className={styles.type}>Record&lt;string, string&gt;</span></td>
            <td>Additional headers.</td>
          </tr>
        </tbody>
      </table>

      <h3 className={styles.subsectionTitle}>Stdio</h3>
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
            <td><code className={styles.inlineCode}>command</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Command to execute.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>args</code></td>
            <td><span className={styles.type}>string[]</span></td>
            <td>Command arguments.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>env</code></td>
            <td><span className={styles.type}>Record&lt;string, string&gt;</span></td>
            <td>Environment variables.</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        code={`mcp_servers:
  # SSE server
  - name: firecrawl
    type: sse
    server_url: "https://sse.firecrawl.dev"
    auth_header: "Authorization"
    auth_token: "Bearer \${FIRECRAWL_API_KEY}"

  # Stdio server
  - name: filesystem
    type: stdio
    command: "npx"
    args: ["-y", "@anthropic/mcp-server-filesystem", "/tmp"]

  # Streamable HTTP
  - name: custom-api
    type: streamable_http
    server_url: "https://api.example.com/mcp"
    custom_headers:
      X-Api-Version: "2"`}
        language="yaml"
        title="McpServer examples"
      />
    </section>
  )
}
