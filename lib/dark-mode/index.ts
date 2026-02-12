"use client"

import { use } from "react"
import { DarkModeContext } from "./provider"

export { DarkModeProvider } from "./provider"

export function useDarkMode() {
  const ctx = use(DarkModeContext)
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider")
  return ctx
}
