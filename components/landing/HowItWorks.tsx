const STEPS = [
  {
    n: '01',
    title: 'Achète ton billet',
    body:
      'Choisis le nombre de billets pour la tombola du mois et règle en ligne via Stripe. Paiement sécurisé, validation côté serveur.',
  },
  {
    n: '02',
    title: 'Tirage transparent',
    body:
      'À la date annoncée, un tirage aléatoire désigne un gagnant parmi tous les billets. Le résultat est validé manuellement avant publication.',
  },
  {
    n: '03',
    title: 'Reçois ton lot',
    body:
      "Le gagnant est contacté par email et son nom apparaît sur la page d'accueil dès la validation. Le lot est expédié sous 7 jours.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="hiw-title"
      className="mx-auto w-full max-w-6xl px-6 py-20"
    >
      <div className="mb-12 max-w-2xl">
        <h2
          id="hiw-title"
          className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl"
        >
          Comment ça marche
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Une tombola par mois, un tirage à date fixe, des lots tech & gaming. Aucun frais caché.
        </p>
      </div>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <span className="text-xs font-medium tracking-widest text-zinc-400 dark:text-zinc-500">
              {step.n}
            </span>
            <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
