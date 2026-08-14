import { PEOPLE, splitThreeWays } from '@/domain/split';
import type {
  Day,
  Expense,
  ExpenseCategory,
  ExpenseStatus,
  LedgerSummary,
} from '@/types/trip';

const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'lodging',
  'car',
  'fuel',
  'food',
  'park',
  'reservation',
  'other',
];

export function emptyCategoryTotals(): Record<ExpenseCategory, number> {
  return Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, 0])) as Record<
    ExpenseCategory,
    number
  >;
}

function totalForStatus(expenses: Expense[], status: ExpenseStatus): number {
  return expenses.reduce(
    (total, expense) =>
      expense.status === status && expense.amountCents !== null
        ? total + expense.amountCents
        : total,
    0,
  );
}

export function summarizeLedger(expenses: Expense[], days: Day[]): LedgerSummary {
  const paidCents = totalForStatus(expenses, 'paid');
  const estimatedCents = totalForStatus(expenses, 'estimated');
  const quotedCents = totalForStatus(expenses, 'quoted');
  const byCategory = emptyCategoryTotals();

  for (const expense of expenses) {
    if (expense.status === 'paid' && expense.amountCents !== null) {
      byCategory[expense.category] += expense.amountCents;
    }
  }

  let cumulativePaidCents = 0;
  const runningByDay = days.map((day) => {
    cumulativePaidCents += expenses.reduce(
      (total, expense) =>
        expense.day === day.day && expense.status === 'paid' && expense.amountCents !== null
          ? total + expense.amountCents
          : total,
      0,
    );

    return { day: day.day, cumulativePaidCents };
  });

  const paidSplit = splitThreeWays(paidCents);
  const estimatedSplit = splitThreeWays(estimatedCents);

  return {
    paidCents,
    estimatedCents,
    quotedCents,
    unknownCount: expenses.filter((expense) => expense.amountCents === null).length,
    byCategory,
    runningByDay,
    perPerson: PEOPLE.map((person) => ({
      person,
      paidCents: paidSplit[person],
      estimatedCents: estimatedSplit[person],
    })),
  };
}

export function mergeExpenses(base: Expense[], overlay: Expense[]): Expense[] {
  const merged = new Map(base.map((expense) => [expense.id, expense]));

  for (const expense of overlay) {
    merged.set(expense.id, expense);
  }

  return [...merged.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
}
