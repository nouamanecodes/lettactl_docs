import type { MetadataRoute } from "next"

const BASE_URL = "https://lettactl.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/quickstart`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/concepts`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/commands`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/schema`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/sdk`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/guides`, changeFrequency: "monthly" as const, priority: 0.7 },
  ]

  const commandGroups = [
    "deployment", "inspection", "lifecycle", "import-export",
    "messaging", "runs", "fleet", "canary", "utility",
  ].map((group) => ({
    url: `${BASE_URL}/commands/${group}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const concepts = [
    "declarative-config", "resource-types",
    "diff-engine",
  ].map((slug) => ({
    url: `${BASE_URL}/concepts/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const guides = [
    "canary-deployments", "multi-tenancy", "git-workflows",
    "cloud-storage", "mcp-servers",
  ].map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...commandGroups, ...concepts, ...guides]
}
