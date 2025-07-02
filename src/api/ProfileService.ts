import type { Profile } from '@/types/profile'
import { GenericRequest } from './GenericRequest'
import type { ResponseHelper } from '@/types/ResponseHelper'

const urlBase = 'data'

export async function getProfile(username: string): Promise<ResponseHelper<Profile> | null> {
  return await GenericRequest<Profile>({
    url: `${urlBase}/${username}`,
    method: 'GET',
  })
}
export async function postProfile(profile: Profile) {
  return await GenericRequest<Profile>({
    url: `${urlBase}`,
    method: 'POST',
    data: {
      age: profile.age,
      gender: profile.gender,
      academic_level: profile.academic_level,
      country: profile.country,
      avg_daily_usage_hours: profile.avg_daily_usage_hours,
      most_used_platform: profile.most_used_platform,
      sleep_hours_per_night: profile.sleep_hours_per_night,
      relationship_status: profile.relationship_status,
      conflicts_over_social_media: profile.conflicts_over_social_media,
    },
  })
}
//servicio para crear un perfil
