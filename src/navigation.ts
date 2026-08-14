export interface PrimaryNavItem {
  to: string;
  label: string;
  mark: string;
}

export const PRIMARY_NAV: readonly PrimaryNavItem[] = [
  { to: '/dash', label: 'Dashboard', mark: '⌂' },
  { to: '/day/1', label: 'Itinerary', mark: '01' },
  { to: '/route', label: 'Route', mark: '↗' },
  { to: '/audit', label: 'Audit', mark: '✓' },
] as const;
