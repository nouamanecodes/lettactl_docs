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
      { flag: "--watch", short: "-w", description: "Continuously poll and refresh the run list (Ctrl+C to stop)", type: "boolean" },
    ],
    examples: [
      { title: "Active runs", code: "lettactl runs --active" },
      { title: "Agent runs", code: "lettactl runs -a my-agent" },
      { title: "Watch mode", code: "lettactl get runs --watch --active" },
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
    name: "track",
    description: "Track async runs until completion. Auto-exits when all runs reach a terminal state. Exit code 1 if any run failed (CI/CD friendly).",
    usage: "lettactl track [run-ids...] [options]",
    flags: [
      { flag: "--agent", short: "-a", description: "Track all active runs for an agent", type: "string" },
    ],
    examples: [
      { title: "Track specific runs", code: "lettactl track <run-id-1> <run-id-2>" },
      { title: "Track by agent", code: "lettactl track --agent my-agent" },
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
