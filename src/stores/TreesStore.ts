import { defineStore } from 'pinia'
import { fetchSocialMediaImpactAcademics, fetchStudentSleepsEnough } from '@/api/TreeService'

interface AcademicImpactData {
  horas_en_redes: number
  impacto_academico: number
}

interface SleepEnoughData {
  horas_en_redes: number
  duerme_bien: number
}

export const useTreeStore = defineStore('tree', {
  state: () => ({
    academicImpact: {
      data_points: [] as AcademicImpactData[],
      plot_base64: '',
      prediction: 0,
    },
    studentSleep: {
      data_points: [] as SleepEnoughData[],
      plot_base64: '',
      prediction: 0,
    },
  }),

  actions: {
    async loadAcademicImpact() {
      try {
        const res = await fetchSocialMediaImpactAcademics()

        // Asegurarse de acceder correctamente a los datos dentro de la propiedad `data`
        const data = res.data.data_points || []

        const cleanData = data.map((p: any) => ({
          horas_en_redes: p.horas_en_redes,
          impacto_academico: Number(p.impacto_academico),
        }))

        this.academicImpact = {
          data_points: cleanData,
          plot_base64: res.data.plot,
          prediction: res.data.prediction,
        }
      } catch (error) {
        console.error('Error cargando impacto académico:', error)
      }
    },

    async loadStudentSleep() {
      try {
        const res = await fetchStudentSleepsEnough()

        const data = res.data.data_points || []

        const cleanData = data.map((p: any) => ({
          horas_en_redes: p.horas_en_redes,
          duerme_bien: Number(p.duerme_bien),
        }))

        this.studentSleep = {
          data_points: cleanData,
          plot_base64: res.data.plot,
          prediction: res.data.prediction,
        }
      } catch (error) {
        console.error('Error cargando sueño:', error)
      }
    },
  },
})
