import Link from "next/link";
import type { Book, BookStatus } from "../lib/books";

const STATUS_STYLES: Record<BookStatus, string> = {
  "Want to read": "bg-amber-200 text-amber-950",
  Reading: "bg-sky-200 text-sky-950",
  Read: "bg-emerald-200 text-emerald-950",
};

// Small coloured label for a book's status.
export function StatusLabel({ status }: { status: BookStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// One book as a cream card linking to its page. `details` adds status, source and language.
export default function BookRow({
  book,
  details = false,
}: {
  book: Book;
  details?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/books/${book.id}`}
        className="card block px-4 py-3 -outline-offset-4 hover:bg-white"
      >
        <span className="block text-lg font-semibold">{book.title}</span>
        {book.author && (
          <span className="block text-muted">{book.author}</span>
        )}
        {details && (
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <StatusLabel status={book.status} />
            <span>{book.source}</span>
            {book.language && <span>{book.language}</span>}
          </span>
        )}
      </Link>
    </li>
  );
}
