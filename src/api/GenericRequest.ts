// src/api/GenericRequest.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ResponseHelper } from '@/types/ResponseHelper'
import type { RequestOptions } from '@/types/RequestOptions'

const baseURL = import.meta.env.VITE_URL_API || 'http://localhost:5000'

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
})

export async function GenericRequest<T>({
  url,
  method,
  headers,
  params,
  data,
}: RequestOptions): Promise<ResponseHelper<T> | T | null> {
  try {
    const config: AxiosRequestConfig = {
      url: `${baseURL}/${url}`,
      method,
      headers: headers ? { 'Content-Type': headers } : { 'Content-Type': 'application/json' },
      params,
      data,
    }

    const response = await axiosInstance(config)
    // Verificar si la respuesta incluye success/message o es un objeto plano
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data && 'message' in response.data && 'data' in response.data) {
        return response.data as ResponseHelper<T>
      }
      return response.data as T // Asumir que es el objeto plano si no hay envolvente
    }
    return null
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      console.error(`Request failed: ${error.message}`, error.response?.data)
    } else {
      console.error('Unknown error:', error)
    }
    return null
  }
}
