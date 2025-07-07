import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/tree1',
      name: 'tree1',
      component: () => import('@/views/Trees/TreeOneView.vue'),
    },
    {
      path: '/student_sleeps_enough',
      name: 'student_sleeps_enough',
      component: () => import('@/views/StudentSleepEnough.vue'),
    },
    {
      path: '/less_sleep_more_social_media',
      name: 'less_sleep_more_social_media',
      component: () => import('@/views/Linear_Regresion/Less_sleep_more_social_media.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/FormView.vue'),
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/views/SuccessView.vue'),
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('@/views/Example/ExampleView.vue'),
    },
    {
      path: '/mental_health_by_usage_boxplot',
      name: 'Salud mental según nivel de uso de redes sociales',
      component: () => import('@/views/MentalHealthByUsageBoxplot.vue'),
    },
    {
      path: '/daily_hours_addicted_age_relation',
      name: '¿A qué grupo de adictos a las redes sociales perteneces según tu edad, nivel de adicción y uso diario?',
      component: () => import('@/views/DailyHoursAddictedAgeRelation.vue'),
    },
    {
      path: '/social_media_addiction_conflicts',
      name: '¿Tu nivel de adicción a las redes sociales te trae conflictos?',
      component: () => import('@/views/SocialMediaAddictionConflicts.vue'),
    },
    {
      path: '/slepp_hours_affect_mental_health',
      name: '¿Que tanto influye las horas de sueno en tu salud mental',
      component: () => import('@/views/SleepHoursAffectMentalHealth.vue'),
    },
    {
      path: '/less_sleep_more_social_medias',
      name: '¿Tu uso de redes sociales afecta tus horas de sueño?',
      component: () => import('@/views/LessSleepMoreSocialMedia.vue'),
    },
    {
      path: '/social_media_mental_health',
      name: '¿Las redes sociales te aíslan?',
      component: () => import('@/views/SocialMediaMentalHealth.vue'),
    },
    {
      path: '/relations_affect_academy_preformance',
      name: '¿Estar en una relacion afecta el rendimiento academico?',
      component: () => import('@/views/RelationsAffectAcademyPerformance.vue'),
    },
    {
      path: '/less_sleep_in_complicated_relationships',
      name: '¿Estar en un estado de relacion complicado pasas menos horas de sueño?',
      component: () => import('@/views/LessSleepInComplicatedRelationships.vue'),
    },
    {
      path: '/social_media_impact_academics',
      name: '¿Tu uso en redes sociales afecta tu rendimiento académico?',
      component: () => import('@/views/SocialMediaImpactAcademics.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'Not found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
