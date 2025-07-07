<template>
  <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40 text-white">
    <h2 class="text-3xl font-semibold text-purple-400 mb-6 text-center">
      ¿Cuántos conflictos personales podrías tener?
    </h2>

    <!-- Explicación del modelo -->
    <p class="text-sm text-gray-300 text-center mb-6 max-w-2xl mx-auto mt-7">
      Utilizamos un modelo de
      <span class="text-purple-300 font-semibold">regresión lineal</span> alimentado con datos de
      estudiantes reales para predecir el número de
      <span class="text-red-400 font-medium">conflictos personales</span>
      basados en tu nivel de adicción a las redes sociales.
    </p>

    <!-- Resultado de la predicción -->
    <div class="text-center mb-8">
      <p v-if="predictionResult !== null" class="text-xl font-bold">
        Según tu nivel de adicción actual, <br />
        <span class="text-purple-300 text-2xl">{{ predictionResult }}</span>
        <span class="text-red-400">conflicto(s) personales</span> podrían surgir.
      </p>
      <p v-if="predictionStore.error" class="text-red-500 mt-2">{{ predictionStore.error }}</p>
      <p v-else-if="predictionResult === null" class="text-gray-400">Cargando predicción...</p>
    </div>

    <!-- Botón de acción -->
    <div class="text-center">
      <button
        @click="fetchConflicts"
        class="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded text-white"
      >
        Generar Predicción
      </button>
    </div>

    <Profile class="mb-6" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePredictionStore } from '@/stores/QuestionsStore'
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth'
import Profile from '@/components/Profile.vue'

const predictionStore = usePredictionStore()
const predictionResult = ref<number | null>(null)

onMounted(() => {
  const storedData = localStorage.getItem('predictionData')
  if (storedData) {
    predictionStore.prediction = JSON.parse(storedData) as PredictionResponse
    updatePredictionResult()
  }
})

watch(() => predictionStore.prediction, updatePredictionResult)

function updatePredictionResult() {
  if (predictionStore.prediction?.prediction !== undefined) {
    predictionResult.value = Number(predictionStore.prediction.prediction)
  } else {
    predictionResult.value = null
  }
}

async function fetchConflicts() {
  try {
    await predictionStore.postSocialMediaAddictionConflicts()
    if (predictionStore.error) throw new Error(predictionStore.error)
    updatePredictionResult()
  } catch (error) {
    console.error('Error al obtener predicción de conflictos:', error)
    predictionResult.value = null
  }
}
</script>
