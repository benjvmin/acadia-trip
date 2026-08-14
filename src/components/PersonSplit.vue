<script setup lang="ts">
import { formatUsd } from '@/domain/money';
import { PERSON_NAMES } from '@/domain/split';
import type { PersonShare } from '@/types/trip';

defineProps<{ shares: PersonShare[] }>();
</script>

<template>
  <section class="card split-card" aria-labelledby="split-title">
    <div class="section-heading">
      <p class="eyebrow">Equal thirds</p>
      <h3 id="split-title">Booked share</h3>
    </div>
    <div class="person-grid">
      <div v-for="share in shares" :key="share.person" class="person-share">
        <span>{{ PERSON_NAMES[share.person] }}</span>
        <strong>{{ formatUsd(share.paidCents) }}</strong>
        <small>+ {{ formatUsd(share.estimatedCents) }} est.</small>
      </div>
    </div>
  </section>
</template>
