import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "agent-calibration",
  title: "Agent Calibration",
  description:
    "Use first_message to prime agents with initial context on creation. When agents drift or need retraining, delete and redeploy them, or use bulk messaging to recalibrate your entire fleet in place.",
  sections: [
    {
      heading: "What Calibration Does",
      content:
        "When you create an agent with a first_message, lettactl sends that message to the agent immediately after creation — before any user interacts with it. The agent processes the message, updates its memory, and is ready to go. Think of it as a boot sequence: the system prompt tells the agent who it is, and the first_message makes it act on that identity by reviewing its memory, confirming its role, or loading initial context into its working memory.",
    },
    {
      heading: "Adding a first_message",
      content:
        "Add the first_message field to any agent in your YAML config. The message is sent asynchronously with a 60-second timeout. lettactl polls until the agent finishes processing, then moves on to the next agent.",
      code: {
        language: "yaml",
        title: "Agent with calibration message",
        code: `agents:
  - name: support-agent
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      value: |
        You are a customer support agent for Acme Corp.
        Use your memory blocks to track customer context.
    memory_blocks:
      - name: company_info
        description: "Company products and policies"
        limit: 5000
        agent_owned: true
        from_file: knowledge/company-info.md
    first_message: |
      Review your memory blocks and confirm you understand your role.
      Summarize what you know about the company and what tools you have.`,
      },
    },
    {
      heading: "When first_message Runs",
      content:
        "The first_message is only sent on initial agent creation — never on updates. If you run lettactl apply twice with the same config, the second run sees the agent already exists, updates it in place, and skips the first_message. This is intentional: updates preserve conversation history and learned memory, so re-sending the calibration message would pollute the agent's context.",
    },
    {
      heading: "Writing Good Calibration Messages",
      content:
        "A good first_message asks the agent to do something with its configuration. Don't just say \"hello\" — make it review its memory, confirm its role, or test a tool. This forces the agent to internalize its setup before real users arrive. Keep it specific: tell the agent exactly what to check and what to summarize.",
      code: {
        language: "yaml",
        title: "Calibration message examples",
        code: `# Good: forces the agent to internalize its config
first_message: |
  Review your memory blocks and system prompt.
  Summarize your role, the tools available to you,
  and the company info in your memory. Be concise.

# Good: tests tool usage during calibration
first_message: |
  Test your lookup_order tool with order ID "TEST-001".
  Confirm the tool works and report what you get back.

# Bad: no action, agent learns nothing
first_message: "Hello, are you ready?"

# Bad: too vague
first_message: "Initialize yourself."`,
      },
    },
    {
      heading: "Skipping Calibration",
      content:
        "Use --skip-first-message when you want fast deploys without waiting for calibration. Canary deploys skip it automatically — canaries are for testing config, not calibration. The export command also supports --skip-first-message to omit it from exported YAML.",
      code: {
        language: "bash",
        title: "Skipping first_message",
        code: `# Skip calibration for fast deploy
lettactl apply -f fleet.yaml --skip-first-message

# Canary deploys auto-skip (testing, not calibration)
lettactl apply -f fleet.yaml --canary

# Promote to production (sends first_message if configured)
lettactl apply -f fleet.yaml --canary --promote

# Export without first_message
lettactl export agent support-agent -f yaml --skip-first-message -o agents.yml`,
      },
    },
    {
      heading: "Retraining: Delete and Redeploy",
      content:
        "Since first_message only fires on creation, retraining means destroying the agent and creating it fresh. This is the nuclear option — the agent loses all conversation history and learned memory. Use it when the agent has drifted so far that patching memory isn't enough. Delete the agent, then apply the config again. The first_message runs on the fresh agent.",
      code: {
        language: "bash",
        title: "Delete and redeploy for retraining",
        code: `# Delete the agent
lettactl delete agent support-agent

# Redeploy — first_message fires on the new agent
lettactl apply -f fleet.yaml

# Or delete and redeploy in one step with destroy + apply
lettactl delete agent support-agent && lettactl apply -f fleet.yaml`,
      },
    },
    {
      heading: "Retraining in Place with Bulk Messaging",
      content:
        "If you don't want to destroy the agent, you can recalibrate it by sending a message that tells it to re-read its memory and correct itself. This works for single agents or entire fleets. The agent keeps its conversation history but reorients around its current memory blocks. Use glob patterns or tags to target specific agents.",
      code: {
        language: "bash",
        title: "Recalibrate agents in place",
        code: `# Recalibrate a single agent
lettactl send support-agent "Re-read all your memory blocks. Your company info and policies have been updated. Summarize what changed."

# Recalibrate all support agents
lettactl send --all "support-*" "Your memory blocks have been updated with new product information. Review your company_info block and confirm you see the changes." --confirm

# Recalibrate by tag (all agents for a tenant)
lettactl send --tags "tenant:acme" "Company policies have changed. Re-read your memory blocks and acknowledge the updates." --confirm

# Recalibrate entire fleet
lettactl send --all "*" "System update: review your memory blocks and tools. Confirm your role and current capabilities." --confirm`,
      },
    },
    {
      heading: "Post-Deploy Recalibration with --recalibrate",
      content:
        "The apply command supports --recalibrate to automatically send a calibration message to agents that had changes applied. This is simpler than manually using lettactl send — the apply command already knows which agents changed, so it only recalibrates the ones that need it. Unchanged agents are skipped entirely.",
      code: {
        language: "bash",
        title: "Recalibrate on apply",
        code: `# Update config and recalibrate agents that changed
lettactl apply -f fleet.yaml --recalibrate

# Custom calibration message
lettactl apply -f fleet.yaml --recalibrate --recalibrate-message "Your gather_competitive_data tool has been fixed."

# Only recalibrate support agents that changed
lettactl apply -f fleet.yaml --recalibrate --recalibrate-tags "role:support"

# Only recalibrate agents matching a glob
lettactl apply -f fleet.yaml --recalibrate --recalibrate-match "*-puma-*"

# Fire-and-forget (don't wait for responses, useful in CI)
lettactl apply -f fleet.yaml --recalibrate --no-wait`,
      },
    },
    {
      heading: "--recalibrate vs Manual Bulk Messaging",
      content:
        "Use --recalibrate on apply when deploying config changes and you want automatic post-deploy calibration — it targets only agents with diffs and requires no extra commands. Use lettactl send for ad-hoc recalibration independent of deployment, when you need per-agent custom messages, or when you want to recalibrate agents that weren't part of an apply run.",
    },
    {
      heading: "Recalibration via the SDK",
      content:
        "For programmatic retraining — like after updating shared memory blocks — use the SDK to send recalibration messages. Update the memory content first, apply the config, then send a bulk message telling agents to re-read their memory.",
      code: {
        language: "typescript",
        title: "SDK recalibration after memory update",
        code: `import { LettaCtl } from 'lettactl'

const ctl = new LettaCtl({
  lettaBaseUrl: 'http://localhost:8283',
})

async function recalibrateFleet(pattern: string, reason: string) {
  // Step 1: Apply updated config (memory blocks, prompts, etc.)
  await ctl.deployFleet(updatedConfig)

  // Step 2: Send recalibration message to all matching agents
  const results = await ctl.bulkSendMessage(
    \`Your configuration has been updated: \${reason}. Re-read your memory blocks and confirm you understand the changes.\`,
    { pattern, confirm: true, timeout: 60 }
  )

  // Step 3: Check results
  const failed = results.filter(r => r.status !== 'completed')
  if (failed.length > 0) {
    console.error(\`\${failed.length} agents failed recalibration\`)
  }
}

// After updating product info
await recalibrateFleet('support-*', 'Product catalog updated with Q2 pricing')`,
      },
    },
    {
      heading: "When to Retrain vs Recalibrate",
      content:
        "Recalibrate in place (bulk message) when you've updated memory blocks, changed shared content, or want agents to re-read their context. This is fast and preserves conversation history. Delete and redeploy (retrain) when the agent's memory is corrupted, it's learned bad patterns from conversations, or you've fundamentally changed its role. Retraining is slower but gives you a clean slate.",
    },
  ],
}
