"use client";

import { useEffect } from "react";
import * as books from "../lib/books";

// TEMPORARY, development only: exposes the storage functions as `window.books`
// so they can be tested from the browser console (Step 2). Does nothing in a
// production build. Remove once the pages use the storage module.
export default function DevConsole() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { books: typeof books }).books = books;
  }, []);
  return null;
}
