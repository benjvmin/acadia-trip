import type { Expense, ExpenseCategory, ExpenseStatus } from '@/types/trip';

export interface ExpenseFormInput {
  date: string;
  day: string;
  category: ExpenseCategory;
  description: string;
  amount: string;
  status: ExpenseStatus;
}

export function buildExpense(input: ExpenseFormInput, now: number): Expense {
  const description = input.description.trim();
  if (!description) throw new Error('description');
  const dollars = input.amount.trim();
  const day = input.day.trim();
  return {
    id: `exp-local-${now}`,
    date: input.date,
    day: day === '' ? null : Number.parseInt(day, 10),
    category: input.category,
    description,
    amountCents: dollars === '' ? null : Math.round(Number.parseFloat(dollars) * 100),
    status: input.status,
    paidBy: null,
  };
}
