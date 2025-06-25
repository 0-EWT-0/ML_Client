<template>
  <footer class="bg-gray-900/50 border-t border-gray-800/50 py-10">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400 mb-4 md:mb-0">
          © {{ new Date().getFullYear() }} Synaptica. All rights reserved.
        </p>
        <div class="flex space-x-6">
          <a
            href="#"
            class="text-sm text-gray-400 hover:text-purple-500 transition-colors duration-300"
            >Privacy Policy</a
          >
          <a
            href="#"
            class="text-sm text-gray-400 hover:text-purple-500 transition-colors duration-300"
            >Terms of Service</a
          >
          <a
            href="#"
            class="text-sm text-gray-400 hover:text-purple-500 transition-colors duration-300"
            >Contact Us</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
