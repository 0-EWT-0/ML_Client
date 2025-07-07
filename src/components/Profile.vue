<template>
  <div
    class="bg-gray-900/50 border border-purple-700/30 backdrop-blur-sm text-white rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-10"
  >
    <h2 class="text-2xl font-bold text-purple-400 mb-4 text-center">Tu Perfil Personalizado</h2>

    <!-- Datos del usuario -->
    <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
      <div><span class="text-purple-400 font-semibold">Edad:</span> {{ profile.age }}</div>
      <div>
        <span class="text-purple-400 font-semibold">Género:</span> {{ capitalize(profile.gender) }}
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Nivel académico:</span>
        {{ capitalize(profile.academic_level) }}
      </div>
      <div><span class="text-purple-400 font-semibold">País:</span> {{ profile.country }}</div>
      <div>
        <span class="text-purple-400 font-semibold">Horas en redes:</span>
        {{ profile.avg_daily_usage_hours }} h
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Plataforma favorita:</span>
        {{ capitalize(profile.most_used_platform) }}
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Sueño promedio:</span>
        {{ profile.sleep_hours_per_night }} h
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Estado sentimental:</span>
        {{ capitalize(profile.relationship_status) }}
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Conflictos en redes:</span>
        {{ profile.conflicts_over_social_media }}
      </div>
    </div>

    <div class="my-4 border-t border-gray-700"></div>

    <!-- Predicciones -->
    <h3 class="text-lg font-semibold text-purple-300 mb-2">Predicciones</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-200 mb-4">
      <div class="flex justify-between">
        <span>Adicción estimada:</span>
        <span class="font-bold text-purple-400">{{ predictions.addicted_score }} / 20</span>
      </div>
      <div class="flex justify-between">
        <span>Afecta el rendimiento:</span>
        <span
          class="font-bold"
          :class="predictions.affects_academic_performance ? 'text-red-400' : 'text-green-400'"
        >
          {{ predictions.affects_academic_performance ? 'Sí' : 'No' }}
        </span>
      </div>
      <div class="flex justify-between md:col-span-2">
        <span>Salud mental estimada:</span>
        <span class="font-bold text-purple-400">{{ predictions.mental_health_score }} / 10</span>
      </div>
    </div>

    <!-- Botón Ver más -->
    <div class="text-center mt-2">
      <button
        @click="showGraph = !showGraph"
        class="text-sm text-purple-400 hover:text-purple-300 underline transition-all"
      >
        {{ showGraph ? 'Ocultar gráficas' : 'Ver más al respecto' }}
      </button>
    </div>

    <!-- Gráfica -->
    <div v-if="hasValidData && showGraph" class="mt-6 h-[300px] w-full">
      <PredictionChart
        :addicted="predictions.addicted_score"
        :academicImpact="predictions.affects_academic_performance"
        :mentalHealth="predictions.mental_health_score"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PredictionChart from '@/components/PredictionChart.vue'

const profile = ref<any>({})
const predictions = ref<any>({})
const showGraph = ref(false)

onMounted(() => {
  const storedProfile = localStorage.getItem('profileData')
  const storedPredictions = localStorage.getItem('predictionsData')

  if (storedProfile) profile.value = JSON.parse(storedProfile)
  if (storedPredictions) predictions.value = JSON.parse(storedPredictions)
})

const hasValidData = computed(() => {
  return (
    predictions.value &&
    typeof predictions.value.addicted_score === 'number' &&
    typeof predictions.value.mental_health_score === 'number'
  )
})

const capitalize = (text: string) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
</script>
