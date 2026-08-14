import { describe, expect, it } from 'vitest';
import { mapSrc } from '@/components/mapSrc';
import type { Stop } from '@/types/trip';

const stop = (name: string, lat: number, lng: number): Stop => ({
  id: name.toLowerCase().replaceAll(' ', '-'),
  time: '',
  name,
  ll: { lat, lng },
  status: 'confirmed',
});

describe('mapSrc', () => {
  it('builds a centered map for one point', () => {
    expect(mapSrc([stop('Bethlehem', 40.626, -75.371)])).toBe(
      'https://maps.google.com/maps?q=40.626%2C-75.371&z=12&output=embed',
    );
  });

  it('builds a route through each point', () => {
    const src = mapSrc([
      stop('Bethlehem', 40.626, -75.371),
      stop('Sturbridge', 42.102, -72.079),
      stop('Merry Manor', 43.6394, -70.2736),
    ]);
    expect(src).toContain('saddr=40.626%2C-75.371');
    expect(src).toContain('daddr=42.102%2C-72.079+to%3A43.6394%2C-70.2736');
    expect(src).toContain('output=embed');
  });
});
