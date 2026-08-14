<script setup lang="ts">
import { computed } from 'vue';
import { formatUsd } from '@/domain/money';

const props = defineProps<{ label: string; cents: number; maxCents: number }>();
const width = computed(() => props.maxCents === 0 ? 0 : Math.min(100, (props.cents / props.maxCents) * 100));
</script>

<template>
  <div class="meter">
    <div class="meter-copy"><span>{{ label }}</span><strong>{{ formatUsd(cents) }}</strong></div>
    <div class="meter-track"><span :style="{ width: `${width}%` }" /></div>
  </div>
</template>
