export interface PredictionResponse {
  prediction_mental_health: number
  prediction_conflicts: number
  plot_base64: string
  coefficient_mental: number
  coefficient_conflicts: number
  is_in_relationship?: string;
  sleepHours: number
}
