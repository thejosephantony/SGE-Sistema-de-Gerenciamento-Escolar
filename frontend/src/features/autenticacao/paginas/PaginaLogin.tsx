import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BannerLogin from '../componentes/BannerLogin'
import FormularioLogin from '../componentes/FormularioLogin'
import type { RespostaAutenticacao } from '../tipos'
import { useAuth } from '../../../contexts/ContextoAutenticacao'

/**
 * Página principal do módulo de autenticação.
 * Agrupa o LoginBanner (visual do portal) e o LoginForm (inputs de login),
 * gerenciando o estado de alertas/notificações toast exibidos na tela.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  // Estado para armazenar e exibir notificações temporárias (toasts)
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)
  const [temporizadorToast, setTemporizadorToast] = useState<number | null>(null)

  // Dispara uma notificação toast flutuante que some após 3.5 segundos
  const handleMostrarMensagem = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    // Cancela o temporizador anterior se houver, evitando conflito de fechamento
    if (temporizadorToast) {
      window.clearTimeout(temporizadorToast)
    }

    setNotificacao({ mensagem, tipo })

    const id = window.setTimeout(() => {
      setNotificacao(null)
    }, 3500)
    
    setTemporizadorToast(id)
  }

  // Callback acionado quando a autenticação é realizada com sucesso no formulário
  const handleSucessoLogin = (dados: RespostaAutenticacao) => {
    handleMostrarMensagem(
      `Login efetuado com sucesso! Bem-vindo(a), ${dados.usuario.nome}.`, 
      'sucesso'
    )
    
    // Salva no contexto de autenticação global
    login(dados.token, dados.usuario)
    
    // Redireciona de acordo com o perfil de usuário
    setTimeout(() => {
      if (dados.usuario.perfil === 'ADMINISTRADOR') {
        navigate('/admin/dashboard')
      } else if (dados.usuario.perfil === 'DOCENTE') {
        navigate('/professor/dashboard')
      } else {
        navigate('/aluno/dashboard')
      }
    }, 1000)
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
            <p className="login-card-subtitulo">Acesse sua conta para entrar no portal escolar</p>
          </div>

          {/* Componente contendo os campos de login e lógica local */}
          <FormularioLogin 
            onSuccess={handleSucessoLogin} 
            onMessage={(msg) => handleMostrarMensagem(msg, msg.includes('sucesso') || msg.includes('preenchidas') ? 'sucesso' : 'erro')} 
          />
        </motion.div>
      </div>

      {/* Toast Flutuante com Framer Motion (Slide-in e fade-out) */}
      <AnimatePresence>
        {notificacao && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`toast-notificacao toast-sucesso ${notificacao.tipo === 'erro' ? 'toast-erro' : ''}`}
            style={
              notificacao.tipo === 'erro' 
                ? { borderLeft: '4px solid var(--cor-erro)' } 
                : undefined
            }
            role="alert"
          >
            {notificacao.tipo === 'erro' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
            <span>{notificacao.mensagem}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
