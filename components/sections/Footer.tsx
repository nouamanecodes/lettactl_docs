import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.brand}>
          lettactl — MIT License
        </span>
        <div className={styles.links}>
          <a
            href="https://www.npmjs.com/package/lettactl"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            npm
          </a>
          <a
            href="https://github.com/nouamanecodes/lettactl"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <a
            href="https://www.letta.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Letta ❤️
          </a>
          <a
            href="https://github.com/nouamanecodes/lettactl_docs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  )
}
