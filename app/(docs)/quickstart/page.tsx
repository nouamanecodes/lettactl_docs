import type { Metadata } from "next"
import CodeBlock from "@/components/elements/CodeBlock"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Getting Started | lettactl",
  description:
    "Install lettactl and deploy your first Letta AI agent fleet in under 5 minutes.",
}

export default function QuickstartPage() {
  return (
    <>
      <h1 className={styles.title}>Getting Started</h1>
      <p className={styles.intro}>
        Install lettactl and deploy your first agent fleet.
      </p>

      <h2 className={styles.sectionTitle}>Installation</h2>
      <p className={styles.paragraph}>
        Install globally via npm, or use npx to run without
        installing:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code="npm install -g lettactl"
        title="Global install"
      />
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code="npx lettactl --help"
        title="Or use npx"
      />

      <h2 className={styles.sectionTitle}>
        Environment Setup
      </h2>
      <p className={styles.paragraph}>
        Point lettactl at your Letta server:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`export LETTA_BASE_URL=http://localhost:8283
# Optional: API key for Letta Cloud
export LETTA_API_KEY=your-key-here`}
        title="Environment variables"
      />

      <h2 className={styles.sectionTitle}>
        Your First Fleet Config
      </h2>
      <p className={styles.paragraph}>
        Create a file called{" "}
        <code className={styles.inlineCode}>
          fleet.yaml
        </code>{" "}
        with a minimal agent definition:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`agents:
  - name: my-first-agent
    description: "A simple AI assistant"
    llm_config:
      model: "openai/gpt-4o"
      context_window: 128000
    system_prompt:
      value: "You are a helpful assistant."
    memory_blocks:
      - name: user_preferences
        description: "What I know about the user"
        agent_owned: true
        limit: 5000`}
        language="yaml"
        title="fleet.yaml"
      />

      <h2 className={styles.sectionTitle}>Deploy</h2>
      <p className={styles.paragraph}>
        Preview what will happen, then deploy:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`# Preview changes
lettactl apply -f fleet.yaml --dry-run

# Deploy for real
lettactl apply -f fleet.yaml`}
        title="Deploy"
      />

      <h2 className={styles.sectionTitle}>Verify</h2>
      <p className={styles.paragraph}>
        Check that your agent is running:
      </p>
      {/* @ts-expect-error Async Server Component */}
      <CodeBlock
        code={`# List agents
lettactl get agents

# Send a test message
lettactl send my-first-agent "Hello, world!"

# View response
lettactl messages my-first-agent`}
        title="Verify"
      />
    </>
  )
}
