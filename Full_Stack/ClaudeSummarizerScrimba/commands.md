---
Commands:
---

<!-- Create a worker project: -->

npm create cloudflare@latest worker

<!-- Navigate to the worker project: -->

cd worker

<!-- Install Anthropic AI SDK to the workspace -->

npm install @anthropic-ai/sdk@0.24.3

<!-- Deploy the worker: -->

npm run deploy

<!-- Push the Anthropic API key as a secret to Cloudflare: -->

npx wrangler secret put ANTHROPIC_API_KEY
