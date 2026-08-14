import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import { PRIMARY_NAV } from '@/navigation';
import { routes } from '@/router';

describe('application navigation', () => {
  it('opens the dashboard from the root route', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    await router.push('/');
    await router.isReady();
    expect(router.currentRoute.value.fullPath).toBe('/dash');
  });

  it('keeps every primary mobile destination routable', () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    expect(PRIMARY_NAV.map((item) => item.to)).toEqual(['/dash', '/day/1', '/route', '/audit']);
    for (const item of PRIMARY_NAV) {
      expect(router.resolve(item.to).matched).toHaveLength(1);
    }
  });
});
