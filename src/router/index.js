import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/index/index.vue'),
    },
    {
      path: '/index',
      redirect: '/',
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
    {
      path: '/topic/detail',
      name: 'topicDetail',
      component: () => import('@/pages/topic/detail.vue'),
    },
  ],
})

export default router
