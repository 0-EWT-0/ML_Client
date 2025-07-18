// src/types/SocialMediaMentalHealth.ts
export interface PredictionResponse {
  addicted_score: number
  affects_academic_performance: number
  mental_health_score: number
  plot_base64: string
  coefficient_mental: number
  coefficient_conflicts: number
  prediction_mental_health: number
  prediction: number
  prediction_conflicts: number
  sleep_hours: number
  media_hours: number
  is_in_relationship?: string
  data_points?: []
}
