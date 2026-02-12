import styles from "../page.module.css"

export default function FromBucket() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>FromBucket</h2>
      <p className={styles.paragraph}>
        Cloud storage reference used by prompts, memory blocks, folders, and
        tools.
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code className={styles.inlineCode}>provider</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>
              Storage provider. Currently only{" "}
              <code className={styles.inlineCode}>supabase</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>bucket</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>Bucket name.</td>
          </tr>
          <tr>
            <td>
              <code className={styles.inlineCode}>path</code>{" "}
              <span className={styles.required}>required</span>
            </td>
            <td><span className={styles.type}>string</span></td>
            <td>File path or glob pattern.</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
