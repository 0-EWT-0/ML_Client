<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center py-8">
    <!-- Questionnaire Section -->
    <section class="container mx-auto px-6 min-h-screen">
      <div class="max-w-2xl mx-auto">
        <!-- Progress Bar -->
        <div class="mb-8">
          <p class="text-sm text-gray-400 mb-2">
            Pregunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}
          </p>
          <div class="w-full bg-gray-800/50 rounded-full h-2">
            <div
              class="bg-purple-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"
            ></div>
          </div>

          <!-- Navigation Buttonssss -->
          <div class="flex justify-between mt-6">
            <button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
              class="bg-gray-700 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Anterior
            </button>
            <button
              v-if="currentQuestionIndex < questions.length - 1"
              @click="nextQuestion"
              :disabled="!isCurrentAnswerValid"
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>

            <button
              v-else
              @click="submitAnswers"
              :disabled="!isCurrentAnswerValid || isSubmitting"
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg
                  class="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando
              </span>
              <span v-else>Enviar</span>
            </button>
          </div>
        </div>

        <!-- Question -->
        <div class="bg-gray-900/50 rounded-2xl p-8 border border-gray-800/50">
          <h2 class="text-2xl font-semibold text-purple-500 mb-4">
            Pregunta {{ currentQuestionIndex + 1 }}
          </h2>
          <p class="text-lg text-gray-300 mb-6">{{ questions[currentQuestionIndex].text }}</p>

          <!-- Input Types -->
          <div v-if="questions[currentQuestionIndex].type === 'range'" class="mb-6">
            <input
              v-model.number="answers[currentQuestionIndex]"
              type="range"
              :min="questions[currentQuestionIndex].min"
              :max="questions[currentQuestionIndex].max"
              step="1"
              class="w-full h-2 rounded-full appearance-none bg-gray-700 cursor-pointer focus:outline-none"
            />
            <h2 class="text-3xl font-semibold text-purple-500 mt-2 text-center">
              {{ answers[currentQuestionIndex] }}
            </h2>
            <p class="text-sm text-gray-400 leading-relaxed"></p>
            <div class="mt-6 flex items-center justify-center">
              <div
                class="rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-500"
              >
                <img
                  :src="currentRangeOption.image"
                  :alt="
                    'label' in currentRangeOption && currentRangeOption.label !== undefined
                      ? currentRangeOption.label
                      : 'name' in currentRangeOption && currentRangeOption.name
                        ? currentRangeOption.name
                        : ''
                  "
                  class="w-full h-32 object-contain rounded-t-md mb-4"
                />
                <span class="text-sm font-medium text-center text-gray-300">{{
                  'label' in currentRangeOption
                    ? currentRangeOption.label
                    : 'name' in currentRangeOption
                      ? currentRangeOption.name
                      : ''
                }}</span>
              </div>
            </div>
          </div>
          <div
            v-else-if="questions[currentQuestionIndex].type === 'checkbox'"
            class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <label
              v-for="option in questions[currentQuestionIndex].options"
              :key="option.type === 'checkbox' ? option.name : option.label"
              class="relative group bg-gray-800/50 rounded-lg border transition-all duration-300 cursor-pointer pb-4"
              :class="{
                'border-gray-700 grayscale-90':
                  option.type === 'checkbox' &&
                  (questions[currentQuestionIndex].multiple
                    ? !(
                        Array.isArray(answers[currentQuestionIndex]) &&
                        (answers[currentQuestionIndex] as string[]).includes(option.name)
                      )
                    : answers[currentQuestionIndex] !== option.name),
                'border-purple-500 bg-purple-500/10 grayscale-0':
                  option.type === 'checkbox' &&
                  (questions[currentQuestionIndex].multiple
                    ? Array.isArray(answers[currentQuestionIndex]) &&
                      (answers[currentQuestionIndex] as string[]).includes(option.name)
                    : answers[currentQuestionIndex] === option.name),
                'hover:border-purple-500/50 hover:bg-purple-500/20 hover:scale-105 transition-transform duration-500': true,
              }"
            >
              <input
                v-if="option.type === 'checkbox' && questions[currentQuestionIndex].multiple"
                type="checkbox"
                :value="option.name"
                v-model="answers[currentQuestionIndex]"
                class="absolute opacity-0"
              />
              <input
                v-else-if="option.type === 'checkbox'"
                type="radio"
                :value="option.name"
                v-model="answers[currentQuestionIndex]"
                class="absolute opacity-0"
              />
              <div class="flex flex-col items-center">
                <img
                  :src="option.image"
                  :alt="option.type === 'checkbox' ? option.name : (option.label ?? '')"
                  class="w-full h-32 object-contain rounded-t-md mb-2"
                />
                <span class="text-sm font-medium text-center text-purple-500">{{
                  option.type === 'checkbox' ? option.name : (option.label ?? '')
                }}</span>
              </div>
            </label>
          </div>
          <div v-else-if="questions[currentQuestionIndex].type === 'country'" class="mb-6 relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              :placeholder="
                questions[currentQuestionIndex].type === 'country'
                  ? 'Busca tu país...'
                  : 'Ingresa tu nombre de usuario...'
              "
              @input="
                questions[currentQuestionIndex].type === 'country'
                  ? filterCountries()
                  : (answers[currentQuestionIndex] = searchQuery)
              "
              @focus="
                questions[currentQuestionIndex].type === 'country' ? (showDropdown = true) : null
              "
              @blur="
                questions[currentQuestionIndex].type === 'country' ? delayHideDropdown() : null
              "
            />
            <div
              v-if="
                showDropdown &&
                filteredCountries.length &&
                questions[currentQuestionIndex].type === 'country'
              "
              class="absolute z-10 w-full bg-gray-800/90 border border-gray-700 rounded-lg mt-1 max-h-64 overflow-y-auto"
            >
              <div
                v-for="country in filteredCountries"
                :key="country.cca3"
                @click="selectCountry(country.name.common)"
                class="flex items-center p-3 hover:bg-purple-500/20 cursor-pointer transition-colors"
              >
                <img
                  :src="country.flags.png"
                  :alt="`${country.name.common} flag`"
                  class="w-6 h-4 mr-2 object-cover"
                />
                <span class="text-gray-300">{{ country.name.common }}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-400 mt-2">
          El tiempo de respuesta del formulario puede durar mas de 50seg al enviar (se utliza la
          capa gratuita de la nube | proyecto experimental)
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserForm' })
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import instagram from '@/assets/imgs/social_media/Instagram.png'
import tiktok from '@/assets/imgs/social_media/Tiktok.png'
import facebook from '@/assets/imgs/social_media/Facebook.png'
import youtube from '@/assets/imgs/social_media/Youtube.png'
import x from '@/assets/imgs/social_media/X.png'
import linkedin from '@/assets/imgs/social_media/LinkedIn.png'
import snapchat from '@/assets/imgs/social_media/Snapchat.png'
import line from '@/assets/imgs/social_media/Line.png'
import kakaotalk from '@/assets/imgs/social_media/Kakaotalk.png'
import vkontakte from '@/assets/imgs/social_media/VK.png'
import wechat from '@/assets/imgs/social_media/WeChat.png'
import whatsapp from '@/assets/imgs/social_media/Whatsapp.png'
import baby from '@/assets/imgs/icons/baby.png'
import child from '@/assets/imgs/icons/child.png'
import teenager from '@/assets/imgs/icons/teenager.png'
import adult from '@/assets/imgs/icons/adult.png'
import grandfather from '@/assets/imgs/icons/grandfather.png'
import male from '@/assets/imgs/icons/male.png'
import female from '@/assets/imgs/icons/female.png'
import highSchool from '@/assets/imgs/icons/highSchool.png'
import undergraduate from '@/assets/imgs/icons/undergraduate.png'
import graduate from '@/assets/imgs/icons/graduate.png'
import single from '@/assets/imgs/icons/single.png'
import relationship from '@/assets/imgs/icons/relationship.png'
import complicated from '@/assets/imgs/icons/complicated.png'
import mood1 from '@/assets/imgs/icons/mood1.png'
import mood2 from '@/assets/imgs/icons/mood2.png'
import mood3 from '@/assets/imgs/icons/mood3.png'
import dormir1 from '@/assets/imgs/icons/dormir1.png'
import dormir2 from '@/assets/imgs/icons/dormir2.png'
import dormir3 from '@/assets/imgs/icons/dormir3.png'
import { useProfileStore } from '@/stores/ProfileStore.ts'
import type { Profile } from '@/types/profile.ts'
import conflicts0 from '@/assets/imgs/icons/conflicts0.png'
import conflicts1 from '@/assets/imgs/icons/conflicts1.png'
import conflicts2 from '@/assets/imgs/icons/conflicts2.png'
import conflicts3 from '@/assets/imgs/icons/conflicts3.png'

