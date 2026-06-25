import { apiFetch } from '../../../services/api'
import type { Matricula } from '../tipos'

function mapToMatricula(m: any): Matricula {
  return {
    id: String(m.id),
    dataMatricula: m.dataMatricula,
    status: m.status,
    discenteId: String(m.discenteId),
    discenteNome: m.discenteNome,
    discenteMatricula: m.discenteMatricula || '',
    turmaId: String(m.turmaId),
    turmaCodigo: m.turmaCodigo,
    disciplinaNome: m.disciplinaNome,
    disciplinaCodigo: m.disciplinaCodigo,
    notaP1: m.notaP1 !== null ? Number(m.notaP1) : undefined,
    notaP2: m.notaP2 !== null ? Number(m.notaP2) : undefined,
    faltas: m.faltas !== null ? Number(m.faltas) : undefined,
    media: m.media !== null && m.media !== undefined ? Number(m.media) : undefined,
    situacao: m.situacao ?? 'SEM_NOTAS'
  }
}

/**
 * Obtém todas as matrículas do SGE.
 */
export async function obterMatriculas(): Promise<Matricula[]> {
  const response = await apiFetch<any[]>('/matriculas')
  return response.map(mapToMatricula)
}

/**
 * Busca matrículas de uma turma específica (endpoint otimizado para diário de classe).
 */
export async function buscarMatriculasPorTurma(turmaId: string): Promise<Matricula[]> {
  const response = await apiFetch<any[]>(`/matriculas/turma/${turmaId}`)
  return response.map(mapToMatricula)
}

/**
 * Busca matrículas de um discente específico (endpoint otimizado para boletim do aluno).
 */
export async function buscarMatriculasPorDiscente(discenteId: string): Promise<Matricula[]> {
  const response = await apiFetch<any[]>(`/matriculas/discente/${discenteId}`)
  return response.map(mapToMatricula)
}

/**
 * Matrícula um discente em uma turma.
 */
export async function matricularDiscente(
  discenteId: string,
  _discenteNome: string,
  _discenteMatricula: string,
  turmaId: string
): Promise<Matricula> {
  const response = await apiFetch<any>('/matriculas', {
    method: 'POST',
    body: JSON.stringify({
      discenteId: Number(discenteId),
      turmaId: Number(turmaId)
    })
  })
  return mapToMatricula(response)
}

/**
 * Cancela (inativa) uma matrícula (exclusão lógica).
 */
export async function cancelarMatricula(id: string): Promise<void> {
  return apiFetch<void>(`/matriculas/${id}/cancelar`, {
    method: 'PATCH'
  })
}

/**
 * Atualiza as notas e faltas de uma matrícula específica (Lançado pelo Professor).
 */
export async function atualizarNotasFaltas(
  id: string,
  notaP1: number | undefined,
  notaP2: number | undefined,
  faltas: number | undefined
): Promise<Matricula> {
  const response = await apiFetch<any>(`/matriculas/${id}/notas-faltas`, {
    method: 'PUT',
    body: JSON.stringify({
      notaP1: notaP1 !== undefined ? notaP1 : null,
      notaP2: notaP2 !== undefined ? notaP2 : null,
      faltas: faltas !== undefined ? faltas : null
    })
  })
  return mapToMatricula(response)
}
