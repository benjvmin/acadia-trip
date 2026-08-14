import { describe, expect, it } from 'vitest';
import { splitThreeWays } from '@/domain/split';

describe('splitThreeWays', () => {
  it('gives leftover cents to ben', () => {
    expect(splitThreeWays(86983)).toEqual({ ben: 28995, brandon: 28994, nick: 28994 });
    expect(splitThreeWays(18200)).toEqual({ ben: 6068, brandon: 6066, nick: 6066 });
    expect(splitThreeWays(95200)).toEqual({ ben: 31734, brandon: 31733, nick: 31733 });
    expect(splitThreeWays(0)).toEqual({ ben: 0, brandon: 0, nick: 0 });
  });
});
