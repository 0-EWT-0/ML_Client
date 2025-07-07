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
          Descubre cómo se ve afectada tu mente, tu tiempo y tu rendimiento académico. <span class="font-bold text-gray-300">Completa el
          formulario de manera anónima y observa tus resultados.</span>
        </p>

        <button
        v-if="!profile.isCompletedForm"
@click="router.push('/form')"
          class="relative overflow-hidden bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          📝 Comenzar
          <span class="shine"></span>
        </button>

        <div v-else>
        <button
        @click="scrollToProfile('profileSection')"
          class="relative overflow-hidden bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 mb-2"
        >
        
           👀 Explora tus resultados
           <span class="shine"></span>
        </button>
          <Arrow class="flex justify-center"/>
        </div>
      </div>
    </section>

    <div v-if="profile.isCompletedForm" id="profileSection">
    <Profile />
    <!-- Products (Bento Grid) -->
    <section
    class="container mx-auto px-6 py-34">
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
    </div>

    <!-- Footer -->
    <Footer v-if="profile.isCompletedForm"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
import Profile from '@/components/Profile.vue'
import Arrow from '@/assets/icons/arrow.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const profile = ref<any>({})
const predictions = ref<any>({})

onMounted(() => {
  const storedProfile = localStorage.getItem('profileData')
  const storedPredictions = localStorage.getItem('predictionsData')

  if (storedProfile) profile.value = JSON.parse(storedProfile)
  if (storedPredictions) predictions.value = JSON.parse(storedPredictions)
})

const scrollToProfile = (id: string) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}


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
    title: 'Salud mental según nivel de uso de redes sociales',
    description:
      'Explora si tu tiempo en línea disminuye tu conexión con amigos o familiares en la vida real.',
    image: question1,
    route: '/mental_health_by_usage_boxplot',
  },
  {
    title:
      '¿A qué grupo de adictos a las redes sociales perteneces según tu edad, nivel de adicción y uso diario?',
    description:
      'Pregunta si tu hábito de estar siempre en línea está generando tensiones o conflictos con tu pareja.',
    image: question2,
    route: '/daily_hours_addicted_age_relation',
  },
  {
    title: '¿Tu nivel de adicción a las redes sociales te trae conflictos?',
    description:
      'Indaga si el uso excesivo del celular genera discusiones frecuentes con tu pareja o amigos.',
    image: question3,
    route: '/social_media_addiction_conflicts',
  },
  {
    title: '¿Que tanto influye las horas de sueno en tu salud mental?',
    description:
      'Evalúa el impacto emocional de una relación conflictiva y cómo esta afecta a tu descanso nocturno.',
    image: question4,
    route: '/slepp_hours_affect_mental_health',
  },
  {
    title: '¿Tu uso de redes sociales afecta tus horas de sueño?',
    description:
      'Analiza si el uso constante de plataformas digitales se asocia con un aumento de problemas personales.',
    image: question5,
    route: '/less_sleep_more_social_medias',
  },
  {
    title: '¿Las redes sociales te aíslan?',
    description:
      'Evalúa si la intensidad de tu uso digital puede predecir o afectar tu bienestar psicológico.',
    image: question6,
    route: '/social_media_mental_health',
  },
  {
    title: '¿Estar en una relacion afecta el rendimiento academico?',
    description:
      'Analiza cómo el uso constante de lo digital puede afectar tu descanso y salud mental.',
    image: question7,
    route: '/relations_affect_academy_preformance',
  },
  {
    title: '¿Estar en un estado de relacion complicado pasas menos horas de sueño?',
    description:
      'Explora si el tener una relación sentimental afecta negativamente tu desempeño académico.',
    image: question8,
    route: '/less_sleep_in_complicated_relationships',
  },
  {
    title: '¿Tu uso en redes sociales afecta tu rendimiento académico?',
    description:
      'Indaga si la obsesión por estar conectado interfiere con tu capacidad para estudiar o concentrarte.',
    image: question9,
    route: '/social_media_impact_academics',
  },
])
</script>

<style scoped>
/* Puedes poner esto en App.vue, main.css o tu layout */
.shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shine 2.5s ease-in-out infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

</style>
