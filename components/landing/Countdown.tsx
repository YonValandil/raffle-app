'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ISODateString } from '@/types';

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function computeParts(targetMs: number): Parts {
  const total = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

const SLOTS: Array<{ key: keyof Parts; label: string }> = [
  { key: 'days', label: 'jours' },
  { key: 'hours', label: 'heures' },
  { key: 'minutes', label: 'minutes' },
  { key: 'seconds', label: 'secondes' },
];

export function Countdown({ targetDate }: { targetDate: ISODateString }) {
  const targetMs = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  const [parts, setParts] = useState<Parts>(() =>
    Number.isNaN(targetMs) ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : computeParts(targetMs),
  );

  useEffect(() => {
    if (Number.isNaN(targetMs)) return;

    const tick = () => setParts(computeParts(targetMs));
    let intervalId: ReturnType<typeof setInterval> | undefined;

    // Align the first tick to the next clock-second boundary so updates feel in-sync
    // with the wall clock, then run a 1s interval. Mitigates timer drift.
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));

    // Browsers throttle intervals in background tabs — refresh immediately on return.
    const onVisibility = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [targetMs]);

  if (Number.isNaN(targetMs)) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Date du tirage à confirmer.</p>;
  }

  // computeParts clamps with Math.max(0, …): all parts at 0 ⟺ deadline reached.
  // Reading state instead of Date.now() keeps the render pure.
  const isFinished =
    parts.days === 0 && parts.hours === 0 && parts.minutes === 0 && parts.seconds === 0;
  if (isFinished) {
    return (
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Le tirage est en cours…
      </p>
    );
  }

  return (
    <div aria-live="polite" className="flex gap-3 sm:gap-4">
      {SLOTS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:h-20 sm:w-20">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={parts[key]}
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-3xl"
                suppressHydrationWarning
              >
                {String(parts[key]).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-2 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
