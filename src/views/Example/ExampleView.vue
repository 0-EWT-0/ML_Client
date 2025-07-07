<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Header -->
    <Header />

    <!-- Main Product Section -->
    <section class="container mx-auto px-6 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Product Image -->
        <div class="relative rounded-2xl overflow-hidden border border-gray-800/50">
          <img
            src="@/assets/imgs/tree1.jpg"
            alt="¿El estudiante duerme bien según el uso de redes?"
            class="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <!-- Product Info -->
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-extrabold text-purple-500 tracking-tight">
            ¿El estudiante duerme bien según el uso de redes?
          </h1>
          <p class="text-base text-gray-400 leading-relaxed">
            The Quantum Core redefines computational performance with unparalleled speed and
            efficiency, designed to power the most demanding applications of the future.
          </p>
          <button
            @click="predictSleep()"
            class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            ✨ Generar predicción
          </button>
        </div>
      </div>
    </section>

    <!-- Product Details Section -->
    <section class="container mx-auto px-6 py-16 bg-gray-900/50 border-y border-gray-800/50">
      <h2
        ref="resultSection"
        class="text-3xl md:text-4xl font-extrabold text-purple-500 tracking-tight mb-8"
      >
        Resultado
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <li class="flex items-start space-x-4">
          <span class="text-purple-600">•</span>
          <p class="text-sm text-gray-400 leading-relaxed">
            {{ predictionResult || 'Ingresa tu información y obtén una predicción personalizada' }}
            <span v-if="regressionStore.error" class="text-red-500">{{ regressionStore.error }}</span>
          </p>
        </li>
        <li v-if="regressionStore.prediction" class="flex items-start space-x-4">
          <span class="text-purple-600">•</span>
          <p class="text-sm text-gray-400 leading-relaxed">
            Predicción Mental: {{ regressionStore.prediction.prediction_mental_health }}<br>
            Conflictos: {{ regressionStore.prediction.prediction_conflicts }}<br>
            Coef. Mental: {{ regressionStore.prediction.coefficient_mental }}<br>
            Coef. Conflictos: {{ regressionStore.prediction.coefficient_conflicts }}<br>
            Plot Base64 (texto): {{ regressionStore.prediction.plot_base64.substring(0, 50) + '...' }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Complementary Image Section -->
    <section class="container mx-auto px-6 py-16">
      <div class="relative rounded-2xl overflow-hidden border border-gray-800/50">
        <img
          v-if="regressionStore.prediction?.plot_base64"
          :src="`data:image/png;base64,${regressionStore.prediction.plot_base64}`"
          alt="Gráfica generada"
          class="w-full object-cover transition-transform duration-500 hover:scale-105"
          @error="handleImageError"
        />
        <div v-else class="text-red-500 text-center">No se pudo cargar la gráfica: {{ imageError || 'Datos no disponibles' }}</div>
        <div class="absolute bottom-0 left-0 right-0 h-32"></div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRegressionLinearStore } from '@/stores/RegressionLinearStore'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'

const predictionResult = ref<string | null>(null)
const resultSection = ref<HTMLElement | null>(null)
const imageError = ref<string | null>(null)

const regressionStore = useRegressionLinearStore()

const formData = ref({
  avg_daily_usage_hours: 6.7,
  addicted_score: 7.8,
})

const predictSleep = async () => {
  try {
    const { avg_daily_usage_hours, addicted_score } = formData.value

    console.log('📤 Enviando al store desde vista:', {
      avg_daily_usage_hours,
      addicted_score
    })

    const response = await regressionStore.predictSocialMediaMentalHealthStore(
      avg_daily_usage_hours,
      addicted_score
    )

    if (!response || !response.data) {
      throw new Error(regressionStore.error || 'Respuesta inválida del servidor')
    }

    const result = response.data
    predictionResult.value = `🧠 Predicción mental: ${result.prediction_mental_health}, 🤝 Conflictos: ${result.prediction_conflicts}, Coef. Mental: ${result.coefficient_mental}, Coef. Conflictos: ${result.coefficient_conflicts}`
    imageError.value = null

  } catch (error) {
    const errorMessage = (error instanceof Error && error.message) ? error.message : 'Desconocido'
    predictionResult.value = `Hubo un error al hacer la predicción: ${errorMessage}`
    imageError.value = errorMessage
    console.error('❌ Error desde vista:', error)
  } finally {
    scrollToResult()
  }
}

const handleImageError = () => {
  imageError.value = 'Error al cargar la imagen (base64 inválido o corrupto)'
  console.error('❌ Error al renderizar la imagen. plot_base64:', regressionStore.prediction?.plot_base64)
}

const scrollToResult = () => {
  if (resultSection.value) {
    resultSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style></style>
