import type { Credenciais, RespostaAutenticacao } from '../tipos'

// Dados de simulação para os usuários de teste
const USUARIOS_MOCK = {
  'admin.sge@colegio.se.gov.br': {
    id: 'usr-admin-01',
    nome: 'Carlos de Andrade',
    perfil: 'ADMINISTRADOR' as const
  },
  'docente.sge@colegio.se.gov.br': {
    id: 'usr-docente-01',
    nome: 'Clara Silva Menezes',
    perfil: 'DOCENTE' as const
  },
  'discente.sge@colegio.se.gov.br': {
    id: 'usr-discente-01',
    nome: 'Lucas Gonzaga Santos',
    perfil: 'DISCENTE' as const
  }
}

/**
 * Serviço responsável pela comunicação com a API de Autenticação do SGE.
 * Seguindo as diretrizes do guia AGENTS.md, as chamadas assíncronas de API são isoladas
 * neste arquivo de serviço, tratando erros e retornando Promises tipadas.
 */
export async function autenticarUsuario(credenciais: Credenciais): Promise<RespostaAutenticacao> {
  // Simulação de latência de rede (1.5 segundos)
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const emailNormalizado = credenciais.email.trim().toLowerCase()
  const usuarioMockado = USUARIOS_MOCK[emailNormalizado as keyof typeof USUARIOS_MOCK]

  if (!usuarioMockado) {
    throw new Error('E-mail institucional não cadastrado no sistema escolar.')
  }

  // Simula sucesso de autenticação retornando token JWT mockado e dados do usuário
  return {
    token: `mock-jwt-token-sge-colegio-${usuarioMockado.id}-${Date.now()}`,
    usuario: {
      id: usuarioMockado.id,
      nome: usuarioMockado.nome,
      email: emailNormalizado,
      perfil: usuarioMockado.perfil
    }
  }
}
