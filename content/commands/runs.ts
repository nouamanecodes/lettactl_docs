import type { CommandDoc } from "../types"

export const groupTitle = "Async Runs"
export const groupDescription =
  "Monitor and manage asynchronous agent processing jobs."

export const commands: CommandDoc[] = [
  {
    name: "runs",
    description: "List async job runs across agents.",
    usage: "lettactl get runs [agent] [options]",
    flags: [
      { flag: "--active", description: "Show only active/running jobs", type: "boolean" },
      { flag: "--agent", short: "-a", description: "Filter by agent name (alias for positional)", type: "string" },
      { flag: "--limit", short: "-l", description: "Limit number of results", type: "number" },
      { flag: "--watch", short: "-w", description: "Continuously poll and refresh the run list (Ctrl+C to stop)", type: "boolean" },
    ],
    examples: [
      { title: "All runs", code: "lettactl get runs" },
      { title: "Agent runs", code: "lettactl get runs my-agent" },
      { title: "Active runs", code: "lettactl get runs --active" },
      { title: "Watch mode", code: "lettactl get runs my-agent --watch" },
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
  {
    name: "SDK: Run Management",
    description: "The LettaCtl SDK exposes run management methods for programmatic use: sendMessage, getRun, waitForRun, listRuns, and deleteRun.",
    usage: "import { LettaCtl } from 'lettactl'",
    flags: [],
    examples: [
      { title: "Send message and wait", code: `const ctl = new LettaCtl({ lettaBaseUrl: 'http://localhost:8283' });
const run = await ctl.sendMessage(agentId, 'Hello');
const completed = await ctl.waitForRun(run.id, { timeout: 60 });` },
      { title: "List runs for an agent", code: `const runs = await ctl.listRuns(agentId);
const activeRuns = await ctl.listRuns(agentId, { active: true });
const limited = await ctl.listRuns(agentId, { limit: 5 });` },
      { title: "Cancel a run", code: `await ctl.deleteRun(runId);` },
      { title: "Check run status", code: `import { isRunTerminal, getEffectiveRunStatus } from 'lettactl';
const run = await ctl.getRun(runId);
if (isRunTerminal(run)) {
  console.log('Done:', getEffectiveRunStatus(run));
}` },
    ],
  },
]
