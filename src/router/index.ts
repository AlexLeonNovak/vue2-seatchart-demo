import Vue from 'vue';
import VueRouter, { type RouteConfig } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

Vue.use(VueRouter);

export const routes: RouteConfig[] = [
  { path: '/', name: 'Main', component: HomeView },
  { path: '/modal', name: 'Modal', component: () => import('@/views/ModalView.vue') },
  // { path: '/about', name: 'About', component: () => import('@/views/AboutView.vue') },
];

export const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
});
