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
          :src="graphSrc"
          alt="Gráfica generada"
          class="w-full object-cover transition-transform duration-500 hover:scale-105"
          :class="{ hidden: !graphSrc }"
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

const predictionResult = ref(null)
const graphSrc = ref(null)
const resultSection = ref(null)

const predictSleep = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/predict/student_sleeps_enough')

    if (!response.ok) throw new Error('Error en la respuesta del servidor')

    const data = await response.json()
    scrollToResult()

    // Display prediction result
    predictionResult.value =
      data.prediction === 1 ? 'El estudiante duerme bien.' : 'El estudiante no duerme bien.'

    // Display graph if provided
    if (data.plot_base64) {
      graphSrc.value = `data:image/png;base64,${data.plot_base64}`
    } else {
      graphSrc.value = null
    }
  } catch (error) {
    predictionResult.value = 'Error al realizar la predicción.'
    graphSrc.value = null
    console.error(error)
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
