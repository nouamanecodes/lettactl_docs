import type { Metadata } from "next"
import CodeBlock from "@/components/elements/CodeBlock"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "YAML Schema | lettactl",
  description:
    "Complete YAML configuration schema reference for lettactl fleet configs.",
}

export default function SchemaPage() {
  return (
    <>
      <h1 className={styles.title}>YAML Schema</h1>
      <p className={styles.intro}>
        Complete configuration reference for fleet YAML files. Every field, every
        option, every constraint.
      </p>

      {/* ── ROOT LEVEL ── */}
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

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── AGENTS ── */}
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

      <hr className={styles.divider} />

      {/* ── LLM CONFIG ── */}
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

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── SYSTEM PROMPT ── */}
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

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── MEMORY BLOCKS ── */}
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

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── ARCHIVES ── */}
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

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`archives:
  - name: knowledge_base
    description: "Long-term knowledge storage"
    embedding: "openai/text-embedding-3-small"`}
        language="yaml"
        title="ArchiveConfig example"
      />

      <hr className={styles.divider} />

      {/* ── TOOLS ── */}
      <h2 className={styles.sectionTitle}>Tools</h2>
      <p className={styles.paragraph}>
        Tools extend what an agent can do. Reference built-in tools by name,
        custom tools by path, or auto-discover from a directory.
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`tools:
  # Built-in tool by name
  - archival_memory_insert
  - archival_memory_search

  # Custom tool from cloud storage
  - name: "web_search"
    from_bucket:
      provider: supabase
      bucket: tools
      path: "web_search.py"

  # Auto-discover all .py files in tools/ directory
  - "tools/*"`}
        language="yaml"
        title="Tools examples"
      />

      <hr className={styles.divider} />

      {/* ── MCP SERVERS ── */}
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

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── MCP TOOLS ── */}
      <h2 className={styles.sectionTitle}>McpToolSelection</h2>
      <p className={styles.paragraph}>
        Select which tools from an MCP server an agent can use.
      </p>

      {/* @ts-expect-error Async Server Component */}
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

      <hr className={styles.divider} />

      {/* ── FOLDERS ── */}
      <h2 className={styles.sectionTitle}>Folders</h2>
      <p className={styles.paragraph}>
        Folders attach file collections to agents for RAG and context. Files
        can be local paths, glob patterns, or cloud storage references.
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`folders:
  - name: documentation
    files:
      # Local file
      - "docs/guide.md"

      # Glob pattern
      - "docs/*.txt"

      # Recursive glob
      - "knowledge/**/*.md"

      # Cloud storage
      - from_bucket:
          provider: supabase
          bucket: my-bucket
          path: "docs/important.pdf"

      # Cloud storage with glob
      - from_bucket:
          provider: supabase
          bucket: my-bucket
          path: "*.txt"`}
        language="yaml"
        title="Folders examples"
      />

      <hr className={styles.divider} />

      {/* ── SHARED BLOCKS ── */}
      <h2 className={styles.sectionTitle}>SharedBlock</h2>
      <p className={styles.paragraph}>
        Shared blocks are memory blocks that multiple agents can reference.
        Define them at the root level, then attach by name.
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`# Define at root level
shared_blocks:
  - name: company_policies
    description: "Company-wide policies all agents must follow"
    limit: 5000
    from_file: "policies.md"

  - name: safety_guidelines
    description: "Safety and compliance rules"
    limit: 3000
    value: "Never generate fake testimonials..."

agents:
  - name: agent-a
    # ... config ...
    shared_blocks:
      - company_policies
      - safety_guidelines

  - name: agent-b
    # ... config ...
    shared_blocks:
      - company_policies`}
        language="yaml"
        title="SharedBlock usage"
      />

      <hr className={styles.divider} />

      {/* ── SHARED FOLDERS ── */}
      <h2 className={styles.sectionTitle}>SharedFolder</h2>
      <p className={styles.paragraph}>
        Like shared blocks, but for file collections.
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`shared_folders:
  - name: brand_assets
    files:
      - "brand/*.md"
      - from_bucket:
          provider: supabase
          bucket: assets
          path: "brand/*.pdf"

agents:
  - name: agent-a
    shared_folders:
      - brand_assets`}
        language="yaml"
        title="SharedFolder usage"
      />

      <hr className={styles.divider} />

      {/* ── FROM BUCKET ── */}
      <h2 className={styles.sectionTitle}>FromBucket</h2>
      <p className={styles.paragraph}>
        Cloud storage reference used by prompts, memory blocks, folders, and
        tools.
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
              <code className={styles.inlineCode}>provider</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>
              Storage provider. Currently only{" "}
              <code className={styles.inlineCode}>supabase</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>bucket</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Bucket name.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>path</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>File path or glob pattern.</td>
          </tr>
        </tbody>
      </table>

      <hr className={styles.divider} />

      {/* ── TAGS ── */}
      <h2 className={styles.sectionTitle}>Tags</h2>
      <p className={styles.paragraph}>
        Tags enable multi-tenancy and agent filtering.
        Use <code className={styles.inlineCode}>key:value</code> format.
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`agents:
  - name: support-agent
    tags:
      - "tenant:acme-corp"
      - "role:support"
      - "env:production"`}
        language="yaml"
        title="Tags example"
      />

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`# Filter by tag
lettactl get agents --tags "tenant:acme-corp"
lettactl get agents --tags "role:support,env:production"`}
        title="Filter by tags"
      />

      <hr className={styles.divider} />

      {/* ── DEFAULTS ── */}
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

      <hr className={styles.divider} />

      {/* ── FULL EXAMPLE ── */}
      <h2 className={styles.sectionTitle}>Complete Example</h2>
      <p className={styles.paragraph}>
        A fleet config using every available feature:
      </p>

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`root_path: ./fleet

# ── Shared Resources ──────────────────────────

shared_blocks:
  - name: company_policies
    description: "Company-wide operational policies"
    limit: 5000
    from_file: "policies/company.md"
    version: "2.0.0"

  - name: safety_guidelines
    description: "AI safety and compliance rules"
    limit: 3000
    value: |
      Never generate fake testimonials.
      Never impersonate real people.
      Always disclose AI-generated content.

shared_folders:
  - name: brand_intelligence
    files:
      - "brand/*.md"
      - from_bucket:
          provider: supabase
          bucket: docs
          path: "brand/*.pdf"

# ── MCP Servers ───────────────────────────────

mcp_servers:
  - name: firecrawl
    type: sse
    server_url: "https://sse.firecrawl.dev"
    auth_header: "Authorization"
    auth_token: "Bearer \${FIRECRAWL_API_KEY}"

  - name: filesystem
    type: stdio
    command: "npx"
    args: ["-y", "@anthropic/mcp-server-filesystem", "/tmp"]

# ── Agents ────────────────────────────────────

agents:
  - name: brand-researcher
    description: "Researches brands and builds customer profiles"
    tags:
      - "tenant:agency-123"
      - "role:research"

    llm_config:
      model: "google_ai/gemini-2.5-pro"
      context_window: 128000

    embedding: "openai/text-embedding-3-small"
    reasoning: true

    system_prompt:
      from_file: "prompts/researcher.md"
      disable_base_prompt: false

    first_message: "Initialize and confirm readiness."

    memory_blocks:
      - name: current_research
        description: "Active research findings"
        limit: 10000
        value: "No active research."
        agent_owned: true

      - name: research_methodology
        description: "How to conduct brand research"
        limit: 3000
        from_file: "docs/methodology.md"
        agent_owned: false
        version: "1.2.0"

    archives:
      - name: research_history
        description: "Past research findings"
        embedding: "openai/text-embedding-3-small"

    folders:
      - name: reference_docs
        files:
          - "reference/*.md"
          - "reference/**/*.txt"

    shared_blocks:
      - company_policies
      - safety_guidelines

    shared_folders:
      - brand_intelligence

    tools:
      - archival_memory_insert
      - archival_memory_search
      - "tools/*"

    mcp_tools:
      - server: firecrawl
        tools: ["scrape", "crawl"]

  - name: creative-director
    description: "Generates creative concepts and ad directions"
    tags:
      - "tenant:agency-123"
      - "role:creative"

    llm_config:
      model: "openai/gpt-4o"
      context_window: 128000

    system_prompt:
      from_file: "prompts/creative.md"

    memory_blocks:
      - name: brand_context
        description: "Current brand context and guidelines"
        limit: 8000
        value: "Awaiting brand assignment."
        agent_owned: true

      - name: creative_principles
        description: "Creative direction principles"
        limit: 2000
        from_file: "docs/creative-principles.md"
        agent_owned: false

    shared_blocks:
      - company_policies

    tools:
      - archival_memory_insert
      - archival_memory_search`}
        language="yaml"
        title="fleet.yaml — complete example"
      />

      <hr className={styles.divider} />

      {/* ── VALIDATION ── */}
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

      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`# Always preview before applying
lettactl apply -f fleet.yaml --dry-run`}
        title="Validate your config"
      />
    </>
  )
}
