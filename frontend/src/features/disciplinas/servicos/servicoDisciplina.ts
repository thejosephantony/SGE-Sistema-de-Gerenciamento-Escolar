import { apiFetch } from '../../../services/api'
import type { Disciplina } from '../tipos'

/**
 * Obtém todas as disciplinas do sistema.
 */
export async function obterDisciplinas(): Promise<Disciplina[]> {
  const response = await apiFetch<any[]>('/disciplinas')
  return response.map((d) => ({
    id: String(d.id),
    nome: d.nome,
    codigo: d.codigo,
    cargaHoraria: d.cargaHoraria,
    ementa: d.ementa || '',
    ativa: d.status === 'ATIVO'
  }))
}

/**
 * Salva ou edita uma disciplina.
 */
export async function salvarDisciplina(disciplina: Omit<Disciplina, 'id'> & { id?: string }): Promise<Disciplina> {
  const url = disciplina.id ? `/disciplinas/${disciplina.id}` : '/disciplinas'
  const method = disciplina.id ? 'PUT' : 'POST'
  
  const response = await apiFetch<any>(url, {
    method,
    body: JSON.stringify({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      cargaHoraria: disciplina.cargaHoraria,
      ementa: disciplina.ementa
    })
  })

  return {
    id: String(response.id),
    nome: response.nome,
    codigo: response.codigo,
    cargaHoraria: response.cargaHoraria,
    ementa: response.ementa || '',
    ativa: response.status === 'ATIVO'
  }
}

/**
 * Altera o status (ATIVA/INATIVA) da disciplina (exclusão lógica).
 */
export async function alterarStatusDisciplina(id: string, ativa: boolean): Promise<void> {
  const endpoint = ativa ? `/disciplinas/${id}/ativar` : `/disciplinas/${id}/desativar`
  return apiFetch<void>(endpoint, {
    method: 'PATCH'
  })
}
