import type { Stop } from '@/types/trip';

const point = (stop: Stop) => `${stop.ll.lat},${stop.ll.lng}`;

export function mapSrc(stops: Stop[]): string {
  const base = 'https://maps.google.com/maps';
  if (stops.length === 0) return `${base}?output=embed`;
  if (stops.length === 1) {
    return `${base}?q=${encodeURIComponent(point(stops[0]))}&z=12&output=embed`;
  }
  const destination = stops.slice(1).map((stop) => encodeURIComponent(point(stop))).join('+to%3A');
  return `${base}?saddr=${encodeURIComponent(point(stops[0]))}&daddr=${destination}&output=embed`;
}
