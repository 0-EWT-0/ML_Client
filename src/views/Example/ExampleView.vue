<template></template>

<script setup lang="ts">
// import { ref, onMounted, watch } from 'vue'
// import { useRegressionLinearStore } from '@/stores/RegressionLinearStore'
// import Header from '../../components/Header.vue'
// import Footer from '../../components/Footer.vue'

// const predictionResult = ref<string | null>(null)
// const resultSection = ref<HTMLElement | null>(null)
// const imageError = ref<string | null>(null)
// const regressionStore = useRegressionLinearStore()

// const formData = ref({
//   avg_daily_usage_hours: 0,
//   addicted_score: 0,
// })

// onMounted(() => {
//   const storedProfile = localStorage.getItem('profileData')
//   const storedPredictions = localStorage.getItem('predictionsData')

//   if (storedProfile) {
//     const profile = JSON.parse(storedProfile)
//     formData.value.avg_daily_usage_hours = profile.avg_daily_usage_hours || 0
//   }

//   if (storedPredictions) {
//     const predictions = JSON.parse(storedPredictions)
//     formData.value.addicted_score = predictions.addicted_score || 0
//   }
// })

// // Actualizar predictionResult cuando prediction cambie
// watch(
//   () => regressionStore.prediction,
//   (newPrediction) => {
//     if (newPrediction) {
//       predictionResult.value = `🧠 Predicción mental: ${newPrediction.prediction_mental_health}, 🤝 Conflictos: ${newPrediction.prediction_conflicts}, Coef. Mental: ${newPrediction.coefficient_mental}, Coef. Conflictos: ${newPrediction.coefficient_conflicts}`
//       imageError.value = null
//     } else {
//       predictionResult.value = null
//     }
//   },
// )

// const predictSleep = async () => {
//   try {
//     const { avg_daily_usage_hours, addicted_score } = formData.value

//     console.log('📤 Enviando al store desde vista:', { avg_daily_usage_hours, addicted_score })

//     await regressionStore.predictSocialMediaMentalHealthStore(avg_daily_usage_hours, addicted_score)

//     if (regressionStore.error) {
//       throw new Error(regressionStore.error)
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Desconocido'
//     predictionResult.value = `Hubo un error al hacer la predicción: ${errorMessage}`
//     imageError.value = errorMessage
//     console.error('❌ Error desde vista:', error)
//   } finally {
//     scrollToResult()
//   }
// }

// const handleImageError = () => {
//   imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)'
//   console.error(
//     '❌ Error al renderizar la imagen. plot_base64:',
//     regressionStore.prediction?.plot_base64,
//   )
// }

// const scrollToResult = () => {
//   if (resultSection.value) {
//     resultSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
//   }
// }
</script>

<style></style>
