import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postProfile } from '@/api/ProfileService'
import type { Profile } from '@/types/profile'
import type { ResponseHelper } from '@/types/ResponseHelper'

export const useProfileStore = defineStore('Profile', () => {
  const profile = ref<Profile>({} as Profile)
  const predictions = ref<any>(null) // Para almacenar las predicciones
  const error = ref<string | null>(null)

  async function PostStoreProfile(profileData: Profile): Promise<ResponseHelper<Profile> | null> {
    try {
      const response = await postProfile(profileData)

      if (!response) {
        error.value = 'No se recibió respuesta del servidor'
        console.error(error.value)
        return {
          success: false,
          message: error.value,
          data: profileData,
          plot_base64: '',
        } as ResponseHelper<Profile>
      }

      // Actualizar el perfil con los datos enviados y los devueltos por el servidor
      if (typeof response === 'object' && 'usuario' in response) {
        //profile.value = { ...profileData, ...response.usuario }
        //predictions.value = response.predictions || null // Guardar predicciones si existen
        error.value = null

        // Persistir en localStorage
        localStorage.setItem('profileData', JSON.stringify(profile.value))
        if (predictions.value) {
          localStorage.setItem('predictionsData', JSON.stringify(predictions.value))
        }
        console.log('✅ Perfil y predicciones guardados en localStorage:', {
          profile: profile.value,
          predictions: predictions.value,
        })
      } else if ('success' in response && 'message' in response && 'data' in response) {
        profile.value = response.data
        predictions.value = null // No hay predicciones en este caso
        error.value = null

        localStorage.setItem('profileData', JSON.stringify(profile.value))
        console.log('✅ Perfil guardado en localStorage:', profile.value)
      } else {
        error.value = 'Respuesta del servidor inesperada'
        console.error(error.value, response)
        profile.value = profileData
        localStorage.setItem('profileData', JSON.stringify(profile.value))
        return {
          success: false,
          message: error.value,
          data: profile.value,
          plot_base64: '',
        } as ResponseHelper<Profile>
      }

      return {
        success: true,
        //message: response.message || 'Perfil creado exitosamente',
        data: profile.value,
        //plot_base64: response.graphs?.academic_plot || '',
      } as ResponseHelper<Profile>
    } catch (error) {
      error = error || 'Error al procesar el perfil'
      console.error('Error en PostStoreProfile:', error)
      profile.value = profileData
      localStorage.setItem('profileData', JSON.stringify(profile.value))
      return {
        success: false,
        // message: error.value,
        data: profile.value,
        plot_base64: '',
      } as ResponseHelper<Profile>
    }
  }

  // Cargar datos desde localStorage al inicializar
  const loadFromLocalStorage = () => {
    const storedProfile = localStorage.getItem('profileData')
    const storedPredictions = localStorage.getItem('predictionsData')
    if (storedProfile) {
      profile.value = JSON.parse(storedProfile)
      console.log('✅ Datos de perfil cargados desde localStorage:', profile.value)
    }
    if (storedPredictions) {
      predictions.value = JSON.parse(storedPredictions)
      console.log('✅ Datos de predicciones cargados desde localStorage:', predictions.value)
    }
  }

  loadFromLocalStorage()

  return { profile, predictions, error, PostStoreProfile }
})
