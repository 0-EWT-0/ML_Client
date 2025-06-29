import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'form',
      component: () => import('@/views/Form.vue'),
    },
    {
      path: '/tree1',
      name: 'tree1',
      component: () => import('@/views/Tress/Tree1View.vue'),
    },
    {
      path: '/less_sleep_more_social_media',
      name: 'less_sleep_more_social_media',
      component: () => import('@/views/Linear_Regresion/Less_sleep_more_social_media.vue'),
    },

    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/views/SuccessView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'Not found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
