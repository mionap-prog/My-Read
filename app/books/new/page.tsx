"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addBook, type BookSource, type BookStatus } from "../../lib/books";

const SOURCES: BookSource[] = ["Owned", "Borrowed", "Library"];
const STATUSES: BookStatus[] = ["Want to read", "Reading", "Read"];

const fieldClass =
  "mt-1 block min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
const labelClass = "block text-sm font-medium";

export default function NewBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState<BookSource>("Owned");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState<BookStatus>("Want to read");
  const [notes, setNotes] = useState("");
  const [titleError, setTitleError] = useState("");
  const [saveError, setSaveError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");

    if (!title.trim()) {
      setTitleError("Please enter a title.");
      return;
    }
    setTitleError("");

    const book = addBook({
      title,
      author: author.trim(),
      source,
      language: language.trim(),
      status,
      notes: notes.trim(),
    });

    if (!book) {
      setSaveError("Could not save the book. Browser storage may be blocked or full.");
      return;
    }
    router.push("/books");
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Add a book</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-red-600 dark:text-red-400">(required)</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={titleError ? true : undefined}
            aria-describedby={titleError ? "title-error" : undefined}
            className={fieldClass}
          />
          {titleError && (
            <p id="title-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="author" className={labelClass}>Author</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="source" className={labelClass}>Source</label>
          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value as BookSource)}
            className={fieldClass}
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className={labelClass}>Language</label>
          <input
            id="language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className={fieldClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={fieldClass}
          />
        </div>

        {saveError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="min-h-11 rounded-md bg-zinc-900 px-5 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Save book
          </button>
          <Link href="/books" className="text-zinc-600 underline dark:text-zinc-400">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
