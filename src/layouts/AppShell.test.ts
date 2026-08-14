import { createApp, h, nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { afterEach, describe, expect, it } from 'vitest';
import AppShell from '@/layouts/AppShell.vue';
import { miniTrip } from '@/data/miniTrip';
import { PRIMARY_NAV } from '@/navigation';
import { useTrip } from '@/state/trip';

const mounted: Array<ReturnType<typeof createApp>> = [];

afterEach(() => {
  mounted.splice(0).forEach((app) => app.unmount());
  useTrip().clearTrip();
  document.body.innerHTML = '';
});

describe('AppShell mobile navigation', () => {
  it('opens from the hamburger, navigates, and closes on activation', async () => {
    const routes = PRIMARY_NAV.map((item) => ({ path: item.to, component: { render: () => h('p') } }));
    const router = createRouter({ history: createMemoryHistory(), routes });
    await router.push('/dash');
    await router.isReady();
    useTrip().setTrip(miniTrip);

    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({ render: () => h(AppShell, null, { default: () => h('p', 'content') }) });
    mounted.push(app);
    app.use(router).mount(host);

    const trigger = host.querySelector<HTMLButtonElement>('.menu-toggle')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(host.querySelector('.mobile-menu')).toBeNull();
    trigger.click();
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const links = [...host.querySelectorAll<HTMLAnchorElement>('.mobile-menu a')];
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(PRIMARY_NAV.map((item) => item.label));
    links[2].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    expect(router.currentRoute.value.fullPath).toBe('/route');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(host.querySelector('.mobile-menu')).toBeNull();
  });

  it('closes on Escape and returns focus to the hamburger', async () => {
    const routes = PRIMARY_NAV.map((item) => ({ path: item.to, component: { render: () => h('p') } }));
    const router = createRouter({ history: createMemoryHistory(), routes });
    await router.push('/dash');
    await router.isReady();
    useTrip().setTrip(miniTrip);
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({ render: () => h(AppShell, null, { default: () => h('p', 'content') }) });
    mounted.push(app);
    app.use(router).mount(host);

    const trigger = host.querySelector<HTMLButtonElement>('.menu-toggle')!;
    trigger.click();
    await nextTick();
    const menu = host.querySelector<HTMLElement>('.mobile-menu')!;
    menu.focus();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await nextTick();
    expect(host.querySelector('.mobile-menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('shows day tabs only while an itinerary day is active', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/dash', component: { render: () => h('p') } },
        { path: '/day/:n', name: 'day', component: { render: () => h('p') } },
        { path: '/route', component: { render: () => h('p') } },
        { path: '/audit', component: { render: () => h('p') } },
      ],
    });
    useTrip().setTrip(miniTrip);
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({ render: () => h(AppShell, null, { default: () => h('p', 'content') }) });
    mounted.push(app);
    await router.push('/dash');
    await router.isReady();
    app.use(router).mount(host);
    await nextTick();
    expect(host.querySelector('nav.tabbar')).toBeNull();
    await router.push('/day/1');
    await nextTick();
    expect(host.querySelectorAll('nav.tabbar a')).toHaveLength(1);
    expect(host.querySelector('nav.tabbar a')?.getAttribute('aria-current')).toBe('page');
  });
});
