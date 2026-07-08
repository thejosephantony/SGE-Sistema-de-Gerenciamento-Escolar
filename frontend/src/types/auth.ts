export type PerfilUsuario = 'ADMINISTRADOR' | 'DOCENTE' | 'DISCENTE'

export type StatusUsuario = 'ATIVO' | 'INATIVO'

export interface UsuarioAutenticado {
  id: number
  nome: string
  email: string
  perfil: PerfilUsuario
  status: StatusUsuario
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  tipo: string
  usuario: UsuarioAutenticado
}
export interface EsqueciSenhaRequest {
  email: string
}

export interface RedefinirSenhaRequest {
  token: string
  novaSenha: string
}

export interface MensagemResponse {
  mensagem: string
}
