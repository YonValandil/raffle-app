import type { ISODateString } from '@/types';

export function formatPriceCents(
  cents: number,
  locale: string = 'fr-FR',
  currency: string = 'EUR',
): string {
  if (!Number.isFinite(cents)) return '–';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function formatDate(
  date: ISODateString | Date,
  locale: string = 'fr-FR',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '–';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);
}
