<template>
  <h2 class="text-4xl md:text-5xl font-extrabold text-center mb-6 text-purple-500 tracking-tight">
    Acerca de ti
  </h2>

  <div
    class="bg-gray-900/50 border border-purple-700/30 backdrop-blur-sm text-white rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-10"
  >
    <!-- <h2 class="text-2xl font-bold text-purple-400 mb-4 text-center">Tu Perfil Personalizado</h2> -->

    <!-- Datos del usuario -->
    <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
      <div><span class="text-purple-400 font-semibold">Edad:</span> {{ profile.age }}</div>
      <div>
        <span class="text-purple-400 font-semibold">Género:</span>
        {{ transformGender(profile.gender) }}
      </div>
      <div>
        <span class="text-purple-400 font-semibold">Nivel académico:</span>
        {{ transformAcedemicLevel(profile.academic_level) }}
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
        {{ transformRelationshipStatus(profile.relationship_status) }}
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
      <div class="flex justify-start gap-2">
        <span>Adicción estimada:</span>
        <span :class="transformAddictedScore(predictions.addicted_score).class" class="font-bold"
          >{{ transformAddictedScore(predictions.addicted_score).text }}
        </span>
      </div>

      <div class="flex justify-start gap-2">
        <span>Salud mental estimada:</span>
        <span
          :class="transformMentalHealthScore(predictions.mental_health_score).class"
          class="font-bold"
          >{{ transformMentalHealthScore(predictions.mental_health_score).text }}</span
        >
      </div>

      <div class="flex justify-start gap-2 md:col-span-2">
        <span>Afecta el rendimiento:</span>
        <span
          class="font-bold"
          :class="predictions.affects_academic_performance ? 'text-red-400' : 'text-green-400'"
        >
          {{ predictions.affects_academic_performance ? 'Sí' : 'No' }}
        </span>
      </div>
    </div>

    <!-- Botón Ver más -->
    <div class="text-center mt-2">
      <button
        @click="showGraph = !showGraph"
        class="text-sm text-purple-400 hover:text-purple-300 underline transition-all"
      >
        {{ showGraph ? 'Ocultar' : 'Ver más al respecto' }}
      </button>
    </div>

    <!-- Gráfica -->
    <div v-if="hasValidData && showGraph" class="mt-6 w-full">
      <div class="h-[300px]">
        <PredictionChart
          :addicted="predictions.addicted_score"
          :academicImpact="predictions.affects_academic_performance"
          :mentalHealth="predictions.mental_health_score"
        />
      </div>

      <!-- Consejos -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-purple-300 mb-2">Consejos que podrían ayudarte</h3>
        <h4 class="text-purple-400 font-semibold">🧠 En tu salud mental</h4>
        <p
          class="text-sm text-gray-300"
          v-for="(tips, index) in transformMentalHealthScore(predictions.mental_health_score).tips"
          :key="index"
        >
          <span :class="transformMentalHealthScore(predictions.mental_health_score).class">● </span
          >{{ tips }}
        </p>

        <h4 class="text-purple-400 font-semibold mt-4">🤕 En tu nivel de adicción</h4>
        <p
          class="text-sm text-gray-300"
          v-for="(tips, index) in transformAddictedScore(predictions.addicted_score).tips"
          :key="index"
        >
          <span :class="transformAddictedScore(predictions.addicted_score).class">● </span
          >{{ tips }}
        </p>
      </div>
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

const transformAcedemicLevel = (value: string) => {
  switch (value) {
    case 'high school':
      return 'Preparatoria'
    case 'undergraduate':
      return 'Licenciatura'
    case 'graduate':
      return 'Graduado'
    default:
      return 'Desconocido'
  }
}

const transformGender = (value: string) => {
  switch (value) {
    case 'male':
      return 'Masculino'
    case 'female':
      return 'Femenino'
    default:
      return 'Desconocido'
  }
}

const transformRelationshipStatus = (value: string) => {
  switch (value) {
    case 'in relationship':
      return 'En una relación'
    case 'single':
      return 'Soltero'
    case 'complicated':
      return 'Complicado'
    default:
      return 'Desconocido'
  }
}

const transformMentalHealthScore = (value: number) => {
  if (value <= 3)
    return {
      class: 'text-red-800',
      text: 'Posibles problemas',
      tips: [
        'Habla con alguien de confianza',
        'Busca ayuda profesional',
        'No ignores tus emociones, tu bienestar es importante',
      ],
    }
  if (value >= 4 && value <= 7) {
    return {
      class: 'text-amber-500',
      text: 'Podrías mejorar',
      tips: [
        'Dedica tiempo a ti mismo y tus hobbies',
        'Haz pausas y respira profundamente',
        'Mantén hábitos saludables: sueño, comida y actividad física',
      ],
    }
  } else {
    return {
      class: 'text-green-400',
      text: 'Todo en orden',
      tips: [
        'Sigue cuidando tu salud emocional',
        'Ayuda a otros si puedes',
        'Mantén tus rutinas positivas y redes de apoyo',
      ],
    }
  }
}

const transformAddictedScore = (value: number) => {
  if (value <= 6)
    return {
      class: 'text-green-800',
      text: 'Bajo',
      tips: [
        'Mantén el equilibrio y autocontrol',
        'Conócete y pon límites saludables',
        'Disfruta sin depender',
      ],
    }
  if (value >= 7 && value <= 13) {
    return {
      class: 'text-amber-500',
      text: 'Moderado',
      tips: [
        'Reflexiona si la conducta interfiere con tu vida',
        'Prueba reducir el tiempo o la frecuencia',
        'Busca actividades alternativas que disfrutes',
      ],
    }
  } else {
    return {
      class: 'text-red-800',
      text: 'Alto',
      tips: [
        'Reconoce que necesitas apoyo, y está bien',
        'Habla con un profesional o centro de ayuda',
        'No estás solo: dar el primer paso es valiente',
      ],
    }
  }
}
</script>
