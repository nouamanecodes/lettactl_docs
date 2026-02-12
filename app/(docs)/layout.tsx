import type React from "react"
import Header from "@/components/sections/Header"
import Footer from "@/components/sections/Footer"
import Sidebar from "@/components/elements/Sidebar"
import styles from "./layout.module.css"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
      <Footer />
    </>
  )
}
