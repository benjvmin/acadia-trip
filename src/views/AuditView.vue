<script setup lang="ts">
import { computed } from 'vue';
import { analyzeRoute } from '@/domain/route';
import { useTrip } from '@/state/trip';

const { trip } = useTrip();
const contradictions = computed(() => analyzeRoute(trip.value!).contradictions);
</script>

<template>
  <div v-if="trip" class="panel-anim audit-view">
    <p class="day-num">Trip audit</p>
    <h2>Loose ends, in daylight</h2>
    <p class="day-meta">Open lodging recommendations, reservations, and backup forks.</p>
    <ol v-if="contradictions.length" class="audit-list">
      <li v-for="item in contradictions" :key="item.id">
        <RouterLink v-if="item.day" :to="`/day/${item.day}`" class="audit-day">Day {{ item.day }}</RouterLink>
        <span v-else class="audit-day">Trip</span>
        <div class="audit-copy">
          <p>{{ item.message }}</p>
          <p class="recommendation"><strong>Recommendation</strong>{{ item.recommendation }}</p>
        </div>
      </li>
    </ol>
    <p v-else class="empty-state">Nothing left to reconcile.</p>
    <nav class="view-actions" aria-label="Audit next steps">
      <RouterLink to="/route">View route <span aria-hidden="true">→</span></RouterLink>
      <RouterLink to="/day/1">Open itinerary <span aria-hidden="true">→</span></RouterLink>
    </nav>
  </div>
</template>
