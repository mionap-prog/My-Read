// Book storage: all books live in localStorage as one JSON array under one key.
// See docs/storage-decision.md. These functions only work in the browser, so call
// them from Client Components (event handlers or effects), never during server render.

export type BookSource = "Owned" | "Borrowed" | "Library";
export type BookStatus = "Want to read" | "Reading" | "Read";

export type Book = {
  id: string;
  title: string; // required
  author: string;
  source: BookSource;
  language: string;
  status: BookStatus;
  notes: string;
  addedAt: string; // ISO date string, set when the book is added
};

// What the caller provides when adding a book (id and addedAt are generated).
export type NewBook = Omit<Book, "id" | "addedAt">;

export const STORAGE_KEY = "my-reads:books";

const SOURCES: BookSource[] = ["Owned", "Borrowed", "Library"];
const STATUSES: BookStatus[] = ["Want to read", "Reading", "Read"];

// Returns localStorage, or null if it is missing or blocked (server render,
// private mode with storage disabled, browser settings).
function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.title === "string" &&
    b.title.trim() !== "" &&
    typeof b.author === "string" &&
    typeof b.language === "string" &&
    typeof b.notes === "string" &&
    typeof b.addedAt === "string" &&
    SOURCES.includes(b.source as BookSource) &&
    STATUSES.includes(b.status as BookStatus)
  );
}

// Read all books. Never throws: missing storage, an empty store, bad JSON or
// something that is not an array all give an empty list. Broken entries are skipped.
export function getBooks(): Book[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBook);
  } catch {
    return [];
  }
}

// Returns true if saved, false if storage is unavailable or full.
function saveBooks(books: Book[]): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch {
    return false;
  }
}

export function getBook(id: string): Book | undefined {
  return getBooks().find((book) => book.id === id);
}

// Adds a book and returns it, or null if the title is empty or saving failed.
export function addBook(input: NewBook): Book | null {
  const title = input.title.trim();
  if (!title) return null;
  const book: Book = {
    ...input,
    title,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  return saveBooks([...getBooks(), book]) ? book : null;
}

// Updates fields of an existing book (id and addedAt cannot change).
// Returns the updated book, or null if not found, the title is empty, or saving failed.
export function updateBook(
  id: string,
  changes: Partial<NewBook>,
): Book | null {
  const books = getBooks();
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;
  const updated: Book = { ...books[index], ...changes, id, addedAt: books[index].addedAt };
  updated.title = updated.title.trim();
  if (!updated.title) return null;
  books[index] = updated;
  return saveBooks(books) ? updated : null;
}

// Deletes a book. Returns true if a book was removed and saved.
export function deleteBook(id: string): boolean {
  const books = getBooks();
  const remaining = books.filter((book) => book.id !== id);
  if (remaining.length === books.length) return false;
  return saveBooks(remaining);
}
