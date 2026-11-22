"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All books" },
  { href: "/books/read", label: "Last reads" },
  { href: "/books/next", label: "Next reads" },
];

// Which link is active for the current path.
// /books and /books/[id] belong to "All books"; /books/read and /books/next have
// their own links; /books/new highlights nothing (the button is on the home page).
function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/books") {
    return (
      pathname.startsWith("/books") &&
      !["/books/new", "/books/read", "/books/next"].includes(pathname)
    );
  }
  return pathname === href;
}

function Nav({ pathname }: { pathname: string | null }) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-3xl items-center gap-1 px-2 sm:gap-2 sm:px-4"
      >
        {links.map(({ href, label }) => {
          const active = pathname !== null && isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center border-b-2 px-3 text-base ${
                active
                  ? "border-zinc-900 font-semibold text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

// Reads the current path, so it must be rendered inside <Suspense>.
function NavWithActive() {
  return <Nav pathname={usePathname()} />;
}

export default function Header() {
  return (
    <Suspense fallback={<Nav pathname={null} />}>
      <NavWithActive />
    </Suspense>
  );
}
