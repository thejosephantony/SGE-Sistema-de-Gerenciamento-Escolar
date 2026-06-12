/**
 * Status possível do ciclo de vida de uma turma do SGE.
 */
export type StatusTurma = 'PLANEJADA' | 'ABERTA' | 'EM_ANDAMENTO' | 'ENCERRADA' | 'CANCELADA'

/**
 * Interface que representa uma Turma no SGE.
 */
export interface Turma {
  id: string
  codigo: string
  capacidade: number
  status: StatusTurma
  periodoLetivo: string // Ex: "2026.1"
  
  // Vínculo com a Disciplina
  disciplinaId: string
  disciplinaNome: string
  disciplinaCodigo: string

  // Vínculo com o Docente (Professor)
  docenteId: string
  docenteNome: string
}
