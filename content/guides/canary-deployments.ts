import type { GuidePage } from "./index"

export const guide: GuidePage = {
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
}
