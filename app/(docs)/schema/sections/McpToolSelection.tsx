import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function McpToolSelection() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>McpToolSelection</h2>
      <p className={styles.paragraph}>
        Select which tools from an MCP server an agent can use.
      </p>

      <CodeBlock
        code={`mcp_tools:
  # Specific tools only
  - server: firecrawl
    tools: ["scrape", "crawl"]

  # All tools from this server (default)
  - server: filesystem`}
        language="yaml"
        title="McpToolSelection examples"
      />
    </section>
  )
}
