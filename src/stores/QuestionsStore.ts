import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMental_health_by_usage_boxplot,
  getDaily_hours_addicted_age_relation,
  postSocial_media_addiction_conflicts,
  postSlepp_hours_affect_mental_health,
  postLess_sleep_more_social_media,
  postRelations_affect_academy_preformance,
  postLess_sleep_in_complicated_relationships,
  getSocial_media_impact_academics,
} from '@/api/QuestionsService'
import type { Profile } from '@/types/profile'
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth'

export const usePredictionStore = defineStore('Prediction', () => {
  const prediction = ref<PredictionResponse | null>(null)
  const error = ref<string | null>(null)

  // 1. getMental_health_by_usage_boxplot
  async function getMentalHealthByUsageBoxplot(): Promise<any | null> {
    try {
      const response = await getMental_health_by_usage_boxplot()
      console.log('Respuesta getMentalHealthByUsageBoxplot:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      // Asumimos que la respuesta puede ser un objeto plano o con data
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        prediction.value = response.data as PredictionResponse
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener el boxplot'
      return null
    }
  }

  // 2. getDaily_hours_addicted_age_relation
  async function getDailyHoursAddictedAgeRelation(): Promise<any | null> {
    try {
      const response = await getDaily_hours_addicted_age_relation()
      console.log('Respuesta getDailyHoursAddictedAgeRelation:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if (response && typeof response === 'object' && 'data' in response && response.data) {
        prediction.value = response.data as PredictionResponse
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener la relación'
      return null
    }
  }

  // 3. postSocial_media_addiction_conflicts
  async function postSocialMediaAddictionConflicts(): Promise<PredictionResponse | null> {
    try {
      const storedData = localStorage.getItem('predictionData')
      if (!storedData) {
        error.value = 'No se encontraron datos de predicción en localStorage'
        return null
      }

      const predictionData = JSON.parse(storedData) as PredictionResponse
      const addictedScore = predictionData.addicted_score || 0

      const response = await postSocial_media_addiction_conflicts({
        addicted_score: addictedScore,
        affects_academic_performance: 0,
        mental_health_score: 0,
        plot_base64: '',
        coefficient_mental: 0,
        coefficient_conflicts: 0,
        prediction_mental_health: 0,
        prediction_conflicts: 0,
        sleep_hours: 0,
        prediction: 0,
        media_hours: 0,
      })
      console.log('Respuesta postSocialMediaAddictionConflicts:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if ('data' in response && response.data) {
        prediction.value = response.data
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar conflictos'
      return null
    }
  }

  // 4. postSlepp_hours_affect_mental_health
  async function postSleepHoursAffectMentalHealth(): Promise<PredictionResponse | null> {
    try {
      const storedProfile = localStorage.getItem('profileData')
      const storedPrediction = localStorage.getItem('predictionData')

      console.log('Datos en localStorage - profileData:', storedProfile)
      console.log('Datos en localStorage - predictionData:', storedPrediction)

      if (!storedProfile || !storedPrediction) {
        error.value = 'No se encontraron datos de perfil o predicción en localStorage'
        return null
      }

      const profileData = JSON.parse(storedProfile) as Profile
      const predictionData = JSON.parse(storedPrediction) as PredictionResponse

      console.log('Datos parseados - profileData:', profileData)
      console.log('Datos parseados - predictionData:', predictionData)

      const sleepHours = profileData.sleep_hours_per_night || 0
      const mentalHealthScore = predictionData.mental_health_score || 0

      console.log('Datos a enviar:', {
        sleep_hours: sleepHours,
        mental_health_score: mentalHealthScore,
      })

      const response = await postSlepp_hours_affect_mental_health({
        sleep_hours: sleepHours,
        mental_health_score: mentalHealthScore,
        addicted_score: 0,
        affects_academic_performance: 0,
        plot_base64: '',
        coefficient_mental: 0,
        coefficient_conflicts: 0,
        prediction_mental_health: 0,
        prediction_conflicts: 0,
        prediction: 0,
        media_hours: 0,
      })
      console.log('Respuesta postSleepHoursAffectMentalHealth:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if ('data' in response && response.data) {
        prediction.value = response.data
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar horas de sueño'
      console.error('Error en postSleepHoursAffectMentalHealth:', err)
      return null
    }
  }

  // 5. postLess_sleep_more_social_media
  async function postLessSleepMoreSocialMedia(): Promise<PredictionResponse | null> {
    try {
      const storedProfile = localStorage.getItem('profileData')
      if (!storedProfile) {
        error.value = 'No se encontraron datos de perfil en localStorage'
        return null
      }

      const profileData = JSON.parse(storedProfile) as Profile
      const mediaHours = profileData.sleep_hours_per_night || 0

      const response = await postLess_sleep_more_social_media({
        media_hours: mediaHours,
        addicted_score: 0,
        affects_academic_performance: 0,
        mental_health_score: 0,
        plot_base64: '',
        coefficient_mental: 0,
        coefficient_conflicts: 0,
        prediction_mental_health: 0,
        prediction_conflicts: 0,
        prediction: 0,
        sleep_hours: 0,
      })
      console.log('Respuesta postLessSleepMoreSocialMedia:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if ('data' in response && response.data) {
        prediction.value = response.data
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar menos sueño y más redes'
      return null
    }
  }

  // Función auxiliar para determinar is_in_relationship
  function getIsInRelationship(status: string | undefined): string {
    if (!status) return 'false'
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === 'single' || lowerStatus === 'complicated') {
      return 'false'
    } else if (lowerStatus === 'in relationship') {
      return 'true'
    }
    return 'false' // Valor por defecto
  }

  // 6. postRelations_affect_academy_preformance
  async function postRelationsAffectAcademyPerformance(): Promise<PredictionResponse | null> {
    try {
      const storedProfile = localStorage.getItem('profileData')
      if (!storedProfile) {
        error.value = 'No se encontraron datos de perfil en localStorage'
        return null
      }

      const profileData = JSON.parse(storedProfile) as Profile
      const relationshipStatus = profileData.relationship_status
      const isInRelationship = getIsInRelationship(relationshipStatus)

      console.log('relationship_status desde localStorage:', relationshipStatus)
      console.log('is_in_relationship enviado al endpoint:', isInRelationship)

      const response = await postRelations_affect_academy_preformance({
        is_in_relationship: isInRelationship,
        age: 0,
        gender: '',
        academic_level: '',
        country: '',
        avg_daily_usage_hours: 0,
        most_used_platform: '',
        sleep_hours_per_night: 0,
        relationship_status: '',
        conflicts_over_social_media: 0,
        isCompletedForm: false,
      })
      console.log('Respuesta cruda del servidor:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if ('data' in response && response.data) {
        prediction.value = response.data
      } else {
        prediction.value = response as PredictionResponse
      }

      console.log('prediction.value actualizado:', prediction.value)

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar relaciones académicas'
      console.error('Error en postRelationsAffectAcademyPerformance:', err)
      return null
    }
  }

  // 7. postLess_sleep_in_complicated_relationships
  // 7. postLess_sleep_in_complicated_relationships
  async function postLessSleepInComplicatedRelationships(): Promise<PredictionResponse | null> {
    try {
      const storedProfile = localStorage.getItem('profileData')
      if (!storedProfile) {
        error.value = 'No se encontraron datos de perfil en localStorage'
        return null
      }

      const profileData = JSON.parse(storedProfile) as Profile
      const sleepHours = profileData.sleep_hours_per_night || 0

      console.log('Datos a enviar:', {
        sleep_hours: sleepHours,
      })

      const response = await postLess_sleep_in_complicated_relationships({
        sleep_hours: sleepHours,
        addicted_score: 0,
        affects_academic_performance: 0,
        mental_health_score: 0,
        plot_base64: '',
        coefficient_mental: 0,
        coefficient_conflicts: 0,
        prediction_mental_health: 0,
        prediction_conflicts: 0,
        prediction: 0,
        media_hours: 0,
      })
      console.log('Respuesta postLessSleepInComplicatedRelationships:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if ('data' in response && response.data) {
        prediction.value = response.data
      } else {
        prediction.value = response as PredictionResponse
      }

      console.log('prediction.value actualizado:', prediction.value)

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar relaciones complicadas'
      return null
    }
  }
  // 8. getSocial_media_impact_academics
  async function getSocialMediaImpactAcademics(): Promise<any | null> {
    try {
      const response = await getSocial_media_impact_academics()
      console.log('Respuesta getSocialMediaImpactAcademics:', response)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        return null
      }

      if (response && typeof response === 'object' && 'data' in response && response.data) {
        prediction.value = response.data as PredictionResponse
      } else {
        prediction.value = response as PredictionResponse
      }

      error.value = null
      localStorage.setItem('predictionData', JSON.stringify(prediction.value))
      return prediction.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener impacto académico'
      return null
    }
  }

  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('predictionData')
    if (storedData) {
      prediction.value = JSON.parse(storedData) as PredictionResponse
    }
  }

  loadFromLocalStorage()

  return {
    prediction,
    error,
    getMentalHealthByUsageBoxplot,
    getDailyHoursAddictedAgeRelation,
    postSocialMediaAddictionConflicts,
    postSleepHoursAffectMentalHealth,
    postLessSleepMoreSocialMedia,
    postRelationsAffectAcademyPerformance,
    postLessSleepInComplicatedRelationships,
    getSocialMediaImpactAcademics,
  }
})
