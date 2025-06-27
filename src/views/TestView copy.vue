<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center py-8">
    <!-- Questionnaire Section -->
    <section class="container mx-auto px-6">
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
        </div>

        <!-- Question -->
        <div class="bg-gray-900/50 rounded-2xl p-8 border border-gray-800/50">
          <h2 class="text-2xl font-semibold text-purple-500 mb-4">
            Pregunta {{ currentQuestionIndex + 1 }}
          </h2>
          <p class="text-lg text-gray-300 mb-6">{{ questions[currentQuestionIndex].text }}</p>

          <!-- Input Types -->
          <div v-if="questions[currentQuestionIndex].type === 'text'" class="mb-6">
            <input
              v-model="answers[currentQuestionIndex]"
              type="text"
              class="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Escribe tu respuesta"
            />
          </div>
          <div v-else-if="questions[currentQuestionIndex].type === 'number'" class="mb-6">
            <input
              v-model.number="answers[currentQuestionIndex]"
              type="number"
              class="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Ingresa un número"
            />
          </div>
          <div v-else-if="questions[currentQuestionIndex].type === 'select'" class="mb-6">
            <select
              v-model="answers[currentQuestionIndex]"
              class="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="" disabled>Selecciona una opción</option>
              <option
                v-for="option in questions[currentQuestionIndex].options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <div v-else-if="questions[currentQuestionIndex].type === 'checkbox'" class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              <label
                v-for="option in questions[currentQuestionIndex].options"
                :key="option.name"
                class="relative group bg-gray-800/50 rounded-lg border transition-all duration-300 cursor-pointer pb-4"
                :class="{
                  'border-gray-700 grayscale-90': !answers[currentQuestionIndex]?.includes(
                    option.name,
                  ),
                  'border-purple-500 bg-purple-500/10 grayscale-0': answers[
                    currentQuestionIndex
                  ]?.includes(option.name),
                  'hover:border-purple-500/50 hover:bg-purple-500/20 hover:scale-105 transition-transform duration-500': true,
                }"
              >
                <input
                  type="checkbox"
                  :value="option.name"
                  v-model="answers[currentQuestionIndex]"
                  class="absolute opacity-0"
                />
                <img
                  :src="option.image"
                  :alt="option.name"
                  class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="p-6">
                  <h3 class="text-lg font-semibold mb-2 text-purple-400">{{ option.name }}</h3>
                  <p class="text-sm text-gray-400 leading-relaxed">{{ option.description }}</p>
                </div>
              </label>
            </div>
          </div>
          <div v-else-if="questions[currentQuestionIndex].type === 'country'" class="mb-6 relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Busca tu país..."
              @input="filterCountries"
              @focus="showDropdown = true"
              @blur="delayHideDropdown"
            />
            <div
              v-if="showDropdown && filteredCountries.length"
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
          <div v-else-if="questions[currentQuestionIndex].type === 'range'" class="mb-6">
            <input
              v-model.number="answers[currentQuestionIndex]"
              type="range"
              :min="questions[currentQuestionIndex].min"
              :max="questions[currentQuestionIndex].max"
              step="1"
              class="w-full h-2 bg-gray-800/50 rounded-full appearance-none cursor-pointer focus:outline-none"
            />
            <p class="text-sm text-gray-400 mt-2">
              Seleccionado: {{ answers[currentQuestionIndex] }}
            </p>
            <div class="mt-6 flex items-center justify-center">
              <div class="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 text-center">
                <img
                  :src="currentRangeOption.image"
                  class="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-6">
            <button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
              class="bg-gray-700 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Anterior
            </button>
            <button
              @click="nextQuestion"
              :disabled="currentQuestionIndex === questions.length - 1"
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import baby from '@/assets/imgs/icons/baby.png'
import child from '@/assets/imgs/icons/child.png'
import teenager from '@/assets/imgs/icons/teenager.png'
import adult from '@/assets/imgs/icons/adult.png'
import grandfather from '@/assets/imgs/icons/grandfather.png'

const questions = ref([
  {
    text: '¿Cuál es tu nombre completo?',
    type: 'text',
  },
  {
    text: '¿Cuántas horas duermes por noche en promedio?',
    type: 'number',
  },
  {
    text: '¿Cuál es tu nivel de energía durante el día?',
    type: 'select',
    options: ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto'],
  },
  {
    text: '¿Qué factores afectan tu calidad de sueño?',
    type: 'checkbox',
    options: [
      {
        name: 'Estrés',
        description: 'Tensión emocional que afecta el descanso.',
        image:
          'https://images.unsplash.com/photo-1509967418736-993bd4b6c0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Tecnología antes de dormir',
        description: 'Uso de dispositivos electrónicos antes de acostarse.',
        image:
          'https://images.unsplash.com/photo-1516321318423-4b6b6b6b6b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Ruido',
        description: 'Sonidos ambientales que perturban el sueño.',
        image:
          'https://images.unsplash.com/photo-1620121478247-ec786b9be246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Alimentación',
        description: 'Hábitos alimenticios que influyen en la calidad del sueño.',
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Ejercicio',
        description: 'Actividad física que impacta el descanso.',
        image:
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    text: '¿Cómo calificarías la calidad de tu sueño?',
    type: 'range',
    min: 1,
    max: 100,
    options: [
      {
        image: baby,
        range: [1, 5],
      },
      {
        image: child,
        range: [6, 15],
      },
      {
        image: teenager,
        range: [16, 30],
      },
      {
        image: adult,
        range: [31, 60],
      },
      {
        image: grandfather,
        range: [61, 100],
      },
    ],
  },
  {
    text: '¿En qué país resides?',
    type: 'country',
  },
])

const currentQuestionIndex = ref(0)
const answers = ref({})
const countries = ref([])
const searchQuery = ref('')
const showDropdown = ref(false)

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
      options.find((option) => value >= option.range[0] && value <= option.range[1]) || options[0]
    )
  }
  return {}
})

const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all')
    if (!response.ok) throw new Error('Error fetching countries')
    const data = await response.json()
    countries.value = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

const selectCountry = (countryName) => {
  answers.value[currentQuestionIndex.value] = countryName
  searchQuery.value = countryName
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
      searchQuery.value = answers.value[currentQuestionIndex.value] || ''
    } else {
      searchQuery.value = ''
    }
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    if (questions.value[currentQuestionIndex.value].type === 'country') {
      searchQuery.value = answers.value[currentQuestionIndex.value] || ''
    } else {
      searchQuery.value = ''
    }
  }
}

onMounted(() => {
  fetchCountries()
  if (questions.value[currentQuestionIndex.value].type === 'country') {
    searchQuery.value = answers.value[currentQuestionIndex.value] || ''
  }
  if (!answers.value[3]) {
    answers.value[3] = []
  }
  if (!answers.value[4]) {
    answers.value[4] = 1
  }
})
</script>

<style>
/* Custom Range Slider Styling */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #a855f7;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
  transition: all 0.2s ease;
}

input[type='range']::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(168, 85, 247, 0.3);
}

input[type='range']::-webkit-slider-runnable-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #a855f7;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
  transition: all 0.2s ease;
}

input[type='range']::-moz-range-thumb:hover {
  box-shadow: 0 0 0 6px rgba(168, 85, 247, 0.3);
}

input[type='range']::-moz-range-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}
</style>
