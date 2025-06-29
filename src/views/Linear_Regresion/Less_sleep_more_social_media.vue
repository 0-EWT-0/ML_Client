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
            src="@/assets/imgs/less_sleep_more_social_media.jpg"
            alt="Menos sueño por uso de redes sociales"
            class="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <!-- Product Info -->
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-extrabold text-purple-500 tracking-tight">
            Menos sueño por uso de redes sociales
          </h1>
          <p class="text-base text-gray-400 leading-relaxed">
            The Quantum Core redefines computational performance with unparalleled speed and
            efficiency, designed to power the most demanding applications of the future.
          </p>

          <div class="flex items-center space-x-4">
            <label for="addicted_score" class="text-sm font-medium text-gray-300 flex-shrink-0"
              >Horas diarias de uso:</label
            >
            <input
              type="number"
              id="media_hours"
              min="1"
              max="24"
              v-model="mediaHours"
              class="w-24 bg-gray-900/50 border border-gray-800/50 rounded-lg py-2 px-4 text-gray-300 text-sm focus:outline-none focus:border-purple-500 transition-colors duration-300"
              placeholder="1 - 10"
            />
          </div>
          <button
            @click="submitPrediction()"
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
          <p id="socialMediaSleepResult" class="text-sm text-gray-400 leading-relaxed">
            {{ predictionResult || 'Ingresa tu información y obtén una predicción personalizada' }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Complementary Image Section -->
    <section class="container mx-auto px-6 py-16">
      <div class="relative rounded-2xl overflow-hidden border border-gray-800/50">
        <img
          :src="graphImage"
          alt="Gráfica generada"
          class="w-full object-cover transition-transform duration-500 hover:scale-105"
          :class="{ hidden: !graphImage }"
        />
        <div class="absolute bottom-0 left-0 right-0 h-32"></div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '@/assets/main.css'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const mediaHours = ref(null)
const predictionResult = ref('')
const graphImage = ref('')
const resultSection = ref(null)

const submitPrediction = async () => {
  if (mediaHours.value === null || mediaHours.value < 0 || mediaHours.value > 24) {
    predictionResult.value = 'Por favor, ingresa un valor válido entre 0 y 24 horas.'
    graphImage.value = ''
    scrollToResult()
    return
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/predict/less_sleep_more_social_media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_hours: mediaHours.value }),
    })

    const data = await response.json()
    predictionResult.value = `Predicción: ${data.addicted_score} impacto en sueño`

    if (data.plot_base64) {
      graphImage.value = `data:image/png;base64,${data.plot_base64}`
    } else {
      predictionResult.value += ' (No se recibió gráfica)'
      graphImage.value = ''
    }
  } catch (error) {
    predictionResult.value = 'Error al realizar la predicción. Inténtalo de nuevo.'
    graphImage.value = ''
  } finally {
    scrollToResult()
  }
}

const scrollToResult = () => {
  if (resultSection.value) {
    resultSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style></style>
