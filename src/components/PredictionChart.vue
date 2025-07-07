<!-- src/components/PredictionChart.vue -->
<template>
  <Bar :data="chartData" :options="chartOptions" class="w-full" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  addicted: number
  academicImpact: boolean
  mentalHealth: number
}>()

const chartData = {
  labels: ['Adicción', 'Salud Mental'],
  datasets: [
    {
      label: 'Predicciones del Usuario',
      backgroundColor: '#a78bfa',
      borderRadius: 8,
      data: [props.addicted, props.mentalHealth],
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 20,
      ticks: { color: '#c4b5fd' },
    },
    x: {
      ticks: { color: '#c4b5fd' },
    },
  },
}
</script>
