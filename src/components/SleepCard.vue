<script setup lang="ts">
import type { Lodging } from '@/types/trip';

defineProps<{ lodging: Lodging | null; overnightCity: string | null }>();
</script>

<template>
  <section v-if="lodging || overnightCity" class="sleep">
    <p class="lbl">Sleep</p>
    <p>{{ lodging?.summary ?? overnightCity }}</p>
    <p v-if="lodging" class="sleep-status">{{ lodging.booked ? 'Booked' : 'Open · recommendation' }}</p>
  </section>
</template>
