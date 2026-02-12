import type { CommandFlag } from "@/content/types"
import styles from "./FlagTable.module.css"

export default function FlagTable({
  flags,
}: {
  flags: CommandFlag[]
}) {
  if (flags.length === 0) return null

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Flag</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {flags.map((flag) => (
          <tr key={flag.flag}>
            <td>
              <span className={styles.flag}>
                {flag.flag}
                {flag.short && `, ${flag.short}`}
              </span>
            </td>
            <td>
              <span className={styles.type}>{flag.type}</span>
              {flag.default && (
                <span className={styles.default}>
                  {" "}= {flag.default}
                </span>
              )}
            </td>
            <td>{flag.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
