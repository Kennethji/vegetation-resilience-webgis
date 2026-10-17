import {
  createRouter,
  createWebHistory,
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/globe',
      name: 'globe',
      component: () => import('../views/GlobeView.vue'),
    },
  ],
})

export default router