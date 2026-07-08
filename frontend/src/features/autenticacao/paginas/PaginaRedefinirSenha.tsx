import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconLock,
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react'
import BannerLogin from '../componentes/BannerLogin'
import { authService } from '../../../services/authService'

export default function PaginaRedefinirSenha() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') ?? ''

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
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

    if (!token) {
      mostrarMensagem('Token de redefinição ausente ou inválido.', 'erro')
      return
    }

    if (novaSenha.length < 6) {
      mostrarMensagem('A nova senha deve possuir pelo menos 6 caracteres.', 'erro')
      return
    }

    if (novaSenha !== confirmarSenha) {
      mostrarMensagem('A confirmação de senha não confere.', 'erro')
      return
    }

    try {
      setCarregando(true)

      const resposta = await authService.redefinirSenha({
        token,
        novaSenha
      })

      mostrarMensagem(resposta.mensagem, 'sucesso')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1600)
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível redefinir a senha.'

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
            <h1 className="login-card-titulo">Redefinir senha</h1>

            <p className="login-card-subtitulo">
              Informe uma nova senha para acessar novamente o Portal SGE.
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

          {!token && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--cor-erro)',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                color: 'var(--cor-erro)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '18px'
              }}
            >
              <IconAlertTriangle size={18} />
              <span>Token de redefinição não encontrado no link.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="novaSenha">Nova senha</label>

              <div style={{ position: 'relative' }}>
                <IconLock
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
                  id="novaSenha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  disabled={carregando || !token}
                  style={{ paddingLeft: '42px' }}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmarSenha">Confirmar nova senha</label>

              <div style={{ position: 'relative' }}>
                <IconLock
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
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  disabled={carregando || !token}
                  style={{ paddingLeft: '42px' }}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-botao"
              disabled={carregando || !token}
              style={{ width: '100%', gap: '8px', marginTop: '8px' }}
            >
              {carregando ? (
                <>
                  <span className="spinner"></span>
                  <span>Redefinindo senha...</span>
                </>
              ) : (
                <>
                  <IconCheck size={18} />
                  Redefinir senha
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
