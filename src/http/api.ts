import { useAuthStore } from '@/stores/auth.store'

enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

function makeRequest(
  method: RequestMethods,
  apiBaseUrl = '',
): <T, TBody = object>(uri: string, body?: TBody, options?: RequestInit) => Promise<T> {
  return async (uri, body, options = {}) => {
    const auth = useAuthStore()
    const token = auth.token
    const requestUrl = `${apiBaseUrl}${uri}`
    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })

    if (response.status === 401) {
      auth.logout()
      throw new Error(`${method} request to ${requestUrl} failed with status ${response.status}`)
    }

    if (!response.ok) {
      throw new Error(`${method} request to ${requestUrl} failed with status ${response.status}`)
    }

    return response.json()
  }
}

const newApi = (apiBaseUrl?: string) => ({
  get: makeRequest(RequestMethods.GET, apiBaseUrl),
  post: makeRequest(RequestMethods.POST, apiBaseUrl),
  put: makeRequest(RequestMethods.PUT, apiBaseUrl),
  patch: makeRequest(RequestMethods.PATCH, apiBaseUrl),
  delete: makeRequest(RequestMethods.DELETE, apiBaseUrl),
})

export const api = newApi(import.meta.env.API_URL)
