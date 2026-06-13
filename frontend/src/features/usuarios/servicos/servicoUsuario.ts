import type { Usuario } from '../tipos'

const CHAVE_STORAGE = 'sge-mock-usuarios'

// Lista inicial de usuários mockados do SGE
const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: 'usr-admin-01',
    nome: 'Carlos de Andrade',
    email: 'admin.sge@colegio.se.gov.br',
    perfil: 'ADMINISTRADOR',
    status: 'ATIVO',
    matriculaAdministrativa: 'ADM98231'
  },
  {
    id: 'usr-docente-01',
    nome: 'Clara Silva Menezes',
    email: 'docente.sge@colegio.se.gov.br',
    perfil: 'DOCENTE',
    status: 'ATIVO',
    registroDocente: 'DOC77610',
    titulacao: 'Licenciatura'
  },
  {
    id: 'usr-docente-02',
    nome: 'Roberto Alves Santos',
    email: 'roberto.alves@colegio.se.gov.br',
    perfil: 'DOCENTE',
    status: 'ATIVO',
    registroDocente: 'DOC88129',
    titulacao: 'Licenciatura'
  },
  {
    id: 'usr-discente-01',
    nome: 'Lucas Gonzaga Santos',
    email: 'discente.sge@colegio.se.gov.br',
    perfil: 'DISCENTE',
    status: 'ATIVO',
    matricula: '2026000109',
    curso: 'Ensino Médio — 1º Ano'
  },
  {
    id: 'usr-discente-02',
    nome: 'Ellen Vitória Santos',
    email: 'ellen.vitoria@colegio.se.gov.br',
    perfil: 'DISCENTE',
    status: 'ATIVO',
    matricula: '2026000212',
    curso: 'Ensino Médio — 3º Ano'
  }
]

// Inicializa a lista na sessionStorage caso não exista ou seja de versão antiga
function obterListaPersistente(): Usuario[] {
  const dados = sessionStorage.getItem(CHAVE_STORAGE)
  if (dados) {
    // Se contiver dados universitários antigos, limpa e reinicia
    if (dados.includes('@ufs.br') || dados.includes('Computação') || dados.includes('Doutorado')) {
      sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(USUARIOS_INICIAIS))
      return USUARIOS_INICIAIS
    }
    return JSON.parse(dados)
  }
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(USUARIOS_INICIAIS))
  return USUARIOS_INICIAIS
}

function salvarListaPersistente(lista: Usuario[]) {
  sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista))
}

/**
 * Obtém todos os usuários cadastrados.
 */
export async function obterUsuarios(): Promise<Usuario[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simula latência sutil
  return obterListaPersistente()
}

/**
 * Salva ou atualiza um usuário.
 */
export async function salvarUsuario(usuario: Omit<Usuario, 'id'> & { id?: string }): Promise<Usuario> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const lista = obterListaPersistente()
  
  if (usuario.id) {
    // Modo Edição
    const index = lista.findIndex((u) => u.id === usuario.id)
    if (index === -1) throw new Error('Usuário não encontrado.')
    
    const usuarioAtualizado = { ...lista[index], ...usuario } as Usuario
    lista[index] = usuarioAtualizado
    salvarListaPersistente(lista)
    return usuarioAtualizado
  } else {
    // Modo Criação
    const novoUsuario: Usuario = {
      ...usuario,
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      status: 'ATIVO'
    }
    lista.push(novoUsuario)
    salvarListaPersistente(lista)
    return novoUsuario
  }
}

/**
 * Altera o status (ATIVO/INATIVO) de um usuário (exclusão lógica).
 */
export async function alterarStatusUsuario(id: string, status: 'ATIVO' | 'INATIVO'): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const lista = obterListaPersistente()
  const index = lista.findIndex((u) => u.id === id)
  
  if (index !== -1) {
    lista[index].status = status
    salvarListaPersistente(lista)
  } else {
    throw new Error('Usuário não encontrado para alteração de status.')
  }
}
