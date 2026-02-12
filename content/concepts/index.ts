export interface ConceptPage {
  slug: string
  title: string
  description: string
  sections: {
    heading: string
    content: string
    code?: { language: string; title: string; code: string }
  }[]
}

export const concepts: Record<string, ConceptPage> = {
  "declarative-config": {
    slug: "declarative-config",
    title: "Declarative Configuration",
    description:
      "How lettactl uses YAML to define and manage agent fleets with a single source of truth.",
    sections: [
      {
        heading: "Declarative vs Imperative",
        content:
          "lettactl follows the declarative model: you describe what your fleet should look like, not the steps to get there. When you run `lettactl apply`, the diff engine compares your YAML against the live server state and figures out the minimum set of operations needed. Create, update, or leave alone — it decides automatically.",
      },
      {
        heading: "The Fleet Config File",
        content:
          "Everything lives in a single YAML file (or split across multiple). The top-level keys are `shared_blocks`, `shared_folders`, `mcp_servers`, and `agents`. Agents is the only required section — everything else is optional.",
        code: {
          language: "yaml",
          title: "fleet.yaml",
          code: `shared_blocks:
  - name: brand_guidelines
    description: "Company voice and style"
    limit: 5000
    from_file: "memory/guidelines.md"

agents:
  - name: support-agent
    description: "Customer support AI"
    llm_config:
      model: "google_ai/gemini-2.5-pro"
      context_window: 32000
    system_prompt:
      from_file: "prompts/support.md"
    shared_blocks:
      - brand_guidelines`,
        },
      },
      {
        heading: "How Apply Works",
        content:
          "The apply command follows a strict pipeline: parse YAML → validate config → load existing server state → diff each agent → execute operations. With `--dry-run`, it stops after the diff and shows you what would change without touching anything. The diff engine compares system prompts, descriptions, models, tools, memory blocks, folders, and tags.",
        code: {
          language: "bash",
          title: "Apply workflow",
          code: `# Preview changes
lettactl apply -f fleet.yaml --dry-run

# Deploy for real
lettactl apply -f fleet.yaml

# Only deploy specific agents
lettactl apply -f fleet.yaml --agent support-*

# Filter by tags
lettactl apply -f fleet.yaml --match tags:team=support`,
        },
      },
      {
        heading: "Idempotency",
        content:
          "Running apply twice with the same config produces zero changes the second time. The diff engine recognizes that the server state already matches and reports all agents as unchanged. This is critical for CI/CD pipelines where apply runs on every push.",
      },
    ],
  },
  "resource-types": {
    slug: "resource-types",
    title: "Resource Types & Shared Resources",
    description:
      "Everything lettactl manages — agents, memory blocks, folders, archives, tools, and MCP servers — all powered by the Letta platform's stateful agent infrastructure.",
    sections: [
      {
        heading: "Letta Under the Hood",
        content:
          "Every resource lettactl manages maps directly to Letta's server-side primitives. Agents are Letta agents with persistent memory. Blocks are Letta's core memory system — structured scratchpads loaded into the context window every turn. Folders use Letta's file attachment API with grep and semantic search. Archives use Letta's archival memory with vector search. Tools are Letta tool registrations. lettactl doesn't reinvent any of this — it gives you declarative, version-controlled access to what Letta already provides.",
      },
      {
        heading: "Agents",
        content:
          "The core resource. Each agent has a name, description, LLM config, system prompt, and optional memory blocks, tools, folders, and archives. Agent names must match `[a-zA-Z0-9_-]+` and can't use reserved words like `agents`, `blocks`, `tools`, `files`, or `archives`.",
      },
      {
        heading: "Memory Blocks",
        content:
          "Letta's core memory system — structured blocks that persist across conversations and are loaded into the agent's context window every turn. Two ownership modes: `agent_owned: true` means the Letta agent reads and writes the block via memory tools (lettactl won't overwrite it on redeploy). `agent_owned: false` means the YAML is the source of truth and lettactl will reset it on each apply. Content can come from `value` (inline), `from_file` (local path), or `from_bucket` (cloud storage).",
        code: {
          language: "yaml",
          title: "Memory blocks",
          code: `memory_blocks:
  - name: customer_data
    description: "What I know about the customer"
    agent_owned: true   # Agent writes here
    limit: 5000
  - name: product_info
    description: "Current product catalog"
    agent_owned: false  # YAML is source of truth
    limit: 3000
    from_file: "memory/products.md"`,
        },
      },
      {
        heading: "Shared Blocks",
        content:
          "Memory blocks defined once at the top level and referenced by multiple agents. When you update a shared block's content, every agent that references it gets the update on next apply. Shared blocks are always agent-readable.",
      },
      {
        heading: "Folders",
        content:
          "File attachments for agents. Can be agent-owned or shared. Files can come from local paths or cloud storage (Supabase buckets). Useful for giving agents access to documents, knowledge bases, or reference materials.",
        code: {
          language: "yaml",
          title: "Folders",
          code: `shared_folders:
  - name: knowledge_base
    files:
      - "docs/faq.md"
      - "docs/policies.md"
      - from_bucket:
          provider: supabase
          bucket: docs
          path: "handbook/"`,
        },
      },
      {
        heading: "Archives",
        content:
          "Letta's long-term archival memory with vector search. Each agent can have at most one archive. Archives persist across conversations and are searchable via Letta's `archival_memory_search` tool. Unlike core memory blocks, archival memory isn't loaded into the context window — the agent queries it on demand. Useful for building up large knowledge stores over time.",
      },
      {
        heading: "Tools",
        content:
          "Functions the Letta agent can call during conversations. Letta provides built-in tools for memory management (memory_insert, memory_replace, memory_rethink), archival search (archival_memory_search, archival_memory_insert), file operations (grep_files, semantic_search_files), and web access (web_search, fetch_webpage). You can also register custom tools on your Letta server. Tools are referenced by name in the agent config.",
      },
      {
        heading: "MCP Servers",
        content:
          "Model Context Protocol server connections. Three transport types: `sse` (Server-Sent Events), `stdio` (subprocess), and `streamable_http`. Each agent can selectively attach specific tools from MCP servers or use `all` to attach everything.",
        code: {
          language: "yaml",
          title: "MCP servers",
          code: `mcp_servers:
  - name: github
    type: sse
    server_url: "http://localhost:3001/sse"

agents:
  - name: dev-agent
    # ...
    mcp_tools:
      - server: github
        tools: ["search_repos", "create_issue"]`,
        },
      },
      {
        heading: "Shared Blocks",
        content:
          "When 50 agents all need the same brand guidelines, you don't want to copy the content 50 times. Shared blocks are defined once at the top level of your YAML under `shared_blocks` and referenced by name in each agent. Letta creates a single block on the server and attaches it to every referencing agent — deduplication is automatic. Content can come from inline `value`, `from_file`, or `from_bucket`.",
        code: {
          language: "yaml",
          title: "Shared blocks",
          code: `shared_blocks:
  - name: brand_voice
    description: "Brand guidelines and tone"
    limit: 5000
    from_file: "memory/brand.md"

agents:
  - name: support-agent
    shared_blocks: [brand_voice]
  - name: sales-agent
    shared_blocks: [brand_voice]`,
        },
      },
      {
        heading: "Shared Folders",
        content:
          "File collections shared across agents. Defined under `shared_folders` at the top level. Files can be local paths or cloud storage references. When you update files in a shared folder, every referencing agent gets the changes on next apply. Letta's file API handles the storage — lettactl handles the lifecycle.",
        code: {
          language: "yaml",
          title: "Shared folders",
          code: `shared_folders:
  - path: "knowledge/"
    description: "Company knowledge base"
    files:
      - "docs/faq.md"
      - "docs/policies.md"
      - from_bucket:
          provider: supabase
          bucket: company-docs
          path: "handbook/"`,
        },
      },
      {
        heading: "Resolution Order",
        content:
          "During apply, shared resources are processed before agents. The pipeline: validate config → process shared blocks → process shared folders → process MCP servers → process each agent. This ensures all shared resources exist on the Letta server before any agent tries to reference them. If two agents reference the same shared block, only one Letta block is created — both agents get a reference to the same block ID.",
      },
    ],
  },
  "memory-model": {
    slug: "memory-model",
    title: "Memory Model",
    description:
      "How Letta's stateful memory system works and how lettactl manages memory lifecycle across your fleet.",
    sections: [
      {
        heading: "Why Stateful Memory Matters",
        content:
          "Most AI agents are stateless — every conversation starts from zero. Letta agents have persistent memory that survives across sessions. They remember what you told them, learn from interactions, and build context over time. lettactl gives you infrastructure-level control over this memory.",
      },
      {
        heading: "Core Memory (Blocks)",
        content:
          "Core memory blocks are the agent's working memory — always loaded into the context window. Each block has a name, description, token limit, and content. Think of them as structured scratchpads the agent can read and write to during conversations.",
      },
      {
        heading: "agent_owned vs YAML-managed",
        content:
          "This is the critical distinction. When `agent_owned: true`, the agent modifies the block during conversations and lettactl preserves those changes on redeploy. When `agent_owned: false`, the YAML content is the source of truth — lettactl will overwrite whatever the agent wrote. Use agent_owned for things like customer context that accumulates. Use YAML-managed for reference data you control.",
        code: {
          language: "yaml",
          title: "Ownership modes",
          code: `memory_blocks:
  # Agent learns and accumulates here
  - name: user_preferences
    description: "What I've learned about this user"
    agent_owned: true
    limit: 5000

  # You control this content
  - name: pricing_rules
    description: "Current pricing logic"
    agent_owned: false
    limit: 3000
    from_file: "memory/pricing.md"`,
        },
      },
      {
        heading: "Archival Memory",
        content:
          "Long-term storage with vector search. Agents write to archival memory using the `archival_memory_insert` tool and search it with `archival_memory_search`. Unlike core memory, archival memory isn't loaded into the context window — the agent queries it on demand. Useful for building up large knowledge stores over time.",
      },
      {
        heading: "Shared Memory",
        content:
          "Shared blocks let multiple agents read from the same memory. Define a block once at the top level and reference it by name in each agent. When you update the content in YAML, every agent gets the update on next apply. This is how you keep a fleet in sync — brand guidelines, product catalogs, company policies.",
      },
      {
        heading: "Memory Lifecycle",
        content:
          "On first deploy, lettactl creates blocks with their initial content. On subsequent deploys, the diff engine checks each block: if it's agent_owned, it leaves the content alone (only updates metadata like description or limit). If it's YAML-managed, it compares content and updates if different. Deleting a block from YAML detaches it from the agent on next apply.",
      },
    ],
  },
  "diff-engine": {
    slug: "diff-engine",
    title: "Diff Engine",
    description:
      "How lettactl compares your local config against live server state and computes the minimum set of changes.",
    sections: [
      {
        heading: "How Diffing Works",
        content:
          "When you run `lettactl apply`, the engine follows a strict pipeline: parse YAML → resolve shared resources → fetch live state from the Letta server → diff each agent. For every agent in your config, it checks the agent registry (a name→ID lookup). If the agent doesn't exist yet, it's marked CREATE. If it exists, the engine fetches its full state and runs a field-by-field comparison. If every field matches, the agent is marked UNCHANGED. Otherwise, it generates a precise update plan with the minimum operations needed.",
      },
      {
        heading: "Field-Level Comparison",
        content:
          "The engine compares 8 scalar fields individually: system prompt (trimmed, then string equality), description, LLM model (default: google_ai/gemini-2.5-pro), context window (default: 28000), embedding model (default: openai/text-embedding-3-small), embedding config (deep-normalized with sorted keys before JSON comparison), reasoning mode (default: true), and tags (arrays sorted before comparison). Each changed field increments the operation count by one.",
      },
      {
        heading: "Tool Diffing",
        content:
          "Tools produce four buckets: toAdd, toRemove, toUpdate, and unchanged. Builtin tools (archival_memory_search, memory_replace, web_search, etc.) are implicitly available — if they appear in your config but not in the server response, they're marked unchanged rather than added. Protected tools (memory_insert, memory_replace, memory_rethink, conversation_search, and file search tools) are never removed, even with --force. Tool updates happen when source code changes are detected via content hashing — the old tool ID is detached and the new one attached.",
      },
      {
        heading: "Block Diffing",
        content:
          "Memory blocks have five buckets: toAdd, toRemove, toUpdate (swap block IDs), toUpdateValue (in-place content update), and unchanged. The critical distinction is agent_owned. When agent_owned is true, the agent writes to the block during conversations and lettactl won't overwrite the content — only metadata like description or limit gets synced. When agent_owned is false, the YAML value is source of truth and the engine compares content strings, generating a toUpdateValue operation if they differ. Shared blocks are always treated as agent_owned regardless of config.",
      },
      {
        heading: "Folder Diffing",
        content:
          "Folders track file-level changes using SHA-256 content hashes (truncated to 16 chars) stored in agent metadata under lettactl.folderFileHashes. On each apply, the engine compares current hashes against previous hashes. Updates only fire when both hashes exist and differ — this prevents false positives on first-time tracking. The engine also handles Letta's automatic file rename behavior: when duplicate filenames collide, Letta appends _(N) suffixes. The diff engine normalizes these back to canonical names, removes the suffixed variants, and re-uploads the clean file.",
      },
      {
        heading: "Drift Detection",
        content:
          "Drift happens when the server state diverges from your YAML — someone manually edited an agent's prompt in the UI, or the agent modified its own memory. The --dry-run flag shows you exactly what drifted with a color-coded diff. Red lines show what would be removed, green lines show what would be added. Resources that would require --force to remove are labeled explicitly.",
        code: {
          language: "bash",
          title: "Drift detection",
          code: `# See what drifted
lettactl apply -f fleet.yaml --dry-run

# Output shows:
# [~] support-agent (UPDATE - 3 changes)
#     system_prompt:
#       - You are a MODIFIED assistant.
#       + You are the ORIGINAL assistant.
#     Tool [-]: some_old_tool (requires --force)
#     Block [~]: pricing_rules (value changed)`,
        },
      },
      {
        heading: "Operation Counting & Conversation Preservation",
        content:
          "Every diff tracks an operationCount — the sum of all individual changes across all categories. Each changed field counts as 1. Each tool add/remove/update counts as 1. Each block operation counts as 1. Folder operations count at the file level — a folder with 3 files to add and 1 to remove counts as 4 operations. An agent with zero operations is marked UNCHANGED. Every diff also carries a preservesConversation flag. In the current implementation, this is always true — all update operations (field changes, tool swaps, block updates, folder changes) maintain the agent's conversation history. The agent is never recreated from scratch during apply.",
      },
      {
        heading: "The --force Flag",
        content:
          "By default, apply is additive — it adds and updates resources but never removes anything not in your config. This is safe for incremental adoption. The --force flag enables strict reconciliation: resources on the server that aren't in your YAML get detached. Tools, blocks, folders, and archives are all subject to force removal. The one exception: protected memory tools (memory_insert, memory_replace, memory_rethink, conversation_search, file search tools) are never removed, even with --force. They're critical for agent operation.",
        code: {
          language: "bash",
          title: "Force reconciliation",
          code: `# Additive only (default) - won't remove anything
lettactl apply -f fleet.yaml

# Strict reconciliation - removes resources not in YAML
lettactl apply -f fleet.yaml --force

# Preview what --force would remove
lettactl apply -f fleet.yaml --force --dry-run`,
        },
      },
      {
        heading: "Selective Apply",
        content:
          "You don't have to deploy everything. Use --agent to filter by name pattern or --match to filter by tags. Combined with --dry-run, this lets you preview and deploy changes to specific parts of your fleet.",
        code: {
          language: "bash",
          title: "Selective deployment",
          code: `# Only agents matching a pattern
lettactl apply -f fleet.yaml --agent "support-*"

# Only agents with specific tags
lettactl apply -f fleet.yaml --match tags:tier=canary

# Combine both
lettactl apply -f fleet.yaml --agent "support-*" --match tags:team=eng`,
        },
      },
    ],
  },
}

export const conceptSlugs = Object.keys(concepts)
