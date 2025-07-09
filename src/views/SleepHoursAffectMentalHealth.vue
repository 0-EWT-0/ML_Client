<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <Header />

    <section class="container mx-auto px-6 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Gráfica simple con predicción -->
        <div class="relative rounded-2xl overflow-hidden border border-gray-800/50">
          <div class="w-full h-[500px] bg-gray-900 flex items-center justify-center">
            <Bar v-if="showGraph" :data="chartData" :options="chartOptions"
              :style="{ height: '100%', width: '100%' }" />
            <p v-else class="text-gray-400">No se generó una gráfica aún.</p>
          </div>
        </div>

        <!-- Información -->
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-extrabold text-purple-500 tracking-tight">
            ¿Cómo afectan tus horas de sueño a tu salud mental?
          </h1>
          <p class="text-base text-gray-400 leading-relaxed">
            Analizamos la correlación entre las horas de sueño promedio por noche y el nivel de salud mental percibida.
            El gráfico muestra tu resultado individual según el modelo de predicción.
          </p>

          <div>
            <p v-if="predictionResult" class="text-sm text-purple-400 font-semibold">
              {{ predictionResult }}
            </p>
            <p v-if="predictionStore.error" class="text-red-500 text-sm">{{ predictionStore.error }}</p>
          </div>

          <!-- Gauge visual -->
          <div v-if="predictionStore.prediction?.mental_health_score" class="mt-6">
            <Gauge :score="Number(predictionStore.prediction.mental_health_score)" />
          </div>

          <button @click="fetchMentalHealth"
            class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
            Generar Predicción
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePredictionStore } from '@/stores/QuestionsStore'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Gauge from '@/components/Gauge.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const predictionStore = usePredictionStore()
const predictionResult = ref<string | null>(null)
const showGraph = ref(false)

const chartData = ref({
  labels: ['Tu Resultado'],
  datasets: [
    {
      label: 'Salud Mental',
      backgroundColor: '#8B5CF6',
      data: []
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: 'Horas de Sueño vs Salud Mental (Resultado Individual)' }
  },
  scales: {
    x: {
      title: { display: true, text: 'Horas de sueño' }
    },
    y: {
      title: { display: true, text: 'Puntaje de salud mental' },
      beginAtZero: true,
      max: 100
    }
  }
}

onMounted(() => {
  const storedPrediction = localStorage.getItem('predictionData')
  if (storedPrediction) {
    const parsed = JSON.parse(storedPrediction)
    predictionStore.prediction = parsed
    updateGraph(parsed)
  }
})

watch(() => predictionStore.prediction, (newPrediction) => {
  if (newPrediction) updateGraph(newPrediction)
})

function updateGraph(prediction: any) {
  predictionResult.value = `Dormiste ${prediction.sleep_hours || 'N/A'} horas. Salud mental estimada: ${prediction.mental_health_score || 'N/A'}.`
  chartData.value.datasets[0].data = (prediction.mental_health_score)
  showGraph.value = true
}

const fetchMentalHealth = async () => {
  try {
    await predictionStore.postSleepHoursAffectMentalHealth()
    if (predictionStore.error) throw new Error(predictionStore.error)
    updateGraph(predictionStore.prediction)
  } catch (error) {
    predictionResult.value = `Error: ${error instanceof Error ? error.message : 'desconocido'}`
    showGraph.value = false
  }
}
</script>