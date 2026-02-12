import type { CommandDoc } from "../types"

export const groupTitle = "Messaging"
export const groupDescription =
  "Send messages to agents and manage conversation history."

export const commands: CommandDoc[] = [
  {
    name: "send",
    description: "Send a message to one or more agents. Supports streaming, synchronous, and fire-and-forget modes.",
    usage: "lettactl send <agent> <message> [options]",
    flags: [
      { flag: "--stream", description: "Stream the response in real-time", type: "boolean" },
      { flag: "--sync", description: "Synchronous mode (may timeout on long responses)", type: "boolean" },
      { flag: "--no-wait", description: "Fire-and-forget — returns a run ID immediately", type: "boolean" },
      { flag: "--all", description: "Send to all agents matching a glob pattern", type: "string" },
      { flag: "--file", short: "-f", description: "Target agents from a fleet config file", type: "string" },
      { flag: "--confirm", description: "Skip confirmation for bulk operations", type: "boolean" },
      { flag: "--timeout", description: "Timeout per agent in seconds", type: "number" },
      { flag: "--max-steps", description: "Maximum processing steps", type: "number" },
      { flag: "--enable-thinking", description: "Enable agent reasoning/thinking", type: "boolean" },
    ],
    examples: [
      { title: "Simple message", code: "lettactl send my-agent 'Hello!'" },
      { title: "Streaming", code: "lettactl send my-agent 'Tell me a story' --stream" },
      { title: "Bulk message", code: "lettactl send --all 'support-*' 'Update your greeting' --confirm" },
      { title: "Fire and forget", code: "lettactl send my-agent 'Process this' --no-wait" },
    ],
  },
  {
    name: "messages",
    description: "List conversation history for an agent.",
    usage: "lettactl messages <agent> [options]",
    flags: [
      { flag: "--limit", short: "-l", description: "Number of messages to show", type: "number", default: "10" },
      { flag: "--all", short: "-a", description: "Show all messages", type: "boolean" },
      { flag: "--system", description: "Include system messages", type: "boolean" },
      { flag: "--order", description: "Sort order", type: "asc | desc" },
      { flag: "--before", description: "Messages before this ID", type: "string" },
      { flag: "--after", description: "Messages after this ID", type: "string" },
    ],
    examples: [
      { title: "Recent messages", code: "lettactl messages my-agent" },
      { title: "All messages", code: "lettactl messages my-agent --all" },
      { title: "With system", code: "lettactl messages my-agent --system -l 20" },
    ],
  },
  {
    name: "reset-messages",
    description: "Clear an agent's conversation history.",
    usage: "lettactl reset-messages <agent> [options]",
    flags: [
      { flag: "--add-default", description: "Add default initial messages after reset", type: "boolean" },
    ],
    examples: [
      { title: "Reset", code: "lettactl reset-messages my-agent" },
      { title: "Reset with defaults", code: "lettactl reset-messages my-agent --add-default" },
    ],
  },
  {
    name: "compact-messages",
    description: "Summarize and compress an agent's message history to free context window space.",
    usage: "lettactl compact-messages <agent>",
    flags: [],
    examples: [
      { title: "Compact", code: "lettactl compact-messages my-agent" },
    ],
  },
  {
    name: "cancel-messages",
    description: "Cancel running message processing for an agent.",
    usage: "lettactl cancel-messages <agent> [options]",
    flags: [
      { flag: "--run-ids", description: "Specific run IDs to cancel", type: "string" },
    ],
    examples: [
      { title: "Cancel all", code: "lettactl cancel-messages my-agent" },
    ],
  },
]
