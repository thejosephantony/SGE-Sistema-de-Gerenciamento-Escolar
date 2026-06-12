import type { Matricula } from '../tipos'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'

const CHAVE_STORAGE = 'sge-mock-matriculas'

// Lista de matrículas iniciais para teste no SGE
const MATRICULAS_INICIAIS: Matricula[] = [
  {
    id: 'mat-01',
    dataMatricula: new Date().toISOString(),
    status: 'ATIVA',
    discenteId: 'usr-discente-01',
    discenteNome: 'Lucas Gonzaga Santos',
    discenteMatricula: '2026000109',
    turmaId: 'turma-01',
    turmaCodigo: 'T01',
    disciplinaNome: 'Língua Portuguesa',
    disciplinaCodigo: 'PORT1001',
    notaP1: 8.5,
    notaP2: 9.0,
    faltas: 2
  },
  {
    id: 'mat-02',
    dataMatricula: new Date().toISOString(),
    status: 'ATIVA',
    discenteId: 'usr-discente-02',
    discenteNome: 'Ellen Vitória Santos',
    discenteMatricula: '2026000212',
    turmaId: 'turma-02',
    turmaCodigo: 'T01',
    disciplinaNome: 'Matemática',
    disciplinaCodigo: 'MATE2002',
    notaP1: 7.0,
    notaP2: 8.0,
    faltas: 0
  }
]

// Carrega ou inicializa na sessionStorage
function obterListaPersistente(): Matricula[] {
  const dados = sessionStorage.getItem(CHAVE_STORAGE)
  if (dados) {
    // Se contiver dados universitários antigos, limpa e reinicia
    if (dados.includes('COMP0348') || dados.includes('Engenharia de Software') || dados.includes('Banco de Dados')) {
      sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(MATRICULAS_INICIAIS))
      return MATRICULAS_INICIAIS
    }
    return JSON.parse(dados)
  }
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(MATRICULAS_INICIAIS))
  return MATRICULAS_INICIAIS
}

function salvarListaPersistente(lista: Matricula[]) {
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista))
}

/**
 * Obtém todas as matrículas do SGE.
 */
export async function obterMatriculas(): Promise<Matricula[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return obterListaPersistente()
}

/**
 * Matrícula um discente em uma turma.
 */
export async function matricularDiscente(
  discenteId: string,
  discenteNome: string,
  discenteMatricula: string,
  turmaId: string
): Promise<Matricula> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const listaMatriculas = obterListaPersistente()
  const listaTurmas = await obterTurmas()

  // Encontra a turma para buscar informações da disciplina
  const turmaObj = listaTurmas.find((t) => t.id === turmaId)
  if (!turmaObj) throw new Error('Turma não encontrada para matrícula.')

  // Validação 1: Impede matricular o aluno na mesma turma duas vezes
  const matriculado = listaMatriculas.find(
    (m) => m.discenteId === discenteId && m.turmaId === turmaId && m.status === 'ATIVA'
  )
  if (matriculado) {
    throw new Error(`O aluno já possui matrícula ativa na turma "${turmaObj.codigo}" de "${turmaObj.disciplinaNome}".`)
  }

  // Validação 2: Verifica capacidade da turma (vagas)
  const matriculadosAtivosNaTurma = listaMatriculas.filter(
    (m) => m.turmaId === turmaId && m.status === 'ATIVA'
  ).length

  if (matriculadosAtivosNaTurma >= turmaObj.capacidade) {
    throw new Error(`A turma "${turmaObj.codigo}" já atingiu a capacidade máxima de ${turmaObj.capacidade} alunos.`)
  }

  // Cria e adiciona a nova matrícula
  const novaMatricula: Matricula = {
    id: `mat-${Math.random().toString(36).substring(2, 9)}`,
    dataMatricula: new Date().toISOString(),
    status: 'ATIVA',
    discenteId,
    discenteNome,
    discenteMatricula,
    turmaId,
    turmaCodigo: turmaObj.codigo,
    disciplinaNome: turmaObj.disciplinaNome,
    disciplinaCodigo: turmaObj.disciplinaCodigo
  }

  listaMatriculas.push(novaMatricula)
  salvarListaPersistente(listaMatriculas)
  return novaMatricula
}

/**
 * Cancela (inativa) uma matrícula (exclusão lógica).
 */
export async function cancelarMatricula(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const lista = obterListaPersistente()
  const index = lista.findIndex((m) => m.id === id)

  if (index !== -1) {
    lista[index].status = 'CANCELADA'
    salvarListaPersistente(lista)
  } else {
    throw new Error('Matrícula não encontrada.')
  }
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
  await new Promise((resolve) => setTimeout(resolve, 400))
  const lista = obterListaPersistente()
  const index = lista.findIndex((m) => m.id === id)

  if (index === -1) {
    throw new Error('Matrícula não encontrada para lançamento.')
  }

  lista[index].notaP1 = notaP1
  lista[index].notaP2 = notaP2
  lista[index].faltas = faltas

  salvarListaPersistente(lista)
  return lista[index]
}
