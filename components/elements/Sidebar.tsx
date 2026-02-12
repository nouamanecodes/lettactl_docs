"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "@/data/navigation"
import styles from "./Sidebar.module.css"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      {navigation.map((section) => (
        <div key={section.href} className={styles.section}>
          <Link
            href={section.href}
            className={`${styles.sectionTitle} ${
              pathname === section.href
                ? styles.sectionTitleActive
                : ""
            }`}
          >
            {section.title}
          </Link>

          {section.items && (
            <div className={styles.items}>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.item} ${
                    pathname === item.href
                      ? styles.itemActive
                      : ""
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}
