<script setup lang="ts">
import type { Stop } from '@/types/trip';

defineProps<{ stops: Stop[] }>();
</script>

<template>
  <ol class="stops">
    <li v-for="stop in stops" :key="stop.id" class="stop" :class="{ warn: stop.warn }">
      <time class="t">{{ stop.time || 'flex' }}</time>
      <div>
        <span class="n">{{ stop.name }}</span>
        <span v-if="stop.flag || stop.status !== 'confirmed'" class="flag">
          {{ stop.flag || stop.status }}
        </span>
        <p v-if="stop.note" class="stop-note">{{ stop.note }}</p>
      </div>
    </li>
  </ol>
</template>
