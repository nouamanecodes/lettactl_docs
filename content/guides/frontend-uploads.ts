import type { GuidePage } from "./index"

export const guide: GuidePage = {
  slug: "frontend-uploads",
  title: "Frontend Uploads",
  description:
    "Let users upload files from your frontend to a Supabase bucket, then have your agents pull from that same bucket. A shared bridge between your UI and your agent fleet.",
  sections: [
    {
      heading: "How It Works",
      content:
        "The pattern is simple: your frontend uploads files to a Supabase Storage bucket, and your agent YAML references that same bucket with from_bucket. Users drop in PDFs, docs, or CSVs through your app — on the next deploy, the agent picks them all up automatically via glob patterns. For SaaS apps, organize uploads by user or tenant ID so each agent only sees its own files.",
    },
    {
      heading: "Create the Bucket",
      content:
        "Create a storage bucket in your Supabase dashboard or via SQL. Use a private bucket if the content is sensitive — lettactl authenticates with your service role key. Organize by tenant or use case so glob patterns stay clean.",
      code: {
        language: "sql",
        title: "Create a bucket via Supabase SQL editor",
        code: `-- Create a private bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', false);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow service role (lettactl) to read everything
-- No policy needed — service role key bypasses RLS`,
      },
    },
    {
      heading: "Upload from Your Frontend",
      content:
        "Use the Supabase JS client in your frontend to upload files into the bucket. Organize uploads by user ID or tenant ID so you can scope agent folders to specific users. The upload path becomes the path you reference in from_bucket.",
      code: {
        language: "typescript",
        title: "Frontend upload with Supabase JS",
        code: `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function uploadDocument(userId: string, file: File) {
  const path = \`\${userId}/\${file.name}\`

  const { error } = await supabase.storage
    .from('user-uploads')
    .upload(path, file, { upsert: true })

  if (error) throw error

  // File is now at: user-uploads/\${userId}/\${file.name}
  // The agent can pull it with:
  //   bucket: user-uploads
  //   path: '\${userId}/*.pdf'
}`,
      },
    },
    {
      heading: "Point the Agent at the Bucket",
      content:
        "Reference the same bucket in your agent YAML. Use a glob pattern to pull all files a user has uploaded. When you redeploy with lettactl apply, the agent's folder is synced with whatever is currently in the bucket.",
      code: {
        language: "yaml",
        title: "Agent pulling from the upload bucket",
        code: `agents:
  - name: user-42-assistant
    tags: ["user:42"]
    llm_config:
      model: google_ai/gemini-2.5-pro
      context_window: 32000
    system_prompt:
      value: "You are a personal assistant. Use the documents in your knowledge folder to answer questions."
    folders:
      - name: user-knowledge
        files:
          # Pull everything user 42 uploaded
          - from_bucket:
              provider: supabase
              bucket: user-uploads
              path: '42/*'`,
      },
    },
    {
      heading: "Automate with the SDK",
      content:
        "For SaaS apps where users upload documents continuously, use the SDK to redeploy after each upload. This closes the loop: user uploads a file, your backend triggers a redeploy, the agent immediately has access to the new content.",
      code: {
        language: "typescript",
        title: "Redeploy after upload",
        code: `import { LettaCtl } from 'lettactl'

const ctl = new LettaCtl({
  lettaBaseUrl: process.env.LETTA_URL!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})

// Called after a successful upload
async function syncAgentKnowledge(userId: string) {
  const fleet = ctl.createFleetConfig()
    .addAgent({
      name: \`user-\${userId}-assistant\`,
      tags: [\`user:\${userId}\`],
      llm_config: {
        model: 'google_ai/gemini-2.5-pro',
        context_window: 32000,
      },
      system_prompt: {
        value: 'You are a personal assistant with access to the user documents.',
      },
      folders: [{
        name: 'user-knowledge',
        files: [{
          from_bucket: {
            provider: 'supabase',
            bucket: 'user-uploads',
            path: \`\${userId}/*\`,
          },
        }],
      }],
    })
    .build()

  await ctl.deployFleet(fleet)
}`,
      },
    },
  ],
}
