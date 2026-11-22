"use client";

import { useState } from "react";
import Link from "next/link";
import type { BookSource, BookStatus, NewBook } from "../lib/books";

const SOURCES: BookSource[] = ["Owned", "Borrowed", "Library"];
const STATUSES: BookStatus[] = ["Want to read", "Reading", "Read"];

const EMPTY_BOOK: NewBook = {
  title: "",
  author: "",
  source: "Owned",
  language: "",
  status: "Want to read",
  notes: "",
};

type BookFormProps = {
  // Starting values. Omit for an empty form (add), pass a book for edit.
  initialValues?: NewBook;
  submitLabel: string;
  cancelHref: string;
  // Called with the cleaned values once the title check passes.
  // Return an error message if saving failed, or null/undefined if it worked.
  onSubmit: (values: NewBook) => string | null | undefined;
};

// Shared by /books/new (add) and /books/[id] (edit).
export default function BookForm({
  initialValues = EMPTY_BOOK,
  submitLabel,
  cancelHref,
  onSubmit,
}: BookFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [author, setAuthor] = useState(initialValues.author);
  const [source, setSource] = useState<BookSource>(initialValues.source);
  const [language, setLanguage] = useState(initialValues.language);
  const [status, setStatus] = useState<BookStatus>(initialValues.status);
  const [notes, setNotes] = useState(initialValues.notes);
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

    const error = onSubmit({
      title: title.trim(),
      author: author.trim(),
      source,
      language: language.trim(),
      status,
      notes: notes.trim(),
    });
    if (error) setSaveError(error);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
      <div>
        <label htmlFor="title" className="field-label">
          Title <span className="text-alert">(required)</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "title-error" : undefined}
          className="field"
        />
        {titleError && (
          <p id="title-error" role="alert" className="error-text mt-1">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="author" className="field-label">Author</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="source" className="field-label">Source</label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value as BookSource)}
          className="field"
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="language" className="field-label">Language</label>
        <input
          id="language"
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="status" className="field-label">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as BookStatus)}
          className="field"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="field-label">Notes</label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="field"
        />
      </div>

      {saveError && (
        <p role="alert" className="error-text">{saveError}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn"
        >
          {submitLabel}
        </button>
        <Link href={cancelHref} className="text-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
