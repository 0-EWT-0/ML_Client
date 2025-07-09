<template>
  <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40 text-white">
    <h2 class="text-3xl font-semibold text-purple-400 mb-4 text-center">
      ¿Cómo influye el uso de redes en la salud mental?
    </h2>

    <p class="text-sm text-gray-300 mt-6 text-center max-w-2xl mx-auto">
      En este gráfico de tipo <span class="text-purple-300 font-semibold">boxplot</span>, cada
      bloque representa la distribución de
      <span class="text-purple-300 font-semibold">puntajes de salud mental</span> para un grupo de
      estudiantes según su nivel de uso de redes sociales:
    </p>

    <ul class="text-sm text-gray-300 mt-4 list-disc list-inside max-w-2xl mx-auto">
      <li>
        <span class="text-green-300 font-medium">Verde (parte superior):</span> representa los
        valores más altos de salud mental.
      </li>
      <li>
        <span class="text-red-400 font-medium">Rojo (parte inferior):</span> muestra los valores más
        bajos.
      </li>
    </ul>

    <p class="text-sm text-gray-300 mt-4 text-center max-w-2xl mx-auto">
      Tu propio puntaje aparecerá como un punto púrpura destacado para que compares tu resultado con
      el de otros estudiantes.
    </p>

    <apexchart type="boxPlot" height="400" :options="chartOptions" :series="combinedSeries" />

    <div class="mt-6 text-center">
      <button @click="fetchBoxplot" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white">
        Volver a cargar datos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePredictionStore } from '@/stores/QuestionsStore'

const predictionStore = usePredictionStore()
const chartSeries = ref<any[]>([])
const userScoreSeries = ref<any[]>([])
const combinedSeries = ref<any[]>([])
const chartOptions = ref({})

function processBoxplotData(dataPoints: { Categoria_Uso: string; mental_health_score: number }[]) {
  const grouped: Record<string, number[]> = {}

  // Agrupar por categoría
  dataPoints.forEach((p) => {
    const category = p.Categoria_Uso
    if (!grouped[category]) grouped[category] = []
    grouped[category].push(p.mental_health_score)
  })

  // Serie de boxplot
  chartSeries.value = [
    {
      name: 'Salud Mental',
      type: 'boxPlot',
      data: Object.entries(grouped).map(([categoria, scores]) => {
        const sorted = scores.sort((a, b) => a - b)
        const q1 = sorted[Math.floor(sorted.length * 0.25)]
        const q2 = sorted[Math.floor(sorted.length * 0.5)] // mediana
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

  const userData = localStorage.getItem('profileData')
  if (userData) {
    try {
      const parsed = JSON.parse(userData)
      const userCategory = parsed?.Categoria_Uso || parsed?.categoria_uso
      const userScore = parsed?.mental_health_score || parsed?.mentalHealthScore

      if (
        typeof userCategory === 'string' &&
        typeof userScore === 'number' &&
        !isNaN(userScore)
      ) {
        const validCategories = Object.keys(grouped)
        const matchedCategory = validCategories.find(
          (cat) => cat.toLowerCase() === userCategory.toLowerCase()
        )

        if (matchedCategory) {
          console.log('✔ Mostrando punto del usuario en categoría:', matchedCategory, userScore)

          userScoreSeries.value = [
            {
              name: 'Tu Puntaje',
              type: 'scatter',
              data: [{ x: matchedCategory, y: userScore }],
            },
          ]
        } else {
          console.warn('⚠ Categoría de usuario no coincide con las del gráfico:', userCategory)
        }
      } else {
        console.warn('⚠ Datos del usuario inválidos o incompletos:', parsed)
      }
    } catch (err) {
      console.error('❌ Error al parsear profileData desde localStorage:', err)
    }
  }
  // Combinar series
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
      colors: ['#C084FC'], // morado
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
    legend: {
      labels: { colors: '#E0E7FF' },
    },
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