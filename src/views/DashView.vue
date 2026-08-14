<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import BarMeter from '@/components/BarMeter.vue';
import CarCard from '@/components/CarCard.vue';
import LedgerSummary from '@/components/LedgerSummary.vue';
import PersonSplit from '@/components/PersonSplit.vue';
import { analyzeCar } from '@/domain/car';
import { summarizeLedger } from '@/domain/ledger';
import { analyzeRoute } from '@/domain/route';
import { useTrip } from '@/state/trip';
import type { ExpenseCategory, ExpenseStatus } from '@/types/trip';
import { buildExpense } from '@/views/expenseForm';

const { trip, expenses, addExpense } = useTrip();
const route = computed(() => analyzeRoute(trip.value!));
const ledger = computed(() => summarizeLedger(expenses.value, trip.value!.days));
const car = computed(() => analyzeCar(trip.value!.vehicle, route.value.drivingMiles));
const unpurchasedCount = computed(() => expenses.value.filter((expense) => expense.status === 'unpurchased').length);
const submitted = ref(false);
const form = reactive({
  date: trip.value?.days[0]?.isoDate ?? '2026-08-17',
  day: '1',
  category: 'food' as ExpenseCategory,
  description: '',
  amount: '',
  status: 'paid' as ExpenseStatus,
});
const categories = computed(() => Object.entries(ledger.value.byCategory)
  .filter(([, cents]) => cents > 0)
  .sort((a, b) => b[1] - a[1]));

function submitExpense(): void {
  addExpense(buildExpense(form, Date.now()));
  form.description = '';
  form.amount = '';
  submitted.value = true;
}
</script>

<template>
  <div v-if="trip" class="panel-anim dashboard">
    <header class="view-heading">
      <p class="day-num">Trip dashboard</p>
      <h2>The road, in numbers</h2>
      <p class="day-meta">Booked figures, working estimates, and a clean three-way split.</p>
    </header>
    <section class="dashboard-actions" aria-label="Explore trip details">
      <RouterLink to="/route" class="journey-callout route-callout">
        <span class="callout-mark" aria-hidden="true">↗</span>
        <p class="eyebrow">{{ route.drivingMiles.toLocaleString() }} planned miles</p>
        <h3>Trace the whole route</h3>
        <p>Follow the confirmed spine from Bethlehem to Acadia and back again.</p>
        <strong>Open route <span aria-hidden="true">→</span></strong>
      </RouterLink>
      <RouterLink to="/audit" class="journey-callout audit-callout">
        <span class="callout-mark" aria-hidden="true">{{ route.contradictions.length }}</span>
        <p class="eyebrow">Trip readiness</p>
        <h3>Finish the open details</h3>
        <p>{{ route.contradictions.length }} items still need a booking, reservation, or decision.</p>
        <strong>Review audit <span aria-hidden="true">→</span></strong>
      </RouterLink>
    </section>
    <LedgerSummary :summary="ledger" :unpurchased-count="unpurchasedCount" />
    <PersonSplit :shares="ledger.perPerson" />
    <section class="card category-card">
      <div class="section-heading"><p class="eyebrow">Paid mix</p><h3>Where it went</h3></div>
      <BarMeter
        v-for="[category, cents] in categories"
        :key="category"
        :label="category"
        :cents="cents"
        :max-cents="ledger.paidCents"
      />
    </section>
    <CarCard :vehicle="trip.vehicle" :analysis="car" />
    <section class="card expense-card">
      <div class="section-heading"><p class="eyebrow">Local overlay</p><h3>Add an expense</h3></div>
      <form class="expense-form" @submit.prevent="submitExpense">
        <label>Date<input v-model="form.date" type="date" required></label>
        <label>Day<select v-model="form.day"><option value="">None</option><option v-for="day in trip.days" :key="day.day" :value="String(day.day)">Day {{ day.day }}</option></select></label>
        <label>Category<select v-model="form.category"><option v-for="category in ['lodging','car','fuel','food','park','reservation','other']" :key="category" :value="category">{{ category }}</option></select></label>
        <label class="wide">Description<input v-model="form.description" type="text" required placeholder="Coffee, tolls, dinner…"></label>
        <label>Amount<input v-model="form.amount" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Status<select v-model="form.status"><option v-for="status in ['paid','quoted','estimated','unpurchased']" :key="status" :value="status">{{ status }}</option></select></label>
        <button type="submit">Save expense</button>
        <p v-if="submitted" class="saved-note" role="status">Saved on this device.</p>
      </form>
    </section>
  </div>
</template>
