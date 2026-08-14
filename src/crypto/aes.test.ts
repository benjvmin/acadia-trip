import { describe, expect, it } from 'vitest';
import { miniTrip } from '@/data/miniTrip';
import { decryptString, encryptString, ITERATIONS } from '@/crypto/aes';

describe('AES-GCM trip encryption', () => {
  it('round-trips text with the required parameters', async () => {
    const plaintext = JSON.stringify(miniTrip);
    const payload = await encryptString(plaintext, 'group-pw');
    expect(payload.iter).toBe(400000);
    expect(ITERATIONS).toBe(400000);
    expect(Uint8Array.from(atob(payload.salt), (c) => c.charCodeAt(0))).toHaveLength(16);
    expect(Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0))).toHaveLength(12);
    expect(await decryptString(payload, 'group-pw')).toBe(plaintext);
  });

  it('rejects a wrong password', async () => {
    const payload = await encryptString('private trip', 'group-pw');
    await expect(decryptString(payload, 'wrong-pw')).rejects.toThrow();
  });
});
