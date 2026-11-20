"use client";

import Link from "next/link";
import { useBooks } from "./lib/useBooks";
import type { Book, BookStatus } from "./lib/books";

// "Last 3 read" / "Next 3 I want to read": the data model has no read date,
// so we take the 3 most recently added books with the given status (see PLAN.md).
function latestWithStatus(books: Book[], status: BookStatus): Book[] {
  return books
    .filter((book) => book.status === status)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, 3);
}

function BookList({
  title,
  books,
  loaded,
  emptyMessage,
}: {
  title: string;
  books: Book[];
  loaded: boolean;
  emptyMessage: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {!loaded ? (
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : books.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {books.map((book) => (
            <li key={book.id}>
              <Link
                href={`/books/${book.id}`}
                className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="block text-lg font-medium">{book.title}</span>
                {book.author && (
                  <span className="block text-zinc-600 dark:text-zinc-400">
                    {book.author}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Home() {
  const { books, loaded } = useBooks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">My Reads</h1>
        <Link
          href="/books/new"
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          New entry
        </Link>
      </div>

      <BookList
        title="Last 3 read"
        books={latestWithStatus(books, "Read")}
        loaded={loaded}
        emptyMessage="No finished books yet. Mark a book as Read and it will show up here."
      />
      <BookList
        title="Next 3 I want to read"
        books={latestWithStatus(books, "Want to read")}
        loaded={loaded}
        emptyMessage="Nothing on your wish list yet. Add a book with the status Want to read."
      />
    </main>
  );
}
