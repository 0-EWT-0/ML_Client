<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Header (asumimos que ya lo tienes como componente) -->
    <Header />

    <!-- Main Product Section -->
    <section class="container mx-auto px-6 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Gráfica -->
        <div class="relative rounded-2xl overflow-hidden border border-gray-800/50">
          <div class="w-full h-[500px] bg-gray-900 flex items-center justify-center">
            <Bar v-if="showGraph" :data="chartData" :style="{ height: '100%', width: '100%' }" />
            <p v-else class="text-gray-400 text-center">Cargando gráfica...</p>
          </div>
        </div>
        <!-- Product Info -->
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-extrabold text-purple-500 tracking-tight">
            Relación Horas Diarias/Adicción/Edad
          </h1>
          <p class="text-base text-gray-400 leading-relaxed">
            Explora cómo el nivel de adicción, el hábito de uso diario en redes sociales y la edad influyen en tu perfil digital. Esta herramienta analiza patrones de dependencia y engagement en comunidades online.
          </p>
          <button
            @click="fetchRelation"
            class="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Cargando...' : 'Generar Relación' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Product Details Section -->
    <section class="container mx-auto px-6 py-16 bg-gray-900/50 border-y border-gray-800/50">
      <h2 ref="resultSection" class="text-3xl md:text-4xl font-extrabold text-purple-500 tracking-tight mb-8">
        Resultado y Análisis
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <li class="flex items-start space-x-4">
          <span class="text-purple-600">•</span>
          <p class="text-sm text-gray-400 leading-relaxed">
            {{ predictionResult || 'Presiona el botón para obtener un análisis personalizado de tu comportamiento digital' }}
            <span v-if="predictionStore.error" class="text-red-500">{{ predictionStore.error }}</span>
          </p>
        </li>
        <li class="flex items-start space-x-4">
          <span class="text-purple-600">•</span>
          <p class="text-sm text-gray-400 leading-relaxed">
            ¿Por qué esta gráfica tiene sentido? Esta visualización agrupa las horas diarias de uso de redes sociales por rangos de edad y categorías de adicción (grupos 0, 1 y 2), reflejando cómo la dependencia digital, los hábitos de interacción y la obsesión por las plataformas varían según la etapa de vida. Al analizar estos patrones, puedes identificar tendencias en tu nivel de engagement, rutina online y su impacto en tu rendimiento académico o estilo de vida, ofreciendo insights valiosos para ajustar tu presencia digital.
          </p>
        </li>
      </ul>
    </section>

    <!-- Footer (asumimos que ya lo tienes como componente) -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { usePredictionStore } from '@/stores/QuestionsStore';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Header from '@/components/Header.vue'; // Ajusta la ruta según tu proyecto
import Footer from '@/components/Footer.vue'; // Ajusta la ruta según tu proyecto

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const predictionStore = usePredictionStore();
const predictionResult = ref<string | null>(null);
const resultSection = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const showGraph = ref(false);

const academicLevel = ref<string>(localStorage.getItem('academic_level') || 'highschool');
const addictedScore = ref<number>(localStorage.getItem('addicted_score') ? parseFloat(localStorage.getItem('addicted_score')!) : 10.74);
const affectsAcademicPerformance = ref<number>(localStorage.getItem('affects_academic_performance') ? parseInt(localStorage.getItem('affects_academic_performance')!) : 1);
const age = ref<number>(localStorage.getItem('age') ? parseInt(localStorage.getItem('age')!) : 17);
const avgDailyUsageHours = ref<number>(localStorage.getItem('avg_daily_usage_hours') ? parseFloat(localStorage.getItem('avg_daily_usage_hours')!) : 11);
const sleepHours = ref<number>(localStorage.getItem('sleep_hours_per_night') ? parseFloat(localStorage.getItem('sleep_hours_per_night')!) : 13);

const academicImpact = computed(() => affectsAcademicPerformance.value === 1 ? 'afectado' : 'no afectado');

// Inicializar chartData con valores por defecto
const chartData = ref({
  labels: [] as string[],
  datasets: [
    { label: 'Grupo 0', backgroundColor: '#4CAF50', data: [] as number[] },
    { label: 'Grupo 1', backgroundColor: '#FF9800', data: [] as number[] },
    { label: 'Grupo 2', backgroundColor: '#F44336', data: [] as number[] }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Horas Diarias por Rango de Edad y Grupo' }
  },
  scales: {
    x: {
      title: { display: true, text: 'Rango de Edad' },
      ticks: { autoSkip: true, maxTicksLimit: 10 }
    },
    y: { beginAtZero: true, title: { display: true, text: 'Horas Diarias' } }
  }
};

onMounted(() => {
  updatePredictionResult();
});

watch(() => predictionStore.prediction, (newPrediction) => {
  if (newPrediction && newPrediction.data_points) {
    isLoading.value = false;
    showGraph.value = true;
    updateChartData(newPrediction.data_points);
    updatePredictionResult();
  } else {
    showGraph.value = false;
  }
});

const updatePredictionResult = () => {
  if (predictionStore.prediction) {
    predictionResult.value = `Relación Horas Diarias/Adicción/Edad: ${predictionStore.prediction.mental_health_score || 'N/A'}`;
  } else {
    predictionResult.value = null;
  }
};

const updateChartData = (dataPoints: any[]) => {
  if (dataPoints && dataPoints.length > 0) {
    const ageRanges = {} as { [key: string]: { [key: number]: number[]; count: number[] } };
    dataPoints.forEach((dp: any) => {
      const age = dp.age;
      const group = dp.grupo;
      const hours = dp.avg_daily_usage_hours;

      let range = '0-10';
      if (age >= 11 && age <= 20) range = '11-20';
      else if (age >= 21 && age <= 30) range = '21-30';
      else if (age >= 31 && age <= 40) range = '31-40';
      else if (age >= 41 && age <= 50) range = '41-50';
      else if (age >= 51 && age <= 60) range = '51-60';
      else if (age >= 61) range = '61+';

      if (!ageRanges[range]) {
        ageRanges[range] = { 0: [], 1: [], 2: [], count: [0, 0, 0] };
      }
      ageRanges[range][group].push(hours);
      ageRanges[range].count[group]++;
    });

    const labels = Object.keys(ageRanges).sort();
    chartData.value.labels = labels;

    chartData.value.datasets[0].data = labels.map(range =>
      ageRanges[range][0].reduce((sum, h) => sum + h, 0) / (ageRanges[range].count[0] || 1)
    );
    chartData.value.datasets[1].data = labels.map(range =>
      ageRanges[range][1].reduce((sum, h) => sum + h, 0) / (ageRanges[range].count[1] || 1)
    );
    chartData.value.datasets[2].data = labels.map(range =>
      ageRanges[range][2].reduce((sum, h) => sum + h, 0) / (ageRanges[range].count[2] || 1)
    );
  } else {
    chartData.value = {
      labels: ['Sin datos'],
      datasets: [
        { label: 'Grupo 0', backgroundColor: '#4CAF50', data: [0] },
        { label: 'Grupo 1', backgroundColor: '#FF9800', data: [0] },
        { label: 'Grupo 2', backgroundColor: '#F44336', data: [0] }
      ]
    };
  }
};

const fetchRelation = async () => {
  isLoading.value = true;
  showGraph.value = false;
  try {
    await predictionStore.getDailyHoursAddictedAgeRelation();
    if (predictionStore.error) {
      throw new Error(predictionStore.error);
    }
    updatePredictionResult();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    predictionResult.value = `Error al obtener la relación: ${errorMessage}`;
    console.error('Error en fetchRelation:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
