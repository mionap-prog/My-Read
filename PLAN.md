# Plan: build My Reads, one small step at a time

## Context
My Reads is a single-user reading list (Next.js 16.4.6 App Router, React 19.3, TypeScript, Tailwind 4). Books are added with a source and language, and marked Want to read / Reading / Read. There is no backend, so data lives in the browser. This file is the backlog: read it before starting a new feature.

The Book fields come from `docs/data-model.md`: `id`, `title` (required), `author`, `source` (Owned/Borrowed/Library), `language`, `status` (Want to read/Reading/Read), `notes`, `addedAt`, and optional `statusChangedAt` (when the book was added or its status last changed).

## Rules that apply to every step
- Before writing code, read the relevant bundled guide in `node_modules/next/dist/docs/01-app/` (AGENTS.md rule). Already checked: dynamic route `params` is a `Promise` (`await params` in a server page, `use(params)` or `useParams()` in a client component); browser-only APIs such as `localStorage` need a Client Component (`'use client'`).
- App Router only, never `pages/`. New pages in `app/`, shared components in `app/components/`.
- No new npm packages without asking. No secrets in source files.
- Follow `docs/brand-guide.md` for colours, fonts and styles.
- Commit after each stable step. Run `npm run lint` and `npm run build` before each commit.
- Books saved earlier must keep working. Any new Book field is optional (missing means "not set"), `isBook()` accepts books without it, and nothing rewrites stored data.

## Steps

1. **[DONE] Compare browser storage options and recommend one (no code).**
   Compare localStorage, IndexedDB, cookies and the File System Access API, plus sessionStorage as the one to rule out. Cover persistence across reload and tab close, size limits, sync vs async API, complexity, and fit for a few hundred small records. Cite sources. Expected recommendation: **localStorage**, one JSON array under a single key. It is simple, synchronous, survives closing the tab, and needs no package. IndexedDB would be overkill here. Write the choice and reasons into `docs/` and update the "Where data is saved" line in `AGENTS.md`. Stop for approval before building.

2. **[DONE] Book type and storage module.**
   Add `app/lib/books.ts` with the `Book` type (the field list above, `source` and `status` as union types) and small functions: `getBooks`, `getBook(id)`, `addBook`, `updateBook`, `deleteBook`. Generate `id` with `crypto.randomUUID()` and set `addedAt` when a book is added. Guard against missing `localStorage`, bad JSON and an empty store. Add a small shared hook in `app/lib/` that reads books on the client after mount, so server and client HTML match. Test in the browser console.

3. **[DONE] All books page `/books`.**
   List every book (title, author, status, source, language), each linking to `/books/[id]`. Friendly empty-state message plus a link to add the first book. Reload the page to confirm books stay saved.
   There is no add form yet, so add test books from the browser console with `books.addBook({ ... })` (available through the temporary `DevConsole`, removed in step 4).

4. **[DONE] Add-a-book page `/books/new`.**
   Form with the six fields. The title is required, and a book without a title is not added (show an inline message). Source and status are selects; notes is a textarea. Save, then go to the home page `/`. Test at 1280 px and 375 px.
   Once this page uses `addBook`, remove the temporary `DevConsole` (delete `app/components/DevConsole.tsx` and its import and `<DevConsole />` lines in `app/layout.tsx`).

5. **[DONE] Book page `/books/[id]`: view, edit, delete.**
   Show one book with an edit form (same title validation) and a delete button with a confirm. After saving or deleting, go to the home page `/`. Show a friendly "book not found" message for an unknown id. Test persistence: reload, close and reopen the tab.

6. **[DONE] Home page `/`.**
   Heading "My Reads", a "New entry" button linking to `/books/new`, "Last 3 read" and "Next 3 I want to read" lists, each with its own empty message. Make each book link to its page.

7. **[DONE] Layout and navigation.**
   Shared header in `app/layout.tsx` (or `app/components/`) with links to Home, All books and New entry. Make sure text is readable and nothing overflows at 1280 px and 375 px (check the touch target size on phone).

8. **[DONE] Final checks and README.**
   Run `npm run lint` and `npm run build`. Walk through every "Done means" item below. Update `README.md` (what it is, how to run, a screenshot) and `AGENTS.md` (pages, data storage, rules), as `108.md` asks for the submission.

