/**
 * Status possível de uma Matrícula no SGE.
 */
export type StatusMatricula = 'ATIVA' | 'CANCELADA' | 'TRANCADA' | 'CONCLUIDA'

/**
 * Situação acadêmica calculada pelo backend (Módulo 7).
 */
export type SituacaoMatricula = 'APROVADO' | 'EM_RECUPERACAO' | 'REPROVADO_FREQUENCIA' | 'SEM_NOTAS'

/**
 * Interface que representa o vínculo de Matrícula de um Discente em uma Turma.
 */
export interface Matricula {
  id: string
  dataMatricula: string // Data em formato ISO
  status: StatusMatricula
  
  // Vínculo do Aluno (Discente)
  discenteId: string
  discenteNome: string
  discenteMatricula: string // RA
  
  // Vínculo da Turma e Disciplina
  turmaId: string
  turmaCodigo: string
  disciplinaNome: string
  disciplinaCodigo: string

  // Lançamentos do Professor
  notaP1?: number
  notaP2?: number
  faltas?: number

  // Campos calculados pelo Backend (Módulo 7)
  media?: number
  situacao?: SituacaoMatricula
}
