import Link from "next/link";
import type { Book } from "../lib/books";

// Shared list of books, each linking to its page. Used by the home page,
// /books, /books/read and /books/next. `details` adds status, source and language.
export default function BookList({
  books,
  details = false,
}: {
  books: Book[];
  details?: boolean;
}) {
  return (
    <ul className="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {books.map((book) => (
        <li key={book.id}>
          <Link
            href={`/books/${book.id}`}
            className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <span className="block text-lg font-medium">{book.title}</span>
            {book.author && (
              <span className="block text-zinc-600 dark:text-zinc-400">
                {book.author}
              </span>
            )}
            {details && (
              <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {book.status}
                </span>
                <span>{book.source}</span>
                {book.language && <span>{book.language}</span>}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
