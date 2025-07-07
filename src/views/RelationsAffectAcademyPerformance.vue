<template>
  <div>
    <h1>Relations Affect Academy Performance</h1>

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
        alt="Relations Affect Academy Performance Plot"
        class="max-w-full h-auto"
        @error="handleImageError"
      />
      <p v-else-if="imageError" class="text-red-500">{{ imageError }}</p>
      <p v-else class="text-gray-500">No se generó una gráfica aún.</p>
    </div>

    <!-- Botón para generar predicción -->
    <button @click="fetchAcademyPerformance" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
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
  console.log('Datos en localStorage - profileData:', storedProfile);
  if (storedProfile) {
    const profileData = JSON.parse(storedProfile) as Profile;
    console.log('Parseado profileData:', profileData);
    console.log('relationship_status:', profileData.relationship_status);
    if (profileData && profileData.relationship_status) {
      updatePredictionResult();
    }
  }
});

watch(() => predictionStore.prediction, (newPrediction) => {
  console.log('predictionStore.prediction actualizado:', newPrediction);
  updatePredictionResult();
});

const updatePredictionResult = () => {
  console.log('Entrando en updatePredictionResult, predictionStore.prediction:', predictionStore.prediction);
  if (predictionStore.prediction) {
    const storedProfile = localStorage.getItem('profileData');
    let relationshipStatus = '';
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile) as Profile;
      console.log('profileData en updatePredictionResult:', profileData);
      console.log('relationship_status en updatePredictionResult:', profileData.relationship_status);
      relationshipStatus = profileData.relationship_status?.toLowerCase() || '';
    }

    let message = '';
    if (relationshipStatus === 'single' || relationshipStatus === 'complicated') {
      message = 'Debido a que no tienes pareja, tu relación no afecta tu rendimiento académico.';
    } else if (relationshipStatus === 'in relationship') {
      message = 'Debido a que sí tienes una relación, haciendo una predicción con los datos de miles de personas, todo indica que sí afecta tu rendimiento académico.';
    } else {
      message = 'Estado de relación no reconocido o no disponible.';
    }

    predictionResult.value = `${message} (Is in Relationship: ${predictionStore.prediction.is_in_relationship || 'N/A'})`;
    imageError.value = null;
  } else {
    predictionResult.value = null;
  }
};

const fetchAcademyPerformance = async () => {
  try {
    console.log('Iniciando fetchAcademyPerformance');
    await predictionStore.postRelationsAffectAcademyPerformance();
    console.log('Después de llamar al store, predictionStore.prediction:', predictionStore.prediction);
    if (predictionStore.error) {
      throw new Error(predictionStore.error);
    }
    updatePredictionResult();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    predictionResult.value = `Error al obtener la predicción: ${errorMessage}`;
    imageError.value = errorMessage;
    console.error('Error en fetchAcademyPerformance:', error);
  }
};

const handleImageError = () => {
  imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)';
  console.error('Error al renderizar la imagen. plot_base64:', predictionStore.prediction?.plot_base64);
};
</script>
