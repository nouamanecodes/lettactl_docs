import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "run-tracking",
  title: "Run Tracking",
  description:
    "Monitor async agent runs in real-time. Use watch mode for broad fleet monitoring, or the track command for focused parallel run tracking that auto-exits on completion — perfect for CI/CD pipelines and scripted workflows.",
  sections: [
    {
      heading: "How Async Runs Work",
      content:
        "When you send a message to an agent without --stream or --sync, lettactl creates an async run. The server returns a run ID immediately while the agent processes the message in the background. Each run progresses through states: created → running → completed/failed/cancelled. You can check a run's status at any time, poll until completion, or use the tracking features described below to monitor multiple runs simultaneously.",
    },
    {
      heading: "Sending Async Messages",
      content:
        "Use --no-wait to send a message and get the run ID back immediately without waiting for the agent to finish processing. This is the foundation for all tracking workflows — you fire off one or more messages, collect the run IDs, then track them to completion.",
      code: {
        language: "bash",
        title: "Fire-and-forget messaging",
        code: `# Send and get run ID immediately
lettactl send my-agent "Process this data" --no-wait
# Output: Message sent. Run ID: run-abc123...

# Check status later
lettactl get run run-abc123

# Wait for completion and show messages
lettactl get run run-abc123 --wait --messages`,
      },
    },
    {
      heading: "Listing Runs",
      content:
        "The get runs command shows all recent runs in a formatted table with agent name, status (color-coded), elapsed time, and stop reason. Use filters to narrow the view. JSON output is available for scripting.",
      code: {
        language: "bash",
        title: "Listing and filtering runs",
        code: `# List all recent runs (default: 20)
lettactl get runs

# Active runs only
lettactl get runs --active

# Runs for a specific agent
lettactl get runs --agent my-agent

# Combine filters
lettactl get runs --active --agent my-agent --limit 50

# JSON output for scripting
lettactl get runs --active -o json`,
      },
    },
    {
      heading: "Watch Mode",
      content:
        "Add --watch (-w) to get runs for a live-updating dashboard. The display refreshes every 2 seconds, showing the current state of all matching runs. Use Ctrl+C to stop watching. Watch mode works with all existing filters — combine it with --active to monitor only running jobs, or --agent to watch a specific agent's runs.",
      code: {
        language: "bash",
        title: "Watch mode examples",
        code: `# Watch all runs (refreshes every 2s)
lettactl get runs --watch

# Watch only active runs
lettactl get runs --watch --active

# Watch runs for a specific agent
lettactl get runs --watch --agent my-agent

# Watch active runs for a specific agent
lettactl get runs --watch --active --agent my-agent --limit 10`,
      },
    },
    {
      heading: "Tracking Specific Runs",
      content:
        "The track command monitors one or more runs until they all reach a terminal state (completed, failed, or cancelled). Unlike watch mode, track auto-exits when all runs finish. It polls every 1 second for responsive tracking, displays run messages on completion, and returns exit code 1 if any run failed. This makes it ideal for CI/CD pipelines and scripted workflows.",
      code: {
        language: "bash",
        title: "Track specific runs",
        code: `# Track a single run
lettactl track run-abc123

# Track multiple runs in parallel
lettactl track run-abc123 run-def456 run-ghi789

# Track shows:
# - Live table with status, elapsed time, stop reason
# - Messages for each run as it completes
# - Summary when all runs finish
# - Exit code 0 if all succeed, 1 if any failed`,
      },
    },
    {
      heading: "Tracking by Agent",
      content:
        "Use --agent to automatically discover and track all active runs for an agent. This is useful when you've sent multiple messages to the same agent and want to wait for all of them to finish.",
      code: {
        language: "bash",
        title: "Track by agent",
        code: `# Send multiple messages
lettactl send my-agent "Process batch 1" --no-wait
lettactl send my-agent "Process batch 2" --no-wait
lettactl send my-agent "Process batch 3" --no-wait

# Track all active runs for the agent
lettactl track --agent my-agent
# Automatically discovers and tracks all 3 runs`,
      },
    },
    {
      heading: "Using in CI/CD",
      content:
        "The track command is designed for CI/CD integration. Send messages with --no-wait, collect run IDs, then track them all to completion. The exit code reflects the aggregate result: 0 if all runs succeeded, 1 if any failed. Combine with --no-ux for clean output in non-interactive environments.",
      code: {
        language: "bash",
        title: "CI/CD pipeline example",
        code: `#!/bin/bash
set -e

# Deploy fleet
lettactl apply -f fleet.yaml

# Send calibration messages to all agents, collect run IDs
RUN1=$(lettactl send agent-1 "Recalibrate" --no-wait --no-ux 2>&1 | grep -ao 'run-[a-z0-9-]\\{20,\\}' | head -1)
RUN2=$(lettactl send agent-2 "Recalibrate" --no-wait --no-ux 2>&1 | grep -ao 'run-[a-z0-9-]\\{20,\\}' | head -1)
RUN3=$(lettactl send agent-3 "Recalibrate" --no-wait --no-ux 2>&1 | grep -ao 'run-[a-z0-9-]\\{20,\\}' | head -1)

# Track all runs — exits 0 on success, 1 on failure
lettactl track "$RUN1" "$RUN2" "$RUN3" --no-ux

echo "All agents calibrated successfully"`,
      },
    },
    {
      heading: "Workflow: Bulk Send + Track",
      content:
        "For fleet-wide operations, combine bulk messaging with agent-based tracking. Send a message to all agents matching a pattern using --no-wait, then use track to monitor completion. This is faster than synchronous bulk messaging for large fleets since you get parallel execution with centralized monitoring.",
      code: {
        language: "bash",
        title: "Bulk send and track workflow",
        code: `# Option 1: Use apply with --recalibrate --no-wait, then track
lettactl apply -f fleet.yaml --recalibrate --no-wait
lettactl get runs --watch --active

# Option 2: Send to specific agent and track
lettactl send my-agent "Update your knowledge base" --no-wait
# Output: Message sent. Run ID: run-abc123...
lettactl track run-abc123

# Option 3: Track all active runs across the fleet
lettactl track --agent agent-1 &
lettactl track --agent agent-2 &
wait  # Wait for all tracking processes`,
      },
    },
    {
      heading: "Run States and Stop Reasons",
      content:
        "Runs progress through states and may have stop reasons that provide additional context. A run is terminal when its status is completed, failed, or cancelled — or when it has a terminal stop reason like end_turn, error, or max_steps. The track command uses both status and stop_reason to determine when a run has finished, handling edge cases where the server status lags behind the actual completion.",
      code: {
        language: "bash",
        title: "Understanding run output",
        code: `# Status values:
#   created    - Run queued, not yet started
#   running    - Agent is processing
#   completed  - Finished successfully
#   failed     - Encountered an error
#   cancelled  - Manually cancelled

# Common stop reasons:
#   end_turn              - Agent finished normally
#   max_steps             - Hit step limit
#   error                 - Processing error
#   llm_api_error         - LLM provider error
#   max_tokens_exceeded   - Output too long
#   cancelled             - User cancelled`,
      },
    },
  ],
}
