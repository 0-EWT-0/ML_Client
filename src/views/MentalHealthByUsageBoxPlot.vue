<template>
  <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40 text-white">
    <h2 class="text-3xl font-semibold text-purple-400 mb-4 text-center">
      ¿Cómo influye el uso de redes en la salud mental?
    </h2>

    <p class="text-sm text-gray-300 mt-6 text-center max-w-2xl mx-auto">
      En este gráfico de tipo <span class="text-purple-300 font-semibold">boxplot</span>, cada
      bloque representa la distribución de
      <span class="text-purple-300 font-semibold">puntajes de salud mental</span> para un grupo de
      estudiantes según su nivel de uso de redes sociales.
    </p>

    <ul class="text-sm text-gray-300 mt-4 list-disc list-inside max-w-2xl mx-auto">
      <li>
        <span class="text-green-300 font-medium">Verde (parte superior):</span> mejores puntajes.
      </li>
      <li><span class="text-red-400 font-medium">Rojo (parte inferior):</span> peores puntajes.</li>
    </ul>

    <p class="text-sm text-gray-300 mt-4 text-center max-w-2xl mx-auto">
      Tu puntaje aparecerá como un punto amarillo para comparar con los demás.
    </p>

    <div
      v-if="userCategoria"
      class="mt-10 bg-gray-800/50 p-4 rounded-xl border border-purple-600/30 max-w-2xl mx-auto"
    >
      <h3 class="text-xl font-semibold text-purple-400 mb-2 text-center">
        Tu Categoría de Uso: <span class="text-white">{{ userCategoria }}</span>
      </h3>
      <p class="text-sm text-gray-300 text-center">
        {{ recomendaciones[userCategoria] }}
      </p>
    </div>

    <div class="mt-6 text-center">
      <button
        @click="fetchBoxplot"
        class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
      >
        Volver a cargar datos
      </button>
    </div>

    <apexchart type="boxPlot" height="400" :options="chartOptions" :series="combinedSeries" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePredictionStore } from '@/stores/QuestionsStore'

const storedProfile = localStorage.getItem('profileData')
const user = storedProfile ? JSON.parse(storedProfile) : null

const userMentalScore = user?.mental_health_score || null

const predictionStore = usePredictionStore()
const chartSeries = ref<any[]>([])
const userScoreSeries = ref<any[]>([])
const combinedSeries = ref<any[]>([])
const chartOptions = ref({})

const recomendaciones: Record<string, string> = {
  Bajo: 'Tu nivel de uso es bajo. ¡Sigue así! Estás cuidando bien tu salud mental y tu equilibrio digital.',
  Moderado:
    'Tu uso de redes sociales es moderado. Intenta establecer horarios y tomar descansos frecuentes para mantener el control.',
  Alto: 'Tu nivel de uso es alto. Considera reducir tu tiempo en redes sociales y buscar actividades que te aporten bienestar emocional.',
}

const userCategoria = (() => {
  if (!user || typeof user.avg_daily_usage_hours !== 'number') return null
  const hrs = user.avg_daily_usage_hours
  if (hrs < 2) return 'Bajo'
  if (hrs < 5) return 'Moderado'
  return 'Alto'
})()

function processBoxplotData(dataPoints: { Categoria_Uso: string; mental_health_score: number }[]) {
  const grouped: Record<string, number[]> = {}

  dataPoints.forEach((p) => {
    const category = p.Categoria_Uso
    if (!grouped[category]) grouped[category] = []
    grouped[category].push(p.mental_health_score)
  })

  chartSeries.value = [
    {
      name: 'Salud Mental',
      type: 'boxPlot',
      data: Object.entries(grouped).map(([categoria, scores]) => {
        const sorted = scores.sort((a, b) => a - b)
        const q1 = sorted[Math.floor(sorted.length * 0.25)]
        const q2 = sorted[Math.floor(sorted.length * 0.5)]
        const q3 = sorted[Math.floor(sorted.length * 0.75)]
        const min = sorted[0]
        const max = sorted[sorted.length - 1]

        return {
          x: categoria,
          y: [min, q1, q2, q3, max],
        }
      }),
    },
  ]

  if (userCategoria && typeof userMentalScore === 'number' && !isNaN(userMentalScore)) {
    userScoreSeries.value = [
      {
        name: 'Tu Puntaje',
        type: 'scatter',
        data: [{ x: userCategoria, y: userMentalScore }],
      },
    ]
  }

  combinedSeries.value = [...chartSeries.value, ...userScoreSeries.value]

  chartOptions.value = {
    chart: {
      type: 'boxPlot',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#6EE7B7',
          lower: '#FCA5A5',
        },
      },
    },
    markers: {
      size: 8,
      colors: ['#C084FC'],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    xaxis: {
      title: { text: 'Categoría de Uso de Redes Sociales' },
      labels: { style: { colors: '#E0E7FF' } },
    },
    yaxis: {
      title: { text: 'Puntaje de Salud Mental (0-10)' },
      min: 0,
      max: 20,
      labels: { style: { colors: '#E0E7FF' } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    },
    annotations:
      userCategoria && userMentalScore
        ? {
            points: [
              {
                x: userCategoria,
                y: userMentalScore,
                marker: {
                  size: 8,
                  fillColor: '#FACC15',
                  strokeColor: '#FDE68A',
                  radius: 2,
                },
                label: {
                  borderColor: '#FACC15',
                  offsetY: 0,
                  style: {
                    color: '#1F2937',
                    background: '#FACC15',
                  },
                  text: 'Aquí estás tú',
                },
              },
            ],
          }
        : {},
  }
}

async function fetchBoxplot() {
  const response = await predictionStore.getMentalHealthByUsageBoxplot()
  if (response?.data_points) {
    processBoxplotData(response.data_points)
  }
}

onMounted(fetchBoxplot)
</script>

<style scoped>
.apexcharts-tooltip {
  font-size: 12px;
}
</style>
