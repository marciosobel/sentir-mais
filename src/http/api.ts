import { useAuthStore } from '@/stores/auth.store'

enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const auth = useAuthStore()

function makeRequest(
  method: RequestMethods,
  baseUrl?: string,
): <T, TBody = object>(uri: string, body?: TBody, options?: RequestInit) => Promise<T> {
  return async (uri, body, options = {}) => {
    const token = auth.token
    const response = await fetch(baseUrl + uri, {
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
      throw new Error(`${method} request to ${baseUrl + uri} failed with status ${response.status}`)
    }

    if (!response.ok) {
      throw new Error(`${method} request to ${baseUrl + uri} failed with status ${response.status}`)
    }

    return response.json()
  }
}

const newApi = (baseUrl?: string) => ({
  get: makeRequest(RequestMethods.GET, baseUrl),
  post: makeRequest(RequestMethods.POST, baseUrl),
  put: makeRequest(RequestMethods.PUT, baseUrl),
  patch: makeRequest(RequestMethods.PATCH, baseUrl),
  delete: makeRequest(RequestMethods.DELETE, baseUrl),
})

export const api = newApi()
