<template>
  <div>
    <h1>Impacto Académico</h1>

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
        alt="Impacto Académico Plot"
        class="max-w-full h-auto"
        @error="handleImageError"
      />
      <p v-else-if="imageError" class="text-red-500">{{ imageError }}</p>
      <p v-else class="text-gray-500">No se generó una gráfica aún.</p>
    </div>

    <!-- Botón para generar predicción -->
    <button @click="fetchSocialMediaImpact" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      Generar Predicción
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePredictionStore } from '@/stores/QuestionsStore';
import type { Profile } from '@/types/profile';
const predictionStore = usePredictionStore();
const predictionResult = ref<string | null>(null);
const imageError = ref<string | null>(null);

onMounted(() => {
  const storedProfile = localStorage.getItem('profileData');
  if (storedProfile) {
    updatePredictionResult();
  }
});

watch(() => predictionStore.prediction, (newPrediction) => {
  updatePredictionResult();
});

const updatePredictionResult = () => {
  const storedProfile = localStorage.getItem('profileData');
  if (storedProfile) {
    const profileData = JSON.parse(storedProfile) as Profile;
    const socialMediaHours = profileData.social_media_hours || 0;
    const impact = socialMediaHours > 5 ? 'negativo' : 'neutro'; // Ejemplo simple: >5 horas = impacto negativo
    const message = `Debido a que tienes ${socialMediaHours} horas en redes, tu impacto académico es ${impact}.`;
    predictionResult.value = message;
  } else if (predictionStore.prediction) {
    predictionResult.value = 'Datos de perfil no disponibles, pero la predicción se ha generado.';
  } else {
    predictionResult.value = null;
  }
  imageError.value = null;
};

const fetchSocialMediaImpact = async () => {
  try {
    await predictionStore.getSocialMediaImpactAcademics();
    if (predictionStore.error) {
      throw new Error(predictionStore.error);
    }
    updatePredictionResult();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    predictionResult.value = `Error al obtener la predicción: ${errorMessage}`;
    imageError.value = errorMessage;
    console.error('Error en fetchSocialMediaImpact:', error);
  }
};

const handleImageError = () => {
  imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)';
  console.error('Error al renderizar la imagen. plot_base64:', predictionStore.prediction?.plot_base64);
};
</script>
