import type { GuidePage } from "./index"

export const guide: GuidePage = {
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
}
