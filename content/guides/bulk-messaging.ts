import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "bulk-messaging",
  title: "Bulk Messaging",
  description:
    "Send the same message to hundreds of agents at once using glob patterns, tags, or config files. Bulk messaging runs 5 agents concurrently with real-time status output — useful for fleet-wide recalibration, announcements, and multi-tenant operations.",
  sections: [
    {
      heading: "How It Works",
      content:
        "lettactl send supports three bulk modes: --all with a glob pattern to match agent names, --tags to match by tag, and -f to target agents in a YAML config file. The message is sent asynchronously to each agent with up to 5 running concurrently. Each agent processes the message independently. You get per-agent status output as they complete and a summary at the end.",
    },
    {
      heading: "Send by Glob Pattern",
      content:
        "Use --all with a minimatch glob pattern to target agents by name. The pattern is matched against all agents on the server. Use --confirm to skip the interactive confirmation prompt.",
      code: {
        language: "bash",
        title: "Glob pattern messaging",
        code: `# All agents matching a pattern
lettactl send --all "support-*" "New FAQ entries have been added to your knowledge base." --confirm

# All agents (wildcard)
lettactl send --all "*" "System maintenance in 1 hour." --confirm

# Complex patterns
lettactl send --all "+(prod|staging)-*" "Deployment complete." --confirm`,
      },
    },
    {
      heading: "Send by Tags",
      content:
        "Use --tags to target agents by their tag values. This ties directly into the multi-tenancy pattern — you can message all agents for a specific tenant, role, or any tag combination. Tags use AND logic: --tags \"tenant:acme,role:support\" matches agents with both tags.",
      code: {
        language: "bash",
        title: "Tag-based messaging",
        code: `# All agents for a tenant
lettactl send --tags "tenant:acme" "Your company policies have been updated." --confirm

# All support agents across tenants
lettactl send --tags "role:support" "New escalation procedure in effect." --confirm

# Specific tenant + role combination
lettactl send --tags "tenant:acme,role:support" "Acme support team: new ticket workflow." --confirm`,
      },
    },
    {
      heading: "Send from Config File",
      content:
        "Use -f to target agents defined in a YAML config file. Only agents that exist on the server and appear in the config will receive the message. This is useful for messaging the exact set of agents in a fleet config.",
      code: {
        language: "bash",
        title: "Config file messaging",
        code: `# Message all agents in a fleet config
lettactl send -f fleet.yaml "Config has been updated. Review your memory." --confirm

# Same fleet you deploy with
lettactl apply -f fleet.yaml
lettactl send -f fleet.yaml "Deployment complete. Confirm readiness." --confirm`,
      },
    },
    {
      heading: "Confirmation and Output",
      content:
        "Without --confirm, lettactl shows which agents will be messaged and asks for confirmation. With --confirm, it proceeds immediately. During execution, each agent's result is printed as it completes — OK with duration on success, FAIL with error on failure. A summary shows total completed vs failed at the end.",
      code: {
        language: "bash",
        title: "Example output",
        code: `$ lettactl send --all "support-*" "Recalibrate" --confirm

OK support-agent-1 (3.2s)
OK support-agent-2 (4.1s)
FAIL support-agent-3: Run timed out after 60s
OK support-agent-4 (2.8s)
OK support-agent-5 (5.5s)

Completed: 4/5, Failed: 1`,
      },
    },
    {
      heading: "Concurrency",
      content:
        "Bulk messaging sends to 5 agents concurrently. As each agent completes, the next one in the queue starts. Each agent is polled independently at 1-second intervals until the run completes, fails, or times out. For large fleets (hundreds of agents), the queue ensures steady throughput without overwhelming the Letta server.",
    },
    {
      heading: "SDK Bulk Messaging",
      content:
        "The SDK exposes bulkSendMessage for programmatic bulk operations. You can target by glob pattern or pass a pre-resolved list of agents. Use collectResponse to capture each agent's reply. Use messageFn for per-agent message customization.",
      code: {
        language: "typescript",
        title: "SDK bulk messaging",
        code: `import { LettaCtl } from 'lettactl'

const ctl = new LettaCtl({
  lettaBaseUrl: 'http://localhost:8283',
})

// Send to all matching agents
const results = await ctl.bulkSendMessage(
  'Review your memory blocks and confirm readiness.',
  {
    pattern: 'support-*',
    confirm: true,
    timeout: 60,
    collectResponse: true,
  }
)

// Check results
for (const r of results) {
  console.log(\`\${r.agentName}: \${r.status} (\${r.duration}s)\`)
  if (r.responseText) {
    console.log(\`  Response: \${r.responseText.slice(0, 100)}\`)
  }
}`,
      },
    },
    {
      heading: "Per-Agent Customization",
      content:
        "In the SDK, use messageFn to send a different message to each agent based on its name, tags, or other properties. This is useful for tenant-specific recalibration where each agent needs a tailored message.",
      code: {
        language: "typescript",
        title: "Custom per-agent messages",
        code: `const results = await ctl.bulkSendMessage('', {
  pattern: '*-support',
  messageFn: (agent) => {
    // Extract tenant from agent name
    const tenant = agent.name.replace('-support', '')
    return \`You are the support agent for \${tenant}. Review your memory blocks and confirm you have the latest \${tenant} product information.\`
  },
  confirm: true,
  collectResponse: true,
})`,
      },
    },
    {
      heading: "Multi-Tenancy Patterns",
      content:
        "Bulk messaging combined with tags is the backbone of multi-tenant operations. Update shared memory, then tell all agents to re-read it. Announce policy changes to a single tenant. Run fleet-wide health checks by asking agents to self-report. All of these are a single command.",
      code: {
        language: "bash",
        title: "Multi-tenant messaging patterns",
        code: `# Update shared block, then notify all agents
lettactl apply -f fleet.yaml
lettactl send --all "*" "Shared company policies have been updated. Re-read your company-policies block." --confirm

# Tenant-specific announcement
lettactl send --tags "tenant:acme" "Acme Corp has a new product line. Check your product_knowledge block." --confirm

# Fleet-wide health check
lettactl send --all "*" "Report your current status: what is your role, how many memory blocks do you have, and are any of them empty?" --confirm`,
      },
    },
  ],
}
