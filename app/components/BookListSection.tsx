"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Book } from "../lib/books";
import BookList from "./BookList";

// A list with loading and empty states. Used for the home sections and the
// /books/read and /books/next pages. `seeAll` adds a link under the list.
export default function BookListSection({
  books,
  loaded,
  emptyMessage,
  details = false,
  seeAll,
}: {
  books: Book[];
  loaded: boolean;
  emptyMessage: ReactNode;
  details?: boolean;
  seeAll?: { href: string; label: string };
}) {
  return (
    <>
      {!loaded ? (
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : books.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {emptyMessage}
        </p>
      ) : (
        <BookList books={books} details={details} />
      )}
      {seeAll && (
        <Link
          href={seeAll.href}
          className="mt-2 inline-flex min-h-11 items-center text-zinc-900 underline hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
        >
          {seeAll.label}
        </Link>
      )}
    </>
  );
}
