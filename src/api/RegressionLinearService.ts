import type { Profile } from '@/types/profile'
import { GenericRequest } from './GenericRequest'
import type { ResponseHelper } from '@/types/ResponseHelper'
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth'

const urlBase = 'predict'

export async function predictSocialMediaMentalHealth(
  profile: Partial<Profile>,
  prediction: PredictionResponse
): Promise<ResponseHelper<PredictionResponse> | null> {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/social_media_mental_health`,
    method: 'POST',
    data: {
      avg_daily_usage_hours: profile.avg_daily_usage_hours,
      addicted_score: prediction.addicted_score,
    },
  })
}
