"use client"

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react"

const STORAGE_KEY = "lettactl_dark_mode"

interface DarkModeContextValue {
  isDark: boolean
  toggle: () => void
}

export const DarkModeContext = createContext<DarkModeContextValue | null>(null)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    try {
      setIsDark(localStorage.getItem(STORAGE_KEY) === "true")
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}
    if (next) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <DarkModeContext value={{ isDark, toggle }}>
      {children}
    </DarkModeContext>
  )
}
