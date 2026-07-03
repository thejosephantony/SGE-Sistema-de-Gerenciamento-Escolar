import { apiFetch } from '../../../services/api'
import type { MaterialDidatico, Atividade, EntregaAtividade } from '../tipos'

// ─── Materiais Didáticos ───────────────────────────────────────────────────

function mapMaterial(m: any): MaterialDidatico {
  return {
    id: String(m.id),
    titulo: m.titulo,
    descricao: m.descricao || '',
    linkArquivo: m.linkArquivo || '',
    dataPublicacao: m.dataPublicacao,
    turmaId: String(m.turmaId),
    turmaCode: m.turmaCode,
    docenteId: String(m.docenteId),
    docenteNome: m.docenteNome
  }
}

export async function obterMateriaisPorTurma(turmaId: string): Promise<MaterialDidatico[]> {
  const response = await apiFetch<any[]>(`/materiais/turma/${turmaId}`)
  return response.map(mapMaterial)
}

export async function criarMaterial(data: {
  titulo: string
  descricao: string
  linkArquivo: string
  turmaId: string
}): Promise<MaterialDidatico> {
  const response = await apiFetch<any>('/materiais', {
    method: 'POST',
    body: JSON.stringify({ ...data, turmaId: Number(data.turmaId) })
  })
  return mapMaterial(response)
}

export async function removerMaterial(id: string): Promise<void> {
  return apiFetch<void>(`/materiais/${id}`, { method: 'DELETE' })
}

// ─── Atividades ────────────────────────────────────────────────────────────

function mapAtividade(a: any): Atividade {
  return {
    id: String(a.id),
    titulo: a.titulo,
    descricao: a.descricao || '',
    prazo: a.prazo,
    dataPublicacao: a.dataPublicacao,
    status: a.status,
    turmaId: String(a.turmaId),
    turmaCode: a.turmaCode,
    docenteId: String(a.docenteId),
    docenteNome: a.docenteNome
  }
}

export async function obterAtividadesPorTurma(turmaId: string): Promise<Atividade[]> {
  const response = await apiFetch<any[]>(`/atividades/turma/${turmaId}`)
  return response.map(mapAtividade)
}

export async function criarAtividade(data: {
  titulo: string
  descricao: string
  prazo: string
  turmaId: string
}): Promise<Atividade> {
  const response = await apiFetch<any>('/atividades', {
    method: 'POST',
    body: JSON.stringify({ ...data, turmaId: Number(data.turmaId) })
  })
  return mapAtividade(response)
}

export async function encerrarAtividade(id: string): Promise<void> {
  return apiFetch<void>(`/atividades/${id}/encerrar`, { method: 'PATCH' })
}

export async function cancelarAtividade(id: string): Promise<void> {
  return apiFetch<void>(`/atividades/${id}/cancelar`, { method: 'PATCH' })
}

// ─── Entregas ──────────────────────────────────────────────────────────────

function mapEntrega(e: any): EntregaAtividade {
  return {
    id: String(e.id),
    textoResposta: e.textoResposta || '',
    linkArquivo: e.linkArquivo || '',
    dataEntrega: e.dataEntrega,
    status: e.status,
    atividadeId: String(e.atividadeId),
    atividadeTitulo: e.atividadeTitulo,
    discenteId: String(e.discenteId),
    discenteNome: e.discenteNome
  }
}

export async function obterEntregasPorAtividade(atividadeId: string): Promise<EntregaAtividade[]> {
  const response = await apiFetch<any[]>(`/entregas/atividade/${atividadeId}`)
  return response.map(mapEntrega)
}

export async function obterMinhasEntregas(): Promise<EntregaAtividade[]> {
  const response = await apiFetch<any[]>('/entregas/minhas')
  return response.map(mapEntrega)
}

export async function enviarEntrega(data: {
  atividadeId: string
  textoResposta: string
  linkArquivo: string
}): Promise<EntregaAtividade> {
  const response = await apiFetch<any>('/entregas', {
    method: 'POST',
    body: JSON.stringify({ ...data, atividadeId: Number(data.atividadeId) })
  })
  return mapEntrega(response)
}
