<script setup lang="ts">
import { formatUsd } from '@/domain/money';
import type { CarAnalysis, Vehicle } from '@/types/trip';

defineProps<{ vehicle: Vehicle; analysis: CarAnalysis }>();
</script>

<template>
  <section class="card car-card" aria-labelledby="car-title">
    <div class="section-heading car-heading">
      <div>
        <p class="eyebrow">Booked wheels</p>
        <h3 id="car-title">{{ vehicle.category }}</h3>
        <p>{{ vehicle.example }} · {{ vehicle.transmission }} · {{ vehicle.seats }} seats</p>
      </div>
      <strong class="car-total">{{ formatUsd(analysis.rentalCents) }}</strong>
    </div>
    <dl class="line-items">
      <div v-for="item in vehicle.lineItems" :key="item.id">
        <dt>{{ item.label }}<small v-if="item.perDayCents">{{ formatUsd(item.perDayCents) }}/day</small></dt>
        <dd>{{ formatUsd(item.amountCents) }}</dd>
      </div>
    </dl>
    <div class="car-metrics">
      <div><span>Per day</span><strong>{{ formatUsd(analysis.centsPerDay) }}</strong></div>
      <div><span>Driving</span><strong>{{ analysis.drivingMiles.toLocaleString() }} mi</strong></div>
      <div><span>Fuel model</span><strong>{{ analysis.gallons.toFixed(1) }} gal</strong><small>{{ vehicle.assumedMpg }} mpg · {{ formatUsd(vehicle.assumedGasCentsPerGallon) }}/gal</small></div>
      <div><span>Est. gas</span><strong>{{ formatUsd(analysis.gasCents) }}</strong></div>
      <div><span>All-in / mile</span><strong>{{ formatUsd(analysis.centsPerMileAllIn) }}</strong></div>
    </div>
    <p class="car-note">Unlimited miles · DW and SLI included · no upgrade</p>
  </section>
</template>
