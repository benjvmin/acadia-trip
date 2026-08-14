import type {
  ConfirmationStatus,
  ExpenseCategory,
  ExpenseStatus,
  LodgingKind,
  PersonId,
  Trip,
} from '@/types/trip';

type JsonObject = Record<string, unknown>;

const PEOPLE: PersonId[] = ['ben', 'brandon', 'nick'];
const CONFIRMATION_STATUSES: ConfirmationStatus[] = ['confirmed', 'option', 'backup', 'estimate'];
const EXPENSE_STATUSES: ExpenseStatus[] = ['paid', 'quoted', 'estimated', 'unpurchased'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'lodging',
  'car',
  'fuel',
  'food',
  'park',
  'reservation',
  'other',
];
const LODGING_KINDS: LodgingKind[] = ['hotel', 'campground', 'airbnb'];

function object(value: unknown, path: string): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as JsonObject;
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  return value;
}

function string(value: unknown, path: string): string {
  if (typeof value !== 'string') throw new Error(`${path} must be a string`);
  return value;
}

function number(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${path} must be a finite number`);
  }
  return value;
}

function boolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`${path} must be a boolean`);
  return value;
}

function nullableString(value: unknown, path: string): string | null {
  return value === null ? null : string(value, path);
}

function nullableNumber(value: unknown, path: string): number | null {
  return value === null ? null : number(value, path);
}

function member<T extends string>(value: unknown, allowed: readonly T[], path: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new Error(`${path} must be one of ${allowed.join(', ')}`);
  }
  return value as T;
}

function optionalString(record: JsonObject, key: string, path: string): void {
  if (key in record) string(record[key], `${path}.${key}`);
}

function latLng(value: unknown, path: string): void {
  const record = object(value, path);
  number(record.lat, `${path}.lat`);
  number(record.lng, `${path}.lng`);
}

function stop(value: unknown, path: string): void {
  const record = object(value, path);
  string(record.id, `${path}.id`);
  string(record.time, `${path}.time`);
  string(record.name, `${path}.name`);
  optionalString(record, 'flag', path);
  if ('warn' in record) boolean(record.warn, `${path}.warn`);
  latLng(record.ll, `${path}.ll`);
  member(record.status, CONFIRMATION_STATUSES, `${path}.status`);
  optionalString(record, 'note', path);
}

function lodging(value: unknown, path: string): void {
  const record = object(value, path);
  string(record.id, `${path}.id`);
  string(record.summary, `${path}.summary`);
  boolean(record.booked, `${path}.booked`);
  array(record.candidates, `${path}.candidates`).forEach((candidate, index) => {
    const itemPath = `${path}.candidates[${index}]`;
    const item = object(candidate, itemPath);
    string(item.id, `${itemPath}.id`);
    string(item.name, `${itemPath}.name`);
    member(item.kind, LODGING_KINDS, `${itemPath}.kind`);
    member(item.status, CONFIRMATION_STATUSES, `${itemPath}.status`);
  });
}

function vehicle(value: unknown): void {
  const record = object(value, 'trip.vehicle');
  string(record.category, 'trip.vehicle.category');
  string(record.example, 'trip.vehicle.example');
  string(record.transmission, 'trip.vehicle.transmission');
  number(record.seats, 'trip.vehicle.seats');
  number(record.durationDays, 'trip.vehicle.durationDays');
  boolean(record.unlimitedMiles, 'trip.vehicle.unlimitedMiles');
  const lines = array(record.lineItems, 'trip.vehicle.lineItems');
  const sum = lines.reduce<number>((total, value, index) => {
    const path = `trip.vehicle.lineItems[${index}]`;
    const line = object(value, path);
    string(line.id, `${path}.id`);
    string(line.label, `${path}.label`);
    const amount = number(line.amountCents, `${path}.amountCents`);
    if ('perDayCents' in line) number(line.perDayCents, `${path}.perDayCents`);
    return total + amount;
  }, 0);
  const total = number(record.totalCents, 'trip.vehicle.totalCents');
  if (sum !== total) throw new Error('trip.vehicle.lineItems must sum to trip.vehicle.totalCents');
  number(record.assumedMpg, 'trip.vehicle.assumedMpg');
  number(record.assumedGasCentsPerGallon, 'trip.vehicle.assumedGasCentsPerGallon');
}

function day(value: unknown, index: number): void {
  const path = `trip.days[${index}]`;
  const record = object(value, path);
  number(record.day, `${path}.day`);
  string(record.date, `${path}.date`);
  string(record.isoDate, `${path}.isoDate`);
  string(record.title, `${path}.title`);
  string(record.meta, `${path}.meta`);
  nullableNumber(record.driveMiles, `${path}.driveMiles`);
  nullableNumber(record.driveHours, `${path}.driveHours`);
  nullableString(record.overnightCity, `${path}.overnightCity`);
  array(record.stops, `${path}.stops`).forEach((value, stopIndex) =>
    stop(value, `${path}.stops[${stopIndex}]`),
  );
  if (record.lodging !== null) lodging(record.lodging, `${path}.lodging`);
}

function expense(value: unknown, index: number): void {
  const path = `trip.expenses[${index}]`;
  const record = object(value, path);
  string(record.id, `${path}.id`);
  string(record.date, `${path}.date`);
  nullableNumber(record.day, `${path}.day`);
  member(record.category, EXPENSE_CATEGORIES, `${path}.category`);
  string(record.description, `${path}.description`);
  nullableNumber(record.amountCents, `${path}.amountCents`);
  member(record.status, EXPENSE_STATUSES, `${path}.status`);
  if (record.paidBy !== null) member(record.paidBy, PEOPLE, `${path}.paidBy`);
}

export function parseTrip(data: unknown): Trip {
  const trip = object(data, 'trip root');
  string(trip.title, 'trip.title');
  string(trip.kicker, 'trip.kicker');
  string(trip.dateRange, 'trip.dateRange');

  const people = array(trip.people, 'trip.people');
  if (people.length !== PEOPLE.length || people.some((person, index) => person !== PEOPLE[index])) {
    throw new Error('trip.people must be ben, brandon, nick in that order');
  }

  const start = object(trip.start, 'trip.start');
  string(start.name, 'trip.start.name');
  latLng(start.ll, 'trip.start.ll');
  vehicle(trip.vehicle);

  const days = array(trip.days, 'trip.days');
  if (days.length < 1 || days.length > 7) throw new Error('trip.days must contain 1 to 7 days');
  days.forEach(day);
  array(trip.expenses, 'trip.expenses').forEach(expense);

  return data as Trip;
}
