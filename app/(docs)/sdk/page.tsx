import type { Metadata } from "next"
import CodeBlock from "@/components/elements/CodeBlock"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "SDK Reference | lettactl",
  description:
    "TypeScript SDK for programmatic agent fleet management with lettactl.",
}

export default function SdkPage() {
  return (
    <>
      <h1 className={styles.title}>SDK Reference</h1>
      <p className={styles.intro}>
        Programmatic TypeScript API for deploying and managing
        Letta agent fleets. Use the SDK when you need dynamic
        agent creation — multi-tenant SaaS, CI/CD pipelines,
        or runtime fleet orchestration.
      </p>

      <h2 className={styles.sectionTitle}>Installation</h2>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock code="npm install lettactl" title="Install" />

      <h2 className={styles.sectionTitle}>Quick Start</h2>
      <p className={styles.paragraph}>
        Initialize the client pointing at your Letta server,
        build a fleet config, and deploy:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`import { LettaCtl } from "lettactl"

const lettactl = new LettaCtl({
  lettaBaseUrl: "http://localhost:8283",
})

const config = lettactl.createFleetConfig()
  .addSharedBlock({
    name: "company-kb",
    description: "Company knowledge base",
    limit: 5000,
    from_file: "memory/kb.md",
  })
  .addAgent({
    name: "support-agent",
    description: "Customer support AI",
    system_prompt: { from_file: "prompts/support.md" },
    llm_config: {
      model: "google_ai/gemini-2.5-pro",
      context_window: 32000,
    },
    shared_blocks: ["company-kb"],
    memory_blocks: [{
      name: "customer_data",
      description: "Per-customer context",
      agent_owned: true,
      limit: 5000,
    }],
  })
  .build()

const result = await lettactl.deployFleet(config)
console.log(result.created) // ["support-agent"]`}
        language="typescript"
        title="Quick start"
      />

      <h2 className={styles.sectionTitle}>LettaCtl</h2>
      <p className={styles.paragraph}>
        Main class. All fleet operations go through this.
      </p>

      <h3 className={styles.sectionTitle}>Constructor</h3>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`interface LettaCtlOptions {
  lettaBaseUrl?: string        // Letta server URL
  lettaApiKey?: string         // API key for Letta Cloud
  supabaseUrl?: string         // Supabase project URL
  supabaseAnonKey?: string     // Supabase anon key
  supabaseServiceRoleKey?: string
  root?: string                // Root dir (defaults to cwd)
}

const lettactl = new LettaCtl(options?: LettaCtlOptions)`}
        language="typescript"
        title="LettaCtl constructor"
      />

      <h3 className={styles.sectionTitle}>
        deployFleet(config, options?)
      </h3>
      <p className={styles.paragraph}>
        Deploy a fleet from a typed config object. Returns
        which agents were created, updated, or unchanged.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`const result = await lettactl.deployFleet(config, {
  dryRun: true,          // Preview without applying
  agentPattern: "support-*",  // Only deploy matching agents
  match: "tags:team=support", // Filter by tags
})

// DeployResult
interface DeployResult {
  agents: Record<string, string>  // name → letta_agent_id
  created: string[]
  updated: string[]
  unchanged: string[]
}`}
        language="typescript"
        title="deployFleet"
      />

      <h3 className={styles.sectionTitle}>
        deployFromYaml(path, options?)
      </h3>
      <p className={styles.paragraph}>
        Deploy directly from a YAML file. Same options as
        deployFleet.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`const result = await lettactl.deployFromYaml(
  "./fleet.yaml",
  { dryRun: false, rootPath: "./config" }
)

// Also available:
await lettactl.deployFromYamlString(yamlContent, options)`}
        language="typescript"
        title="deployFromYaml"
      />

      <h3 className={styles.sectionTitle}>
        sendMessage(agentId, message, options?)
      </h3>
      <p className={styles.paragraph}>
        Send a message to an agent and get the run handle back.
        Supports callbacks for async completion.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`const run = await lettactl.sendMessage(
  "agent-id",
  "Hello, how can you help?",
  {
    onComplete: (run) => console.log("Done:", run.id),
    onError: (err) => console.error("Failed:", err),
    timeout: 30,  // seconds
  }
)

// Poll for completion
const completed = await lettactl.waitForRun(run.id, {
  timeout: 300,
})

interface Run {
  id: string
  status: "created" | "running" | "completed" | "failed"
  agent_id: string
  created_at: string
  completed_at?: string
  stop_reason?: string
}`}
        language="typescript"
        title="sendMessage"
      />

      <h3 className={styles.sectionTitle}>
        deleteAgent(name)
      </h3>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`await lettactl.deleteAgent("support-agent")`}
        language="typescript"
        title="deleteAgent"
      />

      <h2 className={styles.sectionTitle}>FleetConfigBuilder</h2>
      <p className={styles.paragraph}>
        Fluent builder for constructing fleet configs
        programmatically. All methods return{" "}
        <code className={styles.inlineCode}>this</code> for
        chaining.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`const config = lettactl.createFleetConfig()
  .addSharedBlock({
    name: "brand-voice",
    description: "Brand guidelines",
    limit: 5000,
    from_file: "memory/brand.md",
  })
  .addSharedFolder({
    name: "knowledge",
    files: [
      "docs/faq.md",
      "docs/policies.md",
      { from_bucket: {
        provider: "supabase",
        bucket: "docs",
        path: "handbook/",
      }},
    ],
  })
  .addAgent({
    name: "support-agent",
    description: "Tier 1 support",
    tags: ["team:support", "tier:production"],
    system_prompt: { from_file: "prompts/support.md" },
    llm_config: {
      model: "google_ai/gemini-2.5-pro",
      context_window: 32000,
    },
    shared_blocks: ["brand-voice"],
    shared_folders: ["knowledge"],
    memory_blocks: [{
      name: "customer_data",
      description: "Customer context",
      agent_owned: true,
      limit: 5000,
    }],
    tools: [
      "archival_memory_search",
      "archival_memory_insert",
      "send_email",
    ],
  })
  .build()

// Validate before deploying
lettactl.validateFleet(config) // throws on invalid`}
        language="typescript"
        title="FleetConfigBuilder"
      />

      <h2 className={styles.sectionTitle}>Configuration Types</h2>
      <p className={styles.paragraph}>
        Core types for agent and fleet configuration.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`interface FleetConfig {
  shared_blocks?: SharedBlock[]
  shared_folders?: SharedFolderConfig[]
  mcp_servers?: McpServerConfig[]
  agents: AgentConfig[]  // At least 1 required
}

interface AgentConfig {
  name: string              // [a-zA-Z0-9_-]+
  description: string
  system_prompt: PromptConfig
  llm_config: LLMConfig
  tags?: string[]           // For multi-tenancy filtering
  tools?: string[]
  mcp_tools?: McpToolConfig[]
  shared_blocks?: string[]
  shared_folders?: string[]
  memory_blocks?: MemoryBlock[]
  archives?: ArchiveConfig[]  // Max 1 per agent
  folders?: FolderConfig[]
  embedding?: string
  reasoning?: boolean       // Default: true
  first_message?: string    // Sent on first creation
}

interface LLMConfig {
  model: string             // "provider/model-name"
  context_window: number    // 1000-200000
}

interface PromptConfig {
  value?: string            // Inline prompt
  from_file?: string        // Path to prompt file
  disable_base_prompt?: boolean
}

interface MemoryBlock {
  name: string
  description: string
  limit: number
  agent_owned: boolean      // true = agent writes
  value?: string
  from_file?: string
}`}
        language="typescript"
        title="Core types"
      />

      <h2 className={styles.sectionTitle}>MCP Servers</h2>
      <p className={styles.paragraph}>
        Connect agents to MCP tool servers — SSE, stdio, or
        streamable HTTP.
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`const config = lettactl.createFleetConfig()
  .addAgent({
    name: "dev-agent",
    description: "Developer assistant",
    system_prompt: { value: "You help with code." },
    llm_config: {
      model: "openai/gpt-4o",
      context_window: 128000,
    },
    mcp_tools: [
      { server: "github", tools: ["search_repos"] },
      { server: "filesystem", tools: "all" },
    ],
  })
  .build()

// MCP server types
interface McpServerConfig {
  name: string
  type: "sse" | "stdio" | "streamable_http"
  server_url?: string       // For SSE/HTTP
  command?: string           // For stdio
  args?: string[]
  env?: Record<string, string>
}`}
        language="typescript"
        title="MCP servers"
      />
    </>
  )
}
