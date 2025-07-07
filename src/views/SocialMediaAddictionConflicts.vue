<template>
  <div>
    <h1>Social Media Addiction Conflicts</h1>

    <!-- Resultado en texto -->
    <div>
      <p v-if="predictionResult" class="text-lg">
        {{ predictionResult }}
        <span v-if="predictionStore.error" class="text-red-500">{{ predictionStore.error }}</span>
      </p>
      <p v-else class="text-gray-500">Cargando predicción o sin datos disponibles...</p>
    </div>

    <!-- Gráfica -->
    <div class="mt-4">
      <img
        v-if="predictionStore.prediction?.plot_base64"
        :src="`data:image/png;base64,${predictionStore.prediction.plot_base64}`"
        alt="Social Media Addiction Conflicts Plot"
        class="max-w-full h-auto"
        @error="handleImageError"
      />
      <p v-else-if="imageError" class="text-red-500">{{ imageError }}</p>
      <p v-else class="text-gray-500">No se generó una gráfica aún.</p>
    </div>

    <!-- Botón para generar predicción -->
    <button @click="fetchConflicts" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      Generar Conflictos
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePredictionStore } from '@/stores/QuestionsStore';
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth';

const predictionStore = usePredictionStore();
const predictionResult = ref<string | null>(null);
const imageError = ref<string | null>(null);

onMounted(() => {
  const storedData = localStorage.getItem('predictionData');
  if (storedData) {
    predictionStore.prediction = JSON.parse(storedData) as PredictionResponse;
    updatePredictionResult();
  }
});

watch(() => predictionStore.prediction, (newPrediction) => {
  updatePredictionResult();
});

const updatePredictionResult = () => {
  if (predictionStore.prediction) {
    const predictionValue = predictionStore.prediction.prediction || 0; // Asume que 'prediction' viene en la respuesta
    const predictionText = predictionValue === 1 ? 'Sí' : 'No';
    predictionResult.value = `Addicted Score: ${predictionStore.prediction.addicted_score}, Predicción de Conflictos: ${predictionText}`;
    imageError.value = null;
  } else {
    predictionResult.value = null;
  }
};

const fetchConflicts = async () => {
  try {
    await predictionStore.postSocialMediaAddictionConflicts();
    if (predictionStore.error) {
      throw new Error(predictionStore.error);
    }
    updatePredictionResult();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    predictionResult.value = `Error al obtener conflictos: ${errorMessage}`;
    imageError.value = errorMessage;
    console.error('Error en fetchConflicts:', error);
  }
};

const handleImageError = () => {
  imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)';
  console.error('Error al renderizar la imagen. plot_base64:', predictionStore.prediction?.plot_base64);
};
</script>
