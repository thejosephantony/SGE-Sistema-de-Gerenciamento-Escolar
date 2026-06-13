import type { Disciplina } from '../tipos'

const CHAVE_STORAGE = 'sge-mock-disciplinas'

// Lista de disciplinas iniciais do SGE
const DISCIPLINAS_INICIAIS: Disciplina[] = [
  {
    id: 'disc-01',
    nome: 'Língua Portuguesa',
    codigo: 'PORT1001',
    cargaHoraria: 60,
    ementa: 'Estudo da morfologia, sintaxe, interpretação de textos literários e não literários, produção textual voltada para redação acadêmica/Enem e literatura brasileira colonial.',
    ativa: true
  },
  {
    id: 'disc-02',
    nome: 'Matemática',
    codigo: 'MATE2002',
    cargaHoraria: 90,
    ementa: 'Álgebra básica, equações e funções de 1º e 2º graus, matrizes e determinantes, geometria plana, trigonometria básica, progressões (PA e PG) e estatística descritiva.',
    ativa: true
  },
  {
    id: 'disc-03',
    nome: 'História',
    codigo: 'HIST3003',
    cargaHoraria: 60,
    ementa: 'Estudo da Antiguidade clássica, feudalismo, expansão marítima, colonização das Américas e Brasil Colonial até a vinda da Família Real.',
    ativa: true
  },
  {
    id: 'disc-04',
    nome: 'Geografia',
    codigo: 'GEOG4004',
    cargaHoraria: 60,
    ementa: 'Leitura de mapas e cartografia, relevo, vegetação e hidrografia do Brasil, urbanização e demografia, relações geopolíticas e impacto ambiental global.',
    ativa: true
  }
]

// Obtém a lista da sessionStorage ou inicia com o mock padrão
function obterListaPersistente(): Disciplina[] {
  const dados = sessionStorage.getItem(CHAVE_STORAGE)
  if (dados) {
    // Se contiver dados universitários antigos, limpa e reinicia
    if (dados.includes('COMP0348') || dados.includes('Engenharia de Software') || dados.includes('Banco de Dados')) {
      sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(DISCIPLINAS_INICIAIS))
      return DISCIPLINAS_INICIAIS
    }
    return JSON.parse(dados)
  }
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(DISCIPLINAS_INICIAIS))
  return DISCIPLINAS_INICIAIS
}

function salvarListaPersistente(lista: Disciplina[]) {
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista))
}

/**
 * Obtém todas as disciplinas do sistema.
 */
export async function obterDisciplinas(): Promise<Disciplina[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return obterListaPersistente()
}

/**
 * Salva ou edita uma disciplina.
 */
export async function salvarDisciplina(disciplina: Omit<Disciplina, 'id'> & { id?: string }): Promise<Disciplina> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const lista = obterListaPersistente()

  // Validação rápida de código duplicado
  const codigoDuplicado = lista.find(
    (d) => d.codigo.toUpperCase() === disciplina.codigo.toUpperCase() && d.id !== disciplina.id
  )
  if (codigoDuplicado) {
    throw new Error(`Código de disciplina "${disciplina.codigo}" já está sendo utilizado.`)
  }

  if (disciplina.id) {
    // Editar
    const index = lista.findIndex((d) => d.id === disciplina.id)
    if (index === -1) throw new Error('Disciplina não encontrada.')

    const disciplinaAtualizada = { ...lista[index], ...disciplina } as Disciplina
    lista[index] = disciplinaAtualizada
    salvarListaPersistente(lista)
    return disciplinaAtualizada
  } else {
    // Cadastrar
    const novaDisciplina: Disciplina = {
      ...disciplina,
      id: `disc-${Math.random().toString(36).substring(2, 9)}`,
      ativa: true
    }
    lista.push(novaDisciplina)
    salvarListaPersistente(lista)
    return novaDisciplina
  }
}

/**
 * Altera o status (ATIVA/INATIVA) da disciplina (exclusão lógica).
 */
export async function alterarStatusDisciplina(id: string, ativa: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const lista = obterListaPersistente()
  const index = lista.findIndex((d) => d.id === id)

  if (index !== -1) {
    lista[index].ativa = ativa
    salvarListaPersistente(lista)
  } else {
    throw new Error('Disciplina não encontrada para atualização de status.')
  }
}
