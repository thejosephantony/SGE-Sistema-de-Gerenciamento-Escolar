/**
 * Status possível de uma Atividade no AVA.
 */
export type StatusAtividade = 'ABERTA' | 'ENCERRADA' | 'CANCELADA'

/**
 * Status possível de uma Entrega no AVA.
 */
export type StatusEntrega = 'ENVIADA' | 'ATRASADA'

/**
 * Interface que representa um Material Didático.
 */
export interface MaterialDidatico {
  id: string
  titulo: string
  descricao: string
  linkArquivo: string
  dataPublicacao: string
  turmaId: string
  turmaCode: string
  docenteId: string
  docenteNome: string
}

/**
 * Interface que representa uma Atividade do AVA.
 */
export interface Atividade {
  id: string
  titulo: string
  descricao: string
  prazo: string
  dataPublicacao: string
  status: StatusAtividade
  turmaId: string
  turmaCode: string
  docenteId: string
  docenteNome: string
}

/**
 * Interface que representa uma Entrega de Atividade.
 */
export interface EntregaAtividade {
  id: string
  textoResposta: string
  linkArquivo: string
  dataEntrega: string
  status: StatusEntrega
  atividadeId: string
  atividadeTitulo: string
  discenteId: string
  discenteNome: string
}
