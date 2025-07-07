// src/stores/useRegressionLinearStore.ts
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
    console.log('➡️ Datos enviados al backend:', {
      avg_daily_usage_hours: avgDailyUsageHours,
      addicted_score: addictedScore,
    })

    const profileData = { avg_daily_usage_hours: avgDailyUsageHours }
    const predictionData = { addicted_score: addictedScore, affects_academic_performance: 0, mental_health_score: 0, plot_base64: '', coefficient_mental: 0, coefficient_conflicts: 0, prediction_mental_health: 0, prediction_conflicts: 0 } as PredictionResponse

    const response = await predictSocialMediaMentalHealth(profileData, predictionData)

    if (response && typeof response === 'object') {
      console.log('⬅️ Respuesta del servidor completa:', JSON.stringify(response, null, 2))
      const plotBase64 = response.plot_base64?.trim();
      if (plotBase64 && plotBase64.length > 0) {
        prediction.value = { ...response };
        error.value = null;
        console.log('✅ Predicción recibida - plot_base64:', plotBase64.substring(0, 50) + '...');
        localStorage.setItem('predictionData', JSON.stringify(prediction.value));
        console.log('✅ Datos guardados en localStorage bajo clave "predictionData"');
      } else {
        error.value = 'plot_base64 está vacío o no válido';
        console.error('❌ plot_base64 problemático:', plotBase64);
      }
    } else {
      error.value = 'Respuesta del servidor no válida o nula';
      console.error('❌ Error en predictionStore:', error.value, response);
    }

    return response;
  }

  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('predictionData');
    if (storedData) {
      prediction.value = JSON.parse(storedData);
      console.log('✅ Datos cargados desde localStorage:', prediction.value);
    } else {
      console.log('⚠️ No se encontraron datos en localStorage');
    }
  }

  loadFromLocalStorage();

  return {
    prediction,
    error,
    predictSocialMediaMentalHealthStore,
  };
});
