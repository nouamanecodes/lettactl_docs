import type { CommandDoc } from "../types"

export const groupTitle = "Import / Export"
export const groupDescription =
  "Export agents to files and import them back."

export const commands: CommandDoc[] = [
  {
    name: "export agent",
    description: "Export an agent's configuration to a file. Supports Letta-native JSON or git-trackable YAML formats.",
    usage: "lettactl export agent <name> [options]",
    flags: [
      { flag: "--format", short: "-f", description: "Export format", type: "json | yaml", default: "json" },
      { flag: "--output", short: "-o", description: "Output file path", type: "string" },
      { flag: "--legacy-format", description: "Use legacy v1 export format", type: "boolean" },
      { flag: "--skip-first-message", description: "Omit first_message from YAML export", type: "boolean" },
      { flag: "--max-steps", description: "Limit exported processing steps", type: "number" },
    ],
    examples: [
      { title: "Export as YAML", code: "lettactl export agent my-agent -f yaml -o agent.yaml" },
      { title: "Export as JSON", code: "lettactl export agent my-agent -o backup.json" },
    ],
  },
  {
    name: "import",
    description: "Import an agent from a previously exported file.",
    usage: "lettactl import <file> [options]",
    flags: [
      { flag: "--name", description: "Override the agent name", type: "string" },
      { flag: "--append-copy", description: "Add '_copy' suffix to avoid name conflicts", type: "boolean" },
      { flag: "--embedding", description: "Override embedding model", type: "string" },
      { flag: "--override-tools", description: "Overwrite existing tool source code", type: "boolean" },
      { flag: "--strip-messages", description: "Remove message history from import", type: "boolean" },
      { flag: "--secrets", description: "Inject secrets as JSON", type: "string" },
      { flag: "--env-vars", description: "Inject environment variables as JSON", type: "string" },
    ],
    examples: [
      { title: "Basic import", code: "lettactl import backup.json" },
      { title: "Import with new name", code: "lettactl import backup.json --name 'my-agent-v2'" },
      { title: "Clean import", code: "lettactl import backup.json --strip-messages --append-copy" },
    ],
  },
]
