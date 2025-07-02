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
        <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Descubre cómo se ve afectada tu mente, tu tiempo y tu rendimiento académico. Completa el
          formulario de manera anónima y observa tus resultados.
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
        class="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed text-center"
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
import question1 from '@/assets/imgs/cards/question1.jpg'
import question2 from '@/assets/imgs/cards/question2.jpg'
import question3 from '@/assets/imgs/cards/question3.jpg'
import question4 from '@/assets/imgs/cards/question4.jpg'
import question5 from '@/assets/imgs/cards/question5.jpg'
import question6 from '@/assets/imgs/cards/question6.jpg'
import question7 from '@/assets/imgs/cards/question7.jpg'
import question8 from '@/assets/imgs/cards/question8.jpg'
import question9 from '@/assets/imgs/cards/question9.jpg'

const products = ref([
  // {
  //   title: '¿El estudiante duerme bien según el uso de redes?',
  //   description: 'Revolutionary processing power for next-gen applications.',
  //   image: tree1,
  //   route: '/tree1',
  // },
  // {
  //   title: 'Menos sueño por uso de redes sociales',
  //   description: 'Advanced analytics driven by artificial intelligence.',
  //   image: less_sleep_more_social_media,
  //   route: '/less_sleep_more_social_media',
  // },
  {
    title: '¿Cada vez te aíslas más de los demás?',
    description:
      'Explora si tu tiempo en línea disminuye tu conexión con amigos o familiares en la vida real.',
    image: question1,
  },
  {
    title: '¿Tu relación se complica por estar siempre conectado?',
    description:
      'Pregunta si tu hábito de estar siempre en línea está generando tensiones o conflictos con tu pareja.',
    image: question2,
  },
  {
    title: '¿Estar conectado provoca discusiones en tucírculo social?',
    description:
      'Indaga si el uso excesivo del celular genera discusiones frecuentes con tu pareja o amigos.',
    image: question3,
  },
  {
    title: '¿Una mala relación no te deja dormir?',
    description:
      'Evalúa el impacto emocional de una relación conflictiva y cómo esta afecta a tu descanso nocturno.',
    image: question4,
  },
  {
    title: '¿Entre más tiempo pasas en línea, más problemas enfrentas?',
    description:
      'Analiza si el uso constante de plataformas digitales se asocia con un aumento de problemas personales.',
    image: question5,
  },
  {
    title: '¿Tu nivel de conexión refleja tu salud mental?',
    description:
      'Evalúa si la intensidad de tu uso digital puede predecir o afectar tu bienestar psicológico.',
    image: question6,
  },
  {
    title: '¿Lo digital te quita el sueño y la calma?',
    description:
      'Analiza cómo el uso constante de lo digital puede afectar tu descanso y salud mental.',
    image: question7,
  },
  {
    title: '¿Estar en pareja baja tus notas?',
    description:
      'Explora si el tener una relación sentimental afecta negativamente tu desempeño académico.',
    image: question8,
  },
  {
    title: '¿Tu adicción digital afecta tu rendimiento académico?',
    description:
      'Indaga si la obsesión por estar conectado interfiere con tu capacidad para estudiar o concentrarte.',
    image: question9,
  },
])
</script>

<style></style>
