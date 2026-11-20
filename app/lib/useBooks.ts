"use client";

import { useCallback, useEffect, useState } from "react";
import { getBooks, type Book } from "./books";

// Reads books on the client after mount. The first render (server and browser)
// always gives an empty list with loaded = false, so the HTML matches; the real
// books arrive right after. Call reload() after adding, updating or deleting.
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    setBooks(getBooks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    // Initial read from localStorage, which only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  return { books, loaded, reload };
}
