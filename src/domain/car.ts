import type { CarAnalysis, Vehicle } from '@/types/trip';

export function analyzeCar(vehicle: Vehicle, drivingMiles: number): CarAnalysis {
  const rentalCents = vehicle.totalCents;
  const gallons = drivingMiles === 0 ? 0 : drivingMiles / vehicle.assumedMpg;
  const gasCents = Math.round(gallons * vehicle.assumedGasCentsPerGallon);

  return {
    rentalCents,
    centsPerDay: Math.round(rentalCents / vehicle.durationDays),
    drivingMiles,
    gallons,
    gasCents,
    centsPerMileRental:
      drivingMiles === 0 ? 0 : Math.round(rentalCents / drivingMiles),
    centsPerMileAllIn:
      drivingMiles === 0
        ? 0
        : Math.round((rentalCents + gasCents) / drivingMiles),
  };
}
