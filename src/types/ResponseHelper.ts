export interface ResponseHelper<T> {
  plot_base64: string
  success: boolean
  message: string
  data: T
}
