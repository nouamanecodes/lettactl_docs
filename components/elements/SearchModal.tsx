"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import Fuse from "fuse.js"
import { buildSearchIndex, type SearchEntry } from "@/lib/search-index"
import styles from "./SearchModal.module.css"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface GroupedResults {
  category: string
  items: Array<{ entry: SearchEntry; snippet: string }>
}

function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function extractSnippet(content: string, query: string, maxLen = 120): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return content.slice(0, maxLen)
  const start = Math.max(0, idx - 40)
  const end = Math.min(content.length, idx + query.length + 80)
  let snippet = content.slice(start, end)
  if (start > 0) snippet = "..." + snippet
  if (end < content.length) snippet = snippet + "..."
  return snippet
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const searchIndex = useMemo(() => buildSearchIndex(), [])
  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: [
          { name: "title", weight: 2 },
          { name: "content", weight: 1 },
          { name: "parentTitle", weight: 0.5 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [searchIndex]
  )

  const grouped = useMemo((): GroupedResults[] => {
    if (query.length < 2) return []
    const results = fuse.search(query, { limit: 20 })
    const groups = new Map<string, GroupedResults["items"]>()

    for (const result of results) {
      const entry = result.item
      const category = entry.category
      if (!groups.has(category)) groups.set(category, [])
      groups.get(category)!.push({
        entry,
        snippet: extractSnippet(entry.content, query),
      })
    }

    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      items,
    }))
  }, [query, fuse])

  const flatResults = useMemo(
    () => grouped.flatMap((g) => g.items),
    [grouped]
  )

  const navigate = useCallback(
    (href: string) => {
      onClose()
      setQuery("")
      router.push(href)
    },
    [onClose, router]
  )

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && flatResults[activeIndex]) {
        e.preventDefault()
        navigate(flatResults[activeIndex].entry.href)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, flatResults, activeIndex, navigate])

  if (!isOpen) return null

  let flatIndex = 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.kbd}>esc</kbd>
        </div>

        <div className={styles.results}>
          {query.length >= 2 && grouped.length === 0 && (
            <div className={styles.empty}>No results for &ldquo;{query}&rdquo;</div>
          )}

          {grouped.map((group) => (
            <div key={group.category}>
              <div className={styles.groupLabel}>{group.category}</div>
              {group.items.map((item) => {
                const currentIndex = flatIndex++
                return (
                  <div
                    key={item.entry.href + item.entry.title}
                    className={`${styles.resultItem} ${
                      currentIndex === activeIndex ? styles.resultItemActive : ""
                    }`}
                    onClick={() => navigate(item.entry.href)}
                    onMouseEnter={() => setActiveIndex(currentIndex)}
                  >
                    <div className={styles.resultTitle}>
                      {highlightMatches(item.entry.title, query)}
                    </div>
                    {item.entry.parentTitle && (
                      <div className={styles.resultParent}>
                        {item.entry.parentTitle}
                      </div>
                    )}
                    <div className={styles.resultSnippet}>
                      {highlightMatches(item.snippet, query)}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {grouped.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.footerKeys}>
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
