"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X, Github, Star, Moon, Sun } from "lucide-react"
import { useDarkMode } from "@/lib/dark-mode"
import { formatCount } from "@/lib/format"
import styles from "./Header.module.css"

const navLinks = [
  { title: "Docs", href: "/quickstart" },
  { title: "Commands", href: "/commands" },
  { title: "Supabase", href: "/guides/cloud-storage" },
  { title: "Schema", href: "/schema" },
  { title: "SDK", href: "/sdk" },
  { title: "Guides", href: "/guides" },
]

export default function Header() {
  const pathname = usePathname()
  const { isDark, toggle: toggleDarkMode } = useDarkMode()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    fetch("https://api.github.com/repos/nouamanecodes/lettactl")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count != null) setStarCount(data.stargazers_count)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      setIsHidden(currentY > lastScrollY && currentY > 80)
      lastScrollY = currentY
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isHidden ? styles.headerHidden : ""}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <Image src="/assets/lettactl-logo-square.png" alt="lettactl" width={24} height={24} />
            <span className={styles.logoText}>
              letta<span className={styles.logoAccent}>ctl</span>
            </span>
          </Link>

          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${
                  pathname.startsWith(link.href)
                    ? styles.navLinkActive
                    : ""
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              href="https://github.com/nouamanecodes/lettactl"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerBadge}
            >
              <Github size={14} />
              {starCount !== null && (
                <span className={styles.starGroup}>
                  <Star size={12} className={styles.starIcon} />
                  {formatCount(starCount)}
                </span>
              )}
            </a>

            <button
              className={styles.darkModeToggle}
              onClick={toggleDarkMode}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              className={styles.mobileMenuButton}
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenuOverlay}>
            <nav className={styles.mobileNav}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <div className={styles.mobileNavCTA}>
                <a
                  href="https://github.com/nouamanecodes/lettactl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileNavLink}
                >
                  GitHub
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
