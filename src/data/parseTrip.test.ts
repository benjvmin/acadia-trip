import { describe, expect, it } from 'vitest';
import { parseTrip } from '@/data/parseTrip';
import { miniTrip } from '@/data/miniTrip';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('parseTrip', () => {
  it('accepts miniTrip', () => {
    const trip = parseTrip(miniTrip);
    expect(trip.people).toEqual(['ben', 'brandon', 'nick']);
    expect(trip.vehicle.totalCents).toBe(86983);
    expect(trip.vehicle.lineItems.reduce((n, l) => n + l.amountCents, 0)).toBe(86983);
  });

  it('rejects a non-object', () => {
    expect(() => parseTrip(null)).toThrow('trip root must be an object');
  });

  it('parses canonical trip.json when present', () => {
    const path = join(process.cwd(), 'src/data/trip.json');
    if (!existsSync(path)) return;
    const trip = parseTrip(JSON.parse(readFileSync(path, 'utf8')));
    expect(trip.days).toHaveLength(7);
    expect(trip.days.map((d) => d.overnightCity)).toEqual([
      'South Portland, ME',
      'Tremont, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Bar Harbor, ME',
      'Newburyport, MA',
      null,
    ]);
    expect(trip.expenses.find((e) => e.id === 'exp-merry-manor')?.amountCents).toBe(18200);
    expect(trip.expenses.find((e) => e.id === 'exp-tremont')?.amountCents).toBe(95200);
    expect(trip.expenses.find((e) => e.id === 'exp-car')?.amountCents).toBe(86983);
    const confirmed = trip.days.flatMap((d) =>
      d.stops.filter((s) => s.status === 'confirmed').map((s) => s.id),
    );
    expect(confirmed).toEqual([
      'd1-s1-bethlehem',
      'd1-s3-merry-manor',
      'd2-s1-portland-head',
      'd2-s3-tremont',
      'd2-s4-bass-harbor',
      'd3-s1-oceanside',
      'd3-s2-sand-beach',
      'd3-s3-thunder',
      'd3-s4-otter',
      'd4-s1-beehive',
      'd6-s1-cadillac',
      'd6-s2-newburyport',
      'd7-s1-newburyport',
      'd7-s2-bethlehem',
    ]);
  });
});
