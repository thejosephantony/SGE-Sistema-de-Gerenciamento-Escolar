import { apiFetch } from '../../../services/api'
import type { Usuario } from '../tipos'

/**
 * Obtém todos os usuários cadastrados.
 */
export async function obterUsuarios(): Promise<Usuario[]> {
  return apiFetch<Usuario[]>('/usuarios')
}

/**
 * Salva ou atualiza um usuário.
 */
export async function salvarUsuario(usuario: Omit<Usuario, 'id'> & { id?: string }): Promise<Usuario> {
  if (usuario.id) {
    // Modo Edição
    return apiFetch<Usuario>(`/usuarios/${usuario.id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    })
  } else {
    // Modo Criação
    return apiFetch<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario)
    })
  }
}

/**
 * Altera o status (ATIVO/INATIVO) de um usuário (exclusão lógica).
 */
export async function alterarStatusUsuario(id: string, status: 'ATIVO' | 'INATIVO'): Promise<void> {
  const endpoint = status === 'ATIVO' ? `/usuarios/${id}/ativar` : `/usuarios/${id}/desativar`
  return apiFetch<void>(endpoint, {
    method: 'PATCH'
  })
}
