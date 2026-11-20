# Storage decision

**Decision: use `localStorage`, with all books saved as one JSON array under a single key.**

## The situation

- One person uses the app. There is no backend and no accounts.
- The data is a few hundred small records (see `docs/data-model.md`). A book with a long note is maybe 0.5 KB, so even 500 books is only about 250 KB.
- The data must still be there after a reload and after closing and reopening the tab.

## The options in simple words

### localStorage: a small notebook the browser keeps for your site
You save text under a name (a "key") and read it back later. It stays after you close the tab or the browser. To store books you turn the list into text with `JSON.stringify` and back with `JSON.parse`.

- **Survives reload and tab close:** yes. It stays until the user clears site data. One catch: in private/incognito mode it behaves like sessionStorage and is deleted when the window closes.
- **Size limit:** about 5 MiB per site. Going over throws a `QuotaExceededError`. We would use well under 1 MiB.
- **API:** synchronous (the code waits for it, no promises or callbacks). It is fast enough for this much data.
- **Complexity:** very low. Four calls (`getItem`, `setItem`, `removeItem`, `clear`). No package needed.
- **Fit:** **good.** Small data, one user, no backend.
- **Watch out for:** it only works in the browser, so it needs a Client Component in Next.js and must be read after mount (planned in Step 2). Text only, so no search or indexes, and we filter the array in JavaScript instead (fine for hundreds of books).

### sessionStorage: the same notebook, but thrown away when the tab closes
Same API as localStorage, but each tab has its own copy and closing the tab deletes it.

- **Survives reload:** yes. **Survives tab close:** **no.**
- **Fit:** **ruled out.** "Books stay saved after reopening the tab" is a requirement in `PLAN.md`.

### Cookies: tiny notes the browser sends to the server with every request
Designed for things like login sessions, so the server can recognize you.

- **Survives tab close:** yes, if you set an expiry date.
- **Size limit:** about 4 KB per cookie. A list of books would not fit well.
- **API:** awkward string handling (`document.cookie`), or server code in Next.js.
- **Extra cost:** cookies are sent with every request, which would slow things down as the list grows.
- **Fit:** **poor.** Too small, clumsy, and made for a different job. MDN itself recommends modern storage APIs for general client-side data.

### IndexedDB: a real database inside the browser
It stores structured objects, supports indexes and searching, and handles large amounts of data, even files.

- **Survives reload and tab close:** yes (same "best effort" rules as localStorage: the browser can clear it under heavy disk pressure unless persistent storage is granted).
- **Size limit:** very large, usually a share of the disk (e.g. up to 60% of disk in Chrome/Edge).
- **API:** asynchronous, with transactions, object stores, versions and migrations. More code, more ways to go wrong.
- **Fit:** **works, but overkill.** Its strengths (big data, indexes, files) are things this app doesn't need. Using it would also push us toward adding a wrapper package, which the project rules say we must ask about first.
- **When to revisit:** if the app grows to thousands of records, needs fast search, or stores cover images.

### File System Access API: read and write a real file on the user's computer
The user picks a file (for example `my-reads.json`) with a picker, and the app can read and save it directly.

- **Survives reload and tab close:** the file does, but the app must ask the user to pick or re-approve the file again in new sessions.
- **Size limit:** none worth worrying about.
- **API:** asynchronous, needs HTTPS (or localhost), and every access needs the user's permission.
- **Browser support:** limited. At the time of writing it is mainly Chrome and Edge, and not Firefox or Safari (check [Can I use](https://caniuse.com/native-filesystem-api) for the current state).
- **Fit:** **poor as the main storage.** Permission prompts on every visit make it clumsy. It could be a nice later extra for export or backup, which is "Not now" in `PLAN.md`.

## Comparison

| | Survives reload | Survives tab close | Size limit | API | Complexity | Fits this app |
| --- | --- | --- | --- | --- | --- | --- |
| **localStorage** | Yes | Yes | ~5 MiB | Sync | Very low | **Yes** |
| sessionStorage | Yes | **No** | ~5 MiB | Sync | Very low | No |
| Cookies | Yes | Yes (with expiry) | ~4 KB each | Sync, awkward | Medium | No |
| IndexedDB | Yes | Yes | Very large | Async | High | Overkill |
| File System Access | Yes (file) | Yes (file) | Large | Async | High | No (poor support, permission prompts) |

## Known limits of the choice

- Data lives in one browser on one device. A different browser or computer sees an empty list. Clearing site data erases the books. This is expected for "no backend".
- Private/incognito windows won't keep the data.
- If the stored text is damaged or missing, the storage code (Step 2) must fall back to an empty list instead of crashing.

## Sources

- MDN, Web Storage API (localStorage vs sessionStorage, synchronous, private mode): https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN, Storage quotas and eviction criteria (5 MiB limit for web storage, IndexedDB limits, eviction): https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN, IndexedDB API (async, structured data, transactional): https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN, File System API (pickers, secure context, user permission): https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
- MDN, Using HTTP cookies (sent with every request, ~4 KB, expiry): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
- Can I use, File System Access API support: https://caniuse.com/native-filesystem-api
