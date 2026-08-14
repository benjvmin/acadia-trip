<script setup lang="ts">
import { computed } from 'vue';
import MapFrame from '@/components/MapFrame.vue';
import { analyzeRoute } from '@/domain/route';
import { useTrip } from '@/state/trip';

const { trip } = useTrip();
const analysis = computed(() => analyzeRoute(trip.value!));
const confirmedStops = computed(() => trip.value!.days.flatMap((day) => day.stops.filter((stop) => stop.status === 'confirmed')));
</script>

<template>
  <div v-if="trip" class="panel-anim route-view">
    <p class="day-num">Confirmed route</p>
    <h2>The northbound spine</h2>
    <p class="day-meta route-spine">Bethlehem, PA → {{ analysis.overnightCities.join(' → ') }} → Bethlehem, PA</p>
    <MapFrame :stops="confirmedStops" caption="Confirmed stops only" />
    <section class="route-numbers">
      <article><strong>{{ analysis.drivingMiles.toLocaleString() }}</strong><span>driving miles</span></article>
      <article><strong>{{ Math.round(analysis.crowFliesMiles).toLocaleString() }}</strong><span>crow-flies miles</span></article>
      <article><strong>{{ analysis.confirmedStopCount }}</strong><span>confirmed stops</span></article>
    </section>
    <nav class="view-actions" aria-label="Route next steps">
      <RouterLink to="/audit">Review open details <span aria-hidden="true">→</span></RouterLink>
      <RouterLink to="/day/1">Open itinerary <span aria-hidden="true">→</span></RouterLink>
    </nav>
  </div>
</template>
