<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PRIMARY_NAV } from '@/navigation';
import { useTrip } from '@/state/trip';

const route = useRoute();
const router = useRouter();
const { trip } = useTrip();
const activeDay = computed(() => route.name === 'day' ? Number(route.params.n) : null);
const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);
let startX = 0;
let startY = 0;
let axis: 'x' | 'y' | null = null;
let swipeTracking = false;
const slideFrom = ref('14px');

watch(() => route.fullPath, () => {
  menuOpen.value = false;
});

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value;
}

function closeMenu(restoreFocus = false): void {
  menuOpen.value = false;
  if (restoreFocus) void nextTick(() => menuButton.value?.focus());
}

function touchStart(event: TouchEvent): void {
  const target = event.target;
  swipeTracking = activeDay.value !== null && !(
    target instanceof Element && target.closest('a, button, input, select, textarea, iframe')
  );
  if (!swipeTracking) return;
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  axis = null;
}

function touchMove(event: TouchEvent): void {
  if (!swipeTracking) return;
  const touch = event.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (axis === 'x') event.preventDefault();
}

function touchEnd(event: TouchEvent): void {
  if (!swipeTracking || axis !== 'x' || activeDay.value === null) return;
  swipeTracking = false;
  const dx = event.changedTouches[0].clientX - startX;
  if (Math.abs(dx) < 60) return;
  const next = activeDay.value + (dx < 0 ? 1 : -1);
  if (next < 1 || next > (trip.value?.days.length ?? 7)) return;
  slideFrom.value = dx < 0 ? '14px' : '-14px';
  void router.push(`/day/${next}`);
}
</script>

<template>
  <div class="app-shell" :class="{ 'has-day-tabs': activeDay !== null }">
    <header class="topbar" @keydown.esc.prevent="closeMenu(true)">
      <RouterLink to="/dash" class="brand"><h1>Acadia, <em>by road</em></h1></RouterLink>
      <button
        ref="menuButton"
        class="menu-toggle"
        type="button"
        aria-controls="mobile-menu"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="toggleMenu"
      >
        <span class="menu-lines" aria-hidden="true"><i /><i /><i /></span>
        <span>Menu</span>
      </button>
      <p class="dates">Aug 17–23 · 2026</p>
      <nav v-if="menuOpen" id="mobile-menu" class="mobile-menu" aria-label="Primary navigation">
        <RouterLink v-for="item in PRIMARY_NAV" :key="item.to" :to="item.to" :aria-label="item.label" @click="closeMenu()">
          <span aria-hidden="true">{{ item.mark }}</span>{{ item.label }}
        </RouterLink>
      </nav>
    </header>
    <aside class="sidebar">
      <div class="sidebar-title"><span>Private trip log</span><strong>Acadia, <em>by road</em></strong><small>Aug 17–23 · 2026</small></div>
      <nav aria-label="Itinerary days">
        <RouterLink v-for="day in trip?.days" :key="day.day" :to="`/day/${day.day}`">
          <span>0{{ day.day }}</span><div><strong>{{ day.date }}</strong><small>{{ day.title }}</small></div>
        </RouterLink>
      </nav>
      <nav class="sidebar-tools" aria-label="Trip analysis">
        <RouterLink to="/dash">Trip dashboard</RouterLink>
        <RouterLink to="/route">Route analysis</RouterLink>
        <RouterLink to="/audit">Trip audit</RouterLink>
      </nav>
    </aside>
    <main class="app-main" :style="{ '--slide-from': slideFrom }" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot />
    </main>
    <nav v-if="activeDay !== null" class="tabbar" aria-label="Day tabs">
      <div class="inner">
        <RouterLink v-for="day in trip?.days" :key="day.day" class="tab" :to="`/day/${day.day}`">
          <span class="d">{{ day.day }}</span><span class="dt">{{ day.date.slice(0, 3) }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
