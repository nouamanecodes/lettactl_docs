import * as deployment from "./deployment"
import * as inspection from "./inspection"
import * as lifecycle from "./lifecycle"
import * as importExport from "./import-export"
import * as messaging from "./messaging"
import * as runs from "./runs"
import * as fleet from "./fleet"
import * as canary from "./canary"
import * as utility from "./utility"

export const commandGroups: Record<
  string,
  { groupTitle: string; groupDescription: string; commands: typeof deployment.commands }
> = {
  deployment,
  inspection,
  lifecycle,
  "import-export": importExport,
  messaging,
  runs,
  fleet,
  canary,
  utility,
}

export const groupSlugs = Object.keys(commandGroups)
