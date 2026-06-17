import { apiFetch } from '../../../services/api'
import type { Turma, StatusTurma } from '../tipos'

/**
 * Obtém todas as turmas do sistema.
 */
export async function obterTurmas(): Promise<Turma[]> {
  const response = await apiFetch<any[]>('/turmas')
  return response.map((t) => ({
    id: String(t.id),
    codigo: t.codigo,
    capacidade: t.capacidade,
    status: t.status,
    periodoLetivo: t.periodoLetivo,
    disciplinaId: String(t.disciplinaId),
    disciplinaNome: t.disciplinaNome,
    disciplinaCodigo: t.disciplinaCodigo,
    docenteId: String(t.docenteId),
    docenteNome: t.docenteNome
  }))
}

/**
 * Salva ou edita os dados de uma Turma.
 */
export async function salvarTurma(turma: Omit<Turma, 'id'> & { id?: string }): Promise<Turma> {
  const url = turma.id ? `/turmas/${turma.id}` : '/turmas'
  const method = turma.id ? 'PUT' : 'POST'

  const response = await apiFetch<any>(url, {
    method,
    body: JSON.stringify({
      codigo: turma.codigo,
      capacidade: turma.capacidade,
      periodoLetivo: turma.periodoLetivo,
      disciplinaId: Number(turma.disciplinaId),
      docenteId: Number(turma.docenteId),
      status: turma.status
    })
  })

  return {
    id: String(response.id),
    codigo: response.codigo,
    capacidade: response.capacidade,
    status: response.status,
    periodoLetivo: response.periodoLetivo,
    disciplinaId: String(response.disciplinaId),
    disciplinaNome: response.disciplinaNome,
    disciplinaCodigo: response.disciplinaCodigo,
    docenteId: String(response.docenteId),
    docenteNome: response.docenteNome
  }
}

/**
 * Altera o status do ciclo de vida de uma turma.
 */
export async function alterarStatusTurma(id: string, status: StatusTurma): Promise<void> {
  const endpoint = status === 'CANCELADA' ? `/turmas/${id}/desativar` : `/turmas/${id}/ativar`
  return apiFetch<void>(endpoint, {
    method: 'PATCH'
  })
}
