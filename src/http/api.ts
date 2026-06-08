import { useAuthStore } from '@/stores/auth.store'

enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const REQUEST_CACHE_TTL_MS = 3 * 60 * 1000

type CacheEntry = {
  value?: unknown
  promise?: Promise<unknown>
  expiresAt?: number
  timer?: ReturnType<typeof setTimeout>
}

const requestCache = new Map<string, CacheEntry>()

function buildCacheKey(method: RequestMethods, requestUrl: string, token: string | null) {
  return `${method}:${token ?? 'anonymous'}:${requestUrl}`
}

function clearCacheEntry(cacheKey: string) {
  const entry = requestCache.get(cacheKey)
  if (entry?.timer) {
    clearTimeout(entry.timer)
  }
  requestCache.delete(cacheKey)
}

function setCachedValue(cacheKey: string, value: unknown) {
  clearCacheEntry(cacheKey)
  const timer = setTimeout(() => {
    requestCache.delete(cacheKey)
  }, REQUEST_CACHE_TTL_MS)

  requestCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + REQUEST_CACHE_TTL_MS,
    timer,
  })
}

function makeRequest(method: RequestMethods, apiBaseUrl = '') {
  return async <T, TBody = object>(
    uri: string,
    body?: TBody,
    options: RequestInit = {},
  ): Promise<T> => {
    const auth = useAuthStore()
    const token = auth.token
    const requestUrl = `${apiBaseUrl}${uri}`
    const isCacheableGet = method === RequestMethods.GET
    const cacheKey = isCacheableGet ? buildCacheKey(method, requestUrl, token) : ''

    if (isCacheableGet) {
      const cached = requestCache.get(cacheKey)
      if (cached?.promise) {
        return cached.promise as Promise<T>
      }

      if (cached?.value !== undefined) {
        if (!cached.expiresAt || cached.expiresAt > Date.now()) {
          return Promise.resolve(cached.value) as Promise<T>
        }

        clearCacheEntry(cacheKey)
      }
    }

    const requestPromise = (async () => {
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
    })()

    if (isCacheableGet) {
      const sharedPromise = requestPromise
        .then((result) => {
          setCachedValue(cacheKey, result)
          return result
        })
        .catch((error) => {
          clearCacheEntry(cacheKey)
          throw error
        })

      requestCache.set(cacheKey, {
        promise: sharedPromise,
      })
      return sharedPromise as Promise<T>
    }

    const result = await requestPromise
    for (const key of requestCache.keys()) {
      clearCacheEntry(key)
    }
    return result
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
