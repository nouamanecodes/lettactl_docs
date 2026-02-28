import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "self-diagnosis",
  title: "Memory Self-Diagnosis",
  description:
    "Let your agents analyze their own memory health. Detect stale data, overcrowded blocks, redundancy, and missing knowledge — using the agents themselves as the diagnostic tool.",
  sections: [
    {
      heading: "Why Self-Diagnosis",
      content:
        "Byte counts tell you a block is 90% full. They don't tell you why. Is it full of useful, current data? Or is it packed with stale facts from six months ago? Only the agent knows — it sees the content, knows what questions it gets asked, and can identify what's outdated or missing. lettactl's report memory --analyze leverages this by messaging each agent with a structured prompt and parsing the response into actionable diagnostics.",
    },
    {
      heading: "Basic Memory Report",
      content:
        "Start with the basic report to see fill percentages across your fleet. Each block shows its character usage, fill percentage, and a content preview. Color-coded: green (< 50%), yellow (50-79%), red (80%+). Shared blocks are marked with * and show all attached agent names.",
      code: {
        language: "bash",
        title: "Basic memory report",
        code: `# Single agent
lettactl report memory support-agent

# All agents
lettactl report memory --all

# Filter by tags
lettactl report memory --tags "tenant:acme"

# Glob pattern
lettactl report memory --match "support-*"`,
      },
    },
    {
      heading: "LLM-Powered Analysis",
      content:
        "Add --analyze to send each agent a structured diagnostic prompt. The agent reads its own memory blocks (first 500 chars of each) and reports back: topic count, health status, whether the block should be split, a summary, stale data, and missing knowledge. This costs tokens — you'll be prompted to confirm unless you pass --confirm.",
      code: {
        language: "bash",
        title: "Run analysis",
        code: `# Analyze with confirmation prompt
lettactl report memory support-agent --analyze

# Skip confirmation (CI-friendly)
lettactl report memory --all --analyze --confirm

# Analyze a tenant's agents
lettactl report memory --tags "tenant:acme" --analyze --confirm`,
      },
    },
    {
      heading: "What the Agent Reports",
      content:
        "For each memory block, the agent produces: TOPICS (number of distinct topics stored), STATUS (healthy, crowded, near-full, or empty), SPLIT (yes/no — should this block be broken up), SUMMARY (one sentence on what's in there), STALE (outdated facts, old dates, deprecated references), and MISSING (topics the agent gets asked about but has no memory for). It also produces an overall assessment: REDUNDANCY level across blocks, CONTRADICTIONS between blocks, and ACTIONS (suggested changes to memory layout).",
    },
    {
      heading: "How It Works Under the Hood",
      content:
        "The analysis uses lettactl's bulk messaging system to send messages to up to 5 agents concurrently. Each agent gets a per-agent prompt built from its actual block data — names, limits, fill percentages, and content previews. The agent responds in a structured plain-text format using === BLOCK: name === markers and KEY: value pairs. lettactl parses this response, extracts the diagnostics, and displays them in a color-coded table with health issues and suggested actions.",
    },
    {
      heading: "Reading the Output",
      content:
        "The analysis output has three sections. First, a table showing each block's topic count, status (color-coded), split recommendation, and summary. Second, a health issues list showing all blocks with stale or missing data. Third, an overall assessment with redundancy level, contradictions, and suggested actions. Status colors: healthy = green, empty = dim, crowded = yellow, near-full = red.",
    },
    {
      heading: "Acting on the Results",
      content:
        "The analysis gives you specific, actionable recommendations. If a block says SPLIT: yes, create two smaller blocks in your YAML and redeploy. If it reports STALE data, update the source content in from_file. If it flags MISSING knowledge, add a new memory block for that topic. If redundancy is high, consolidate overlapping blocks. The agent is telling you what it needs — listen to it.",
      code: {
        language: "yaml",
        title: "Fixing a crowded block",
        code: `# Before: one overcrowded block
memory_blocks:
  - name: notes
    description: "Everything"
    agent_owned: true
    limit: 2000

# After: split based on agent's recommendation
memory_blocks:
  - name: meeting_notes
    description: "Meeting summaries and decisions"
    agent_owned: true
    limit: 3000
  - name: action_items
    description: "Active tasks and follow-ups"
    agent_owned: true
    limit: 2000`,
      },
    },
    {
      heading: "Fleet-Wide Diagnostics",
      content:
        "The real power is running analysis across your entire fleet. Use --all or --tags to diagnose hundreds of agents at once. The bulk messenger runs 5 agents concurrently with real-time status output. Results aggregate into a single report showing which agents need attention. This turns memory maintenance from a manual, per-agent chore into a fleet-wide health check you can run on a schedule.",
      code: {
        language: "bash",
        title: "Fleet-wide analysis",
        code: `# Diagnose entire fleet
lettactl report memory --all --analyze --confirm

# Diagnose all support agents
lettactl report memory --tags "role:support" --analyze --confirm

# JSON output for programmatic processing
lettactl report memory --all --analyze --confirm -o json`,
      },
    },
  ],
}
