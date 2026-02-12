import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DarkModeProvider } from "@/lib/dark-mode"
import "./globals.css"

const darkModeScript = `(function(){try{if(localStorage.getItem('lettactl_dark_mode')==='true'){document.documentElement.classList.add('dark')}}catch{}})()`

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "lettactl — kubectl for AI Agent Fleets",
  description:
    "Declarative YAML configuration, per-agent memory, git-native versioning, and canary deployments for Letta AI agent fleets.",
  keywords:
    "lettactl, letta, ai agents, agent fleet management, declarative yaml, memgpt, ai agent deployment, kubectl ai",
  authors: [{ name: "lettactl" }],
  metadataBase: new URL("https://lettactl.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "lettactl — kubectl for AI Agent Fleets",
    description:
      "Declarative YAML configuration, per-agent memory, git-native versioning, and canary deployments for Letta AI agent fleets.",
    url: "https://lettactl.dev",
    siteName: "lettactl",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "lettactl — kubectl for AI Agent Fleets",
    description:
      "Declarative YAML configuration, per-agent memory, git-native versioning, and canary deployments for Letta AI agent fleets.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className={`${manrope.className} antialiased`}>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
