import { describe, expect, it } from 'vitest';
import { analyzeRoute } from '@/domain/route';
import { miniTrip } from '@/data/miniTrip';

describe('analyzeRoute', () => {
  it('counts stop statuses and sums the route', () => {
    const trip = {
      ...miniTrip,
      days: [{
        ...miniTrip.days[0],
        driveMiles: 470,
        overnightCity: 'South Portland, ME',
        stops: [
          { id: 'start', time: '', name: 'Bethlehem', ll: { lat: 40.626, lng: -75.371 }, status: 'confirmed' as const },
          { id: 'fuel', time: '', name: 'Sturbridge', ll: { lat: 42.102, lng: -72.079 }, status: 'estimate' as const },
          { id: 'end', time: '', name: 'South Portland', ll: { lat: 43.6394, lng: -70.2736 }, status: 'confirmed' as const },
          { id: 'dinner', time: '', name: 'Dinner', ll: { lat: 43.66, lng: -70.25 }, status: 'option' as const },
          { id: 'backup', time: '', name: 'Backup', ll: { lat: 43.65, lng: -70.26 }, status: 'backup' as const },
        ],
      }],
    };
    const result = analyzeRoute(trip);
    expect(result).toMatchObject({
      confirmedStopCount: 2,
      optionStopCount: 1,
      backupStopCount: 1,
      estimateStopCount: 1,
      drivingMiles: 470,
      overnightCities: ['South Portland, ME'],
    });
    expect(result.crowFliesMiles).toBeGreaterThan(250);
    expect(result.crowFliesMiles).toBeLessThan(result.drivingMiles);
    expect(result.contradictions.some((c) => c.kind === 'impossible_mileage')).toBe(false);
  });

  it('flags a day whose confirmed chain exceeds its driving miles', () => {
    const trip = {
      ...miniTrip,
      days: [{
        ...miniTrip.days[0],
        driveMiles: 10,
        stops: [
          { id: 'start', time: '', name: 'Bethlehem', ll: { lat: 40.626, lng: -75.371 }, status: 'confirmed' as const },
          { id: 'end', time: '', name: 'South Portland', ll: { lat: 43.6394, lng: -70.2736 }, status: 'confirmed' as const },
        ],
      }],
    };
    expect(analyzeRoute(trip).contradictions).toContainEqual({
      id: 'audit-impossible_mileage-d1',
      day: 1,
      kind: 'impossible_mileage',
      message: expect.stringContaining('Day 1'),
      recommendation: expect.stringContaining('Increase'),
      relatedIds: ['start', 'end'],
    });
  });

  it('analyzes the seven-day driving plan without impossible mileage', () => {
    const miles = [470, 165, 55, 25, 40, 280, 330];
    const overnights = [
      'South Portland, ME',
      'Tremont, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Newburyport, MA',
      null,
    ];
    const trip = {
      ...miniTrip,
      days: miles.map((driveMiles, index) => ({
        ...miniTrip.days[0],
        day: index + 1,
        driveMiles,
        overnightCity: overnights[index],
        stops: [],
        lodging: null,
      })),
    };
    const result = analyzeRoute(trip);
    expect(result.drivingMiles).toBe(470 + 165 + 55 + 25 + 40 + 280 + 330);
    expect(result.overnightCities).toEqual([
      'South Portland, ME',
      'Tremont, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Newburyport, MA',
    ]);
    expect(result.crowFliesMiles).toBeLessThan(result.drivingMiles);
    expect(result.contradictions.some((c) => c.kind === 'impossible_mileage')).toBe(false);
  });
});