9. **[DONE] Home page, header and two new list pages.**
   - Two new pages: `/books/read` lists all books with status Read, and `/books/next` lists all books with status Want to read, most recent status change first (same order as the home page, see Assumptions). Each has its own friendly empty message, and each book links to its page. Reuse the existing list components, don't copy them.
   - Header links, in this order: Home, All books, Last reads (`/books/read`), Next reads (`/books/next`). Remove "New entry" from the header; the button on the home page stays.
   - Home page: "My Reads" on the left, the "New entry" button on the right. Then three sections in this order: Currently reading (all books with status Reading), Next 3 I want to read, Last 3 read. Each has its own friendly empty message. "Next 3" and "Last 3" end with a "See all" link to their page.
   - No data change.
   **Done means:**
   - The header shows the four links and highlights the current page.
   - Every page shows the right books; changing a book's status moves it to the right section and page after saving.
   - Empty messages show where there are no books; it works at 1280 px and 375 px.
   - Lint and build pass, and AGENTS.md lists the new pages.

10. **[DONE] Design pass.**
   Direction is decided (no need to ask):
   - Background on every page: `public/banner.svg`, pinned to the bottom of the page, centred, not repeating. Everything above it is flat green `#163A25`. Leave enough space at the bottom so the cards never cover the picture.
   - Dark mode (`prefers-color-scheme: dark`): use `public/banner-dark.svg` and flat green `#0A1915` instead.
   - On phones, the picture is at least 220 px tall, centred, with the sides cropped.
   - Headings and buttons use the Fraunces font, loaded with `next/font/google` (no new npm package). Book titles and other text use Geist.
   - Colours: cream text `#F4EEDC` on the green; cream cards `#F7F1E3` with dark text `#2A1E1C` and grey-brown `#6B5B4E` for authors; buttons are coral `#E9493E` pills with cream text. The header is green with cream links and an underline for the current page.
   Keep the technical parts of the old design step: define colours and fonts as tokens in `app/globals.css` and remove the `font-family: Arial` override; extract a shared `BookRow` in `app/components/`; share button and field styles instead of repeating them inline. Restyle header, headings, lists, empty states, forms, the book page and status labels. No behaviour change.
   **Done means:**
   - `docs/brand-guide.md` records these choices and tokens (replace "Not decided yet"), and AGENTS.md still points to it.
   - Every page has the same look in light and dark mode, with no leftover default styling.
   - Text is readable, nothing overflows at 1280 px and 375 px, touch targets are at least 44 px.
   - All "Done means" items below still pass, and `npm run lint` and `npm run build` pass.

## Extras (only if time)
Not required. Do them in this order, one at a time, only after step 10. Each follows the rules above (commit per extra, lint and build, update `docs/data-model.md` and `AGENTS.md` when data or pages change). Mark one `[DONE]` when finished.

**Extra 1. Moved into step 9.**

**Extra 2. Dates.**
Add optional `startedAt` and `finishedAt` to `Book` and `NewBook`, stored as `YYYY-MM-DD` (from `<input type="date">`, so no time-zone shifts). `isBook()` accepts them missing and rejects malformed values. In `BookForm.tsx`, "Started" shows for Reading and Read, "Finished" only for Read, nothing for Want to read; finish before start is rejected with an inline message; dates that don't fit the status are dropped on save; when status becomes Read and "Finished" is empty, prefill today (editable). Show dates on `/books` rows and the book page. "Last 3 read" sorts by `finishedAt` (fallback `addedAt` for books without one); "Currently reading" sorts by `startedAt` (fallback `addedAt`). Put the shared "effective date" helper in `app/lib/books.ts`. This replaces the "last 3 read" assumption below.
Done means:
- Date fields appear only for the right statuses and disappear when status changes; end before start is rejected with a message.
- Saved dates survive reload and show in lists and on the book page.
- "Last 3 read" follows end date, and an old Read book with no end date still appears in a sensible place.
- A book saved before this extra (no date fields) still loads, lists and edits. Test by seeding old-shape JSON in localStorage.
- Lint and build pass, data model doc updated.

**Extra 3. Stars (1–5).**
Add optional `rating` (1 to 5) to `Book` and `NewBook`; `isBook()` accepts it missing and rejects other values; it is dropped on save unless status is Read. New `app/components/StarRating.tsx` with an input mode (in `BookForm`, only for Read, a radio group of five buttons at least 44 px, with a way to clear it) and a read-only mode (on `/books` rows and the book page, with a text alternative like "4 out of 5 stars"). No package.
Done means:
- Stars appear only when status is Read, and are hidden and not saved otherwise.
- A rating can be set, changed and cleared, persists after reload, and shows on `/books` and the book page; it works with the keyboard and has a screen-reader label.
- Unrated and older Read books show no stars (not 0 stars) and still work.
- Lint and build pass, data model doc updated.

