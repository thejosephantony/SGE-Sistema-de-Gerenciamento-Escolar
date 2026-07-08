export interface PlanoEnsino {
  id: string
  turmaId: string
  turmaCodigo: string
  periodoLetivo: string
  disciplinaId: string
  disciplinaCodigo: string
  disciplinaNome: string
  docenteId: string
  docenteNome: string
  ementa: string
  objetivos: string
  conteudoProgramatico: string
  metodologia: string
  avaliacao: string
  bibliografia?: string
  criadoEm: string
  atualizadoEm: string
}

export interface PlanoEnsinoRequest {
  ementa: string
  objetivos: string
  conteudoProgramatico: string
  metodologia: string
  avaliacao: string
  bibliografia?: string
}
