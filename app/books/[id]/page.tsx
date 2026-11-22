"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookForm from "../../components/BookForm";
import { deleteBook, updateBook } from "../../lib/books";
import { useBooks } from "../../lib/useBooks";

// In this Next.js version `params` is a Promise. Reading it must sit behind <Suspense>
// (see optimizing-the-static-shell.md), so the page is a thin wrapper around BookDetail.
export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-cream/80">Loading…</p>
        </main>
      }
    >
      <BookDetail params={params} />
    </Suspense>
  );
}

function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { books, loaded } = useBooks();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const book = books.find((b) => b.id === id);

  function handleDelete() {
    if (!deleteBook(id)) {
      setDeleteError("Could not delete the book. Browser storage may be blocked.");
      return;
    }
    router.push("/");
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      {!loaded ? (
        <p className="text-cream/80">Loading…</p>
      ) : !book ? (
        <div className="empty-state p-6 text-center">
          <h1 className="heading text-2xl">Book not found</h1>
          <p className="mt-2">
            We couldn&apos;t find a book with that id. It may have been deleted.
          </p>
          <Link
            href="/books"
            className="btn mt-4"
          >
            Back to all books
          </Link>
        </div>
      ) : (
        <>
          <h1 className="heading text-3xl">Edit book</h1>
          <p className="mt-1 text-sm text-cream/80">
            Added {new Date(book.addedAt).toLocaleDateString()}
          </p>

          <BookForm
            initialValues={book}
            submitLabel="Save changes"
            cancelHref="/books"
            onSubmit={(values) => {
              if (!updateBook(id, values)) {
                return "Could not save your changes. Browser storage may be blocked or full.";
              }
              router.push("/");
            }}
          />

          <section className="mt-10 border-t border-cream/20 pt-6">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="btn-outline"
              >
                Delete book
              </button>
            ) : (
              <div role="alertdialog" aria-labelledby="delete-question">
                <p id="delete-question" className="font-medium">
                  Delete &ldquo;{book.title}&rdquo;? This can&apos;t be undone.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="text-link"
                  >
                    Keep it
                  </button>
                </div>
                {deleteError && (
                  <p role="alert" className="error-text mt-2">
                    {deleteError}
                  </p>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
