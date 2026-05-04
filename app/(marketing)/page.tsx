import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Countdown } from '@/components/landing/Countdown';
import { getActiveTombola, getActiveTombolaStats } from '@/lib/services/tombolas';
import { formatPriceCents } from '@/lib/utils/format';

// Live participant / ticket counts → render per request, not at build time.
export const dynamic = 'force-dynamic';

export default async function MarketingHome() {
  const tombola = await getActiveTombola();
  const stats = tombola
    ? await getActiveTombolaStats(tombola.id)
    : { totalParticipants: 0, totalTickets: 0 };

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-fuchsia-50 via-white to-white dark:from-fuchsia-950/20 dark:via-zinc-950 dark:to-zinc-950"
            style={{ clipPath: 'polygon(0 0, 100% 4%, 100% 100%, 0 100%)' }}
          />

          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
            {tombola ? (
              <>
                <span className="rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                  Tombola en cours
                </span>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
                  {tombola.title}
                </h1>

                <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                  À gagner :{' '}
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {tombola.prize}
                  </span>
                </p>

                <div className="mt-10">
                  <Countdown targetDate={tombola.draw_date} />
                </div>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                  <Link
                    href="/participer"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors duration-200 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Participer pour {formatPriceCents(tombola.ticket_price_cents)}
                  </Link>
                  <Link
                    href="#comment-ca-marche"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    Comment ça marche
                  </Link>
                </div>

                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {stats.totalParticipants}
                  </span>{' '}
                  participant{stats.totalParticipants !== 1 ? 's' : ''} ·{' '}
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {stats.totalTickets}
                  </span>{' '}
                  billet{stats.totalTickets !== 1 ? 's' : ''} sur {tombola.max_participants}
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                  Pas de tombola active
                </h1>
                <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
                  La prochaine tombola arrive bientôt. Reviens dans quelques jours pour participer.
                </p>
              </>
            )}
          </div>
        </section>

        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
