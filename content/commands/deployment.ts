import type { CommandDoc } from "../types"

export const groupTitle = "Deployment"
export const groupDescription =
  "Deploy and validate agent fleet configurations."

export const commands: CommandDoc[] = [
  {
    name: "apply",
    description: "Deploy agents from a YAML configuration file. The diff engine compares desired state against server state and applies only the necessary changes.",
    usage: "lettactl apply [options]",
    flags: [
      { flag: "--file", short: "-f", description: "Agent YAML configuration file", type: "string", default: "agents.yml" },
      { flag: "--agent", description: "Deploy only agents matching this name", type: "string" },
      { flag: "--match", description: "Apply template config to existing agents matching glob pattern (merge semantics)", type: "string" },
      { flag: "--dry-run", description: "Preview changes without applying them", type: "boolean" },
      { flag: "--force", description: "Strict reconciliation — remove resources not in config", type: "boolean" },
      { flag: "--root", description: "Root directory for resolving relative file paths", type: "string" },
      { flag: "--manifest", description: "Write a JSON manifest with resource IDs after deploy", type: "string" },
      { flag: "--skip-first-message", description: "Skip sending the first_message on agent creation", type: "boolean" },
      { flag: "--canary", description: "Deploy canary copies of agents (CANARY- prefix)", type: "boolean" },
      { flag: "--canary-prefix", description: "Custom prefix for canary agents", type: "string", default: "CANARY-" },
      { flag: "--promote", description: "Promote canary config to production agents", type: "boolean" },
      { flag: "--cleanup", description: "Remove canary agents after promotion", type: "boolean" },
    ],
    examples: [
      { title: "Basic deploy", code: "lettactl apply -f fleet.yaml" },
      { title: "Dry run preview", code: "lettactl apply -f fleet.yaml --dry-run" },
      { title: "Deploy single agent", code: "lettactl apply -f fleet.yaml --agent my-agent" },
      { title: "Template application", code: "lettactl apply -f template.yaml --match 'support-*'" },
      { title: "Canary deploy + promote", code: "lettactl apply -f fleet.yaml --canary\nlettactl apply -f fleet.yaml --canary --promote --cleanup" },
    ],
    seeAlso: ["validate", "get agents"],
  },
  {
    name: "validate",
    description: "Check a YAML configuration file for syntax errors and schema violations without deploying.",
    usage: "lettactl validate [options]",
    flags: [
      { flag: "--file", short: "-f", description: "Configuration file to validate", type: "string" },
    ],
    examples: [
      { title: "Validate config", code: "lettactl validate -f fleet.yaml" },
    ],
  },
]
