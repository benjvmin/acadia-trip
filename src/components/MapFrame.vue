<script setup lang="ts">
import { computed } from 'vue';
import { mapSrc } from '@/components/mapSrc';
import type { Stop } from '@/types/trip';

const props = defineProps<{ stops: Stop[]; caption?: string }>();
const src = computed(() => mapSrc(props.stops));
</script>

<template>
  <figure class="map-frame">
    <iframe
      :src="src"
      :title="caption ?? 'Trip stops map'"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
    <figcaption class="map-caption">
      {{ caption ?? `${stops.length} mapped stop${stops.length === 1 ? '' : 's'}` }}
    </figcaption>
  </figure>
</template>
