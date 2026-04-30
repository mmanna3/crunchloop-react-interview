const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest(url: string, options?: RequestInit) {
  return fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
}

async function handleError(response: Response): Promise<never> {
  let message = response.statusText
  try {
    const body = await response.json()
    if (body?.message) message = body.message
  } catch { /* no JSON body */ }

  throw new ApiError(response.status, message)
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await apiRequest(url, options)
  if (!response.ok) return handleError(response)
  return response.json()
}

export async function fetcherVoid(url: string, options?: RequestInit): Promise<void> {
  const response = await apiRequest(url, options)
  if (!response.ok) return handleError(response)
}