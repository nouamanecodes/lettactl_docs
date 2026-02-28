import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "cloud-storage",
  title: "Supabase Integration",
  description:
    "Source agent prompts, memory blocks, tools, and folder files from Supabase Storage buckets. lettactl downloads content at deploy time so your agent configs stay declarative while your content lives in the cloud.",
  sections: [
    {
      heading: "Overview",
      content:
        "lettactl integrates with Supabase Storage as a cloud backend for agent configuration content. Instead of keeping prompt files, knowledge documents, and tool source code on the local filesystem, you can store them in Supabase buckets and reference them from your YAML with from_bucket. At deploy time, lettactl downloads the content and applies it to your agents. This is read-only — lettactl never writes to your buckets.",
    },
    {
      heading: "Setup",
      content:
        "You need three environment variables. SUPABASE_URL is your project URL. For authentication, lettactl prefers SUPABASE_SERVICE_ROLE_KEY (required for private buckets) and falls back to SUPABASE_ANON_KEY for public buckets. The service role key bypasses row-level security, so use it when your buckets are private.",
      code: {
        language: "bash",
        title: "Environment variables",
        code: `# Required
export SUPABASE_URL=https://your-project.supabase.co

# For private buckets (recommended)
export SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx

# For public buckets only
export SUPABASE_ANON_KEY=sb_publishable_xxxxx`,
      },
    },
    {
      heading: "The from_bucket Syntax",
      content:
        "Every place in your YAML that accepts from_file also accepts from_bucket. The structure is always the same: a provider (currently only supabase), a bucket name, and a file path. The path can include directories and, for folders, glob patterns.",
      code: {
        language: "yaml",
        title: "from_bucket structure",
        code: `from_bucket:
  provider: supabase
  bucket: my-bucket
  path: prompts/system-prompt.md`,
      },
    },
    {
      heading: "System Prompts",
      content:
        "Store your system prompts in Supabase and reference them by path. lettactl downloads the file content at deploy time and sets it as the agent's system prompt. This is useful for managing prompts across environments — staging and production can point to different buckets or paths.",
      code: {
        language: "yaml",
        title: "Cloud-sourced system prompt",
        code: `agents:
  - name: support-agent
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      from_bucket:
        provider: supabase
        bucket: agent-configs
        path: prompts/support-agent.md`,
      },
    },
    {
      heading: "Memory Blocks",
      content:
        "Seed agent memory blocks with content from Supabase. The file content becomes the initial value of the memory block. This works for both agent-owned blocks and shared blocks.",
      code: {
        language: "yaml",
        title: "Cloud-sourced memory blocks",
        code: `agents:
  - name: sales-agent
    memory_blocks:
      - name: product_knowledge
        description: "Product catalog and pricing"
        limit: 8000
        agent_owned: true
        from_bucket:
          provider: supabase
          bucket: knowledge-base
          path: products/catalog.md

shared_blocks:
  - name: company-policies
    description: "Company-wide policies"
    limit: 5000
    from_bucket:
      provider: supabase
      bucket: shared-content
      path: policies/main.md`,
      },
    },
    {
      heading: "Folders",
      content:
        "Download files from Supabase buckets into agent folders. This supports glob patterns — use *.pdf to download all PDFs, or * to download everything in a directory. You can mix local files and bucket files in the same folder. lettactl downloads each file to a temp directory, uploads it to the Letta agent folder, then cleans up.",
      code: {
        language: "yaml",
        title: "Cloud-sourced folders with glob patterns",
        code: `agents:
  - name: research-agent
    folders:
      - name: company-docs
        files:
          # Glob: download all PDFs from the docs directory
          - from_bucket:
              provider: supabase
              bucket: documents
              path: 'docs/*.pdf'

          # Single file from bucket
          - from_bucket:
              provider: supabase
              bucket: documents
              path: readme.md

          # Mix with local files
          - local-files/extra-notes.txt`,
      },
    },
    {
      heading: "Shared Folders",
      content:
        "Shared folders work the same way — define them once with bucket sources and reference them from multiple agents. The files are downloaded once and the folder is shared across all referencing agents.",
      code: {
        language: "yaml",
        title: "Cloud-sourced shared folders",
        code: `shared_folders:
  - name: knowledge-base
    files:
      - from_bucket:
          provider: supabase
          bucket: shared-docs
          path: '*.md'

agents:
  - name: agent-a
    shared_folders: [knowledge-base]

  - name: agent-b
    shared_folders: [knowledge-base]`,
      },
    },
    {
      heading: "Tools",
      content:
        "Store custom tool source code in Supabase and load it at deploy time. The bucket file should contain the Python source code for the tool.",
      code: {
        language: "yaml",
        title: "Cloud-sourced tools",
        code: `agents:
  - name: data-agent
    tools:
      - name: custom_lookup
        from_bucket:
          provider: supabase
          bucket: tools
          path: custom_lookup.py`,
      },
    },
    {
      heading: "Where from_bucket Is Supported",
      content:
        "The from_bucket syntax works in five places: system_prompt (single file, no glob), memory_blocks value (single file, no glob), shared_blocks value (single file, no glob), folders files (single file or glob patterns), shared_folders files (single file or glob patterns), and tools source code (single file, no glob). Glob patterns like *.txt and *.pdf are only supported in folder file entries.",
    },
    {
      heading: "Complete Example",
      content:
        "Here's a full fleet config that sources everything from Supabase — system prompt, memory, folders, and tools. Local files and bucket files can be mixed freely.",
      code: {
        language: "yaml",
        title: "Full cloud-native fleet config",
        code: `shared_blocks:
  - name: company-context
    description: "Company info shared across all agents"
    limit: 5000
    from_bucket:
      provider: supabase
      bucket: shared-content
      path: company-context.md

shared_folders:
  - name: product-docs
    files:
      - from_bucket:
          provider: supabase
          bucket: documents
          path: 'products/*.md'

agents:
  - name: support-agent
    description: "Customer support agent"
    tags: ["role:support"]
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      from_bucket:
        provider: supabase
        bucket: agent-configs
        path: prompts/support.md
    shared_blocks: [company-context]
    shared_folders: [product-docs]
    memory_blocks:
      - name: faq_knowledge
        description: "Common customer questions"
        limit: 4000
        agent_owned: true
        from_bucket:
          provider: supabase
          bucket: knowledge-base
          path: support/faq.md
    tools:
      - name: ticket_lookup
        from_bucket:
          provider: supabase
          bucket: tools
          path: ticket_lookup.py`,
      },
    },
    {
      heading: "Error Handling",
      content:
        "lettactl provides specific error messages for common Supabase issues. If a bucket doesn't exist or is private without the right key, you'll see a clear message explaining the possible causes. File-not-found errors include the exact bucket and path. Files smaller than 40 bytes trigger a warning (likely empty), and files over 50MB trigger a size warning.",
    },
    {
      heading: "Bucket Organization Tips",
      content:
        "Organize your Supabase buckets by content type rather than by agent. A prompts/ bucket for all system prompts, a knowledge-base/ bucket for memory content, a tools/ bucket for Python source. This makes it easy to update content across agents — change a prompt file once and re-deploy. Use private buckets with the service role key for anything sensitive.",
    },
    {
      heading: "Using the SDK",
      content:
        "When using the TypeScript SDK, pass Supabase credentials directly to the constructor instead of relying on environment variables. The SDK uses the same from_bucket resolution as the CLI — bucket content is downloaded and applied during deployFleet().",
      code: {
        language: "typescript",
        title: "SDK setup with Supabase",
        code: `import { LettaCtl } from 'lettactl'

const ctl = new LettaCtl({
  lettaBaseUrl: 'http://localhost:8283',
  lettaApiKey: 'your_api_key',
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseServiceRoleKey: 'sb_secret_xxxxx',
})`,
      },
    },
  ],
}
