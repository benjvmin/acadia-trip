import type { PersonId } from '@/types/trip';

export const PEOPLE = ['ben', 'brandon', 'nick'] as const;

export const PERSON_NAMES: Record<PersonId, string> = {
  ben: 'Ben',
  brandon: 'Brandon',
  nick: 'Nick',
};

export function splitThreeWays(cents: number): Record<PersonId, number> {
  const base = Math.floor(cents / 3);
  const remainder = cents - base * 3;

  return { ben: base + remainder, brandon: base, nick: base };
}
