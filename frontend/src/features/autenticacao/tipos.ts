/**
 * Interfaces e Tipagens TypeScript para o módulo de Autenticação do SGE.
 */

// Perfil de acesso do usuário no sistema escolar
export type PerfilUsuario = 'ADMINISTRADOR' | 'DOCENTE' | 'DISCENTE'

// Credenciais enviadas no formulário de login
export interface Credenciais {
  email: string
  senha: string
}

// Dados do usuário logado
export interface DadosUsuario {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
}

// Resposta de sucesso retornada pelo serviço de autenticação
export interface RespostaAutenticacao {
  token: string
  usuario: DadosUsuario
}

// Erros locais de validação de formulário
export interface ErrosFormulario {
  email?: string
  senha?: string
}
