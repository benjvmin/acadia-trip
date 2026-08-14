import { haversineMiles } from '@/domain/haversine';
import { reconcile } from '@/domain/reconcile';
import type { Contradiction, RouteAnalysis, Stop, Trip } from '@/types/trip';

function chainMiles(stops: Stop[]): number {
  let miles = 0;

  for (let index = 1; index < stops.length; index += 1) {
    miles += haversineMiles(stops[index - 1].ll, stops[index].ll);
  }

  return miles;
}

export function analyzeRoute(trip: Trip): RouteAnalysis {
  const allStops = trip.days.flatMap((day) => day.stops);
  const confirmedStops = allStops.filter((stop) => stop.status === 'confirmed');
  const contradictions: Contradiction[] = reconcile(trip);

  for (const day of trip.days) {
    const dayConfirmedStops = day.stops.filter((stop) => stop.status === 'confirmed');
    const confirmedMiles = chainMiles(dayConfirmedStops);

    if (day.driveMiles !== null && confirmedMiles > day.driveMiles) {
      contradictions.push({
        id: `audit-impossible_mileage-d${day.day}`,
        day: day.day,
        kind: 'impossible_mileage',
        message: `Day ${day.day} confirmed-stop chain (${Math.round(confirmedMiles)} mi) exceeds planned driving (${day.driveMiles} mi).`,
        recommendation: 'Increase the driving estimate or trim and reorder confirmed stops until the route is realistic.',
        relatedIds: dayConfirmedStops.map((stop) => stop.id),
      });
    }
  }

  return {
    confirmedStopCount: confirmedStops.length,
    optionStopCount: allStops.filter((stop) => stop.status === 'option').length,
    backupStopCount: allStops.filter((stop) => stop.status === 'backup').length,
    estimateStopCount: allStops.filter((stop) => stop.status === 'estimate').length,
    drivingMiles: trip.days.reduce((total, day) => total + (day.driveMiles ?? 0), 0),
    crowFliesMiles: chainMiles(confirmedStops),
    overnightCities: trip.days.flatMap((day) =>
      day.overnightCity === null ? [] : [day.overnightCity],
    ),
    contradictions,
  };
}
