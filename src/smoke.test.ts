import { describe, expect, it } from 'vitest';
import { join } from 'node:path';

describe('scaffold', () => {
  it('exposes src via the @ alias', () => {
    const main = join(process.cwd(), 'src/main.ts');
    expect(main.endsWith('/src/main.ts')).toBe(true);
  });
});
