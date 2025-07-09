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

// Obtener datos del usuario desde el localStorage
const storedProfile = localStorage.getItem('profileData')
const userData = storedProfile ? JSON.parse(storedProfile) : {}

const chartData = {
  labels: ['Adicción', 'Salud Mental'],
  datasets: [
    {
      label: 'Predicción del Modelo',
      backgroundColor: '#a78bfa', // Morado claro
      borderRadius: 8,
      data: [props.addicted, props.mentalHealth],
    },
    {
      label: 'Datos del Usuario',
      backgroundColor: '#f59e0b', // Amarillo
      borderRadius: 8,
      data: [userData?.addicted_score ?? 0, userData?.mental_health_score ?? 0],
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#e5e5e5',
      },
    },
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
