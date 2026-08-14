import { describe, expect, it } from 'vitest';
import { formatUsd } from '@/domain/money';

describe('formatUsd', () => {
  it('formats cents', () => {
    expect(formatUsd(0)).toBe('$0.00');
    expect(formatUsd(86983)).toBe('$869.83');
    expect(formatUsd(18200)).toBe('$182.00');
  });
});
