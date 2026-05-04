import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500"
          />
          Tombola
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-zinc-50 transition-colors duration-200 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Se connecter
          </Link>
        </nav>
      </div>
    </header>
  );
}
