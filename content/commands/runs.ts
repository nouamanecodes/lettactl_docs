import type { CommandDoc } from "../types"

export const groupTitle = "Async Runs"
export const groupDescription =
  "Monitor and manage asynchronous agent processing jobs."

export const commands: CommandDoc[] = [
  {
    name: "runs",
    description: "List async job runs across agents.",
    usage: "lettactl runs [options]",
    flags: [
      { flag: "--active", description: "Show only active/running jobs", type: "boolean" },
      { flag: "--agent", short: "-a", description: "Filter by agent name", type: "string" },
      { flag: "--limit", short: "-l", description: "Limit number of results", type: "number" },
    ],
    examples: [
      { title: "Active runs", code: "lettactl runs --active" },
      { title: "Agent runs", code: "lettactl runs -a my-agent" },
    ],
  },
  {
    name: "run",
    description: "Get details about a specific async run.",
    usage: "lettactl run <run-id> [options]",
    flags: [
      { flag: "--wait", description: "Wait for the run to complete", type: "boolean" },
      { flag: "--stream", description: "Stream run output", type: "boolean" },
      { flag: "--messages", description: "Show messages produced by the run", type: "boolean" },
    ],
    examples: [
      { title: "Check run", code: "lettactl run abc-123" },
      { title: "Wait for completion", code: "lettactl run abc-123 --wait --messages" },
    ],
  },
  {
    name: "run-delete",
    description: "Cancel and delete a specific async run.",
    usage: "lettactl run-delete <run-id>",
    flags: [],
    examples: [
      { title: "Cancel run", code: "lettactl run-delete abc-123" },
    ],
  },
]