**Extra 4. Filter and search on `/books`.**
In `app/books/page.tsx`, add a status filter (All / Want to read / Reading / Read) and a search box matching title or author (case-insensitive, trimmed), combined. Plain React state, no URL params. Controls show only when the list is not empty.
Done means:
- Filter and search work alone and together, and "Clear" resets them.
- Two different empty states: "No books yet" (empty library, link to add) and "No books match" (filters active, clear-filters action). A result count is shown.
- Controls wrap and inputs are at least 44 px at 375 px, and older books still match.
- Lint and build pass.

**Extra 5. Export / Import.**
A "Backup" section at the bottom of `/books`, visible even with an empty library so a fresh browser can import. In `app/lib/books.ts` (export `isBook`): `exportBooks()` downloads `my-reads-YYYY-MM-DD.json` containing `{ app: "my-reads", version: 1, exportedAt, books }`; `parseImport(text)` accepts that wrapper or a bare array, validates each entry with `isBook()`, counts valid and skipped, never throws; `importBooks(books, mode)` merges by `id` by default (existing books kept, new ids added, same id skipped), with "replace everything" only behind a confirm. Show a result message ("Imported 12, skipped 1 invalid, 3 already present") and an inline error for non-JSON or wrong files. If Extra 6 exists, also include its goals (file `version` 2, `goals` optional, version 1 files still import).
Done means:
- Export downloads a file with every book (including dates and ratings if those extras exist), and that file imports back with identical data.
- Importing into an empty browser restores the list, and importing the same file twice creates no duplicates.
- A broken, empty or wrong file shows a clear message and changes nothing.
- A file exported before Extras 2 and 3 (old shape) imports fine.
- Lint and build pass, file format documented in `docs/data-model.md`, AGENTS.md mentions it. (The File System Access API stays out, see `docs/storage-decision.md`.)

**Extra 6. Yearly reading challenge.** (needs Extra 2)
A goal per year in a second localStorage key `my-reads:goals`, a JSON object like `{ "2026": 24 }`. New `app/lib/goal.ts` with `getGoal(year)` and `setGoal(year, n)`, guarded like `books.ts` (missing storage, bad JSON, non-positive numbers). Count = books with status Read whose `finishedAt` is in the current year; Read books without `finishedAt` fall back to the year of `addedAt` (same rule as Extra 2). New `app/components/ReadingChallenge.tsx` card on the home page: "7 of 24 books in 2026" with a progress bar (`role="progressbar"`, values exposed) and a small form to set or change the goal. No goal set shows a prompt; past the goal shows completed.
Done means:
- Setting a goal persists after reload, and changing it updates the display.
- The count equals the number of Read books finished this year and updates when a book is marked Read with an end date.
- No goal, a goal of 0, blank or not a number, and a count above the goal all behave sensibly, in light and dark at 375 px.
- Books from earlier years are not counted, and older books follow the documented fallback.
- Lint and build pass, docs and AGENTS.md updated.

## Done means
- A book without a title is not added.
- An empty list shows a friendly message.
- Books stay saved after reloading and reopening the tab.
- It works at 1280 px and 375 px wide, and text is easy to read.
- `npm run lint` and `npm run build` pass.

## Assumptions
- **"Last 3 read" and "Next 3 I want to read":** the data model has no read date and dates are out of scope. Order each list by `statusChangedAt` (set when a book is added and whenever its status changes on save), newest first, falling back to `addedAt` for books saved before that field existed. So a book marked Read today is at the top of "Last 3 read" even if it was added long ago. (Extra 2 would replace this for "Last 3 read": it would sort by end date.)

## Not now
A second reader (needs accounts and a backend).

## Verification (end to end)
1. `npm run dev`, open `localhost:3000`.
2. Add a book with no title: it is rejected. Add three books with different statuses.
3. Check `/`, `/books` and `/books/[id]`, edit one book, delete one book.
4. Reload, then close and reopen the tab: all changes remain.
5. Clear the list: the empty-state messages show on `/` and `/books`. Open `/books/unknown-id`: friendly not-found message.
6. Resize to 1280 px and 375 px (browser dev tools): layout works and text is readable.
7. Open `/books/read` and `/books/next` and check they list the right books.
8. Switch the computer to dark mode and check every page.
9. Open `/hello`: friendly not-found page.
10. `npm run lint` and `npm run build` both pass.
