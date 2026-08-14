import { beforeEach, describe, expect, it } from 'vitest';
import { miniTrip } from '@/data/miniTrip';
import { useTrip } from '@/state/trip';
import type { Expense } from '@/types/trip';

describe('useTrip', () => {
  beforeEach(() => {
    localStorage.clear();
    useTrip().clearTrip();
  });

  it('persists added expenses in the overlay', () => {
    const state = useTrip();
    state.setTrip(miniTrip);
    const expense: Expense = {
      id: 'exp-local-1',
      date: '2026-08-17',
      day: 1,
      category: 'food',
      description: 'Coffee',
      amountCents: 450,
      status: 'paid',
      paidBy: null,
    };

    state.addExpense(expense);

    expect(state.expenses.value.find((item) => item.id === expense.id)).toEqual(expense);
    expect(JSON.parse(localStorage.getItem('acadia-expense-overlay') ?? '[]')).toContainEqual(expense);
  });
});
