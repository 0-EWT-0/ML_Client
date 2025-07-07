<template>
  <div class="p-4 max-w-6xl mx-auto">
    <h2 class="text-4xl md:text-5xl font-extrabold text-center mb-6 text-purple-500 tracking-tight">
      ¿Las redes sociales afectan tu rendimiento académico?
    </h2>

    <div class="bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/40">
      <div class="flex flex-col md:flex-row items-center justify-center gap-6">
        <TreeChart></TreeChart>

        <div class="text-white text-sm md:text-base max-w-md">
          <Profile></Profile>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTreeStore } from '@/stores/TreesStore'
import TreeChart from '@/components/TreeChart.vue'
import Profile from '@/components/Profile.vue'
const treeStore = useTreeStore()

const plot = computed(() => treeStore.academicImpact.plot_base64)
const prediction = computed(() => treeStore.academicImpact.prediction)
</script>
