import { describe, expect, it } from 'vitest';
import { mergeExpenses, summarizeLedger } from '@/domain/ledger';
import type { Day, Expense } from '@/types/trip';

const days: Day[] = [
  { day: 1, date: 'Mon 17 Aug', isoDate: '2026-08-17', title: 'A', meta: '', driveMiles: 470, driveHours: 8, overnightCity: 'South Portland, ME', stops: [], lodging: null },
  { day: 2, date: 'Tue 18 Aug', isoDate: '2026-08-18', title: 'B', meta: '', driveMiles: 165, driveHours: 3.5, overnightCity: 'Tremont, ME', stops: [], lodging: null },
];

const expenses: Expense[] = [
  { id: 'exp-car', date: '2026-08-17', day: 1, category: 'car', description: 'SUV', amountCents: 86983, status: 'paid', paidBy: null },
  { id: 'exp-merry-manor', date: '2026-08-17', day: 1, category: 'lodging', description: 'Manor', amountCents: 18200, status: 'paid', paidBy: null },
  { id: 'exp-tremont', date: '2026-08-18', day: 2, category: 'lodging', description: 'Tremont', amountCents: 95200, status: 'paid', paidBy: null },
  { id: 'exp-oceanside', date: '2026-08-19', day: 3, category: 'lodging', description: 'Oceanside', amountCents: 104700, status: 'estimated', paidBy: null },
  { id: 'exp-quote', date: '2026-08-19', day: null, category: 'food', description: 'Dinner', amountCents: 12000, status: 'quoted', paidBy: null },
  { id: 'exp-park', date: '2026-08-19', day: 3, category: 'park', description: 'Pass', amountCents: 3500, status: 'unpurchased', paidBy: null },
  { id: 'exp-unknown', date: '2026-08-20', day: null, category: 'other', description: 'Unknown', amountCents: null, status: 'estimated', paidBy: null },
  { id: 'exp-global', date: '2026-08-16', day: null, category: 'other', description: 'Global', amountCents: 300, status: 'paid', paidBy: null },
];

describe('summarizeLedger', () => {
  it('counts paid booked items and splits them', () => {
    const s = summarizeLedger(expenses, days);
    expect(s.paidCents).toBe(86983 + 18200 + 95200 + 300);
    expect(s.estimatedCents).toBe(104700);
    expect(s.quotedCents).toBe(12000);
    expect(s.unknownCount).toBe(1);
    expect(s.byCategory).toEqual({ lodging: 113400, car: 86983, fuel: 0, food: 0, park: 0, reservation: 0, other: 300 });
    expect(s.runningByDay).toEqual([
      { day: 1, cumulativePaidCents: 86983 + 18200 },
      { day: 2, cumulativePaidCents: 86983 + 18200 + 95200 },
    ]);
    expect(s.perPerson.map((p) => p.person)).toEqual(['ben', 'brandon', 'nick']);
    expect(s.perPerson.reduce((n, p) => n + p.paidCents, 0)).toBe(s.paidCents);
    expect(s.perPerson.reduce((n, p) => n + p.estimatedCents, 0)).toBe(s.estimatedCents);
    expect(s.perPerson[0].paidCents).toBeGreaterThanOrEqual(s.perPerson[1].paidCents);
  });
});

describe('mergeExpenses', () => {
  it('lets overlay win by id and sorts by date then id', () => {
    const overlay: Expense[] = [
      { id: 'exp-car', date: '2026-08-17', day: 1, category: 'car', description: 'SUV', amountCents: 86983, status: 'paid', paidBy: 'ben' },
      { id: 'aaa', date: '2026-08-17', day: 1, category: 'food', description: 'Breakfast', amountCents: 1000, status: 'paid', paidBy: null },
    ];
    const merged = mergeExpenses(expenses, overlay);
    expect(merged.find((e) => e.id === 'exp-car')?.paidBy).toBe('ben');
    expect(merged.filter((e) => e.id === 'exp-car')).toHaveLength(1);
    expect(merged.map((e) => `${e.date}:${e.id}`)).toEqual(
      [...merged].map((e) => `${e.date}:${e.id}`).sort(),
    );
  });
});
