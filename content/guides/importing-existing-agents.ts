import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "importing-existing-agents",
  title: "Importing Existing Agents",
  description:
    "Already have agents running on Letta? Export them to YAML, check them into git, and manage them with lettactl going forward. No need to rewrite configs from scratch.",
  sections: [
    {
      heading: "Why Export First",
      content:
        "If you've been creating agents through the Letta UI, Python SDK, or API, you already have running agents with system prompts, memory blocks, tools, and conversation history. You don't need to rewrite all of that as YAML from scratch. The export command captures your agent's current configuration as a lettactl-compatible YAML file that you can immediately apply, version control, and manage declaratively.",
    },
    {
      heading: "Export a Single Agent",
      content:
        "Use lettactl export agent with the -f yaml flag to generate a fleet-compatible YAML file. The output includes the agent's name, system prompt, LLM config, memory blocks, custom tools, folders, archives, and tags. Built-in tools (memory, search, archival) are automatically filtered out since the server re-attaches them on creation.",
      code: {
        language: "bash",
        title: "Export an agent to YAML",
        code: `# Export to a file
lettactl export agent support-agent -f yaml -o support-agent.yml

# Export to stdout (pipe to other tools)
lettactl export agent support-agent -f yaml

# Export without the calibration message
lettactl export agent support-agent -f yaml --skip-first-message -o support-agent.yml`,
      },
    },
    {
      heading: "What Gets Exported",
      content:
        "The YAML export captures everything lettactl needs to recreate the agent: name, description, system_prompt, llm_config (model, context_window, max_tokens, reasoning), embedding config, tags, agent-owned memory blocks (with current values), custom tools (by name), folders (with filenames), archives, and first_message if one was configured. Conversation history is NOT included — YAML captures configuration only, not state.",
      code: {
        language: "yaml",
        title: "Example exported YAML",
        code: `agents:
  - name: support-agent
    description: "Customer support assistant"
    system_prompt:
      value: |
        You are a customer support agent for Acme Corp.
        Always be helpful and professional.
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    reasoning: true
    tags:
      - "tenant:acme"
      - "role:support"
    memory_blocks:
      - name: customer_context
        description: "Current customer information"
        limit: 5000
        agent_owned: true
        value: "No customer context loaded yet."
    tools:
      - custom_lookup
      - ticket_creator
    archives:
      - name: knowledge-base
        description: "FAQ and documentation"
        embedding: openai/text-embedding-3-small`,
      },
    },
    {
      heading: "Bulk Export",
      content:
        "Use lettactl export agents to export multiple agents at once. You can export your entire fleet, match agents by glob pattern, or filter by tags. All variants output a single fleet YAML with every matched agent in the agents array.",
      code: {
        language: "bash",
        title: "Bulk export agents",
        code: `# Export every agent to a single fleet YAML
lettactl export agents --all -f yaml -o fleet.yaml

# Export agents matching a glob pattern
lettactl export agents --match "support-*" -f yaml -o support-fleet.yaml

# Export agents by tags (AND logic — all tags must match)
lettactl export agents --tags "tenant:acme,role:support" -f yaml -o acme-support.yaml`,
      },
    },
    {
      heading: "Verify with Dry Run",
      content:
        "Before applying your exported YAML, run a dry run to see what lettactl would do. If the agent already exists and the config matches, you'll see UNCHANGED — that confirms the export is accurate. If you see UPDATE, the diff shows what's different between the server state and the exported config.",
      code: {
        language: "bash",
        title: "Verify exported config",
        code: `# Dry run — should show UNCHANGED if export is accurate
lettactl apply -f support-agent.yml --dry-run

# Output:
# [=] support-agent (UNCHANGED)
# Summary: 0 changes`,
      },
    },
    {
      heading: "Check Into Git",
      content:
        "Once exported, commit the YAML to version control. This is the starting point for declarative management — from now on, the YAML is the source of truth. Edit the YAML, apply it, and the diff engine updates only what changed.",
      code: {
        language: "bash",
        title: "Version control your agents",
        code: `# Initial commit of exported configs
git add support-agent.yml
git commit -m "import: capture existing agent configs"

# From now on, make changes in YAML and apply
vim support-agent.yml  # Edit system prompt, add a tool, etc.
lettactl apply -f support-agent.yml --dry-run  # Preview changes
lettactl apply -f support-agent.yml             # Apply changes
git add support-agent.yml && git commit -m "update: new system prompt"`,
      },
    },
    {
      heading: "Merging into a Fleet Config",
      content:
        "If you exported agents individually, you can merge them into a single fleet YAML. A fleet config has a top-level agents array and optional shared_blocks, shared_folders, and other shared resources. This lets you manage your entire fleet from one file.",
      code: {
        language: "yaml",
        title: "Merged fleet config",
        code: `# fleet.yaml — all agents in one file
agents:
  - name: support-agent
    description: "Customer support"
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      from_file: prompts/support.md
    tools:
      - custom_lookup

  - name: sales-agent
    description: "Sales assistant"
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      from_file: prompts/sales.md
    tools:
      - product_search`,
      },
    },
    {
      heading: "What's Not Exported",
      content:
        "YAML export is configuration-only. Conversation history and message state are not included — the agent keeps its history on the server when you re-apply. Built-in tools (memory_insert, memory_replace, conversation_search, archival_memory_search, etc.) are filtered out since the server auto-attaches them. Shared blocks are not included — only agent-owned blocks. If you use shared blocks, define them separately in your fleet YAML.",
    },
    {
      heading: "Rollback with Git",
      content:
        "Once your agents are in git, rollback is trivial. Revert the commit and re-apply. The diff engine computes what changed and updates the agent in place. Conversation history is preserved — only the configuration is reverted.",
      code: {
        language: "bash",
        title: "Rollback a change",
        code: `# Oops, bad config change
git revert HEAD

# Re-apply the previous config
lettactl apply -f support-agent.yml

# Agent is back to its previous config, conversation history intact`,
      },
    },
  ],
}
