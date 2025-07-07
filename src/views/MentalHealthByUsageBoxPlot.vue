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
        valores más altos de salud mental, indicando un mejor estado emocional en ese grupo.
      </li>
      <li>
        <span class="text-red-400 font-medium">Rojo (parte inferior):</span> muestra los valores más
        bajos, lo que sugiere mayor afectación emocional o bienestar reducido.
      </li>
    </ul>

    <p class="text-sm text-gray-300 mt-4 text-center max-w-2xl mx-auto">
      En general, si un grupo tiene su bloque rojo más bajo o más largo, puede indicar que
      <span class="text-red-400 font-semibold"
        >más estudiantes en ese nivel de uso tienen menor salud mental</span
      >. Esto ayuda a visualizar cómo influye el tiempo en redes en el bienestar emocional.
    </p>

    <apexchart type="boxPlot" height="400" :options="chartOptions" :series="chartSeries" />

    <div class="mt-6 text-center">
      <button
        @click="fetchBoxplot"
        class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
      >
        Volver a cargar datos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePredictionStore } from '@/stores/QuestionsStore'
import Profile from '@/components/Profile.vue'

const predictionStore = usePredictionStore()
const chartSeries = ref<any[]>([])
const chartOptions = ref({})

function processBoxplotData(dataPoints: { Categoria_Uso: string; mental_health_score: number }[]) {
  const grouped: Record<string, number[]> = {}

  // Agrupar datos por categoría
  dataPoints.forEach((p) => {
    const category = p.Categoria_Uso
    if (!grouped[category]) grouped[category] = []
    grouped[category].push(p.mental_health_score)
  })

  // Convertir a formato ApexCharts
  chartSeries.value = [
    {
      name: 'Salud Mental',
      data: Object.entries(grouped).map(([categoria, scores]) => {
        const sorted = scores.sort((a, b) => a - b)
        const q1 = sorted[Math.floor(sorted.length * 0.25)]
        const q2 = sorted[Math.floor(sorted.length * 0.5)] // Mediana
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
    xaxis: {
      title: { text: 'Categoría de Uso de Redes Sociales' },
      labels: { style: { colors: '#E0E7FF' } },
    },
    yaxis: {
      title: { text: 'Puntaje de Salud Mental (0-10)' },
      min: 0,
      max: 10,
      labels: { style: { colors: '#E0E7FF' } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
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
