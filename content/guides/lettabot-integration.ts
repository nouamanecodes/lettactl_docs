import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "lettabot-integration",
  title: "LettaBot Integration",
  description:
    "Connect your lettactl-managed agents to multi-channel messaging platforms like Telegram, Slack, and Discord using LettaBot. Define everything in one fleet YAML and deploy with a single command.",
  sections: [
    {
      heading: "Overview",
      content:
        "LettaBot is a multi-channel AI assistant runtime that bridges Letta agents to messaging platforms — Telegram, Slack, Discord, WhatsApp, and Signal. Normally you'd configure LettaBot separately with its own lettabot.yaml file. With lettactl integration, you define both your agent configuration and its channel bindings in a single fleet YAML. When you run lettactl apply, the agent is created on the Letta server and the LettaBot runtime config is stored in the agent's metadata. Then lettactl export lettabot generates a ready-to-use lettabot.yaml that LettaBot can consume directly — no manual config writing needed.",
    },
    {
      heading: "Prerequisites",
      content:
        "Before integrating LettaBot with lettactl, you need:\n\n- A running Letta server (self-hosted or Letta Cloud)\n- lettactl installed and connected (LETTA_BASE_URL set)\n- LettaBot installed (npm install -g lettabot or cloned from source)\n- Bot tokens for at least one channel (e.g., Telegram bot token from @BotFather, Slack app/bot tokens, Discord bot token)\n\nYou do NOT need an existing lettabot.yaml — lettactl will generate one for you.",
    },
    {
      heading: "Step 1: Add the lettabot Section to Your Fleet YAML",
      content:
        "Add an optional lettabot: block to any agent in your fleet YAML. This section defines which channels the agent connects to and how it behaves at runtime. The lettabot config is purely additive — it doesn't change how the agent works on the Letta server. It only configures the LettaBot runtime that bridges the agent to messaging platforms.",
      code: {
        language: "yaml",
        title: "fleet.yaml — agent with LettaBot config",
        code: `agents:
  - name: support-bot
    description: "Customer support agent"
    llm_config:
      model: openai/gpt-4o-mini
      context_window: 128000
    system_prompt:
      from_file: prompts/support.md
    memory_blocks:
      - name: customer_context
        description: "Current customer information"
        limit: 3000
        value: ""
        agent_owned: true

    # LettaBot runtime configuration
    lettabot:
      channels:
        telegram:
          enabled: true
          token: \${TELEGRAM_BOT_TOKEN}
          dmPolicy: pairing
          groupDebounceSec: 5
          groups:
            "*": { mode: mention-only }
        slack:
          enabled: true
          botToken: \${SLACK_BOT_TOKEN}
          appToken: \${SLACK_APP_TOKEN}
      features:
        heartbeat:
          enabled: true
          intervalMin: 30
          promptFile: prompts/heartbeat.md
        maxToolCalls: 50
      attachments:
        maxMB: 50
        maxAgeDays: 7`,
      },
    },
    {
      heading: "Step 2: Apply the Fleet Config",
      content:
        "Run lettactl apply as you normally would. The agent is created on the Letta server with its model, prompt, tools, and memory blocks. The lettabot config is stored in the agent's metadata under the key lettactl.lettabotConfig. This metadata survives agent updates — changing the LettaBot config never triggers agent recreation, so conversation history is always preserved.",
      code: {
        language: "bash",
        title: "Apply the fleet config",
        code: `# Set your channel tokens as environment variables
export TELEGRAM_BOT_TOKEN="123456:ABC..."
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_APP_TOKEN="xapp-..."

# Apply — creates agent + stores lettabot config in metadata
lettactl apply -f fleet.yaml

# Verify the lettabot config was stored
lettactl export agent support-bot -f yaml | grep -A 20 "lettabot:"`,
      },
    },
    {
      heading: "Step 3: Generate the LettaBot Config",
      content:
        "Use lettactl export lettabot to generate a ready-to-use lettabot.yaml from the agent's metadata. The exported config includes the server connection block (inferred from your LETTA_BASE_URL), the agent identity, and all channel/feature settings. You can write it to a file or pipe it to stdout for inspection.",
      code: {
        language: "bash",
        title: "Generate lettabot.yaml",
        code: `# Export for a single agent
lettactl export lettabot support-bot -o lettabot.yaml

# Preview without writing to file
lettactl export lettabot support-bot`,
      },
    },
    {
      heading: "Step 4: Start LettaBot",
      content:
        "Place the generated lettabot.yaml in your LettaBot project directory and start it. LettaBot will load the config, connect to the Letta server, find the agent, and start listening on the configured channels. The agent's full conversation history and memory are preserved — LettaBot simply bridges messages between channels and the existing agent.",
      code: {
        language: "bash",
        title: "Start LettaBot",
        code: `# Copy the generated config to your lettabot directory
lettactl export lettabot support-bot -o ./my-lettabot/lettabot.yaml

# Start LettaBot
cd my-lettabot
npx tsx src/main.ts

# Or if installed globally
lettabot`,
      },
    },
    {
      heading: "Fleet Mode: Multiple Agents, One LettaBot Instance",
      content:
        "When multiple agents in your fleet have lettabot: sections, you can export them all into a single multi-agent lettabot.yaml. LettaBot supports multi-agent mode natively — one instance manages multiple agents, each with their own channels. Use --all, --match, or --tags to control which agents are included.",
      code: {
        language: "bash",
        title: "Multi-agent LettaBot export",
        code: `# Export all agents that have lettabot config
lettactl export lettabot --all -o lettabot.yaml

# Export by glob pattern
lettactl export lettabot --match "support-*" -o lettabot.yaml

# Export by tags (AND logic)
lettactl export lettabot --tags "tenant:acme,role:support" -o lettabot.yaml`,
      },
    },
    {
      heading: "Multi-Agent Output Format",
      content:
        "When exporting multiple agents, the output uses LettaBot's agents: array format. Each agent carries its own channels and features. The server block is shared across all agents. Agents without a lettabot: section in their fleet config are automatically skipped.",
      code: {
        language: "yaml",
        title: "Generated multi-agent lettabot.yaml",
        code: `server:
  mode: docker
  baseUrl: http://localhost:8283

agents:
  - name: billing-bot
    id: agent-def456
    channels:
      slack:
        enabled: true
        botToken: xoxb-...
        appToken: xapp-...
        dmPolicy: open
    features:
      maxToolCalls: 20

  - name: support-bot
    id: agent-abc123
    channels:
      telegram:
        enabled: true
        token: "123456:ABC..."
        dmPolicy: pairing
        groups:
          "*": { mode: mention-only }
    features:
      heartbeat:
        enabled: true
        intervalMin: 30
      maxToolCalls: 50`,
      },
    },
    {
      heading: "Updating LettaBot Config",
      content:
        "To change the LettaBot configuration, edit your fleet YAML and re-run lettactl apply. The diff engine detects lettabot config changes separately from agent changes — updating channels or features never triggers agent recreation, so conversation history is always preserved. After applying, re-export the lettabot.yaml and restart LettaBot to pick up the changes.",
      code: {
        language: "bash",
        title: "Update and redeploy",
        code: `# Edit your fleet YAML (add a channel, change settings, etc.)
# Then apply the changes
lettactl apply -f fleet.yaml

# Preview changes before applying
lettactl apply -f fleet.yaml --dry-run

# Re-export and restart
lettactl export lettabot support-bot -o ./my-lettabot/lettabot.yaml
cd my-lettabot && npx tsx src/main.ts`,
      },
    },
    {
      heading: "Supported Channels",
      content:
        "LettaBot supports six messaging channels. Each channel has its own configuration fields, but they all share a common base: enabled (required boolean), dmPolicy (pairing, allowlist, or open), allowedUsers (restrict access), groupDebounceSec (batch group messages), groups (per-group mode settings), and mentionPatterns (regex for mention detection).\n\n- telegram: Bot API via grammY. Requires token from @BotFather.\n- telegram-mtproto: User account mode via TDLib. Requires apiId, apiHash, phoneNumber.\n- slack: Socket Mode via @slack/bolt. Requires appToken and botToken.\n- discord: Gateway via discord.js. Requires token from Discord developer portal.\n- whatsapp: Reverse-engineered via Baileys. QR code pairing, no token needed.\n- signal: Local daemon via signal-cli. Requires phone number.",
    },
    {
      heading: "Environment Variables for Secrets",
      content:
        "Channel tokens should never be committed to git. Use environment variable references in your fleet YAML. The fleet parser expands ${VAR} syntax before storing the config. For CI/CD pipelines, set the tokens as secrets in your deployment platform and they'll be expanded at apply time.",
      code: {
        language: "yaml",
        title: "Using environment variables for tokens",
        code: `lettabot:
  channels:
    telegram:
      enabled: true
      token: \${TELEGRAM_BOT_TOKEN}    # Expanded from env at apply time
    slack:
      enabled: true
      botToken: \${SLACK_BOT_TOKEN}
      appToken: \${SLACK_APP_TOKEN}
  features:
    heartbeat:
      enabled: true
      promptFile: prompts/heartbeat.md  # Resolved relative to YAML root`,
      },
    },
    {
      heading: "Complete Workflow Example",
      content:
        "Here's the full end-to-end workflow for setting up a fleet of agents with LettaBot integration — from writing the config to having bots live on Telegram and Slack.",
      code: {
        language: "bash",
        title: "End-to-end deployment",
        code: `# 1. Write your fleet config with lettabot sections
cat > fleet.yaml << 'EOF'
agents:
  - name: support-bot
    description: "Handles customer support"
    llm_config:
      model: openai/gpt-4o-mini
      context_window: 128000
    system_prompt:
      value: "You are a helpful support agent."
    memory_blocks:
      - name: persona
        description: "Bot identity"
        value: "I help customers with their questions."
        limit: 2000
        agent_owned: true
    lettabot:
      channels:
        telegram:
          enabled: true
          token: \${TELEGRAM_BOT_TOKEN}
          dmPolicy: pairing
      features:
        maxToolCalls: 20
EOF

# 2. Set your tokens
export TELEGRAM_BOT_TOKEN="123456:ABC-your-token"

# 3. Deploy the agent
lettactl apply -f fleet.yaml

# 4. Generate lettabot config
lettactl export lettabot support-bot -o lettabot.yaml

# 5. Start LettaBot
npx tsx src/main.ts
# -> LettaBot connects to your agent and starts listening on Telegram

# 6. Later: update config (e.g., add Slack)
# Edit fleet.yaml, add slack channel, then:
lettactl apply -f fleet.yaml
lettactl export lettabot support-bot -o lettabot.yaml
# Restart LettaBot to pick up changes`,
      },
    },
  ],
}
