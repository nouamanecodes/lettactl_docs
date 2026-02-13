export interface NavItem {
  title: string
  href: string
  items?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/quickstart",
  },
  {
    title: "Commands",
    href: "/commands",
    items: [
      { title: "Deployment", href: "/commands/deployment" },
      { title: "Inspection", href: "/commands/inspection" },
      { title: "Lifecycle", href: "/commands/lifecycle" },
      { title: "Import / Export", href: "/commands/import-export" },
      { title: "Messaging", href: "/commands/messaging" },
      { title: "Async Runs", href: "/commands/runs" },
      { title: "Fleet Reporting", href: "/commands/fleet" },
      { title: "Canary Deployments", href: "/commands/canary" },
      { title: "Utility", href: "/commands/utility" },
    ],
  },
  {
    title: "Supabase Integration",
    href: "/guides/cloud-storage",
  },
  { title: "YAML Schema", href: "/schema" },
  { title: "SDK Reference", href: "/sdk" },
  {
    title: "Guides",
    href: "/guides",
    items: [
      { title: "Canary Deployments", href: "/guides/canary-deployments" },
      { title: "Multi-Tenancy", href: "/guides/multi-tenancy" },
      { title: "Self-Diagnosis", href: "/guides/self-diagnosis" },
      { title: "Cloud Storage", href: "/guides/cloud-storage" },
      { title: "Frontend Uploads", href: "/guides/frontend-uploads" },
      { title: "MCP Servers", href: "/guides/mcp-servers" },
      { title: "Safe Tool Design in a Web App", href: "/guides/safe-tool-design" },
    ],
  },
  {
    title: "Concepts",
    href: "/concepts",
    items: [
      { title: "Declarative Config", href: "/concepts/declarative-config" },
      { title: "Resource Types", href: "/concepts/resource-types" },
      { title: "Diff Engine", href: "/concepts/diff-engine" },
    ],
  },
]
