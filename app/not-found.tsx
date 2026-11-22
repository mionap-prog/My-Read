import Link from "next/link";

// Shown for any address that doesn't exist.
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <div className="empty-state p-6 text-center">
        <h1 className="heading text-3xl">Page not found</h1>
        <p className="mt-2">
          We couldn&apos;t find that page. The address may be wrong, or the page
          may have moved.
        </p>
        <Link href="/" className="btn mt-4">
          Back to home
        </Link>
      </div>
    </main>
  );
}
