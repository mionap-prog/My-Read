"use client";

import Link from "next/link";
import { useBooks } from "../lib/useBooks";
import BookList from "../components/BookList";

export default function BooksPage() {
  const { books, loaded } = useBooks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="heading text-3xl">All books</h1>

      {!loaded ? (
        <p className="mt-6 text-cream/80">Loading…</p>
      ) : books.length === 0 ? (
        <div className="empty-state mt-6 p-6 text-center">
          <p className="text-lg">No books yet. Your reading list is empty.</p>
          <Link
            href="/books/new"
            className="btn mt-4"
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <BookList books={books} details />
      )}
    </main>
  );
}
