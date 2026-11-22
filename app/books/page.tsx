"use client";

import Link from "next/link";
import { useBooks } from "../lib/useBooks";
import BookList from "../components/BookList";

export default function BooksPage() {
  const { books, loaded } = useBooks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">All books</h1>

      {!loaded ? (
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : books.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
          <p className="text-lg">No books yet. Your reading list is empty.</p>
          <Link
            href="/books/new"
            className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
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
