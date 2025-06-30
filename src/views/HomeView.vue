<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Header -->
    <Header />

    <!-- Banner -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-gray-950"></div>
      <img
        src="@/assets/imgs/banner.jpg"
        alt="Tech background"
        class="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
      />
      <!-- Fade-out effect at the bottom -->
      <div
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"
      ></div>
      <div class="container mx-auto px-6 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          ¿Te has preguntado
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
            >cómo las redes sociales afectan tu vida diaria?</span
          >
        </h1>
        <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Descubre cómo el uso de redes sociales afecta tu mente, tu tiempo y tu rendimiento
          académico. Analiza, predice y mejora con aprendiza automático.
        </p>
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          <a href="/form"> Comenzar </a>
        </button>
      </div>
    </section>

    <!-- Products (Bento Grid) -->
    <section class="container mx-auto px-6 py-20">
      <h2
        class="text-4xl md:text-5xl font-extrabold text-center mb-6 text-purple-500 tracking-tight"
      >
        Elige lo que quieres entender de ti
      </h2>
      <p
        class="text-lg md:text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed text-center"
      >
        Personaliza tus predicciones y descubre cómo tus hábitos digitales influyen en lo que más
        importa.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="group bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300"
        >
          <a :href="product.route">
            <img
              :src="product.image"
              :alt="product.title"
              class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-2 text-purple-400">{{ product.title }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ product.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script  setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import '@/assets/main.css'
import tree1 from '@/assets/imgs/tree1.jpg'
import less_sleep_more_social_media from '@/assets/imgs/less_sleep_more_social_media.jpg'

const products = ref([
  {
    title: '¿El estudiante duerme bien según el uso de redes?',
    description: 'Revolutionary processing power for next-gen applications.',
    image: tree1,
    route: '/tree1',
  },
  {
    title: 'Menos sueño por uso de redes sociales',
    description: 'Advanced analytics driven by artificial intelligence.',
    image: less_sleep_more_social_media,
    route: '/less_sleep_more_social_media',
  },
  {
    title: 'CloudSync',
    description: 'Unified data management across all platforms.',
    image:
      'https://images.unsplash.com/photo-1516321318423-4b6b6b6b6b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'VR Nexus',
    description: 'Immersive virtual reality experiences redefined.',
    image:
      'https://images.unsplash.com/photo-1593508512255-86ab7664402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'IoT Connect',
    description: 'Smart connectivity for your IoT ecosystem.',
    image:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'CyberGuard',
    description: 'Unbreakable security for your digital assets.',
    image:
      'https://images.unsplash.com/photo-1563206767-5b18f935e59a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
])
</script>

<style></style>
