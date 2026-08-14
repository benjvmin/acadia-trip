<script setup lang="ts">
import { formatUsd } from '@/domain/money';
import type { LedgerSummary } from '@/types/trip';

defineProps<{ summary: LedgerSummary; unpurchasedCount: number }>();
</script>

<template>
  <section class="ledger-summary" aria-label="Trip cost summary">
    <article><span>Spent</span><strong>{{ formatUsd(summary.paidCents) }}</strong><small>booked</small></article>
    <article><span>Estimated</span><strong>{{ formatUsd(summary.estimatedCents) }}</strong><small>not paid</small></article>
    <article><span>Open items</span><strong>{{ summary.unknownCount + unpurchasedCount }}</strong><small>need action</small></article>
  </section>
</template>
