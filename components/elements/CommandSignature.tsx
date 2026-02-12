import type { CommandDoc } from "@/content/types"
import CodeBlock from "./CodeBlock"
import FlagTable from "./FlagTable"
import styles from "./CommandSignature.module.css"

export default function CommandSignature({
  command,
}: {
  command: CommandDoc
}) {
  return (
    <div className={styles.wrapper} id={command.name}>
      <h3 className={styles.name}>{command.name}</h3>
      <p className={styles.description}>{command.description}</p>
      <code className={styles.usage}>{command.usage}</code>

      {command.flags.length > 0 && (
        <>
          <h4 className={styles.subheading}>Options</h4>
          <FlagTable flags={command.flags} />
        </>
      )}

      {command.examples.length > 0 && (
        <>
          <h4 className={styles.subheading}>Examples</h4>
          {command.examples.map((example) => (
            <div key={example.title}>
              {/* @ts-expect-error Async Server Component */}
              <CodeBlock
                code={example.code}
                title={example.title}
              />
            </div>
          ))}
        </>
      )}

      {command.notes && command.notes.length > 0 && (
        <>
          <h4 className={styles.subheading}>Notes</h4>
          {command.notes.map((note, i) => (
            <p key={i} className={styles.note}>
              {note}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
