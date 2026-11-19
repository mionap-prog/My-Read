<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## About this app

- **What the app is:** A reading list where I add books, note where each book comes from and its language, and mark them as Want to read, Reading or Read.
- **Where data is saved for now:** in the browser
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS
- **How to run it:** `npm run dev`, then open `localhost:3000`
- **Conventions:** new pages go in `app/`, shared components in `app/components/`
- **Do not:**
  - add npm packages without asking
  - put secrets in source files (use `.env.local`)
- **Backlog:** it's in `PLAN.md`. Read it before starting a new feature.
