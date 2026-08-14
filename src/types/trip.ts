export type PersonId = 'ben' | 'brandon' | 'nick';
export type ConfirmationStatus = 'confirmed' | 'option' | 'backup' | 'estimate';
export type ExpenseStatus = 'paid' | 'quoted' | 'estimated' | 'unpurchased';
export type ExpenseCategory =
  | 'lodging'
  | 'car'
  | 'fuel'
  | 'food'
  | 'park'
  | 'reservation'
  | 'other';
export type LodgingKind = 'hotel' | 'campground' | 'airbnb';
export type ContradictionKind =
  | 'unbooked_lodging'
  | 'unconfirmed_reservation'
  | 'or_stop'
  | 'impossible_mileage';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Stop {
  id: string;
  time: string;
  name: string;
  flag?: string;
  warn?: boolean;
  ll: LatLng;
  status: ConfirmationStatus;
  note?: string;
}

export interface LodgingCandidate {
  id: string;
  name: string;
  kind: LodgingKind;
  status: ConfirmationStatus;
}

export interface Lodging {
  id: string;
  summary: string;
  booked: boolean;
  candidates: LodgingCandidate[];
}

export interface Expense {
  id: string;
  date: string;
  day: number | null;
  category: ExpenseCategory;
  description: string;
  amountCents: number | null;
  status: ExpenseStatus;
  paidBy: PersonId | null;
}

export interface VehicleLine {
  id: string;
  label: string;
  amountCents: number;
  perDayCents?: number;
}

export interface Vehicle {
  category: string;
  example: string;
  transmission: string;
  seats: number;
  durationDays: number;
  unlimitedMiles: boolean;
  lineItems: VehicleLine[];
  totalCents: number;
  assumedMpg: number;
  assumedGasCentsPerGallon: number;
}

export interface Day {
  day: number;
  date: string;
  isoDate: string;
  title: string;
  meta: string;
  driveMiles: number | null;
  driveHours: number | null;
  overnightCity: string | null;
  stops: Stop[];
  lodging: Lodging | null;
}

export interface Trip {
  title: string;
  kicker: string;
  dateRange: string;
  people: PersonId[];
  start: { name: string; ll: LatLng };
  vehicle: Vehicle;
  days: Day[];
  expenses: Expense[];
}

export interface Contradiction {
  id: string;
  day: number | null;
  kind: ContradictionKind;
  message: string;
  recommendation: string;
  relatedIds: string[];
}

export interface PersonShare {
  person: PersonId;
  paidCents: number;
  estimatedCents: number;
}

export interface LedgerSummary {
  paidCents: number;
  estimatedCents: number;
  quotedCents: number;
  unknownCount: number;
  byCategory: Record<ExpenseCategory, number>;
  runningByDay: Array<{ day: number; cumulativePaidCents: number }>;
  perPerson: PersonShare[];
}

export interface CarAnalysis {
  rentalCents: number;
  centsPerDay: number;
  drivingMiles: number;
  gallons: number;
  gasCents: number;
  centsPerMileRental: number;
  centsPerMileAllIn: number;
}

export interface RouteAnalysis {
  confirmedStopCount: number;
  optionStopCount: number;
  backupStopCount: number;
  estimateStopCount: number;
  drivingMiles: number;
  crowFliesMiles: number;
  overnightCities: string[];
  contradictions: Contradiction[];
}
