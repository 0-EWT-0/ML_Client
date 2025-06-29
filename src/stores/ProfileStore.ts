import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProfile, postProfile } from '@/api/ProfileService';
import type { Profile } from '@/types/profile';
import type { ResponseHelper } from '@/types/ResponseHelper';

export const useProfileStore = defineStore('Profile', () => {
  const profile = ref<Profile>({} as Profile);

  // Obtener un perfil por usernameeee
  async function GetStoreProfile(username: string): Promise<ResponseHelper<Profile> | null> {
    const response = await getProfile(username);
    if (response?.success) {
      profile.value = response.data;
    }
    return response;
  }

  // Crear un nuevo perfil
  async function PostStoreProfile(profileData: Profile): Promise<ResponseHelper<Profile> | null> {
    const response = await postProfile(profileData);
    if (response?.success) {
      profile.value = response.data; // Actualizar el perfil actual
    }
    return response;
  }

  return {
    profile,
    GetStoreProfile,
    PostStoreProfile,
  };
});
