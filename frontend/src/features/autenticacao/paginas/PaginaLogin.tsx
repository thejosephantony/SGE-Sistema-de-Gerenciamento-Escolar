import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BannerLogin from '../componentes/BannerLogin'
import FormularioLogin from '../componentes/FormularioLogin'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import type { PerfilUsuario } from '../../../types/auth'

/**
 * Retorna a rota inicial do sistema de acordo com o perfil do usuário autenticado.
 */
function obterRotaPorPerfil(perfil: PerfilUsuario): string {
  switch (perfil) {
    case 'ADMINISTRADOR':
      return '/admin/dashboard'

    case 'DOCENTE':
      return '/professor/dashboard'

    case 'DISCENTE':
      return '/aluno/dashboard'

    default:
      return '/'
  }
}

/**
 * Página principal do módulo de autenticação.
 * Mantém o visual do portal e integra o formulário de login com o backend.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Estado para armazenar e exibir notificações temporárias.
  const [notificacao, setNotificacao] = useState<{
    mensagem: string
    tipo: 'sucesso' | 'erro'
  } | null>(null)

  const [temporizadorToast, setTemporizadorToast] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(false)

  // Dispara uma notificação toast flutuante que some após 3.5 segundos.
  const handleMostrarMensagem = (
    mensagem: string,
    tipo: 'sucesso' | 'erro' = 'sucesso'
  ) => {
    if (temporizadorToast) {
      window.clearTimeout(temporizadorToast)
    }

    setNotificacao({ mensagem, tipo })

    const id = window.setTimeout(() => {
      setNotificacao(null)
    }, 3500)

    setTemporizadorToast(id)
  }

  /**
   * Função chamada pelo formulário quando o usuário tenta entrar.
   * Agora ela usa o backend real por meio do ContextoAutenticacao.
   */
  const handleLogin = async (email: string, senha: string) => {
    try {
      setCarregando(true)

      const usuario = await login(email, senha)

      handleMostrarMensagem(
        `Login efetuado com sucesso! Bem-vindo(a), ${usuario.nome}.`,
        'sucesso'
      )

      const rota = obterRotaPorPerfil(usuario.perfil)

      setTimeout(() => {
        navigate(rota, { replace: true })
      }, 800)
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login.'

      handleMostrarMensagem(mensagem, 'erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      {/* Lado Esquerdo - Banner Institucional */}
      <BannerLogin />

      {/* Lado Direito - Form de Acesso */}
      <div className="login-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="login-card"
        >
          <div className="login-card-header">
            <h1 className="login-card-titulo">Bem-vindo de volta</h1>
            <p className="login-card-subtitulo">
              Acesse sua conta para entrar no portal escolar
            </p>
          </div>

          {/* Formulário visual mantido, mas agora usando login real */}
          <FormularioLogin
            onLogin={handleLogin}
            carregando={carregando}
            onMessage={(mensagem, tipo = 'sucesso') =>
              handleMostrarMensagem(mensagem, tipo)
            }
          />
        </motion.div>
      </div>

      {/* Toast Flutuante com Framer Motion */}
      <AnimatePresence>
        {notificacao && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`toast-notificacao toast-sucesso ${
              notificacao.tipo === 'erro' ? 'toast-erro' : ''
            }`}
            style={
              notificacao.tipo === 'erro'
                ? { borderLeft: '4px solid var(--cor-erro)' }
                : undefined
            }
            role="alert"
          >
            {notificacao.tipo === 'erro' ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}

            <span>{notificacao.mensagem}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}