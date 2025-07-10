<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <Header />

    <section class="relative py-20 flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-gray-950"></div>
      <div class="container mx-auto px-6 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-purple-500">
          Impacto de las Relaciones en el Rendimiento Académico
        </h1>
        <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Descubre cómo tu situación sentimental puede influir en tu desempeño académico.
        </p>

        <div class="mt-8">
          <p v-if="predictionResult" class="text-lg text-gray-300 leading-relaxed">
            {{ predictionResult }}
          </p>
          <p v-else class="text-gray-400">Cargando predicción o sin datos disponibles...</p>
        </div>

        <div
          v-if="chartData"
          class="mt-12 w-full max-w-4xl mx-auto bg-gray-900/50 rounded-2xl border border-gray-800/50 p-6"
        >
          <Bar :data="chartData" class="h-[400px] w-full" />
        </div>
        <div v-if="imageError" class="text-red-500 mt-4 font-semibold">{{ imageError }}</div>

        <button
          @click="fetchAcademyPerformance"
          class="relative overflow-hidden mt-8 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          Recargar Predicción
          <span class="shine"></span>
        </button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { usePredictionStore } from '@/stores/QuestionsStore'
import type { Profile } from '@/types/profile'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { Label } from 'recharts'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const predictionStore = usePredictionStore()
const predictionResult = ref<string | null>(null)
const imageError = ref<string | null>(null)
const storedProfile = localStorage.getItem('profileData')
const user = storedProfile ? JSON.parse(storedProfile) : null

const chartData = computed(() => {
  const predictionsData = localStorage.getItem('predictionsData')
  if (!predictionsData) return null
  const profile = JSON.parse(predictionsData)
  const { addicted_score, affects_academic_performance, mental_health_score } = profile
  return {
    labels: ['Adicción', 'Impacto Académico', 'Salud Mental'],
    datasets: [
      {
        label: 'Valores del Usuario',
        data: [addicted_score || 0, affects_academic_performance || 0, mental_health_score || 0],
        backgroundColor: ['#a78bfa', '#fb7185', '#34d399'],
        borderRadius: 8,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#E5E7EB',
        font: { size: 14 },
      },
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#fff',
      bodyColor: '#D1D5DB',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: '#D1D5DB' },
      grid: { color: 'rgba(255,255,255,0.1)' },
      title: {
        display: true,
        text: 'Puntuación',
        color: '#E5E7EB',
        font: { size: 14, weight: 'bold' },
      },
    },
    x: {
      ticks: { color: '#D1D5DB' },
      grid: { color: 'rgba(255,255,255,0.05)' },
      title: {
        display: true,
        text: 'Métricas evaluadas',
        color: '#E5E7EB',
        font: { size: 14, weight: 'bold' },
      },
    },
  },
}

onMounted(() => {
  const storedProfile = localStorage.getItem('profileData')
  if (storedProfile) {
    const profileData = JSON.parse(storedProfile) as Profile
    if (profileData && profileData.relationship_status) {
      updatePredictionResult()
    }
  }
})

watch(
  () => predictionStore.prediction,
  () => updatePredictionResult(),
)

const updatePredictionResult = () => {
  if (predictionStore.prediction) {
    const storedProfile = localStorage.getItem('profileData')
    let relationshipStatus = ''
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile) as Profile
      relationshipStatus = profileData.relationship_status?.toLowerCase() || ''
    }

    let message = ''
    if (relationshipStatus === 'single' || relationshipStatus === 'complicated') {
      message = 'Debido a que no tienes pareja, tu relación no afecta tu rendimiento académico.'
    } else if (relationshipStatus === 'in relationship') {
      message =
        'Debido a que sí tienes una relación, haciendo una predicción con los datos de miles de personas, todo indica que sí afecta tu rendimiento académico.'
    } else {
      message = 'Estado de relación no reconocido o no disponible.'
    }

    predictionResult.value = `${message}`
    imageError.value = null
  } else {
    predictionResult.value = null
  }
}

const fetchAcademyPerformance = async () => {
  try {
    await predictionStore.postRelationsAffectAcademyPerformance()
    if (predictionStore.error) throw new Error(predictionStore.error)
    updatePredictionResult()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    predictionResult.value = `Error al obtener la predicción: ${errorMessage}`
    imageError.value = errorMessage
    console.error('Error en fetchAcademyPerformance:', error)
  }
}
</script>

<style scoped>
.shine {
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: skewX(-25deg);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -75%;
  }
  50% {
    left: 125%;
  }
  100% {
    left: 125%;
  }
}
</style>
