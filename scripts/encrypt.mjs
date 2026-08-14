// Encrypt src/data/trip.json as the payload consumed by the Vue application.
// Usage: node scripts/encrypt.mjs "<password>"
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { webcrypto as crypto } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('usage: node scripts/encrypt.mjs "<password>"');
  process.exit(1);
}

const ITERATIONS = 400000;
const sourceUrl = new URL('../src/data/trip.json', import.meta.url);
const outputDirectoryUrl = new URL('../public/', import.meta.url);
const outputUrl = new URL('trip.enc.json', outputDirectoryUrl);
const plaintext = await readFile(sourceUrl, 'utf8');
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  'PBKDF2',
  false,
  ['deriveKey'],
);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const ciphertext = new Uint8Array(
  await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  ),
);
const toBase64 = (bytes) => Buffer.from(bytes).toString('base64');
const payload = {
  salt: toBase64(salt),
  iv: toBase64(iv),
  data: toBase64(ciphertext),
  iter: ITERATIONS,
};

await mkdir(outputDirectoryUrl, { recursive: true });
await writeFile(outputUrl, `${JSON.stringify(payload)}\n`, 'utf8');
console.log(`wrote public/trip.enc.json — cipher ${ciphertext.length} bytes, ${ITERATIONS} PBKDF2 iterations`);
