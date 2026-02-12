import type { CommandDoc } from "../types"

export const groupTitle = "Canary Deployments"
export const groupDescription =
  "Safely test configuration changes on isolated canary copies before promoting to production."

export const commands: CommandDoc[] = [
  {
    name: "Canary Workflow",
    description: "Canary deployments let you test changes on isolated copies of your agents. Canary agents share the same shared blocks, folders, and tools as production, but get their own agent-specific memory blocks. The workflow is: deploy canaries → test → promote → cleanup.",
    usage: "lettactl apply -f fleet.yaml --canary",
    flags: [
      { flag: "--canary", description: "Deploy canary copies with CANARY- prefix", type: "boolean" },
      { flag: "--canary-prefix", description: "Custom prefix instead of CANARY-", type: "string", default: "CANARY-" },
      { flag: "--promote", description: "Promote canary config to production agents", type: "boolean" },
      { flag: "--cleanup", description: "Remove canary agents", type: "boolean" },
      { flag: "--agent", description: "Scope canary operation to a specific agent", type: "string" },
    ],
    examples: [
      { title: "1. Deploy canaries", code: "lettactl apply -f fleet.yaml --canary" },
      { title: "2. Test canary agents", code: "lettactl send CANARY-my-agent 'Test message'\nlettactl messages CANARY-my-agent" },
      { title: "3. Inspect canary", code: "lettactl describe agent my-agent --canary\nlettactl get agents --canary" },
      { title: "4. Promote and cleanup", code: "lettactl apply -f fleet.yaml --canary --promote --cleanup" },
    ],
    notes: [
      "Canary agents share shared blocks/folders/tools with production",
      "Agent-specific memory blocks are isolated to the canary",
      "Running --canary twice updates existing canaries (idempotent)",
      "--promote is equivalent to a normal apply with --skip-first-message",
      "Works with --agent flag for scoped deployments",
    ],
  },
]
