import type { CommandDoc } from "../types"

export const groupTitle = "Fleet Reporting"
export const groupDescription =
  "Analyze memory usage and health across your agent fleet."

export const commands: CommandDoc[] = [
  {
    name: "report memory",
    description: "Analyze memory block usage across agents. Shows fill percentages with color coding. In analyze mode, agents self-diagnose their own memory health using LLM calls.",
    usage: "lettactl report memory [agent] [options]",
    flags: [
      { flag: "--all", description: "Report on all agents", type: "boolean" },
      { flag: "--match", description: "Filter agents by wildcard pattern", type: "string" },
      { flag: "--tags", description: "Filter agents by tags", type: "string" },
      { flag: "--analyze", description: "LLM-powered deep analysis (sends messages to agents)", type: "boolean" },
      { flag: "--confirm", description: "Skip confirmation for analyze mode", type: "boolean" },
      { flag: "--output", short: "-o", description: "Output format", type: "json" },
    ],
    examples: [
      { title: "All agents", code: "lettactl report memory --all" },
      { title: "By tag", code: "lettactl report memory --tags 'tenant:acme'" },
      { title: "Deep analysis", code: "lettactl report memory my-agent --analyze" },
      { title: "Bulk analysis", code: "lettactl report memory --all --analyze --confirm" },
    ],
    notes: [
      "Color coding: green (<50% full), yellow (50-79%), red (80%+)",
      "Analyze mode costs tokens — each agent receives a diagnostic message",
      "Analysis reports: topic count, space status, stale info, redundancies, suggested actions",
    ],
  },
]
