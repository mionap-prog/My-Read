<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## About this app

- **What the app is:** A reading list where I add books, note where each book comes from and its language, and mark them as Want to read, Reading or Read.
- **Pages:**
  - `/` home: "New entry" button, last 3 read, next 3 to read
  - `/books` all books, with an empty-state message
  - `/books/new` add a book (title required)
  - `/books/[id]` view, edit and delete one book, with a "book not found" message for unknown ids
  - A shared header (`app/components/Header.tsx`) links to Home, All books and New entry
- **Where data is saved:** in the browser's `localStorage`, as one JSON array of books under the key `my-reads:books` (no backend, no packages). Reasons in `docs/storage-decision.md`; fields in `docs/data-model.md`.
- **Data code:** `app/lib/books.ts` (the `Book` type and `getBooks`, `getBook`, `addBook`, `updateBook`, `deleteBook`) and `app/lib/useBooks.ts` (client hook that reads books after mount). Pages that use them are Client Components.
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS
- **How to run it:** `npm install`, then `npm run dev`, then open `localhost:3000`. Before a commit run `npm run lint` and `npm run build`.
- **Conventions:** new pages go in `app/`, shared components in `app/components/`. Use the App Router only, never `pages/`. Tailwind defaults, clean and simple (`docs/brand-guide.md`).
- **Do not:**
  - add npm packages without asking
  - put secrets in source files (use `.env.local`)
- **Backlog:** it's in `PLAN.md`. Read it before starting a new feature.
