import CodeBlock from "@/components/elements/CodeBlock"
import styles from "../page.module.css"

export default function SharedResources() {
  return (
    <>
      <section>
        <h2 className={styles.sectionTitle}>SharedBlock</h2>
        <p className={styles.paragraph}>
          Shared blocks are memory blocks that multiple agents can reference.
          Define them at the root level, then attach by name.
        </p>

        <CodeBlock
          code={`# Define at root level
shared_blocks:
  - name: company_policies
    description: "Company-wide policies all agents must follow"
    limit: 5000
    from_file: "policies.md"

  - name: safety_guidelines
    description: "Safety and compliance rules"
    limit: 3000
    value: "Never generate fake testimonials..."

agents:
  - name: agent-a
    # ... config ...
    shared_blocks:
      - company_policies
      - safety_guidelines

  - name: agent-b
    # ... config ...
    shared_blocks:
      - company_policies`}
          language="yaml"
          title="SharedBlock usage"
        />
      </section>

      <hr className={styles.divider} />

      <section>
        <h2 className={styles.sectionTitle}>SharedFolder</h2>
        <p className={styles.paragraph}>
          Like shared blocks, but for file collections.
        </p>

        <CodeBlock
          code={`shared_folders:
  - name: brand_assets
    files:
      - "brand/*.md"
      - from_bucket:
          provider: supabase
          bucket: assets
          path: "brand/*.pdf"

agents:
  - name: agent-a
    shared_folders:
      - brand_assets`}
          language="yaml"
          title="SharedFolder usage"
        />
      </section>
    </>
  )
}
