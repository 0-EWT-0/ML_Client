export interface RequestOptions {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: string
  params?: Record<string, unknown>
  data?: unknown
}
