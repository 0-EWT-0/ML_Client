<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profileStore';
import type { Profile } from '@/types';

const profileStore = useProfileStore();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { profile, GetStoreProfile, PostStoreProfile } = profileStore;

// Estado para el formulario de creación
const newProfile = ref<Profile>({
  Age: 0,
  Gender: '',
  Academic_Level: '',
  Country: '',
  Avg_Daily_Usage_Hours: 0,
  Most_Used_Platform: '',
  Sleep_Hours_Per_Night: 0,
  Relationship_Status: '',
  Conflicts_Over_Social_Media: 0,
  username: '',
});

// Estado para buscar perfil por username
const searchUsername = ref('');
const message = ref('');
const error = ref('');

// Función para crear un perfil
async function createProfile() {
  try {
    const response = await PostStoreProfile(newProfile.value);
    if (response?.success) {
      message.value = response.message;
      error.value = '';
      // Limpiar el formulario
      newProfile.value = {
        Age: 0,
        Gender: '',
        Academic_Level: '',
        Country: '',
        Avg_Daily_Usage_Hours: 0,
        Most_Used_Platform: '',
        Sleep_Hours_Per_Night: 0,
        Relationship_Status: '',
        Conflicts_Over_Social_Media: 0,
        username: '',
      };
    } else {
      error.value = response?.message || 'Error al crear el perfil';
      message.value = '';
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    error.value = 'Error inesperado al crear el perfil';
    message.value = '';
  }
}

// Función para buscar un perfil
async function fetchProfile() {
  if (!searchUsername.value) {
    error.value = 'Por favor, ingresa un username';
    return;
  }
  try {
    const response = await GetStoreProfile(searchUsername.value);
    if (response?.success) {
      message.value = response.message;
      error.value = '';
    } else {
      error.value = response?.message || 'Error al obtener el perfil';
      message.value = '';
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    error.value = 'Error inesperado al obtener el perfil';
    message.value = '';
  }
}

// Cargar un perfil de prueba al montar el componente
onMounted(async () => {
  await fetchProfile(); // Por ejemplo, buscar "Maria" al iniciar
});
</script>

<template>
  <div class="container">
    <h1>Prueba de Perfiles</h1>

    <!-- Formulario para crear un perfil -->
    <h2>Crear Perfil</h2>
    <form @submit.prevent="createProfile">
      <div>
        <label>Edad:</label>
        <input v-model.number="newProfile.Age" type="number" required />
      </div>
      <div>
        <label>Género:</label>
        <input v-model="newProfile.Gender" type="text" required />
      </div>
      <div>
        <label>Nivel Académico:</label>
        <input v-model="newProfile.Academic_Level" type="text" required />
      </div>
      <div>
        <label>País:</label>
        <input v-model="newProfile.Country" type="text" required />
      </div>
      <div>
        <label>Horas de Uso Diario:</label>
        <input v-model.number="newProfile.Avg_Daily_Usage_Hours" type="number" step="0.1" required />
      </div>
      <div>
        <label>Plataforma Más Usada:</label>
        <input v-model="newProfile.Most_Used_Platform" type="text" required />
      </div>
      <div>
        <label>Horas de Sueño por Noche:</label>
        <input v-model.number="newProfile.Sleep_Hours_Per_Night" type="number" step="0.1" required />
      </div>
      <div>
        <label>Estado de Relación:</label>
        <input v-model="newProfile.Relationship_Status" type="text" required />
      </div>
      <div>
        <label>Conflictos por Redes Sociales:</label>
        <input v-model.number="newProfile.Conflicts_Over_Social_Media" type="number" required />
      </div>
      <div>
        <label>Username:</label>
        <input v-model="newProfile.username" type="text" required />
      </div>
      <button type="submit">Crear Perfil</button>
    </form>

    <!-- Formulario para buscar un perfil -->
    <h2>Buscar Perfil</h2>
    <div>
      <label>Username:</label>
      <input v-model="searchUsername" type="text" placeholder="Ej. Maria" />
      <button @click="fetchProfile">Buscar</button>
    </div>

    <!-- Mostrar mensajes y errores -->
    <div v-if="message" class="success">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Mostrar el perfil actual -->
    <h2>Perfil Actual</h2>
    <div v-if="profileStore.profile.username">
      <p><strong>Username:</strong> {{ profileStore.profile.username }}</p>
      <p><strong>Edad:</strong> {{ profileStore.profile.Age }}</p>
      <p><strong>Género:</strong> {{ profileStore.profile.Gender }}</p>
      <p><strong>Nivel Académico:</strong> {{ profileStore.profile.Academic_Level }}</p>
      <p><strong>País:</strong> {{ profileStore.profile.Country }}</p>
      <p><strong>Horas de Uso Diario:</strong> {{ profileStore.profile.Avg_Daily_Usage_Hours }}</p>
      <p><strong>Plataforma Más Usada:</strong> {{ profileStore.profile.Most_Used_Platform }}</p>
      <p><strong>Horas de Sueño:</strong> {{ profileStore.profile.Sleep_Hours_Per_Night }}</p>
      <p><strong>Estado de Relación:</strong> {{ profileStore.profile.Relationship_Status }}</p>
      <p><strong>Conflictos:</strong> {{ profileStore.profile.Conflicts_Over_Social_Media }}</p>
    </div>
    <div v-else>
      <p>No hay perfil cargado.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
div {
  display: flex;
  flex-direction: column;
}
button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
