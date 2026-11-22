"use client";

import Link from "next/link";
import { useBooks } from "./lib/useBooks";
import { booksWithStatus } from "./lib/books";
import BookListSection from "./components/BookListSection";

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

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Currently reading
        </h2>
        <BookListSection
          books={booksWithStatus(books, "Reading")}
          loaded={loaded}
          emptyMessage="You are not reading anything right now. Mark a book as Reading and it will show up here."
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Next 3 I want to read
        </h2>
        <BookListSection
          books={booksWithStatus(books, "Want to read").slice(0, 3)}
          loaded={loaded}
          emptyMessage="Nothing on your wish list yet. Add a book with the status Want to read."
          seeAll={{ href: "/books/next", label: "See all" }}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Last 3 read</h2>
        <BookListSection
          books={booksWithStatus(books, "Read").slice(0, 3)}
          loaded={loaded}
          emptyMessage="No finished books yet. Mark a book as Read and it will show up here."
          seeAll={{ href: "/books/read", label: "See all" }}
        />
      </section>
    </main>
  );
}
