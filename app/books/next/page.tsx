"use client";

import { useBooks } from "../../lib/useBooks";
import { booksWithStatus } from "../../lib/books";
import BookListSection from "../../components/BookListSection";

export default function NextPage() {
  const { books, loaded } = useBooks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="heading text-3xl">Next reads</h1>
      <BookListSection
        books={booksWithStatus(books, "Want to read")}
        loaded={loaded}
        details
        emptyMessage="Nothing on your wish list yet. Add a book with the status Want to read."
      />
    </main>
  );
}