const profileStore = useProfileStore()
const { PostStoreProfile } = profileStore

const router = useRouter()

interface RangeOption {
  type: 'range'
  label: string
  image: string
  range: number[]
}

interface NameOption {
  type: 'checkbox'
  name: string
  image: string
}

type QuestionOption = RangeOption | NameOption

interface Question {
  text: string
  type: 'range' | 'checkbox' | 'country'
  multiple?: boolean
  min?: number
  max?: number
  options?: QuestionOption[]
}

const questions = ref<Question[]>([
  {
    text: '¿Cuántos años tienes?',
    type: 'range',
    min: 1,
    max: 100,
    options: [
      { type: 'range', label: 'Bebé', image: baby, range: [1, 5] },
      { type: 'range', label: 'Niño', image: child, range: [6, 14] },
      { type: 'range', label: 'Adolescente', image: teenager, range: [15, 20] },
      { type: 'range', label: 'Adulto', image: adult, range: [21, 60] },
      { type: 'range', label: 'Adulto mayor', image: grandfather, range: [61, 100] },
    ],
  },
  {
    text: '¿Cuál es tu género?',
    type: 'checkbox',
    multiple: false,
    options: [
      { type: 'checkbox', name: 'Masculino', image: male },
      { type: 'checkbox', name: 'Femenino', image: female },
    ],
  },
  {
    text: '¿Cuál es tu nivel académico?',
    type: 'checkbox',
    multiple: false,
    options: [
      { type: 'checkbox', name: 'Secundaria', image: highSchool },
      { type: 'checkbox', name: 'Licenciatura', image: undergraduate },
      { type: 'checkbox', name: 'Graduado', image: graduate },
    ],
  },
  {
    text: '¿En qué país resides?',
    type: 'country',
  },
  {
    text: '¿Cuántas horas pasas en redes sociales?',
    type: 'range',
    min: 1,
    max: 24,
    options: [
      { type: 'range', label: 'Bajo uso', image: mood1, range: [1, 8] },
      { type: 'range', label: 'Uso moderado', image: mood2, range: [9, 16] },
      { type: 'range', label: 'Alto uso', image: mood3, range: [17, 24] },
    ],
  },
  {
    text: '¿Qué red social usas con mayor frecuencia?',
    type: 'checkbox',
    multiple: false,
    options: [
      { type: 'checkbox', name: 'Instagram', image: instagram },
      { type: 'checkbox', name: 'Tiktok', image: tiktok },
      { type: 'checkbox', name: 'Facebook', image: facebook },
      { type: 'checkbox', name: 'Youtube', image: youtube },
      { type: 'checkbox', name: 'X/Twitter', image: x },
      { type: 'checkbox', name: 'LinkedIn', image: linkedin },
      { type: 'checkbox', name: 'Snapchat', image: snapchat },
      { type: 'checkbox', name: 'Line', image: line },
      { type: 'checkbox', name: 'KakaoTalk', image: kakaotalk },
      { type: 'checkbox', name: 'Vkontakte', image: vkontakte },
      { type: 'checkbox', name: 'WeChat', image: wechat },
      { type: 'checkbox', name: 'WhatsApp', image: whatsapp },
    ],
  },
  {
    text: '¿Cuántas horas duermes al día?',
    type: 'range',
    min: 1,
    max: 24,
    options: [
      { type: 'range', label: 'Sueño corto', image: dormir3, range: [1, 7] },
      { type: 'range', label: 'Sueño moderado', image: dormir2, range: [8, 16] },
      { type: 'range', label: 'Sueño largo', image: dormir1, range: [17, 24] },
    ],
  },
  {
    text: '¿Cuál es tu situación sentimental?',
    type: 'checkbox',
    multiple: false,
    options: [
      { type: 'checkbox', name: 'Soltero', image: single },
      { type: 'checkbox', name: 'En relación', image: relationship },
      { type: 'checkbox', name: 'Complicado', image: complicated },
    ],
  },
  {
    text: '¿Cuántos conflictos has tenido en redes sociales?',
    type: 'range',
    min: 0,
    max: 10,
    options: [
      { type: 'range', label: 'Sin conflictos', image: conflicts0, range: [0, 1] },
      { type: 'range', label: 'Pocos conflictos', image: conflicts1, range: [2, 3] },
      { type: 'range', label: 'Varios conflictos', image: conflicts2, range: [4, 7] },
      { type: 'range', label: 'Muchos conflictos', image: conflicts3, range: [8, 10] },
    ],
  },
] as const)

