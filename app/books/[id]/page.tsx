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
          <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
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
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : !book ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
          <h1 className="text-2xl font-semibold tracking-tight">Book not found</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            We couldn&apos;t find a book with that id. It may have been deleted.
          </p>
          <Link
            href="/books"
            className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Back to all books
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold tracking-tight">Edit book</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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

          <section className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="min-h-11 rounded-md border border-red-600 px-5 py-2 text-red-700 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
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
                    className="min-h-11 rounded-md bg-red-700 px-5 py-2 text-white hover:bg-red-800"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="min-h-11 text-zinc-600 underline dark:text-zinc-400"
                  >
                    Keep it
                  </button>
                </div>
                {deleteError && (
                  <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
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
