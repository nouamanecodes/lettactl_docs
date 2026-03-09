import type { CommandDoc } from "../types"

export const groupTitle = "Remote Environments"
export const groupDescription =
  "Manage named Letta server connections — like git remotes for your agent infrastructure."

export const commands: CommandDoc[] = [
  {
    name: "remote add",
    description: "Register a named Letta server. The first remote added is automatically activated.",
    usage: "lettactl remote add <name> <url> [options]",
    flags: [
      { flag: "--api-key", description: "API key for authentication (required for Letta Cloud)", type: "string" },
    ],
    examples: [
      { title: "Self-hosted server", code: "lettactl remote add local http://localhost:8283" },
      { title: "Letta Cloud", code: "lettactl remote add production https://api.letta.com --api-key sk-xxx" },
      { title: "Staging environment", code: "lettactl remote add staging https://staging.example.com --api-key sk-stg-xxx" },
    ],
    notes: [
      "The first remote added is auto-activated.",
      "Remote configs are stored in ~/.lettactl/remotes.json.",
    ],
  },
  {
    name: "remote remove",
    description: "Remove a named remote. If the active remote is removed, the first remaining remote becomes active.",
    usage: "lettactl remote remove <name>",
    flags: [],
    examples: [
      { title: "Remove a remote", code: "lettactl remote remove staging" },
    ],
  },
  {
    name: "remote use",
    description: "Set the active remote. All subsequent commands will target this server.",
    usage: "lettactl remote use <name>",
    flags: [],
    examples: [
      { title: "Switch to production", code: "lettactl remote use production" },
      { title: "Switch and apply to shell", code: "lettactl remote use staging && eval $(lettactl remote env)" },
    ],
    notes: [
      "The active remote is loaded automatically on every CLI invocation.",
      "Explicit LETTA_BASE_URL environment variable always takes precedence over the active remote.",
    ],
  },
  {
    name: "remote list",
    description: "List all configured remotes. The active remote is marked with an asterisk (*).",
    usage: "lettactl remote list",
    flags: [],
    examples: [
      { title: "List remotes", code: "lettactl remote list" },
    ],
  },
  {
    name: "remote show",
    description: "Show details of a specific remote including URL and API key status.",
    usage: "lettactl remote show <name>",
    flags: [],
    examples: [
      { title: "Show remote details", code: "lettactl remote show production" },
    ],
  },
  {
    name: "remote env",
    description: "Output shell export statements for the active remote. Use with eval to apply to current session.",
    usage: "lettactl remote env",
    flags: [],
    examples: [
      { title: "Apply to current shell", code: "eval $(lettactl remote env)" },
      { title: "Add to shell profile", code: 'eval $(lettactl remote env 2>/dev/null)' },
    ],
    notes: [
      "Outputs to stdout for use with eval. Errors go to stderr.",
      "Useful for CI/CD scripts that need environment variables set.",
    ],
  },
]
