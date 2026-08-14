import type { Contradiction, Trip } from '@/types/trip';

export function reconcile(trip: Trip): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const reportedLodging = new Set<string>();

  for (const day of trip.days) {
    const lodging = day.lodging;
    if (lodging && !lodging.booked && !reportedLodging.has(lodging.id)) {
      reportedLodging.add(lodging.id);
      contradictions.push({
        id: `audit-unbooked_lodging-d${day.day}`,
        day: day.day,
        kind: 'unbooked_lodging',
        message: `Night ${day.day} lodging is still open.`,
        recommendation: 'Compare refundable options, then book a stay when the group agrees.',
        relatedIds: [lodging.id],
      });
    }

    for (const stop of day.stops) {
      if (
        stop.warn === true &&
        stop.flag === 'reservation' &&
        stop.status === 'confirmed'
      ) {
        contradictions.push({
          id: `audit-unconfirmed_reservation-${stop.id}`,
          day: day.day,
          kind: 'unconfirmed_reservation',
          message: `${stop.name} still needs a vehicle reservation.`,
          recommendation: 'Reserve the timed vehicle entry as soon as it is available; otherwise choose a sunrise plan that does not require this reservation.',
          relatedIds: [stop.id],
        });
      }
    }

    const backups = day.stops.filter((stop) => stop.status === 'backup');
    if (backups.length > 0) {
      contradictions.push({
        id: `audit-or_stop-d${day.day}`,
        day: day.day,
        kind: 'or_stop',
        message: `Day ${day.day} still has backup/or stops: ${backups
          .map((stop) => stop.name)
          .join(', ')}.`,
        recommendation: `Keep ${backups.map((stop) => stop.name).join(', ')} as a fallback only, then make the final call from weather and trail conditions.`,
        relatedIds: backups.map((stop) => stop.id),
      });
    }
  }

  return contradictions;
}
