import { defineStore } from 'pinia'
import { ref } from 'vue'
import { predictSocialMediaMentalHealth } from '@/api/RegressionLinearService'
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth'

export const useRegressionLinearStore = defineStore('RegressionLinear', () => {
  const prediction = ref<PredictionResponse | null>(null)
  const error = ref<string | null>(null)

  async function predictSocialMediaMentalHealthStore(
    avgDailyUsageHours: number,
    addictedScore: number
  ): Promise<PredictionResponse | null> {
    try {
      const response = await predictSocialMediaMentalHealth({
        avg_daily_usage_hours: avgDailyUsageHours,
        addicted_score: addictedScore,
      })

      console.log('Respuesta del servidor:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      // Manejar respuesta como ResponseHelper o objeto plano
      if ('data' in response && response.data) {
        prediction.value = response.data
      } else if (typeof response === 'object' && 'prediction_mental_health' in response) {
        prediction.value = response as PredictionResponse
      } else {
        error.value = 'Formato de respuesta del servidor no válido'
        return null
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (error) {
      error.value = error instanceof Error ? error.message : 'Error al procesar la predicción'
      return null
    }
  }

  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('predictionData')
    if (storedData) {
      prediction.value = JSON.parse(storedData)
    }
  }

  loadFromLocalStorage()

  return { prediction, error, predictSocialMediaMentalHealthStore }
})
