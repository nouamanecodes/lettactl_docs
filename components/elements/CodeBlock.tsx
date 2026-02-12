import { codeToHtml } from "shiki"
import CopyButton from "./CopyButton"
import styles from "./CodeBlock.module.css"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export default async function CodeBlock({
  code,
  language = "bash",
  title,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "catppuccin-mocha",
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.language}>
          {title || language}
        </span>
        <CopyButton text={code.trim()} />
      </div>
      <div
        className={styles.code}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
