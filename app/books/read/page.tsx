"use client";

import { useBooks } from "../../lib/useBooks";
import { booksWithStatus } from "../../lib/books";
import BookListSection from "../../components/BookListSection";

export default function ReadPage() {
  const { books, loaded } = useBooks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Last reads</h1>
      <BookListSection
        books={booksWithStatus(books, "Read")}
        loaded={loaded}
        details
        emptyMessage="No finished books yet. Mark a book as Read and it will show up here."
      />
    </main>
  );
}
