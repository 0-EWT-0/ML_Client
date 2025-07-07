<template>
  <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40 text-white">
    <h2 class="text-3xl font-semibold text-purple-400 mb-4 text-center">
      ¿Las redes sociales afectan tu descanso?
    </h2>

    <p class="text-sm text-gray-300 text-center mb-6 max-w-2xl mx-auto">
      Este gráfico compara el promedio de
      <span class="text-purple-300 font-semibold">horas en redes sociales</span> con la probabilidad
      de que los estudiantes
      <span class="text-green-300 font-semibold">duerman lo suficiente</span>.
    </p>

    <apexchart type="bar" height="400" :options="chartOptions" :series="chartSeries" />

    <div class="mt-6 text-center">
      <button
        @click="fetchData"
        class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
      >
        Volver a cargar datos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTreeStore } from '@/stores/TreesStore'

const treeStore = useTreeStore()
const chartSeries = ref<any[]>([])
const chartOptions = ref({})

function processData() {
  const data = treeStore.studentSleep.data_points

  const buckets: Record<string, { total: number; duermeBien: number }> = {}

  data.forEach((p) => {
    const hora = Math.floor(p.horas_en_redes)
    const key = `${hora} h`

    if (!buckets[key]) {
      buckets[key] = { total: 0, duermeBien: 0 }
    }

    buckets[key].total++
    if (p.duerme_bien === 1) {
      buckets[key].duermeBien++
    }
  })

  const categories = Object.keys(buckets).sort((a, b) => parseInt(a) - parseInt(b))
  const seriesData = categories.map((key) => {
    const { total, duermeBien } = buckets[key]
    return total > 0 ? Number(((duermeBien / total) * 100).toFixed(1)) : 0
  })

  chartSeries.value = [
    {
      name: '% que duerme bien',
      data: seriesData,
    },
  ]

  chartOptions.value = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      title: { text: 'Horas promedio en redes sociales' },
      labels: { style: { colors: '#E0E7FF' } },
    },
    yaxis: {
      title: { text: '% que duerme bien' },
      max: 100,
      labels: { style: { colors: '#E0E7FF' } },
    },
    colors: ['#6EE7B7'],
    tooltip: {
      theme: 'dark',
    },
  }
}

function fetchData() {
  treeStore.loadStudentSleep().then(processData)
}

onMounted(fetchData)
</script>
