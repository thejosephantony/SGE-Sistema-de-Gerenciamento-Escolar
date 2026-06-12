import type { Turma, StatusTurma } from '../tipos'

const CHAVE_STORAGE = 'sge-mock-turmas'

// Lista de turmas iniciais cadastradas no SGE
const TURMAS_INICIAIS: Turma[] = [
  {
    id: 'turma-01',
    codigo: 'T01',
    capacidade: 40,
    status: 'EM_ANDAMENTO',
    periodoLetivo: '2026',
    disciplinaId: 'disc-01',
    disciplinaNome: 'Língua Portuguesa',
    disciplinaCodigo: 'PORT1001',
    docenteId: 'usr-docente-01',
    docenteNome: 'Clara Silva Menezes'
  },
  {
    id: 'turma-02',
    codigo: 'T01',
    capacidade: 35,
    status: 'ABERTA',
    periodoLetivo: '2026',
    disciplinaId: 'disc-02',
    disciplinaNome: 'Matemática',
    disciplinaCodigo: 'MATE2002',
    docenteId: 'usr-docente-02',
    docenteNome: 'Roberto Alves Santos'
  },
  {
    id: 'turma-03',
    codigo: 'T02',
    capacidade: 30,
    status: 'PLANEJADA',
    periodoLetivo: '2026',
    disciplinaId: 'disc-03',
    disciplinaNome: 'História',
    disciplinaCodigo: 'HIST3003',
    docenteId: 'usr-docente-01',
    docenteNome: 'Clara Silva Menezes'
  }
]

// Carrega ou inicializa as turmas mockadas na sessionStorage
function obterListaPersistente(): Turma[] {
  const dados = sessionStorage.getItem(CHAVE_STORAGE)
  if (dados) {
    // Se contiver dados universitários antigos, limpa e reinicia
    if (dados.includes('2026.1') || dados.includes('COMP0348') || dados.includes('Engenharia de Software')) {
      sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(TURMAS_INICIAIS))
      return TURMAS_INICIAIS
    }
    return JSON.parse(dados)
  }
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(TURMAS_INICIAIS))
  return TURMAS_INICIAIS
}

function salvarListaPersistente(lista: Turma[]) {
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista))
}

/**
 * Obtém todas as turmas do sistema.
 */
export async function obterTurmas(): Promise<Turma[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return obterListaPersistente()
}

/**
 * Salva ou edita os dados de uma Turma.
 */
export async function salvarTurma(turma: Omit<Turma, 'id'> & { id?: string }): Promise<Turma> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const lista = obterListaPersistente()

  // Validação rápida: Impede criar duas turmas com mesmo código para a mesma disciplina no mesmo período letivo
  const turmaDuplicada = lista.find(
    (t) => 
      t.codigo.toUpperCase() === turma.codigo.toUpperCase() &&
      t.disciplinaId === turma.disciplinaId &&
      t.periodoLetivo === turma.periodoLetivo &&
      t.id !== turma.id
  )
  if (turmaDuplicada) {
    throw new Error(`A disciplina "${turma.disciplinaNome}" já possui uma turma "${turma.codigo}" cadastrada no período ${turma.periodoLetivo}.`)
  }

  if (turma.id) {
    // Editar
    const index = lista.findIndex((t) => t.id === turma.id)
    if (index === -1) throw new Error('Turma não encontrada.')

    const turmaAtualizada = { ...lista[index], ...turma } as Turma
    lista[index] = turmaAtualizada
    salvarListaPersistente(lista)
    return turmaAtualizada
  } else {
    // Cadastrar
    const novaTurma: Turma = {
      ...turma,
      id: `turma-${Math.random().toString(36).substring(2, 9)}`,
      status: 'PLANEJADA' // Toda turma inicia como planejada
    }
    lista.push(novaTurma)
    salvarListaPersistente(lista)
    return novaTurma
  }
}

/**
 * Altera o status do ciclo de vida de uma turma.
 */
export async function alterarStatusTurma(id: string, status: StatusTurma): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const lista = obterListaPersistente()
  const index = lista.findIndex((t) => t.id === id)

  if (index !== -1) {
    lista[index].status = status
    salvarListaPersistente(lista)
  } else {
    throw new Error('Turma não encontrada para atualização de status.')
  }
}
