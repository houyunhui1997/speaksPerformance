import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/index/AppLandingPlaceholder.vue'),
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/pages/index/index.vue'),
    },
    {
      path: '/footprint',
      name: 'footprint',
      component: () => import('@/pages/footprint/index.vue'),
    },
    {
      path: '/hotspot',
      name: 'hotspot',
      component: () => import('@/pages/hotspot/index.vue'),
    },
    {
      path: '/public-opinion',
      name: 'publicOpinion',
      component: () => import('@/pages/publicOpinion/index.vue'),
    },
    {
      path: '/topic',
      name: 'topic',
      component: () => import('@/pages/topic/index.vue'),
    },
  ],
})

export default router
