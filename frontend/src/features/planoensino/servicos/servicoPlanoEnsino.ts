import { apiFetch } from '../../../services/api'
import type { PlanoEnsino, PlanoEnsinoRequest } from '../tipos'

function mapPlanoEnsino(p: any): PlanoEnsino {
  return {
    id: String(p.id),
    turmaId: String(p.turmaId),
    turmaCodigo: p.turmaCodigo,
    periodoLetivo: p.periodoLetivo,
    disciplinaId: String(p.disciplinaId),
    disciplinaCodigo: p.disciplinaCodigo,
    disciplinaNome: p.disciplinaNome,
    docenteId: String(p.docenteId),
    docenteNome: p.docenteNome,
    ementa: p.ementa,
    objetivos: p.objetivos,
    conteudoProgramatico: p.conteudoProgramatico,
    metodologia: p.metodologia,
    avaliacao: p.avaliacao,
    bibliografia: p.bibliografia || '',
    criadoEm: p.criadoEm,
    atualizadoEm: p.atualizadoEm
  }
}

export async function buscarPlanoEnsinoPorTurma(
  turmaId: string
): Promise<PlanoEnsino> {
  const response = await apiFetch<any>(`/planos-ensino/turma/${turmaId}`)
  return mapPlanoEnsino(response)
}

export async function salvarPlanoEnsino(
  turmaId: string,
  dados: PlanoEnsinoRequest
): Promise<PlanoEnsino> {
  const response = await apiFetch<any>(`/planos-ensino/turma/${turmaId}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })

  return mapPlanoEnsino(response)
}
