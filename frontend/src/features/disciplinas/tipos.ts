/**
 * Interface que representa uma Disciplina no SGE.
 */
export interface Disciplina {
  id: string
  nome: string
  codigo: string        // Código identificador único (ex: COMP0391)
  cargaHoraria: number  // Carga horária em horas (ex: 60, 90)
  ementa: string
  ativa: boolean
}
