import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500"
          />
          <p>© {year} Tombola — SIRET : à compléter</p>
        </div>

        <nav aria-label="Liens légaux" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/mentions-legales"
            className="text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Mentions légales
          </Link>
          <Link
            href="/cgu"
            className="text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            CGU
          </Link>
          <Link
            href="/contact"
            className="text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
