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
        <p className="mt-3 text-cream/80">Loading…</p>
      ) : books.length === 0 ? (
        <p className="empty-state mt-3">
          {emptyMessage}
        </p>
      ) : (
        <BookList books={books} details={details} />
      )}
      {seeAll && (
        <Link
          href={seeAll.href}
          className="text-link mt-2"
        >
          {seeAll.label}
        </Link>
      )}
    </>
  );
}
