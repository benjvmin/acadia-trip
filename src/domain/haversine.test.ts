import { describe, expect, it } from 'vitest';
import { haversineMiles } from '@/domain/haversine';

describe('haversineMiles', () => {
  const bethlehem = { lat: 40.626, lng: -75.371 };

  it('estimates Bethlehem to South Portland', () => {
    const miles = haversineMiles(bethlehem, { lat: 43.6394, lng: -70.2736 });
    expect(miles).toBeGreaterThan(333);
    expect(miles).toBeLessThan(335);
  });

  it('returns zero for the same point', () => {
    expect(haversineMiles(bethlehem, bethlehem)).toBe(0);
  });
});
