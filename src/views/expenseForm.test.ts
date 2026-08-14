import { describe, expect, it } from 'vitest';
import { buildExpense } from '@/views/expenseForm';

describe('buildExpense', () => {
  it('normalizes a local expense', () => {
    expect(buildExpense({
      date: '2026-08-17',
      day: '1',
      category: 'food',
      description: '  Coffee  ',
      amount: '4.50',
      status: 'paid',
    }, 1_700_000_000_000)).toEqual({
      id: 'exp-local-1700000000000',
      date: '2026-08-17',
      day: 1,
      category: 'food',
      description: 'Coffee',
      amountCents: 450,
      status: 'paid',
      paidBy: null,
    });
  });

  it('uses null for blank amount and day, and rejects blank descriptions', () => {
    const input = {
      date: '2026-08-17',
      day: '',
      category: 'other' as const,
      description: 'Note',
      amount: '',
      status: 'estimated' as const,
    };
    expect(buildExpense(input, 1).amountCents).toBeNull();
    expect(buildExpense(input, 1).day).toBeNull();
    expect(() => buildExpense({ ...input, description: '  ' }, 1)).toThrow('description');
  });
});
