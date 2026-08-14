<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { decryptString, type EncPayload } from '@/crypto/aes';
import { parseTrip } from '@/data/parseTrip';
import { useTrip } from '@/state/trip';

const password = ref('');
const error = ref('');
const busy = ref(false);
const { setTrip } = useTrip();

async function unlock(candidate = password.value): Promise<void> {
  if (!candidate || busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    const response = await fetch('./trip.enc.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('payload');
    const payload = await response.json() as EncPayload;
    const decrypted = await decryptString(payload, candidate);
    setTrip(parseTrip(JSON.parse(decrypted)));
    sessionStorage.setItem('acadia-pw', candidate);
  } catch {
    sessionStorage.removeItem('acadia-pw');
    error.value = 'Wrong password — try again.';
  } finally {
    busy.value = false;
  }
}

onMounted(() => {
  const saved = sessionStorage.getItem('acadia-pw');
  if (saved) void unlock(saved);
});
</script>

<template>
  <main class="unlock">
    <section class="unlock-card">
      <p class="unlock-kicker">Private trip log</p>
      <h1>Acadia, <em>by road</em></h1>
      <p class="unlock-dates">Aug 17–23 · 2026</p>
      <form @submit.prevent="unlock()">
        <label for="trip-password">Group password</label>
        <div class="unlock-field">
          <input id="trip-password" v-model="password" type="password" autocomplete="current-password" required autofocus>
          <button type="submit" :disabled="busy">{{ busy ? 'Opening…' : 'Open log' }}</button>
        </div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      </form>
    </section>
  </main>
</template>
