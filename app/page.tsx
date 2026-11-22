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
        <h1 className="heading text-4xl">My Reads</h1>
        <Link
          href="/books/new"
          className="btn"
        >
          New entry
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="heading text-2xl">
          Currently reading
        </h2>
        <BookListSection
          books={booksWithStatus(books, "Reading")}
          loaded={loaded}
          emptyMessage="You are not reading anything right now. Mark a book as Reading and it will show up here."
        />
      </section>

      <section className="mt-10">
        <h2 className="heading text-2xl">
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
        <h2 className="heading text-2xl">Last 3 read</h2>
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
