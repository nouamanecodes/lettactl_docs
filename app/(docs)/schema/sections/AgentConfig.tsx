import styles from "../page.module.css"

export default function AgentConfig() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>AgentConfig</h2>
      <p className={styles.paragraph}>
        Each agent is a stateful Letta AI agent with its own memory, tools,
        and configuration.
      </p>

      <h3 className={styles.subsectionTitle}>Required Fields</h3>
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
            <td><code className={styles.inlineCode}>name</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>
              Unique agent identifier. Must match{" "}
              <code className={styles.inlineCode}>^[a-zA-Z0-9_-]+$</code>.
              Cannot use reserved words:{" "}
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
            <td><code className={styles.inlineCode}>description</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>Human-readable description of the agent&apos;s purpose.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>llm_config</code></td>
            <td><span className={styles.type}>LLMConfig</span></td>
            <td>Model and context window settings.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>system_prompt</code></td>
            <td><span className={styles.type}>PromptConfig</span></td>
            <td>The agent&apos;s system instructions.</td>
          </tr>
        </tbody>
      </table>

      <h3 className={styles.subsectionTitle}>Optional Fields</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className={styles.inlineCode}>embedding</code></td>
            <td><span className={styles.type}>string</span></td>
            <td><code className={styles.inlineCode}>openai/text-embedding-3-small</code></td>
            <td>Embedding model for vector operations.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>embedding_config</code></td>
            <td><span className={styles.type}>object</span></td>
            <td>&mdash;</td>
            <td>Additional embedding model settings.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>reasoning</code></td>
            <td><span className={styles.type}>boolean</span></td>
            <td><code className={styles.inlineCode}>true</code></td>
            <td>Enable reasoning/chain-of-thought.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>first_message</code></td>
            <td><span className={styles.type}>string</span></td>
            <td>&mdash;</td>
            <td>Message sent on first creation for calibration.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>tools</code></td>
            <td><span className={styles.type}>(string | ToolObject)[]</span></td>
            <td>&mdash;</td>
            <td>Tool names, configs, or glob patterns.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>mcp_tools</code></td>
            <td><span className={styles.type}>McpToolSelection[]</span></td>
            <td>&mdash;</td>
            <td>Tools provided by MCP servers.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>memory_blocks</code></td>
            <td><span className={styles.type}>MemoryBlock[]</span></td>
            <td>&mdash;</td>
            <td>Agent-specific memory blocks.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>archives</code></td>
            <td><span className={styles.type}>ArchiveConfig[]</span></td>
            <td>&mdash;</td>
            <td>Archival memory storage. Max 1 per agent.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>folders</code></td>
            <td><span className={styles.type}>FolderConfig[]</span></td>
            <td>&mdash;</td>
            <td>Agent-specific file folders for RAG.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>shared_blocks</code></td>
            <td><span className={styles.type}>string[]</span></td>
            <td>&mdash;</td>
            <td>Names of shared blocks to attach.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>shared_folders</code></td>
            <td><span className={styles.type}>string[]</span></td>
            <td>&mdash;</td>
            <td>Names of shared folders to attach.</td>
          </tr>
          <tr>
            <td><code className={styles.inlineCode}>tags</code></td>
            <td><span className={styles.type}>string[]</span></td>
            <td>&mdash;</td>
            <td>
              Tags for multi-tenancy and filtering. Format:{" "}
              <code className={styles.inlineCode}>key:value</code>.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
