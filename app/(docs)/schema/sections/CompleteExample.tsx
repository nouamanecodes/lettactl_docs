import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function CompleteExample() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Complete Example</h2>
      <p className={styles.paragraph}>
        A fleet config using every available feature:
      </p>

      <CodeBlock
        code={`root_path: ./fleet

# ── Shared Resources ──────────────────────────

shared_blocks:
  - name: company_policies
    description: "Company-wide operational policies"
    limit: 5000
    from_file: "policies/company.md"
    version: "2.0.0"

  - name: safety_guidelines
    description: "AI safety and compliance rules"
    limit: 3000
    value: |
      Never generate fake testimonials.
      Never impersonate real people.
      Always disclose AI-generated content.

shared_folders:
  - name: brand_intelligence
    files:
      - "brand/*.md"
      - from_bucket:
          provider: supabase
          bucket: docs
          path: "brand/*.pdf"

# ── MCP Servers ───────────────────────────────

mcp_servers:
  - name: firecrawl
    type: sse
    server_url: "https://sse.firecrawl.dev"
    auth_header: "Authorization"
    auth_token: "Bearer \${FIRECRAWL_API_KEY}"

  - name: filesystem
    type: stdio
    command: "npx"
    args: ["-y", "@anthropic/mcp-server-filesystem", "/tmp"]

# ── Agents ────────────────────────────────────

agents:
  - name: brand-researcher
    description: "Researches brands and builds customer profiles"
    tags:
      - "tenant:agency-123"
      - "role:research"

    llm_config:
      model: "google_ai/gemini-2.5-pro"
      context_window: 128000

    embedding: "openai/text-embedding-3-small"
    reasoning: true

    system_prompt:
      from_file: "prompts/researcher.md"
      disable_base_prompt: false

    first_message: "Initialize and confirm readiness."

    memory_blocks:
      - name: current_research
        description: "Active research findings"
        limit: 10000
        value: "No active research."
        agent_owned: true

      - name: research_methodology
        description: "How to conduct brand research"
        limit: 3000
        from_file: "docs/methodology.md"
        agent_owned: false
        version: "1.2.0"

    archives:
      - name: research_history
        description: "Past research findings"
        embedding: "openai/text-embedding-3-small"

    folders:
      - name: reference_docs
        files:
          - "reference/*.md"
          - "reference/**/*.txt"

    shared_blocks:
      - company_policies
      - safety_guidelines

    shared_folders:
      - brand_intelligence

    tools:
      - archival_memory_insert
      - archival_memory_search
      - "tools/*"

    mcp_tools:
      - server: firecrawl
        tools: ["scrape", "crawl"]

  - name: creative-director
    description: "Generates creative concepts and ad directions"
    tags:
      - "tenant:agency-123"
      - "role:creative"

    llm_config:
      model: "openai/gpt-4o"
      context_window: 128000

    system_prompt:
      from_file: "prompts/creative.md"

    memory_blocks:
      - name: brand_context
        description: "Current brand context and guidelines"
        limit: 8000
        value: "Awaiting brand assignment."
        agent_owned: true

      - name: creative_principles
        description: "Creative direction principles"
        limit: 2000
        from_file: "docs/creative-principles.md"
        agent_owned: false

    shared_blocks:
      - company_policies

    tools:
      - archival_memory_insert
      - archival_memory_search`}
        language="yaml"
        title="fleet.yaml — complete example"
      />
    </section>
  )
}
