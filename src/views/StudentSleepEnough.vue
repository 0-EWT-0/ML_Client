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

    <div class="w-full min-h-[400px]">
      <div
        v-if="loadSwitch"
        class="flex flex-col items-center justify-center h-[400px] text-purple-300 animate-pulse"
      >
        <div
          class="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-3"
        ></div>
        Cargando datos...
      </div>
      <apexchart
        v-else
        type="bar"
        height="400"
        width="100%"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>

    <div class="mt-6 text-center">
      <button
        @click="fetchData"
        class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
        :disabled="loadSwitch"
      >
        Volver a cargar datos
      </button>
    </div>

    <Profile class="m-6 mt-6" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTreeStore } from '@/stores/TreesStore'
import Profile from '@/components/Profile.vue'

const treeStore = useTreeStore()
const chartSeries = ref<any[]>([])
const chartOptions = ref({})
const loadSwitch = ref(true)

// Obtener datos del usuario
const storedProfile = localStorage.getItem('profileData')
const user = storedProfile ? JSON.parse(storedProfile) : null
const userHoraKey = user ? `${Math.floor(user.avg_daily_usage_hours)} h` : null

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

  // Obtener índice del usuario
  const userIndex = categories.findIndex((c) => c === userHoraKey)
  const userPercentage = userIndex !== -1 ? seriesData[userIndex] : null

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
    annotations:
      userPercentage !== null
        ? {
            points: [
              {
                x: userHoraKey,
                y: userPercentage,
                marker: {
                  size: 8,
                  fillColor: '#FACC15',
                  strokeColor: '#FDE68A',
                  radius: 2,
                },
                label: {
                  borderColor: '#FACC15',
                  offsetY: -10,
                  style: {
                    color: '#1F2937',
                    background: '#FACC15',
                  },
                  text: 'Tú',
                },
              },
            ],
          }
        : {},
  }

  loadSwitch.value = false
}

function fetchData() {
  loadSwitch.value = true
  treeStore.loadStudentSleep().then(processData)
}

onMounted(fetchData)
</script>
