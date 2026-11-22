<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## About this app

- **What the app is:** A reading list where I add books, note where each book comes from and its language, and mark them as Want to read, Reading or Read.
- **Pages:**
  - `/` home: "My Reads" and a "New entry" button, then Currently reading (all Reading), Next 3 I want to read and Last 3 read (each with "See all")
  - `/books` all books, with an empty-state message
  - `/books/read` all books with status Read, newest first
  - `/books/next` all books with status Want to read, newest first
  - `/books/new` add a book (title required)
  - `/books/[id]` view, edit and delete one book, with a "book not found" message for unknown ids
  - A shared header (`app/components/Header.tsx`) links to Home, All books, Last reads and Next reads
- **Where data is saved:** in the browser's `localStorage`, as one JSON array of books under the key `my-reads:books` (no backend, no packages). Reasons in `docs/storage-decision.md`; fields in `docs/data-model.md`. Each book has an optional `statusChangedAt` (set when the book is added or its status changes; old books without it fall back to `addedAt`). Lists are sorted newest first by that date. New Book fields must be optional so old saved books keep working.
- **Data code:** `app/lib/books.ts` (the `Book` type and `getBooks`, `getBook`, `addBook`, `updateBook`, `deleteBook`) and `app/lib/useBooks.ts` (client hook that reads books after mount). Pages that use them are Client Components. Shared lists: `app/components/BookList.tsx` (one `BookRow.tsx` per book) and `BookListSection.tsx`; `booksWithStatus` in `books.ts` sorts newest first.
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS
- **How to run it:** `npm install`, then `npm run dev`, then open `localhost:3000`. Before a commit run `npm run lint` and `npm run build`.
- **Look:** green page with a banner picture pinned to the bottom (`public/banner.svg`, and `public/banner-dark.svg` in dark mode), cream cards, coral pill buttons, Fraunces headings and Geist text. Tokens and shared classes are in `app/globals.css`; all choices in `docs/brand-guide.md`.
- **Conventions:** new pages go in `app/`, shared components in `app/components/`. Use the App Router only, never `pages/`. Follow `docs/brand-guide.md` for colours, fonts and styles.
- **Do not:**
  - write new inline styles for things that already have a shared one: reuse `.btn`, `.card`, `.field` (and the other classes in `globals.css`) and the `BookRow` and `BookList` components
  - add npm packages without asking
  - put secrets in source files (use `.env.local`)
- **Backlog:** it's in `PLAN.md`. Read it before starting a new feature.
