<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Header (Assuming you have a Header component) -->
    <Header />

    <!-- Main Section -->
    <section class="relative py-20 flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-gray-950"></div>
      <div class="container mx-auto px-6 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-purple-500">
          Impacto de las Relaciones en el Rendimiento Académico
        </h1>
        <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Descubre cómo tu situación sentimental puede influir en tu desempeño académico.
        </p>

        <!-- Resultado en texto -->
        <div class="mt-8">
          <p v-if="predictionResult" class="text-lg text-gray-300 leading-relaxed">
            {{ predictionResult ? 'SI' : 'NO' }}
            <span v-if="predictionStore.error" class="text-red-500 font-semibold">{{
              predictionStore.error
            }}</span>
          </p>
          <p v-else class="text-gray-400">Cargando predicción o sin datos disponibles...</p>
        </div>

        <!-- Gráfica -->
        <div
          v-if="chartData"
          class="mt-12 max-w-lg mx-auto bg-gray-900/50 rounded-2xl border border-gray-800/50 p-6"
        >
          <Bar :data="chartData" class="w-full h-80" />
        </div>
        <div v-if="imageError" class="text-red-500 mt-4 font-semibold">{{ imageError }}</div>

        <!-- Botón para generar predicción -->
        <button
          @click="fetchAcademyPerformance"
          class="relative overflow-hidden mt-8 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          Recargar Predicción
          <span class="shine"></span>
        </button>
      </div>
    </section>

    <!-- Footer (Assuming you have a Footer component) -->
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
import Header from '@/components/Header.vue' // Adjust path as needed
import Footer from '@/components/Footer.vue' // Adjust path as needed

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const predictionStore = usePredictionStore()
const predictionResult = ref<string | null>(null)
const imageError = ref<string | null>(null)

// Chart data and options
const chartData = computed(() => {
  const predictionsData = localStorage.getItem('predictionsData')
  if (!predictionsData) return null
  const profile = JSON.parse(predictionsData)
  const { addicted_score, affects_academic_performance, mental_health_score } = profile
  return {
    labels: ['Addicted Score', 'Affects Academic', 'Mental Health Score'],
    datasets: [
      {
        label: 'Scores',
        data: [addicted_score || 0, affects_academic_performance || 0, mental_health_score || 0],
        backgroundColor: [
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(168, 85, 247, 0.6)',
        ],
        borderColor: ['rgba(139, 92, 246, 1)', 'rgba(236, 72, 153, 1)', 'rgba(168, 85, 247, 1)'],
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Puntuación',
        color: '#D1D5DB',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      ticks: {
        color: '#D1D5DB',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Métricas',
        color: '#D1D5DB',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      ticks: {
        color: '#D1D5DB',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#D1D5DB',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#FFFFFF',
      bodyColor: '#D1D5DB',
    },
  },
}

onMounted(() => {
  const storedProfile = localStorage.getItem('profileData')
  console.log('Datos en localStorage - profileData:', storedProfile)
  if (storedProfile) {
    const profileData = JSON.parse(storedProfile) as Profile
    console.log('Parseado profileData:', profileData)
    console.log('relationship_status:', profileData.relationship_status)
    if (profileData && profileData.relationship_status) {
      updatePredictionResult()
    }
  }
})

watch(
  () => predictionStore.prediction,
  (newPrediction) => {
    console.log('predictionStore.prediction actualizado:', newPrediction)
    updatePredictionResult()
  },
)

const updatePredictionResult = () => {
  console.log(
    'Entrando en updatePredictionResult, predictionStore.prediction:',
    predictionStore.prediction,
  )
  if (predictionStore.prediction) {
    const storedProfile = localStorage.getItem('profileData')
    let relationshipStatus = ''
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile) as Profile
      console.log('profileData en updatePredictionResult:', profileData)
      console.log('relationship_status en updatePredictionResult:', profileData.relationship_status)
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

    predictionResult.value = `${message} (Is in Relationship: ${predictionStore.prediction.prediction || 'N/A'})`
    imageError.value = null
  } else {
    predictionResult.value = null
  }
}

const fetchAcademyPerformance = async () => {
  try {
    console.log('Iniciando fetchAcademyPerformance')
    await predictionStore.postRelationsAffectAcademyPerformance()
    console.log(
      'Después de llamar al store, predictionStore.prediction:',
      predictionStore.prediction,
    )
    if (predictionStore.error) {
      throw new Error(predictionStore.error)
    }
    updatePredictionResult()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    predictionResult.value = `Error al obtener la predicción: ${errorMessage}`
    imageError.value = errorMessage
    console.error('Error en fetchAcademyPerformance:', error)
  }
}

const handleImageError = () => {
  imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)'
  console.error(
    'Error al renderizar la imagen. plot_base64:',
    predictionStore.prediction?.plot_base64,
  )
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
