import type { CommandDoc } from "../types"

export const groupTitle = "Inspection"
export const groupDescription =
  "List and inspect agents, blocks, tools, and other resources."

export const commands: CommandDoc[] = [
  {
    name: "get",
    description: "List resources on the Letta server. Supports agents, blocks, archives, tools, folders, files, mcp-servers, and archival memory.",
    usage: "lettactl get <resource> [options]",
    flags: [
      { flag: "--output", short: "-o", description: "Output format", type: "table | json | yaml | wide" },
      { flag: "--agent", short: "-a", description: "Filter by agent name", type: "string" },
      { flag: "--shared", description: "Show resources used by 2+ agents", type: "boolean" },
      { flag: "--orphaned", description: "Show resources attached to 0 agents", type: "boolean" },
      { flag: "--tags", description: "Filter agents by tags (AND logic)", type: "string" },
      { flag: "--canary", description: "Show only canary agents", type: "boolean" },
      { flag: "--full", description: "Show full archival entry text", type: "boolean" },
      { flag: "--query", description: "Semantic search in archival memory", type: "string" },
    ],
    examples: [
      { title: "List all agents", code: "lettactl get agents" },
      { title: "JSON output", code: "lettactl get agents -o json" },
      { title: "Shared blocks", code: "lettactl get blocks --shared" },
      { title: "Filter by tag", code: "lettactl get agents --tags 'tenant:acme'" },
      { title: "Search archival", code: "lettactl get archival -a my-agent --query 'pricing'" },
    ],
  },
  {
    name: "describe",
    description: "Show detailed information about a specific resource including full config, attached resources, and source code.",
    usage: "lettactl describe <resource> <name> [options]",
    flags: [
      { flag: "--canary", description: "Describe the canary version", type: "boolean" },
    ],
    examples: [
      { title: "Describe agent", code: "lettactl describe agent my-agent" },
      { title: "Describe block", code: "lettactl describe block brand_guidelines" },
      { title: "Describe tool", code: "lettactl describe tool my-custom-tool" },
    ],
  },
  {
    name: "files",
    description: "Show file attachment state (open/closed) for an agent.",
    usage: "lettactl files <agent-name>",
    flags: [],
    examples: [
      { title: "View files", code: "lettactl files my-agent" },
    ],
  },
  {
    name: "context",
    description: "Show context window token usage breakdown for an agent.",
    usage: "lettactl context <agent-name>",
    flags: [],
    examples: [
      { title: "View context", code: "lettactl context my-agent" },
    ],
  },
]
