<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Banner -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-gray-950"></div>
      <img
        src="@/assets/imgs/banner2.jpg"
        alt="Tech background"
        class="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
      />
      <!-- Fade-out effect at the bottom -->
      <div
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"
      ></div>
      <div class="container mx-auto px-6 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
        >
          ¡Formulario completado!
        </h1>

        <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Gracias por enviar el formulario. Serás redirigido a la página principal en
        </p>

        <div class="flex items-end justify-center">
          <h1
            class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
          >
            {{ countdown }}
            <span
              class="text-xl md:text-2xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500"
            >
              segundos
            </span>
          </h1>
        </div>
        <button
          @click="redirectNow"
          class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          Regresar ahora
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/main.css'

const router = useRouter()
const countdown = ref(5) // Inicia en 5 segundos
let timer: number | null = null

const redirectNow = () => {
  if (timer) clearInterval(timer) // Limpia el temporizador
  router.push('/') // Redirige a la página principal
}

onMounted(() => {
  // Inicia el temporizador
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      redirectNow()
    }
  }, 1000)
})

onUnmounted(() => {
  // Limpia el temporizador cuando el componente se desmonta
  if (timer) clearInterval(timer)
})
</script>
