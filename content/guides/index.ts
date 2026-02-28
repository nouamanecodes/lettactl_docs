export interface GuidePage {
  slug: string
  title: string
  description: string
  sections: {
    heading: string
    content: string
    code?: { language: string; title: string; code: string }
  }[]
}

import { guide as importingExistingAgents } from "./importing-existing-agents"
import { guide as cloudStorage } from "./cloud-storage"
import { guide as frontendUploads } from "./frontend-uploads"
import { guide as canaryDeployments } from "./canary-deployments"
import { guide as multiTenancy } from "./multi-tenancy"
import { guide as selfDiagnosis } from "./self-diagnosis"
import { guide as agentCalibration } from "./agent-calibration"
import { guide as bulkMessaging } from "./bulk-messaging"
import { guide as safeToolDesign } from "./safe-tool-design"
import { guide as lettabotIntegration } from "./lettabot-integration"
import { guide as conversations } from "./conversations"

export const guides: Record<string, GuidePage> = {
  "importing-existing-agents": importingExistingAgents,
  "cloud-storage": cloudStorage,
  "frontend-uploads": frontendUploads,
  "canary-deployments": canaryDeployments,
  "multi-tenancy": multiTenancy,
  "self-diagnosis": selfDiagnosis,
  "agent-calibration": agentCalibration,
  "bulk-messaging": bulkMessaging,
  "safe-tool-design": safeToolDesign,
  "lettabot-integration": lettabotIntegration,
  conversations,
}

export const guideSlugs = Object.keys(guides)
