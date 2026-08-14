import { createRouter, createWebHashHistory } from 'vue-router';
import AuditView from '@/views/AuditView.vue';
import DashView from '@/views/DashView.vue';
import DayView from '@/views/DayView.vue';
import RouteView from '@/views/RouteView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/dash' },
    { path: '/day/:n', name: 'day', component: DayView },
    { path: '/dash', name: 'dash', component: DashView },
    { path: '/route', name: 'route', component: RouteView },
    { path: '/audit', name: 'audit', component: AuditView },
    { path: '/:pathMatch(.*)*', redirect: '/dash' },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
