import { computed, ref } from 'vue';
import { mergeExpenses } from '@/domain/ledger';
import type { Expense, Trip } from '@/types/trip';

const OVERLAY_KEY = 'acadia-expense-overlay';
const trip = ref<Trip | null>(null);
const overlay = ref<Expense[]>([]);
const expenses = computed(() => trip.value ? mergeExpenses(trip.value.expenses, overlay.value) : []);

function loadOverlay(): void {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(OVERLAY_KEY) ?? '[]');
    overlay.value = Array.isArray(parsed) ? parsed as Expense[] : [];
  } catch {
    overlay.value = [];
  }
}

function setTrip(next: Trip): void {
  trip.value = next;
  loadOverlay();
}

function clearTrip(): void {
  trip.value = null;
  overlay.value = [];
}

function addExpense(expense: Expense): void {
  overlay.value = mergeExpenses(overlay.value, [expense]);
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay.value));
}

export function useTrip() {
  return { trip, expenses, setTrip, clearTrip, addExpense, loadOverlay };
}
