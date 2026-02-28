import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "conversations",
  title: "Conversations",
  description:
    "Use conversations to give each agent multiple isolated message histories — perfect for per-user threads, A/B testing prompts, or separating hook and b-roll interactions. Conversations share the agent's archival memory, blocks, and tools while keeping messages completely separate.",
  sections: [
    {
      heading: "Declare Conversations in YAML",
      content:
        "The recommended way to create conversations is declaratively in your fleet YAML. Conversations are created automatically on `lettactl apply` and are idempotent — re-applying the same YAML won't duplicate them. Each conversation is matched by its `summary` field. Use `isolated_blocks` to create per-conversation copies of named memory blocks.",
      code: {
        language: "yaml",
        title: "fleet.yaml",
        code: `agents:
  - name: support-agent
    description: "Multi-conversation support agent"
    llm_config:
      model: google_ai/gemini-2.0-flash-lite
      context_window: 32000
    system_prompt:
      value: |
        You are a customer support agent. Each conversation
        is an independent customer interaction. Use your memory
        blocks for shared knowledge across all conversations.
    embedding: openai/text-embedding-3-small
    memory_blocks:
      - name: faq
        description: "Frequently asked questions"
        limit: 5000
        agent_owned: true
        from_file: knowledge/faq.md
      - name: customer_context
        description: "Per-customer context"
        limit: 2000
        value: ""
    conversations:
      - summary: "Ticket #101"
      - summary: "Ticket #102"
        isolated_blocks: [customer_context]  # per-conversation copy`,
      },
    },
    {
      heading: "Full Workflow: YAML to Conversations",
      content:
        "Deploy the agent with conversations declared in YAML, then start sending isolated messages. On re-apply, existing conversations (matched by summary) are left untouched while new ones are created. You can also create conversations imperatively with `lettactl create conversation`.",
      code: {
        language: "bash",
        title: "End-to-end setup",
        code: `# 1. Deploy the agent — conversations are created automatically
lettactl apply -f fleet.yaml

# 2. Send messages scoped to each conversation
lettactl get conversations support-agent  # find conversation IDs
lettactl send support-agent "I can't log in" --conversation-id <conv-A>
lettactl send support-agent "How do I upgrade?" --conversation-id <conv-B>

# 3. Each conversation has isolated history
lettactl get messages support-agent --conversation-id <conv-A>  # only ticket #101
lettactl get messages support-agent --conversation-id <conv-B>  # only ticket #102

# 4. Re-apply is idempotent — no duplicate conversations
lettactl apply -f fleet.yaml --dry-run  # shows 0 new conversations

# 5. Add a new conversation to YAML and re-apply
# Add "- summary: Ticket #103" to fleet.yaml
lettactl apply -f fleet.yaml  # only creates Ticket #103`,
      },
    },
    {
      heading: "Imperative Conversation Creation",
      content:
        "You can also create conversations imperatively using the CLI. This is useful for dynamic use cases where conversations are created at runtime rather than declared ahead of time.",
      code: {
        language: "bash",
        title: "Create conversations via CLI",
        code: `# Create a conversation for an existing agent
lettactl create conversation support-agent  # → conv-id

# You can also use lettactl apply with YAML (see above)`,
      },
    },
    {
      heading: "What Are Conversations?",
      content:
        "By default, an agent has a single, flat message history. Every message you send lands in the same timeline. Conversations add a layer of isolation: each conversation is an independent message stream attached to the same agent. The agent's configuration, archival memory, blocks, and tools are shared across all conversations, but messages within one conversation are invisible to another. This is useful when a single agent serves multiple users, when you want to test different interaction patterns without cross-contamination, or when different parts of your system (e.g. a webhook handler vs a chat UI) need separate histories.",
    },
    {
      heading: "Creating a Conversation",
      content:
        "Use the create conversation command to start a new conversation for an agent. The server returns a conversation ID that you use for all subsequent operations — sending messages, listing history, and compacting.",
      code: {
        language: "bash",
        title: "Create a conversation",
        code: `# Create a conversation for an existing agent
lettactl create conversation my-agent

# Output:
# Conversation created for agent my-agent
# Conversation ID: conv-abc12345-6789-0123-4567-890abcdef012`,
      },
    },
    {
      heading: "Sending Messages in a Conversation",
      content:
        "Pass --conversation-id to the send command to scope a message to a specific conversation. Conversation messages always use streaming mode. The agent responds using its full configuration (system prompt, tools, memory blocks) but only sees the message history within that conversation.",
      code: {
        language: "bash",
        title: "Send to a conversation",
        code: `# Send a message within a conversation
lettactl send my-agent "Hello from conversation A" --conversation-id <conv-id>

# The agent only sees messages from this conversation
# Archival memory, blocks, and tools are still shared`,
      },
    },
    {
      heading: "Viewing Conversation Messages",
      content:
        "Use --conversation-id with get messages to view only the messages from a specific conversation. Without the flag, you see the agent's legacy (non-conversation) messages. This separation is key — conversation messages never appear in the default message list, and legacy messages never appear in conversation-scoped queries.",
      code: {
        language: "bash",
        title: "List conversation messages",
        code: `# View messages from a specific conversation
lettactl get messages my-agent --conversation-id <conv-id>

# View legacy (non-conversation) messages
lettactl get messages my-agent

# Include system messages in conversation view
lettactl get messages my-agent --conversation-id <conv-id> --system`,
      },
    },
    {
      heading: "Listing and Inspecting Conversations",
      content:
        "Use get conversations to see all conversations for an agent. Each entry shows the conversation ID, a summary (if available), message count, and creation date. Use describe conversation to see full details for a specific conversation.",
      code: {
        language: "bash",
        title: "List and inspect conversations",
        code: `# List all conversations for an agent
lettactl get conversations my-agent

# Describe a specific conversation
lettactl describe conversation <conv-id>`,
      },
    },
    {
      heading: "Multiple Conversations (Isolation)",
      content:
        "You can create as many conversations as you need. Each one is fully isolated — messages in conversation A are invisible to conversation B. This makes it possible to run parallel interactions with the same agent without interference. For example, a support agent could have one conversation per customer ticket, or a testing agent could have one conversation per test scenario.",
      code: {
        language: "bash",
        title: "Multiple isolated conversations",
        code: `# Create two conversations
lettactl create conversation my-agent  # → conv-A
lettactl create conversation my-agent  # → conv-B

# Messages are isolated
lettactl send my-agent "I'm user A" --conversation-id conv-A
lettactl send my-agent "I'm user B" --conversation-id conv-B

# Each conversation has its own history
lettactl get messages my-agent --conversation-id conv-A  # only user A messages
lettactl get messages my-agent --conversation-id conv-B  # only user B messages`,
      },
    },
    {
      heading: "Migrating from Legacy Messages",
      content:
        "If you have an existing agent that was created before conversations were available, migration is seamless. Your existing messages remain accessible via the legacy API (get messages without --conversation-id). When you create a conversation and start sending messages to it, those messages are completely separate from the legacy history. There is no data migration required — the two message stores coexist. You can continue using both: legacy messages for backwards compatibility, and conversations for new isolated interactions.",
      code: {
        language: "bash",
        title: "Migration workflow",
        code: `# Existing agent with legacy messages
lettactl get messages my-agent  # shows existing history

# Create a conversation — does not affect legacy messages
lettactl create conversation my-agent  # → conv-id

# New messages go to the conversation
lettactl send my-agent "New interaction" --conversation-id <conv-id>

# Legacy messages are still accessible
lettactl get messages my-agent  # still shows old history

# Conversation messages are separate
lettactl get messages my-agent --conversation-id <conv-id>  # only new messages`,
      },
    },
    {
      heading: "Compacting Conversation Messages",
      content:
        "As a conversation grows, you can compact its messages to free context window space. This summarizes the conversation history while preserving the essential information. By default, compaction uses the agent's configured LLM model, but you can override it with --model.",
      code: {
        language: "bash",
        title: "Compact conversation messages",
        code: `# Compact using the agent's default model
lettactl compact-messages my-agent --conversation-id <conv-id>

# Compact using a specific model
lettactl compact-messages my-agent --conversation-id <conv-id> --model openai/gpt-4o-mini`,
      },
    },
    {
      heading: "Deleting Conversations",
      content:
        "The Letta API does not currently support deleting individual conversations. Conversations are automatically cascade-deleted when the parent agent is deleted. If you need a fresh conversation, create a new one — old conversations don't interfere since each has its own isolated message history.",
      code: {
        language: "bash",
        title: "Delete agent cascades conversations",
        code: `# Deleting an agent removes all its conversations
lettactl delete agent my-agent --force
# All conversations are automatically removed`,
      },
    },
    {
      heading: "YAML Re-apply Preserves Conversations",
      content:
        "When you update an agent's configuration via YAML apply, conversations are preserved. The diff engine updates the agent's config (system prompt, model, tools, etc.) but does not touch conversation state. This means you can iterate on an agent's configuration without losing any conversation history. The dry-run output will show the conversation count for agents that have conversations.",
      code: {
        language: "bash",
        title: "Re-apply preserves conversations",
        code: `# Update agent config
vim fleet.yaml  # change system prompt, model, etc.

# Dry-run shows conversations are preserved
lettactl apply -f fleet.yaml --dry-run
# [~] my-agent (UPDATE) — 3 conversations

# Apply — conversations untouched
lettactl apply -f fleet.yaml`,
      },
    },
  ],
}
