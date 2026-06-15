import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { ErrosFormulario } from '../tipos'

const CREDENCIAIS_TESTE = {
  admin: { email: 'admin@sge.com', nome: 'Administrador' },
  docente: { email: 'docente@sge.com', nome: 'Professor' },
  discente: { email: 'discente@sge.com', nome: 'Aluno' }
}

interface LoginFormProps {
  onLogin: (email: string, senha: string) => Promise<void>
  carregando: boolean
  onMessage: (mensagem: string, tipo?: 'sucesso' | 'erro') => void
}

export default function FormularioLogin({
  onLogin,
  carregando,
  onMessage
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)
  const [erros, setErros] = useState<ErrosFormulario>({})
  const [exibirSenha, setExibirSenha] = useState(false)

  const handleTogglePassword = () => {
    setExibirSenha((prev) => !prev)
  }

  const handlePrefillTestCredentials = (
    perfil: 'admin' | 'docente' | 'discente'
  ) => {
    const dados = CREDENCIAIS_TESTE[perfil]

    setEmail(dados.email)
    setSenha('123456')
    setErros({})

    onMessage(`Credenciais de ${dados.nome} preenchidas!`, 'sucesso')
  }

  const validarFormulario = (): boolean => {
    const novosErros: ErrosFormulario = {}

    if (!email.trim()) {
      novosErros.email = 'Informe o seu e-mail institucional.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email =
        'Insira um formato de e-mail válido. Exemplo: usuario@sge.com.'
    }

    if (!senha) {
      novosErros.senha = 'Informe a sua senha de acesso.'
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve conter pelo menos 6 caracteres.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmitForm = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!validarFormulario()) {
      return
    }

    try {
      await onLogin(email, senha)
    } catch (error: unknown) {
      const mensagemErro =
        error instanceof Error
          ? error.message
          : 'Falha inesperada ao realizar login.'

      onMessage(mensagemErro, 'erro')
    }
  }

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <div className="input-group">
        <label htmlFor="emailInput">E-mail Institucional</label>

        <div className="input-group-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>

          <input
            type="email"
            id="emailInput"
            className={erros.email ? 'input-com-erro' : ''}
            placeholder="admin@sge.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)

              if (erros.email) {
                setErros((prev) => ({ ...prev, email: undefined }))
              }
            }}
            disabled={carregando}
            required
          />
        </div>

        {erros.email && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="input-erro-msg"
            role="alert"
          >
            {erros.email}
          </motion.span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="senhaInput">Senha de Acesso</label>

        <div className="input-group-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>

          <input
            type={exibirSenha ? 'text' : 'password'}
            id="senhaInput"
            className={erros.senha ? 'input-com-erro' : ''}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)

              if (erros.senha) {
                setErros((prev) => ({ ...prev, senha: undefined }))
              }
            }}
            disabled={carregando}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={handleTogglePassword}
            disabled={carregando}
            title={exibirSenha ? 'Ocultar senha' : 'Exibir senha'}
          >
            {exibirSenha ? '🙈' : '👁️'}
          </button>
        </div>

        {erros.senha && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="input-erro-msg"
            role="alert"
          >
            {erros.senha}
          </motion.span>
        )}
      </div>

      <div className="login-opcoes">
        <label className="lembrar-me selecao-inativa">
          <input
            type="checkbox"
            checked={lembrarMe}
            onChange={(e) => setLembrarMe(e.target.checked)}
            disabled={carregando}
          />
          Lembrar de mim
        </label>

        <a
          href="#recuperar-senha"
          onClick={(e) => {
            e.preventDefault()
            onMessage(
              'A recuperação de senha será integrada em uma etapa futura.',
              'sucesso'
            )
          }}
        >
          Esqueceu a senha?
        </a>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="login-botao"
        disabled={carregando}
      >
        {carregando ? (
          <>
            <span className="spinner" aria-hidden="true"></span>
            <span>Acessando...</span>
          </>
        ) : (
          <span>Acessar o SGE</span>
        )}
      </motion.button>

      <div className="preenchimento-rapido">
        <h3 className="preenchimento-titulo">
          Preenchimento Rápido (Teste)
        </h3>

        <div className="chips-grupo">
          <button
            type="button"
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('admin')}
            disabled={carregando}
          >
            🎓 Administrador
          </button>

          <button
            type="button"
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('docente')}
            disabled={carregando}
          >
            👨‍🏫 Professor
          </button>

          <button
            type="button"
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('discente')}
            disabled={carregando}
          >
            ✏️ Aluno
          </button>
        </div>
      </div>
    </form>
  )
}