const currentQuestionIndex = ref(0)
type Answer = string | number | string[] | undefined
const answers = ref<Answer[]>(Array(9).fill(undefined))
interface Country {
  name: { common: string }
  cca3: string
  flags: { png: string }
}
const countries = ref<Country[]>([])
const searchQuery = ref('')
const showDropdown = ref(false)
const error = ref('')
const message = ref('')
const isSubmitting = ref(false)

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value
  return countries.value.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const currentRangeOption = computed(() => {
  if (questions.value[currentQuestionIndex.value].type === 'range') {
    const value = answers.value[currentQuestionIndex.value] || 1
    const options = questions.value[currentQuestionIndex.value].options
    return (
      (options &&
        options.find(
          (option) =>
            option.type === 'range' &&
            typeof value === 'number' &&
            value >= option.range[0] &&
            value <= option.range[1],
        )) ||
      (options && options[0]) || { label: '', image: '' }
    )
  }
  return { label: '', image: '' }
})

const isCurrentAnswerValid = computed(() => {
  const answer = answers.value[currentQuestionIndex.value]
  const question = questions.value[currentQuestionIndex.value]

  if (question.type === 'range') {
    return typeof answer === 'number'
  } else if (question.type === 'checkbox') {
    if (question.multiple) {
      return Array.isArray(answer) && answer.length > 0
    } else {
      return typeof answer === 'string' && answer !== ''
    }
  } else if (question.type === 'country') {
    return typeof answer === 'string' && answer !== ''
  }
  return false
})

