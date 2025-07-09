<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-xl text-center text-purple-300 font-semibold mb-2">
      Salud Mental Estimada
    </h2>
    <Doughnut :data="chartData" :options="chartOptions" />
    <p class="mt-4 text-center text-lg font-bold" :class="colorClass">
      {{ score }} / 20
    </p>
    <p class="text-sm text-gray-400 text-center mt-2">{{ interpretation }}</p>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { computed } from 'vue';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Props
const props = defineProps<{ score: number }>();

// Cálculo de interpretación y colores
const interpretation = computed(() => {
  if (props.score < 10) return 'Bienestar mental bajo';
  if (props.score < 16) return 'Bienestar mental moderado';
  return 'Bienestar mental alto';
});

const colorClass = computed(() => {
  if (props.score < 10) return 'text-red-500';
  if (props.score < 16) return 'text-yellow-400';
  return 'text-green-400';
});

// Preparar los datos para el gauge
const chartData = computed(() => {
  return {
    labels: ['Puntaje', 'Restante'],
    datasets: [
      {
        data: [props.score, 20 - props.score],
        backgroundColor: [getColor(), '#2d2d2d'],
        borderWidth: 0,
        cutout: '80%',
        rotation: -90,
        circumference: 180,
      },
    ],
  };
});

function getColor() {
  if (props.score < 10) return '#ef4444'; // rojo
  if (props.score < 16) return '#facc15'; // amarillo
  return '#22c55e'; // verde
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};
</script>

<style scoped>
canvas {
  height: 200px !important;
}
</style>