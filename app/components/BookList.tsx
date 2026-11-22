import type { Book } from "../lib/books";
import BookRow from "./BookRow";

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
    <ul className="mt-3 space-y-3">
      {books.map((book) => (
        <BookRow key={book.id} book={book} details={details} />
      ))}
    </ul>
  );
}
