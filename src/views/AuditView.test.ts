import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { afterEach, describe, expect, it } from 'vitest';
import { miniTrip } from '@/data/miniTrip';
import { useTrip } from '@/state/trip';
import AuditView from '@/views/AuditView.vue';

let app: ReturnType<typeof createApp> | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
  useTrip().clearTrip();
  document.body.innerHTML = '';
});

describe('AuditView', () => {
  it('frames open lodging as a recommendation with a day action', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/audit', component: AuditView },
        { path: '/day/:n', component: { template: '<p>day</p>' } },
        { path: '/route', component: { template: '<p>route</p>' } },
      ],
    });
    await router.push('/audit');
    await router.isReady();
    useTrip().setTrip({
      ...miniTrip,
      days: [{
        ...miniTrip.days[0],
        day: 3,
        lodging: { id: 'open-stay', summary: 'A waterfront hotel', booked: false, candidates: [] },
      }],
    });
    const host = document.createElement('div');
    document.body.append(host);
    app = createApp(AuditView);
    app.use(router).mount(host);

    expect(host.textContent?.toLowerCase()).not.toContain('chosen');
    expect(host.textContent).not.toContain('A waterfront hotel');
    expect(host.querySelector('.recommendation')?.textContent).toContain('Compare refundable options');
    expect(host.querySelector<HTMLAnchorElement>('.audit-day')?.getAttribute('href')).toBe('/day/3');
  });
});
