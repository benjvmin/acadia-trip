import type { Trip } from '@/types/trip';

export const miniTrip: Trip = {
  title: 'Acadia, by road',
  kicker: 'Private trip log',
  dateRange: 'Aug 17–23 · 2026',
  people: ['ben', 'brandon', 'nick'],
  start: {
    name: 'Bethlehem, PA',
    ll: { lat: 40.626, lng: -75.371 },
  },
  vehicle: {
    category: 'Midsize SUV',
    example: 'Nissan Rogue or similar',
    transmission: 'automatic',
    seats: 5,
    durationDays: 7,
    unlimitedMiles: true,
    lineItems: [
      { id: 'time-distance', label: 'Time & Distance', amountCents: 51354 },
      { id: 'damage-waiver', label: 'Damage Waiver', amountCents: 16093, perDayCents: 2299 },
      {
        id: 'sli',
        label: 'Supplemental Liability Protection',
        amountCents: 12740,
        perDayCents: 1820,
      },
      { id: 'taxes-fees', label: 'Taxes and Fees', amountCents: 6796 },
    ],
    totalCents: 86983,
    assumedMpg: 28,
    assumedGasCentsPerGallon: 350,
  },
  days: [
    {
      day: 1,
      date: 'Mon 17 Aug',
      isoDate: '2026-08-17',
      title: 'The long haul north',
      meta: 'Bethlehem to South Portland',
      driveMiles: 470,
      driveHours: 8,
      overnightCity: 'South Portland, ME',
      stops: [
        {
          id: 'd1-s1-bethlehem',
          time: '6:30a',
          name: 'Bethlehem, PA',
          ll: { lat: 40.626, lng: -75.371 },
          status: 'confirmed',
        },
      ],
      lodging: {
        id: 'lodging-merry-manor',
        summary: 'Best Western Merry Manor Inn, South Portland',
        booked: true,
        candidates: [
          {
            id: 'merry-manor',
            name: 'Best Western Merry Manor Inn',
            kind: 'hotel',
            status: 'confirmed',
          },
        ],
      },
    },
  ],
  expenses: [
    {
      id: 'exp-merry-manor',
      date: '2026-08-17',
      day: 1,
      category: 'lodging',
      description: 'Best Western Merry Manor Inn, South Portland',
      amountCents: 18200,
      status: 'paid',
      paidBy: null,
    },
  ],
};
