<template>
  <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40 text-white">
    <h3 class="text-2xl font-semibold text-purple-400 mb-6 text-center">
      ¿Tu uso en redes sociales afecta tu rendimiento académico?
    </h3>
    <p class="text-center text-sm text-gray-300 mb-4 max-w-2xl mx-auto">
      Esta tabla agrupa estudiantes por horas promedio en redes sociales, mostrando el porcentaje de
      quienes reportan que este uso <span class="text-red-400 font-medium">sí afecta</span> su
      rendimiento escolar.
    </p>

    <div class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-purple-700/40 text-sm">
        <thead class="bg-purple-800 text-white">
          <tr>
            <th class="px-4 py-2 text-left">Horas en redes</th>
            <th class="px-4 py-2 text-left">Total estudiantes</th>
            <th class="px-4 py-2 text-left text-red-300">Con impacto académico</th>
            <th class="px-4 py-2 text-left">Porcentaje (%)</th>
          </tr>
        </thead>
        <tbody v-if="groupedByHour.length">
          <tr
            v-for="row in groupedByHour"
            :key="row.label"
            class="hover:bg-purple-700/30 transition-colors"
          >
            <td class="border px-4 py-2 font-medium">{{ row.label }}</td>
            <td class="border px-4 py-2">{{ row.total }}</td>
            <td class="border px-4 py-2 text-red-300">{{ row.impacto }}</td>
            <td class="border px-4 py-2">
              {{ row.total > 0 ? ((row.impacto / row.total) * 100).toFixed(1) + '%' : '0%' }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center text-gray-400 py-4">Cargando datos...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTreeStore } from '@/stores/TreesStore'

const treeStore = useTreeStore()
const loaded = ref(false)

onMounted(async () => {
  await treeStore.loadAcademicImpact()
  loaded.value = true
})

const groupedByHour = computed(() => {
  if (!loaded.value) return []

  const data = treeStore.academicImpact.data_points
  const buckets: Record<string, { total: number; impacto: number }> = {}

  data.forEach((p) => {
    const horas = Math.floor(p.horas_en_redes)
    const key = `${horas} h`

    if (!buckets[key]) {
      buckets[key] = { total: 0, impacto: 0 }
    }

    buckets[key].total++
    if (Number(p.impacto_academico) === 1) {
      buckets[key].impacto++
    }
  })

  return Object.entries(buckets)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([label, val]) => ({
      label,
      total: val.total,
      impacto: val.impacto,
    }))
})
</script>
