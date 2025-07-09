import type { Profile } from '@/types/profile'
import { GenericRequest } from './GenericRequest'
import type { PredictionResponse } from '@/types/SocialMediaMentalHealth'

const urlBase = 'predict'

export async function getMental_health_by_usage_boxplot() {
  return await GenericRequest({
    url: `${urlBase}/mental_health_by_usage_boxplot`,
    method: 'GET',
  })
}

export async function getDaily_hours_addicted_age_relation() {
  return await GenericRequest({
    url: `${urlBase}/daily_hours_addicted_age_relation`,
    method: 'GET',
  })
}

export async function postSocial_media_addiction_conflicts(prediction: PredictionResponse) {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/social_media_addiction_conflicts`,
    method: 'POST',
    data: {
      addicted_score: prediction.addicted_score,
    },
  })
}

export async function postSlepp_hours_affect_mental_health(prediction: PredictionResponse) {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/avg_daily_usage_hours`,
    method: 'POST',
    data: {
      sleep_hours: prediction.sleep_hours,
      mental_health_score: prediction.mental_health_score,
    },
  })
}

export async function postLess_sleep_more_social_media(prediction: PredictionResponse) {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/less_sleep_more_social_media`,
    method: 'POST',
    data: {
      media_hours: prediction.media_hours,
    },
  })
}

// Social Media Mental Health (Ya esta hecho en RegressionLinearService.ts)

export async function postRelations_affect_academy_preformance(profile: Profile) {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/academic_impact`,
    method: 'POST',
    data: {
      relationship_status: profile.relationship_status,
    },
  })
}

export async function postLess_sleep_in_complicated_relationships(prediction: PredictionResponse) {
  return await GenericRequest<PredictionResponse>({
    url: `${urlBase}/less_sleep_relation`,
    method: 'POST',
    data: {
      sleep_hours: prediction.sleep_hours,
    },
  })
}

export async function getSocial_media_impact_academics() {
  return await GenericRequest({
    url: `${urlBase}/social_media_impact_academics`,
    method: 'GET',
  })
}
