import type { CommandDoc } from "../types"

export const groupTitle = "Lifecycle"
export const groupDescription =
  "Create, update, and delete agents and resources."

export const commands: CommandDoc[] = [
  {
    name: "create agent",
    description: "Create a new agent directly from CLI flags without a YAML file.",
    usage: "lettactl create agent <name> [options]",
    flags: [
      { flag: "--description", description: "Agent description", type: "string" },
      { flag: "--model", description: "LLM model identifier", type: "string" },
      { flag: "--system", description: "System prompt text", type: "string" },
      { flag: "--context-window", description: "Context window size in tokens", type: "number" },
      { flag: "--embedding", description: "Embedding model", type: "string" },
      { flag: "--timezone", description: "Agent timezone", type: "string" },
      { flag: "--tags", description: "Comma-separated tags", type: "string" },
      { flag: "--tools", description: "Comma-separated tool names", type: "string" },
      { flag: "--memory-blocks", description: "Memory block definitions", type: "string" },
    ],
    examples: [
      { title: "Quick agent", code: "lettactl create agent my-agent \\\n  --description 'Test agent' \\\n  --model 'openai/gpt-4o' \\\n  --system 'You are a helpful assistant.'" },
    ],
  },
  {
    name: "update agent",
    description: "Modify an existing agent's configuration.",
    usage: "lettactl update agent <name> [options]",
    flags: [
      { flag: "--name", description: "New name", type: "string" },
      { flag: "--description", description: "New description", type: "string" },
      { flag: "--model", description: "New LLM model", type: "string" },
      { flag: "--system", description: "New system prompt", type: "string" },
      { flag: "--context-window", description: "New context window size", type: "number" },
      { flag: "--add-tool", description: "Add a tool", type: "string" },
      { flag: "--remove-tool", description: "Remove a tool", type: "string" },
      { flag: "--tags", description: "Replace tags", type: "string" },
    ],
    examples: [
      { title: "Update model", code: "lettactl update agent my-agent --model 'openai/gpt-4o-mini'" },
      { title: "Add tool", code: "lettactl update agent my-agent --add-tool archival_memory_search" },
    ],
  },
  {
    name: "delete",
    description: "Delete a specific resource by name.",
    usage: "lettactl delete <resource> <name> [options]",
    flags: [
      { flag: "--force", description: "Skip confirmation prompt", type: "boolean" },
    ],
    examples: [
      { title: "Delete agent", code: "lettactl delete agent my-agent" },
      { title: "Force delete", code: "lettactl delete agent my-agent --force" },
    ],
  },
  {
    name: "delete-all",
    description: "Bulk delete resources matching a pattern. Preserves shared resources used by other agents.",
    usage: "lettactl delete-all <resource> [options]",
    flags: [
      { flag: "--pattern", description: "Regex pattern to match resource names", type: "string" },
      { flag: "--force", description: "Actually delete (required to confirm)", type: "boolean" },
    ],
    examples: [
      { title: "Preview deletion", code: "lettactl delete-all agents --pattern 'test-.*'" },
      { title: "Execute deletion", code: "lettactl delete-all agents --pattern 'test-.*' --force" },
    ],
  },
  {
    name: "cleanup",
    description: "Remove orphaned resources (blocks, folders, archives) not attached to any agent. Dry-run by default.",
    usage: "lettactl cleanup <resource> [options]",
    flags: [
      { flag: "--force", description: "Actually delete orphans (default is dry-run)", type: "boolean" },
    ],
    examples: [
      { title: "Preview orphans", code: "lettactl cleanup all" },
      { title: "Delete orphaned blocks", code: "lettactl cleanup blocks --force" },
    ],
    notes: ["Resources: blocks, folders, archives, all"],
  },
]
