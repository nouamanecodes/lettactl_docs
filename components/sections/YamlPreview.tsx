import CodeBlock from "@/components/elements/CodeBlock"
import styles from "./YamlPreview.module.css"

const exampleYaml = `shared_blocks:
  - name: brand_guidelines
    description: "Company voice and style"
    limit: 5000
    from_file: "memory/guidelines.md"
  - name: product_catalog
    description: "Current products and pricing"
    limit: 8000
    from_file: "memory/catalog.md"

shared_folders:
  - path: "knowledge/"
    description: "Company knowledge base"

agents:
  - name: support-agent
    description: "Customer support AI"
    tags: { team: support, tier: production }
    llm_config:
      model: "google_ai/gemini-2.5-pro"
      context_window: 32000
    system_prompt:
      from_file: "prompts/support.md"
    shared_blocks:
      - brand_guidelines
      - product_catalog
    shared_folders:
      - "knowledge/"
    memory_blocks:
      - name: customer_data
        agent_owned: true
        limit: 5000
      - name: ticket_context
        agent_owned: true
        limit: 3000
    tools:
      - archival_memory_search
      - archival_memory_insert
      - send_email
      - search_tickets

  - name: sales-agent
    description: "Outbound sales assistant"
    tags: { team: sales, tier: canary }
    llm_config:
      model: "google_ai/gemini-2.5-pro"
      context_window: 32000
    system_prompt:
      from_file: "prompts/sales.md"
    shared_blocks:
      - brand_guidelines
      - product_catalog
    shared_folders:
      - "knowledge/"
    memory_blocks:
      - name: lead_profiles
        agent_owned: true
        limit: 10000
    tools:
      - archival_memory_search
      - archival_memory_insert
      - search_crm`

export default function YamlPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Define once, deploy everywhere
        </h2>
        <p className={styles.subtitle}>
          Your entire agent fleet in one YAML file.
          Version-controlled, git-native, reproducible.
        </p>
      </div>

      <div className={styles.content}>
        {/* @ts-expect-error Async Server Component */}
        <CodeBlock code={exampleYaml} language="yaml" />

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepContent}>
              <h3>Write your config</h3>
              <p>
                Define agents, memory blocks, tools, and
                shared resources in declarative YAML.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h3>Deploy with one command</h3>
              <p>
                Run lettactl apply and the diff engine
                figures out exactly what needs to change.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepContent}>
              <h3>Iterate with confidence</h3>
              <p>
                Git-native versioning means you can roll back
                any change. Canary first if you want.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
