import { apiFetch, removerToken, salvarToken } from './api'
import type {
  LoginRequest,
  LoginResponse,
  UsuarioAutenticado
} from '../types/auth'

const USUARIO_STORAGE_KEY = 'sge_usuario'

function salvarUsuario(usuario: UsuarioAutenticado): void {
  localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario))
}

export function obterUsuarioSalvo(): UsuarioAutenticado | null {
  const usuarioJson = localStorage.getItem(USUARIO_STORAGE_KEY)

  if (!usuarioJson) {
    return null
  }

  try {
    return JSON.parse(usuarioJson) as UsuarioAutenticado
  } catch {
    localStorage.removeItem(USUARIO_STORAGE_KEY)
    return null
  }
}

function removerUsuario(): void {
  localStorage.removeItem(USUARIO_STORAGE_KEY)
}

export const authService = {
  async login(dados: LoginRequest): Promise<LoginResponse> {
    const resposta = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dados)
    })

    salvarToken(resposta.token)
    salvarUsuario(resposta.usuario)

    return resposta
  },

  async me(): Promise<UsuarioAutenticado> {
    const usuario = await apiFetch<UsuarioAutenticado>('/auth/me', {
      method: 'GET'
    })

    salvarUsuario(usuario)

    return usuario
  },

  logout(): void {
    removerToken()
    removerUsuario()
  }
}