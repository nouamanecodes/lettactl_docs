export interface GuidePage {
  slug: string
  title: string
  description: string
  sections: {
    heading: string
    content: string
    code?: { language: string; title: string; code: string }
  }[]
}

export const guides: Record<string, GuidePage> = {
  "canary-deployments": {
    slug: "canary-deployments",
    title: "Canary Deployments",
    description:
      "Deploy agent changes to isolated canary copies first. Test with real traffic, then promote to production or roll back — without touching your live fleet.",
    sections: [
      {
        heading: "How Canary Deploys Work",
        content:
          "A canary deployment creates a prefixed copy of your agents (e.g. CANARY-support-agent) with isolated memory but shared tools, folders, and archives. You test the canary with real messages, verify behavior, then either promote the config to production or delete the canaries. The YAML config is always the source of truth — promotion applies the same YAML to production names, it doesn't copy state from the canary.",
      },
      {
        heading: "Step 1: Preview the Canary",
        content:
          "Always start with --dry-run to see what will be created. The canary flag rewrites all agent names in your config with a CANARY- prefix and computes the diff against existing canary agents (or shows CREATE if they don't exist yet).",
        code: {
          language: "bash",
          title: "Preview canary deployment",
          code: `# See what the canary deploy would do
lettactl apply -f fleet.yaml --canary --dry-run

# Output:
# [+] CANARY-support-agent (CREATE)
# [+] CANARY-sales-agent (CREATE)
# Summary: 2 agents to create`,
        },
      },
      {
        heading: "Step 2: Deploy the Canary",
        content:
          "Run apply with --canary to create the canary agents. Each canary gets its own isolated memory blocks (agent-specific blocks are new instances, not shared with production). Shared blocks, tools, folders, and archives reference the same server-side resources as production. The first_message calibration is automatically skipped for faster deployment.",
        code: {
          language: "bash",
          title: "Deploy canary agents",
          code: `# Deploy canary copies of all agents
lettactl apply -f fleet.yaml --canary

# Deploy canary for a specific agent only
lettactl apply -f fleet.yaml --canary --agent support-agent`,
        },
      },
      {
        heading: "Step 3: Test the Canary",
        content:
          "Interact with canary agents directly. The --canary flag on get and describe auto-prefixes the name so you don't have to type CANARY- manually. For send, use the full prefixed name. Compare canary behavior against production side by side.",
        code: {
          language: "bash",
          title: "Test and compare",
          code: `# List all canary agents
lettactl get agents --canary

# Inspect canary config
lettactl describe agent support-agent --canary

# Send test messages to canary
lettactl send CANARY-support-agent "How do I reset my password?"

# Compare against production
lettactl describe agent support-agent`,
        },
      },
      {
        heading: "Step 4: Promote to Production",
        content:
          "When you're satisfied with the canary, promote by running apply with --canary --promote. This applies the same YAML config to your production agent names. It does NOT copy the canary's learned memory or conversation history — it applies the YAML as source of truth. If the production agent already exists, it updates in-place (conversation history preserved). If it doesn't exist, it creates a new one.",
        code: {
          language: "bash",
          title: "Promote to production",
          code: `# Promote config to production agents
lettactl apply -f fleet.yaml --canary --promote

# Promote and clean up canaries in one command
lettactl apply -f fleet.yaml --canary --promote --cleanup`,
        },
      },
      {
        heading: "Step 5: Clean Up",
        content:
          "Delete canary agents after promotion (or after deciding to roll back). Cleanup deletes canary agents and their agent-specific memory blocks. Shared blocks, shared folders, and tools are left untouched.",
        code: {
          language: "bash",
          title: "Clean up canary agents",
          code: `# Delete all canary agents
lettactl apply -f fleet.yaml --canary --cleanup

# Delete canary for a specific agent
lettactl apply -f fleet.yaml --canary --cleanup --agent support-agent`,
        },
      },
      {
        heading: "Rolling Back",
        content:
          "There's no special rollback command — and you don't need one. If the canary looks wrong, just clean it up and fix your config. If you already promoted and need to revert, use git to go back to the previous config and re-apply. The YAML is always the source of truth.",
        code: {
          language: "bash",
          title: "Roll back a promotion",
          code: `# Revert config changes
git revert HEAD

# Re-apply previous config to production
lettactl apply -f fleet.yaml

# Clean up the canaries
lettactl apply -f fleet.yaml --canary --cleanup`,
        },
      },
      {
        heading: "Custom Prefixes",
        content:
          "The default prefix is CANARY- but you can use any prefix with --canary-prefix. This is useful for running multiple canary environments (staging, testing, etc.). Important: use the same prefix for deploy, promote, and cleanup — the prefix isn't stored in a central registry, so a mismatch means cleanup won't find the right agents.",
        code: {
          language: "bash",
          title: "Custom canary prefix",
          code: `# Deploy with custom prefix
lettactl apply -f fleet.yaml --canary --canary-prefix "STAGING-"

# Clean up with the same prefix
lettactl apply -f fleet.yaml --canary --cleanup --canary-prefix "STAGING-"`,
        },
      },
      {
        heading: "What Gets Isolated vs Shared",
        content:
          "Canary agents share most resources with production to keep the test realistic. Agent-specific memory blocks are the exception — each canary gets fresh instances so the canary's learned memory doesn't pollute production, and vice versa. Conversation history is also separate (new agent = fresh history). Shared blocks are truly shared — if a shared block changes, both canary and production agents see the update.",
      },
      {
        heading: "Canary Metadata",
        content:
          "Each canary agent stores metadata that lettactl uses for identification and cleanup: lettactl.canary (true), lettactl.canary.productionName (original agent name), lettactl.canary.prefix (the prefix used), and lettactl.canary.createdAt (ISO timestamp). This metadata is stored on the Letta agent and survives server restarts.",
      },
      {
        heading: "Idempotency",
        content:
          "Running --canary twice with the same config updates existing canary agents rather than creating duplicates. The diff engine treats CANARY-support-agent like any other agent — if it already exists and matches the config, it's marked UNCHANGED. This makes canary deploys safe to retry and safe to run in CI.",
      },
      {
        heading: "Complete Workflow Example",
        content:
          "Here's the full canary deployment lifecycle from preview to cleanup, deploying a fleet config change that updates the system prompt and adds a new tool.",
        code: {
          language: "bash",
          title: "Full canary lifecycle",
          code: `# 1. Edit your fleet config
vim fleet.yaml

# 2. Preview what canary deploy would do
lettactl apply -f fleet.yaml --canary --dry-run

# 3. Deploy canaries
lettactl apply -f fleet.yaml --canary

# 4. Verify canaries are running
lettactl get agents --canary

# 5. Test with real messages
lettactl send CANARY-support-agent "test query"
lettactl send CANARY-sales-agent "test query"

# 6. Happy with results? Promote and clean up
lettactl apply -f fleet.yaml --canary --promote --cleanup

# 7. Verify production is updated
lettactl describe agent support-agent`,
        },
      },
    ],
  },
  "multi-tenancy": {
    slug: "multi-tenancy",
    title: "Multi-Tenancy",
    description:
      "Manage thousands of agents across tenants using tag-based filtering. B2B and B2B2C patterns for SaaS platforms built on Letta.",
    sections: [
      {
        heading: "How Multi-Tenancy Works",
        content:
          "lettactl uses tag-based filtering for multi-tenancy — not separate databases or isolated deployments. Every agent has an optional tags array of key:value strings. All commands that list or operate on agents accept a --tags flag that filters using AND logic. Combined with shared resources and the SDK, this gives you a scalable multi-tenant architecture on top of Letta.",
      },
      {
        heading: "Tag Conventions",
        content:
          "Tags use a key:value format. For B2B, use tenant:{id} and role:{type}. For B2B2C, add user:{id} and client:{id}. Tags are stored on the Letta agent and filtered server-side, so queries stay fast even with thousands of agents. Tag filtering uses AND logic — --tags \"tenant:acme,role:support\" returns agents with both tags.",
        code: {
          language: "yaml",
          title: "B2B tag pattern",
          code: `agents:
  - name: acme-support
    tags: ["tenant:acme", "role:support"]
    # ...

  - name: acme-research
    tags: ["tenant:acme", "role:research"]
    # ...

  - name: globex-support
    tags: ["tenant:globex", "role:support"]
    # ...`,
        },
      },
      {
        heading: "Querying by Tenant",
        content:
          "The --tags flag works on get, describe, report, and send commands. Query all agents for a tenant, all support agents across tenants, or drill down to a specific user's agents. Tag filtering is pushed to the Letta server, so it scales to large fleets without local overhead.",
        code: {
          language: "bash",
          title: "Tag-based queries",
          code: `# All agents for Acme Corp
lettactl get agents --tags "tenant:acme"

# All support agents across all tenants
lettactl get agents --tags "role:support"

# Memory report for a specific tenant
lettactl report memory --tags "tenant:acme"

# Send message to all agents for a tenant
lettactl send --tags "tenant:acme" "New policy update" --confirm`,
        },
      },
      {
        heading: "B2B2C Pattern",
        content:
          "For platforms where each tenant has multiple end users, add user and client dimensions to your tags. The naming convention encodes the hierarchy: user-{id}-client-{id}-{role}. This lets you query at any level — all agents for a user, all agents for a specific client, or all support agents platform-wide.",
        code: {
          language: "yaml",
          title: "B2B2C tag pattern",
          code: `agents:
  - name: user-42-client-7-support
    tags: ["user:42", "client:7", "role:support"]
    # ...

  - name: user-42-client-7-research
    tags: ["user:42", "client:7", "role:research"]
    # ...`,
        },
      },
      {
        heading: "Shared Resources Across Tenants",
        content:
          "Shared blocks and shared folders are the key to efficient multi-tenancy. Define company-wide resources once and reference them from every tenant's agents. Letta creates a single block on the server and attaches it to all referencing agents. When you update the shared resource and re-apply, every tenant gets the change.",
        code: {
          language: "yaml",
          title: "Shared resources across tenants",
          code: `shared_blocks:
  - name: platform-policies
    description: "Platform-wide policies"
    limit: 10000
    from_file: "shared/policies.md"

agents:
  - name: acme-support
    tags: ["tenant:acme"]
    shared_blocks: [platform-policies]

  - name: globex-support
    tags: ["tenant:globex"]
    shared_blocks: [platform-policies]`,
        },
      },
      {
        heading: "Dynamic Tenant Provisioning with SDK",
        content:
          "For SaaS platforms that onboard tenants dynamically, use the TypeScript SDK to generate and deploy agent configs at runtime. There's no built-in template variable substitution — instead, generate the YAML or config object programmatically. This gives you full control over naming, tags, and per-tenant customization.",
        code: {
          language: "typescript",
          title: "SDK tenant provisioning",
          code: `import { LettaCtl } from 'lettactl'

const ctl = new LettaCtl({
  lettaBaseUrl: 'http://localhost:8283'
})

async function provisionTenant(tenantId: string) {
  const fleet = ctl.createFleetConfig()
    .addAgent({
      name: \`\${tenantId}-support\`,
      description: \`Support agent for \${tenantId}\`,
      tags: [\`tenant:\${tenantId}\`, 'role:support'],
      llm_config: {
        model: 'google_ai/gemini-2.5-pro',
        context_window: 32000
      },
      system_prompt: {
        value: \`You are a support agent for \${tenantId}.\`
      }
    })
    .build()

  await ctl.deployFleet(fleet)
}`,
        },
      },
      {
        heading: "Template Mode for Fleet-Wide Updates",
        content:
          "The --match flag applies a config template to all agents matching a glob pattern. This is useful for rolling out a new tool or prompt change across your entire fleet without listing every agent. Template mode uses three-way merge semantics: it tracks what was last applied via agent metadata, so it only removes resources it previously added — user-added resources are preserved.",
        code: {
          language: "bash",
          title: "Template mode updates",
          code: `# Add a new tool to all support agents
lettactl apply -f new-tool-template.yaml --match "*-support"

# Update system prompt for all agents
lettactl apply -f updated-prompt.yaml --match "*"

# Preview changes first
lettactl apply -f new-tool-template.yaml --match "*-support" --dry-run`,
        },
      },
      {
        heading: "Tenant-Scoped Canary Deploys",
        content:
          "Canary deployments work with multi-tenancy. Deploy canary copies, test them, then promote. Canary agents preserve all tags from the original, so you can still query them by tenant. Note: --canary and --match cannot be combined — use --canary with --agent to scope to specific tenant agents.",
        code: {
          language: "bash",
          title: "Canary deploy for a tenant",
          code: `# Deploy canary for a specific tenant's agent
lettactl apply -f fleet.yaml --canary --agent acme-support

# Query canary agents for the tenant
lettactl get agents --canary --tags "tenant:acme"

# Promote and clean up
lettactl apply -f fleet.yaml --canary --promote --cleanup`,
        },
      },
      {
        heading: "Scaling to Thousands of Agents",
        content:
          "lettactl handles large fleets through server-side tag filtering, async pagination (1000 items per page), parallel fetching of agent details, and a concurrency limit of 5 for update operations. The CLI is stateless — no local database or cache. For the best performance: always use --tags to scope your queries instead of fetching all agents, use shared resources to avoid duplicating blocks and folders, and use the SDK for bulk provisioning.",
      },
    ],
  },
  "self-diagnosis": {
    slug: "self-diagnosis",
    title: "Memory Self-Diagnosis",
    description:
      "Let your agents analyze their own memory health. Detect stale data, overcrowded blocks, redundancy, and missing knowledge — using the agents themselves as the diagnostic tool.",
    sections: [
      {
        heading: "Why Self-Diagnosis",
        content:
          "Byte counts tell you a block is 90% full. They don't tell you why. Is it full of useful, current data? Or is it packed with stale facts from six months ago? Only the agent knows — it sees the content, knows what questions it gets asked, and can identify what's outdated or missing. lettactl's report memory --analyze leverages this by messaging each agent with a structured prompt and parsing the response into actionable diagnostics.",
      },
      {
        heading: "Basic Memory Report",
        content:
          "Start with the basic report to see fill percentages across your fleet. Each block shows its character usage, fill percentage, and a content preview. Color-coded: green (< 50%), yellow (50-79%), red (80%+). Shared blocks are marked with * and show all attached agent names.",
        code: {
          language: "bash",
          title: "Basic memory report",
          code: `# Single agent
lettactl report memory support-agent

# All agents
lettactl report memory --all

# Filter by tags
lettactl report memory --tags "tenant:acme"

# Glob pattern
lettactl report memory --match "support-*"`,
        },
      },
      {
        heading: "LLM-Powered Analysis",
        content:
          "Add --analyze to send each agent a structured diagnostic prompt. The agent reads its own memory blocks (first 500 chars of each) and reports back: topic count, health status, whether the block should be split, a summary, stale data, and missing knowledge. This costs tokens — you'll be prompted to confirm unless you pass --confirm.",
        code: {
          language: "bash",
          title: "Run analysis",
          code: `# Analyze with confirmation prompt
lettactl report memory support-agent --analyze

# Skip confirmation (CI-friendly)
lettactl report memory --all --analyze --confirm

# Analyze a tenant's agents
lettactl report memory --tags "tenant:acme" --analyze --confirm`,
        },
      },
      {
        heading: "What the Agent Reports",
        content:
          "For each memory block, the agent produces: TOPICS (number of distinct topics stored), STATUS (healthy, crowded, near-full, or empty), SPLIT (yes/no — should this block be broken up), SUMMARY (one sentence on what's in there), STALE (outdated facts, old dates, deprecated references), and MISSING (topics the agent gets asked about but has no memory for). It also produces an overall assessment: REDUNDANCY level across blocks, CONTRADICTIONS between blocks, and ACTIONS (suggested changes to memory layout).",
      },
      {
        heading: "How It Works Under the Hood",
        content:
          "The analysis uses lettactl's bulk messaging system to send messages to up to 5 agents concurrently. Each agent gets a per-agent prompt built from its actual block data — names, limits, fill percentages, and content previews. The agent responds in a structured plain-text format using === BLOCK: name === markers and KEY: value pairs. lettactl parses this response, extracts the diagnostics, and displays them in a color-coded table with health issues and suggested actions.",
      },
      {
        heading: "Reading the Output",
        content:
          "The analysis output has three sections. First, a table showing each block's topic count, status (color-coded), split recommendation, and summary. Second, a health issues list showing all blocks with stale or missing data. Third, an overall assessment with redundancy level, contradictions, and suggested actions. Status colors: healthy = green, empty = dim, crowded = yellow, near-full = red.",
      },
      {
        heading: "Acting on the Results",
        content:
          "The analysis gives you specific, actionable recommendations. If a block says SPLIT: yes, create two smaller blocks in your YAML and redeploy. If it reports STALE data, update the source content in from_file. If it flags MISSING knowledge, add a new memory block for that topic. If redundancy is high, consolidate overlapping blocks. The agent is telling you what it needs — listen to it.",
        code: {
          language: "yaml",
          title: "Fixing a crowded block",
          code: `# Before: one overcrowded block
memory_blocks:
  - name: notes
    description: "Everything"
    agent_owned: true
    limit: 2000

# After: split based on agent's recommendation
memory_blocks:
  - name: meeting_notes
    description: "Meeting summaries and decisions"
    agent_owned: true
    limit: 3000
  - name: action_items
    description: "Active tasks and follow-ups"
    agent_owned: true
    limit: 2000`,
        },
      },
      {
        heading: "Fleet-Wide Diagnostics",
        content:
          "The real power is running analysis across your entire fleet. Use --all or --tags to diagnose hundreds of agents at once. The bulk messenger runs 5 agents concurrently with real-time status output. Results aggregate into a single report showing which agents need attention. This turns memory maintenance from a manual, per-agent chore into a fleet-wide health check you can run on a schedule.",
        code: {
          language: "bash",
          title: "Fleet-wide analysis",
          code: `# Diagnose entire fleet
lettactl report memory --all --analyze --confirm

# Diagnose all support agents
lettactl report memory --tags "role:support" --analyze --confirm

# JSON output for programmatic processing
lettactl report memory --all --analyze --confirm -o json`,
        },
      },
    ],
  },
}

export const guideSlugs = Object.keys(guides)
