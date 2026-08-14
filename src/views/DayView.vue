<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MapFrame from '@/components/MapFrame.vue';
import SleepCard from '@/components/SleepCard.vue';
import StopList from '@/components/StopList.vue';
import { useTrip } from '@/state/trip';

const route = useRoute();
const { trip } = useTrip();
const day = computed(() => {
  const number = Number.parseInt(String(route.params.n), 10);
  return trip.value?.days.find((item) => item.day === number) ?? trip.value?.days[0];
});
</script>

<template>
  <div v-if="day" class="panel-anim day-view">
    <p class="day-num">Day {{ day.day }} · {{ day.date }}</p>
    <h2>{{ day.title }}</h2>
    <p class="day-meta">{{ day.meta }}</p>
    <MapFrame :stops="day.stops" :caption="`${day.date} · all stops`" />
    <StopList :stops="day.stops" />
    <SleepCard :lodging="day.lodging" :overnight-city="day.overnightCity" />
    <p class="swipe-hint">Swipe for the next day</p>
  </div>
</template>
