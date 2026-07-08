import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconMail,
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react'
import BannerLogin from '../componentes/BannerLogin'
import { authService } from '../../../services/authService'

export default function PaginaRecuperarSenha() {
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [notificacao, setNotificacao] = useState<{
    mensagem: string
    tipo: 'sucesso' | 'erro'
  } | null>(null)

  const mostrarMensagem = (mensagem: string, tipo: 'sucesso' | 'erro') => {
    setNotificacao({ mensagem, tipo })

    setTimeout(() => {
      setNotificacao(null)
    }, 6000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      mostrarMensagem('Informe o e-mail cadastrado.', 'erro')
      return
    }

    try {
      setCarregando(true)

      const resposta = await authService.solicitarRecuperacaoSenha({
        email: email.trim()
      })

      mostrarMensagem(resposta.mensagem, 'sucesso')
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível solicitar a recuperação de senha.'

      mostrarMensagem(mensagem, 'erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      <BannerLogin />

      <div className="login-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="login-card"
        >
          <div className="login-card-header">
            <h1 className="login-card-titulo">Recuperar senha</h1>

            <p className="login-card-subtitulo">
              Informe seu e-mail cadastrado para receber as instruções de redefinição.
            </p>
          </div>

          <AnimatePresence>
            {notificacao && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  marginBottom: '18px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border:
                    notificacao.tipo === 'sucesso'
                      ? '1px solid var(--cor-sucesso)'
                      : '1px solid var(--cor-erro)',
                  backgroundColor:
                    notificacao.tipo === 'sucesso'
                      ? 'rgba(22, 163, 74, 0.08)'
                      : 'rgba(220, 38, 38, 0.08)',
                  color:
                    notificacao.tipo === 'sucesso'
                      ? 'var(--cor-sucesso)'
                      : 'var(--cor-erro)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                {notificacao.tipo === 'sucesso' ? (
                  <IconCheck size={18} />
                ) : (
                  <IconAlertTriangle size={18} />
                )}

                <span>{notificacao.mensagem}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="emailRecuperacao">E-mail cadastrado</label>

              <div style={{ position: 'relative' }}>
                <IconMail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--cor-texto-secundario)'
                  }}
                />

                <input
                  id="emailRecuperacao"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  disabled={carregando}
                  style={{ paddingLeft: '42px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-botao"
              disabled={carregando}
              style={{ width: '100%', gap: '8px', marginTop: '8px' }}
            >
              {carregando ? (
                <>
                  <span className="spinner"></span>
                  <span>Enviando instruções...</span>
                </>
              ) : (
                <>
                  <IconMail size={18} />
                  Enviar instruções
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                color: 'var(--cor-primaria)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <IconArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
