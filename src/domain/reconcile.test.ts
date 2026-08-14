import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { miniTrip } from '@/data/miniTrip';
import { parseTrip } from '@/data/parseTrip';
import { reconcile } from '@/domain/reconcile';
import type { Trip } from '@/types/trip';

describe('reconcile', () => {
  it('reports an unbooked lodging only once per lodging id', () => {
    const lodging = { id: 'lodging-oceanside', summary: 'Atlantic Oceanside', booked: false, candidates: [] };
    const trip: Trip = {
      ...miniTrip,
      days: [
        { ...miniTrip.days[0], day: 3, lodging },
        { ...miniTrip.days[0], day: 4, lodging },
      ],
    };
    expect(reconcile(trip).filter((c) => c.kind === 'unbooked_lodging')).toEqual([
      {
        id: 'audit-unbooked_lodging-d3',
        day: 3,
        kind: 'unbooked_lodging',
        message: 'Night 3 lodging is still open.',
        recommendation: 'Compare refundable options, then book a stay when the group agrees.',
        relatedIds: ['lodging-oceanside'],
      },
    ]);
  });

  it('reports confirmed reservations and backup/or stops', () => {
    const trip: Trip = {
      ...miniTrip,
      days: [{
        ...miniTrip.days[0],
        day: 6,
        stops: [
          { id: 'cadillac', time: '5:00a', name: 'Cadillac Mountain', flag: 'reservation', warn: true, ll: { lat: 44.3526, lng: -68.2253 }, status: 'confirmed' },
          { id: 'backup', time: '', name: 'Champlain North Ridge', ll: { lat: 44.3607, lng: -68.2033 }, status: 'backup' },
        ],
      }],
    };
    const results = reconcile(trip);
    expect(results.map((c) => c.kind)).toEqual(['unconfirmed_reservation', 'or_stop']);
    expect(results[0].message).toBe('Cadillac Mountain still needs a vehicle reservation.');
    expect(results[0].recommendation).toContain('Reserve');
    expect(results[1].message).toBe('Day 6 still has backup/or stops: Champlain North Ridge.');
    expect(results[1].recommendation).toContain('fallback');
  });

  it('finds exactly the four known canonical contradictions', () => {
    const canonical = parseTrip(
      JSON.parse(readFileSync('src/data/trip.json', 'utf8')),
    );
    const kinds = reconcile(canonical).map((contradiction) => contradiction.kind).sort();
    expect(kinds).toEqual([
      'or_stop',
      'unbooked_lodging',
      'unbooked_lodging',
      'unconfirmed_reservation',
    ]);
    expect(reconcile(canonical).every((item) => item.recommendation.length > 0)).toBe(true);
    expect(reconcile(canonical).every((item) => !item.message.toLowerCase().includes('chosen'))).toBe(true);
    expect(reconcile(canonical).filter((item) => item.kind === 'unbooked_lodging').every((item) => !item.message.includes('Oceanside') && !item.message.includes('Garrison'))).toBe(true);
  });
});