const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/independent?status=true')
    if (!response.ok) throw new Error('Error fetching countries')
    const data = await response.json()
    countries.value = data.sort(
      (a: { name: { common: string } }, b: { name: { common: string } }) =>
        a.name.common.localeCompare(b.name.common),
    )
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

const selectCountry = (countryName: Answer) => {
  answers.value[currentQuestionIndex.value] = countryName
  searchQuery.value = (countryName as string) || ''
  showDropdown.value = false
}

const filterCountries = () => {
  showDropdown.value = true
}

const delayHideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    if (questions.value[currentQuestionIndex.value].type === 'country') {
      searchQuery.value = (answers.value[currentQuestionIndex.value] as string) || ''
    } else {
      searchQuery.value = ''
    }
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    if (questions.value[currentQuestionIndex.value].type === 'country') {
      searchQuery.value = (answers.value[currentQuestionIndex.value] as string) || ''
    } else {
      searchQuery.value = ''
    }
  }
}

const submitAnswers = async () => {
  try {
    isSubmitting.value = true

    const genderValue = answers.value[1] as string | undefined
    const academicValue = answers.value[2] as string | undefined
    const relationshipValue = answers.value[7] as string | undefined
    const platformValue = answers.value[5]

    const genderMap: Record<string, string> = { Masculino: 'male', Femenino: 'female' }
    const academicMap: Record<string, string> = {
      Secundaria: 'highschool',
      Licenciatura: 'undergraduate',
      Graduado: 'graduate',
    }
    const relationshipMap: Record<string, string> = {
      Soltero: 'single',
      'En relación': 'in relationship',
      Complicado: 'complicated',
    }
    const platformMap: Record<string, string> = {
      Instagram: 'instagram',
      Tiktok: 'tiktok',
      Facebook: 'facebook',
      Youtube: 'youtube',
      'X/Twitter': 'twitter',
      LinkedIn: 'linkedin',
      Snapchat: 'snapchat',
      Line: 'line',
      KakaoTalk: 'kakaotalk',
      Vkontakte: 'vkontakte',
      WeChat: 'wechat',
      WhatsApp: 'whatsapp',
    }

    const profile: Profile = {
      age: (answers.value[0] as number | undefined) ?? 0,
      gender: genderValue ? (genderMap[genderValue] ?? '') : '',
      academic_level: academicValue ? (academicMap[academicValue] ?? '') : '',
      country: (answers.value[3] as string | undefined) ?? '',
      avg_daily_usage_hours: (answers.value[4] as number | undefined) ?? 0,
      most_used_platform: Array.isArray(platformValue)
        ? (platformValue as string[])
            .map((name) => platformMap[name] || name.toLowerCase())
            .join(', ')
        : typeof platformValue === 'string' && platformValue
          ? (platformMap[platformValue] ?? platformValue.toLowerCase())
          : '',
      sleep_hours_per_night: (answers.value[6] as number | undefined) ?? 0,
      relationship_status: relationshipValue ? (relationshipMap[relationshipValue] ?? '') : '',
      conflicts_over_social_media: (answers.value[8] as number | undefined) ?? 0,
      isCompletedForm: true,
    }

    console.log('Profile sent to PostStoreProfile:', profile)
    const response = await PostStoreProfile(profile)
    console.log('PostStoreProfile response:', response)

    if (response && response.success) {
      console.log('Success response received, redirecting to /success')
      message.value = response.message || '¡Perfil enviado con éxito!'
      error.value = ''
      router.push('/success')
    } else {
      console.log('Response not successful:', response?.message)
      error.value = response?.message || 'Error al enviar el perfil'
      message.value = ''
    }
  } catch (err) {
    console.error('Error in submitAnswers:', err)
    error.value = 'Error inesperado al enviar el perfil'
    message.value = ''
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCountries()
  if (questions.value[currentQuestionIndex.value].type === 'country') {
    searchQuery.value = (answers.value[currentQuestionIndex.value] as string) || ''
  }
  // Initialize answers for checkbox questions
  if (!answers.value[1]) answers.value[1] = questions.value[1].multiple ? [] : ''
  if (!answers.value[2]) answers.value[2] = questions.value[2].multiple ? [] : ''
  if (!answers.value[5]) answers.value[5] = questions.value[5].multiple ? [] : ''
  if (!answers.value[7]) answers.value[7] = questions.value[7].multiple ? [] : ''
  // Initialize answers for range questions
  if (!answers.value[0]) answers.value[0] = 1 // Age
  if (!answers.value[4]) answers.value[4] = 1 // Avg_Daily_Usage_Hours
  if (!answers.value[6]) answers.value[6] = 1 // Sleep_Hours_Per_Night
  if (!answers.value[8]) answers.value[8] = 0 // Conflicts_Over_Social_Media
  // Initialize answers for country question
  if (!answers.value[3]) answers.value[3] = '' // Country
})
</script>

<style scoped>
/* Custom Range Slider Styling */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #a855f7;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
  transition: all 0.2s ease;
}
</style>
