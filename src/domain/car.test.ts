import { describe, expect, it } from 'vitest';
import { analyzeCar } from '@/domain/car';
import { miniTrip } from '@/data/miniTrip';

describe('analyzeCar', () => {
  it('prices the Rogue rental against miles', () => {
    const a = analyzeCar(miniTrip.vehicle, 1365);
    expect(a.rentalCents).toBe(86983);
    expect(a.centsPerDay).toBe(Math.round(86983 / 7));
    expect(a.gallons).toBeCloseTo(1365 / 28, 5);
    expect(a.gasCents).toBe(Math.round((1365 / 28) * 350));
    expect(a.centsPerMileRental).toBe(Math.round(86983 / 1365));
    expect(a.centsPerMileAllIn).toBe(Math.round((86983 + a.gasCents) / 1365));
  });

  it('zeros per-mile when miles are 0', () => {
    const a = analyzeCar(miniTrip.vehicle, 0);
    expect(a.centsPerMileRental).toBe(0);
    expect(a.centsPerMileAllIn).toBe(0);
    expect(a.gallons).toBe(0);
    expect(a.gasCents).toBe(0);
  });
});
