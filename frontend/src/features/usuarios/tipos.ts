import type { PerfilUsuario } from '../autenticacao/tipos'

/**
 * Interface que representa um usuário do SGE.
 * Pode conter campos extras dependendo do perfil (Discente, Docente ou Admin).
 */
export interface Usuario {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  status: 'ATIVO' | 'INATIVO'
  
  // Detalhes específicos de Discente (Estudante)
  matricula?: string
  curso?: string

  // Detalhes específicos de Docente (Professor)
  registroDocente?: string
  titulacao?: string

  // Detalhes específicos de Administrador
  matriculaAdministrativa?: string
}
