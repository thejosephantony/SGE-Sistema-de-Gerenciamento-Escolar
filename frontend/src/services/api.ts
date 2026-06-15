const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const TOKEN_STORAGE_KEY = 'sge_token'

interface ApiErrorResponse {
  message?: string
  erro?: string
  error?: string
}

export function obterToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function salvarToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function removerToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = obterToken()

  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    let mensagem = `Erro ${response.status}`

    try {
      const erro = (await response.json()) as ApiErrorResponse
      mensagem = erro.message ?? erro.erro ?? erro.error ?? mensagem
    } catch {
      // Mantém a mensagem padrão caso a resposta não tenha JSON.
    }

    throw new Error(mensagem)
  }

  return response.json() as Promise<T>
}