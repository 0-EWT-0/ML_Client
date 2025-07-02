import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ResponseHelper } from '@/types/ResponseHelper'
import type { RequestOptions } from '@/types/RequestOptions'

const baseURL = import.meta.env.VITE_URL_API || 'https://flaskapi-ml.onrender.com'

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
})

export async function GenericRequest<T>({
  url,
  method,
  headers,
  params,
  data,
}: RequestOptions): Promise<ResponseHelper<T> | null> {
  try {
    const config: AxiosRequestConfig = {
      url: `${baseURL}/${url}`,
      method,
      headers: headers ? { 'Content-Type': headers } : { 'Content-Type': 'application/json' },
      params,
      data,
    }

    const response = await axiosInstance(config)
    return response.data as ResponseHelper<T>
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      console.error(`Request failed: ${error.message}`, error.response?.data)
    } else {
      console.error('Unknown error:', error)
    }
    return null
  }
}
// GenericRequest function to handle API requests
