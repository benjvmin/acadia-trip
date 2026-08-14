import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { afterEach, describe, expect, it } from 'vitest';
import { miniTrip } from '@/data/miniTrip';
import { useTrip } from '@/state/trip';
import DashView from '@/views/DashView.vue';

let app: ReturnType<typeof createApp> | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
  useTrip().clearTrip();
  document.body.innerHTML = '';
});

describe('DashView journey callouts', () => {
  it('offers prominent paths to route and audit', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/dash', component: DashView },
        { path: '/route', component: { template: '<p>route</p>' } },
        { path: '/audit', component: { template: '<p>audit</p>' } },
      ],
    });
    await router.push('/dash');
    await router.isReady();
    useTrip().setTrip(miniTrip);
    const host = document.createElement('div');
    document.body.append(host);
    app = createApp(DashView);
    app.use(router).mount(host);

    const callouts = [...host.querySelectorAll<HTMLAnchorElement>('.dashboard-actions a')];
    expect(callouts).toHaveLength(2);
    expect(callouts.map((link) => link.getAttribute('href'))).toEqual(['/route', '/audit']);
    expect(callouts.map((link) => link.querySelector('h3')?.textContent)).toEqual([
      'Trace the whole route',
      'Finish the open details',
    ]);
    expect(host.querySelector('.spine-card')).toBeNull();
  });
});
