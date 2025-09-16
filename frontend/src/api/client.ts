const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function rawRequest(url: string, options: RequestInit = {}) {
  return fetch(API_BASE + url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  })
}
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let resp = await rawRequest(url, options)
  if (resp.status === 401) {
    const r = await rawRequest('/api/auth/refresh', { method: 'POST' })
    if (r.ok) {
      resp = await rawRequest(url, options)
    }
  }

  const contentType = resp.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await resp.json()
    : await resp.text()

  if (!resp.ok) {
    const msg =
      typeof data === 'object' && data && 'error' in data
        ? (data.error as string)
        : `HTTP ${resp.status}`
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: any) => request<T>(url, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T>(url: string, body?: any) => request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}