"use client";

import { useRouter } from "next/navigation";
import BookForm from "../../components/BookForm";
import { addBook } from "../../lib/books";

export default function NewBookPage() {
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Add a book</h1>

      <BookForm
        submitLabel="Save book"
        cancelHref="/books"
        onSubmit={(values) => {
          if (!addBook(values)) {
            return "Could not save the book. Browser storage may be blocked or full.";
          }
          router.push("/books");
        }}
      />
    </main>
  );
}
