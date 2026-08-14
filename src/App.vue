<script setup lang="ts">
import AppShell from '@/layouts/AppShell.vue';
import UnlockView from '@/views/UnlockView.vue';
import { useTrip } from '@/state/trip';

const { trip } = useTrip();
</script>

<template>
  <UnlockView v-if="!trip" />
  <AppShell v-else>
    <RouterView />
  </AppShell>
</template>
