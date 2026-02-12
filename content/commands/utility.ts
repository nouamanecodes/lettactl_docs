import type { CommandDoc } from "../types"

export const groupTitle = "Utility"
export const groupDescription =
  "Health checks, shell completions, and other utilities."

export const commands: CommandDoc[] = [
  {
    name: "health",
    description: "Check connectivity to the Letta server.",
    usage: "lettactl health [options]",
    flags: [
      { flag: "--output", short: "-o", description: "Output format (json for CI scripts)", type: "json" },
    ],
    examples: [
      { title: "Health check", code: "lettactl health" },
      { title: "CI-friendly", code: "lettactl health -o json" },
    ],
  },
  {
    name: "completion",
    description: "Generate shell completion scripts for tab-completion of commands and flags.",
    usage: "lettactl completion <shell>",
    flags: [],
    examples: [
      { title: "Bash", code: "lettactl completion bash >> ~/.bashrc" },
      { title: "Zsh", code: "lettactl completion zsh >> ~/.zshrc" },
      { title: "Fish", code: "lettactl completion fish > ~/.config/fish/completions/lettactl.fish" },
    ],
    notes: ["Supported shells: bash, zsh, fish"],
  },
]
