# Plan: build My Reads, one small step at a time

## Context
My Reads is a single-user reading list (Next.js 16.4.6 App Router, React 19.3, TypeScript, Tailwind 4). Books are added with a source and language, and marked Want to read / Reading / Read. There is no backend, so data lives in the browser. This file is the backlog: read it before starting a new feature.

The Book fields come from `docs/data-model.md`: `id`, `title` (required), `author`, `source` (Owned/Borrowed/Library), `language`, `status` (Want to read/Reading/Read), `notes`, `addedAt`.

## Rules that apply to every step
- Before writing code, read the relevant bundled guide in `node_modules/next/dist/docs/01-app/` (AGENTS.md rule). Already checked: dynamic route `params` is a `Promise` (`await params` in a server page, `use(params)` or `useParams()` in a client component); browser-only APIs such as `localStorage` need a Client Component (`'use client'`).
- App Router only, never `pages/`. New pages in `app/`, shared components in `app/components/`.
- No new npm packages without asking. No secrets in source files.
- Tailwind defaults, clean and simple (`docs/brand-guide.md`).
- Commit after each stable step. Run `npm run lint` and `npm run build` before each commit.

## Steps

1. **[DONE] Compare browser storage options and recommend one (no code).**
   Compare localStorage, IndexedDB, cookies and the File System Access API, plus sessionStorage as the one to rule out. Cover persistence across reload and tab close, size limits, sync vs async API, complexity, and fit for a few hundred small records. Cite sources. Expected recommendation: **localStorage**, one JSON array under a single key. It is simple, synchronous, survives closing the tab, and needs no package. IndexedDB would be overkill here. Write the choice and reasons into `docs/` and update the "Where data is saved" line in `AGENTS.md`. Stop for approval before building.

2. **[DONE] Book type and storage module.**
   Add `app/lib/books.ts` with the `Book` type (the field list above, `source` and `status` as union types) and small functions: `getBooks`, `getBook(id)`, `addBook`, `updateBook`, `deleteBook`. Generate `id` with `crypto.randomUUID()` and set `addedAt` when a book is added. Guard against missing `localStorage`, bad JSON and an empty store. Add a small shared hook in `app/lib/` that reads books on the client after mount, so server and client HTML match. Test in the browser console.

3. **[DONE] All books page `/books`.**
   List every book (title, author, status, source, language), each linking to `/books/[id]`. Friendly empty-state message plus a link to add the first book. Reload the page to confirm books stay saved.
   There is no add form yet, so add test books from the browser console with `books.addBook({ ... })` (available through the temporary `DevConsole`, removed in step 4).

4. **[DONE] Add-a-book page `/books/new`.**
   Form with the six fields. The title is required, and a book without a title is not added (show an inline message). Source and status are selects; notes is a textarea. Save, then go to `/books`. Test at 1280 px and 375 px.
   Once this page uses `addBook`, remove the temporary `DevConsole` (delete `app/components/DevConsole.tsx` and its import and `<DevConsole />` lines in `app/layout.tsx`).

5. **[DONE] Book page `/books/[id]`: view, edit, delete.**
   Show one book with an edit form (same title validation) and a delete button with a confirm. After saving or deleting, go back to `/books`. Show a friendly "book not found" message for an unknown id. Test persistence: reload, close and reopen the tab.

6. **[DONE] Home page `/`.**
   Heading "My Reads", a "New entry" button linking to `/books/new`, "Last 3 read" and "Next 3 I want to read" lists, each with its own empty message. Make each book link to its page.

7. **[DONE] Layout and navigation.**
   Shared header in `app/layout.tsx` (or `app/components/`) with links to Home, All books and New entry. Make sure text is readable and nothing overflows at 1280 px and 375 px (check the touch target size on phone).

8. **Final checks and README.**
   Run `npm run lint` and `npm run build`. Walk through every "Done means" item below. Update `README.md` (what it is, how to run, a screenshot) and `AGENTS.md` (pages, data storage, rules), as `108.md` asks for the submission.

## Done means
- A book without a title is not added.
- An empty list shows a friendly message.
- Books stay saved after reloading and reopening the tab.
- It works at 1280 px and 375 px wide, and text is easy to read.
- `npm run lint` and `npm run build` pass.

## Assumptions
- **"Last 3 read":** the data model has no read date and dates are out of scope. Treat "last 3 read" as the three most recently added books with status Read, and "next 3 I want to read" as the three most recently added books with status Want to read.

## Not now
Dates, stars, yearly challenge, search, export, accounts.

## Verification (end to end)
1. `npm run dev`, open `localhost:3000`.
2. Add a book with no title: it is rejected. Add three books with different statuses.
3. Check `/`, `/books` and `/books/[id]`, edit one book, delete one book.
4. Reload, then close and reopen the tab: all changes remain.
5. Clear the list: the empty-state messages show on `/` and `/books`. Open `/books/unknown-id`: friendly not-found message.
6. Resize to 1280 px and 375 px (browser dev tools): layout works and text is readable.
7. `npm run lint` and `npm run build` both pass.
