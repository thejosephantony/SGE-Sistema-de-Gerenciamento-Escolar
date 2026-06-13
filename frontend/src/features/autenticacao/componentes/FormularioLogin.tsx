import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Credenciais, ErrosFormulario, RespostaAutenticacao } from '../tipos'
import { autenticarUsuario } from '../servicos/servicoAutenticacao'

// Mapa de credenciais de teste para preenchimento rápido
const CREDENCIAIS_TESTE = {
  admin: { email: 'admin.sge@colegio.se.gov.br', nome: 'Carlos (Administrador)' },
  docente: { email: 'docente.sge@colegio.se.gov.br', nome: 'Clara (Professor)' },
  discente: { email: 'discente.sge@colegio.se.gov.br', nome: 'Lucas (Aluno)' }
}

interface LoginFormProps {
  onSuccess: (dados: RespostaAutenticacao) => void
  onMessage: (mensagem: string) => void
}

/**
 * Componente contendo o formulário de login, lógica de validação de inputs e
 * botões de preenchimento de teste rápido.
 */
export default function LoginForm({ onSuccess, onMessage }: LoginFormProps) {
  // Estados locais do formulário
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)
  
  // Estados de controle de UI e validação
  const [erros, setErros] = useState<ErrosFormulario>({})
  const [exibirSenha, setExibirSenha] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Alternar visualização da senha
  const handleTogglePassword = () => {
    setExibirSenha((prev) => !prev)
  }

  // Preenche dados de teste rapidamente
  const handlePrefillTestCredentials = (perfil: 'admin' | 'docente' | 'discente') => {
    const dados = CREDENCIAIS_TESTE[perfil]
    setEmail(dados.email)
    setSenha('sge12345')
    setErros({})
    onMessage(`Credenciais de ${dados.nome} preenchidas!`)
  }

  // Validação local de formulário antes do envio
  const validarFormulario = (): boolean => {
    const novosErros: ErrosFormulario = {}

    if (!email.trim()) {
      novosErros.email = 'Informe o seu e-mail institucional.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'Insira um formato de e-mail válido (ex: usuario@colegio.se.gov.br).'
    }

    if (!senha) {
      novosErros.senha = 'Informe a sua senha de acesso.'
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve conter pelo menos 6 caracteres.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Envio do formulário para autenticação via Service
  const handleSubmitForm = async (evento: React.FormEvent) => {
    evento.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setIsLoading(true)
    const credenciais: Credenciais = { email, senha }

    try {
      // Chama o serviço assíncrono para autenticação
      const resposta = await autenticarUsuario(credenciais)
      onSuccess(resposta)
    } catch (error: unknown) {
      // Trata o erro de maneira segura de acordo com o guia (sem usar any)
      const mensagemErro = error instanceof Error ? error.message : 'Falha inesperada ao realizar login.'
      onMessage(mensagemErro)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      {/* Entrada do E-mail */}
      <div className="input-group">
        <label htmlFor="emailInput">E-mail Institucional</label>
        <div className="input-group-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <input 
            type="email" 
            id="emailInput" 
            className={erros.email ? 'input-com-erro' : ''}
            placeholder="nome@colegio.se.gov.br"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (erros.email) setErros((prev) => ({ ...prev, email: undefined }))
            }}
            disabled={isLoading}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {erros.email}
          </motion.span>
        )}
      </div>

      {/* Entrada da Senha */}
      <div className="input-group">
        <label htmlFor="senhaInput">Senha de Acesso</label>
        <div className="input-group-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
              if (erros.senha) setErros((prev) => ({ ...prev, senha: undefined }))
            }}
            disabled={isLoading}
            required
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={handleTogglePassword}
            disabled={isLoading}
            title={exibirSenha ? "Ocultar senha" : "Exibir senha"}
          >
            {exibirSenha ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {erros.senha && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="input-erro-msg"
            role="alert"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {erros.senha}
          </motion.span>
        )}
      </div>

      {/* Opções de Login */}
      <div className="login-opcoes">
        <label className="lembrar-me selecao-inativa">
          <input 
            type="checkbox" 
            checked={lembrarMe}
            onChange={(e) => setLembrarMe(e.target.checked)}
            disabled={isLoading}
          />
          Lembrar de mim
        </label>
        <a 
          href="#recuperar-senha" 
          onClick={(e) => { 
            e.preventDefault(); 
            onMessage("A recuperação de senha será integrada com o backend na Fase 2."); 
          }}
        >
          Esqueceu a senha?
        </a>
      </div>

      {/* Botão de Submit com animação de hover e loading */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        className="login-botao"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true"></span>
            <span>Acessando...</span>
          </>
        ) : (
          <span>Acessar o SGE</span>
        )}
      </motion.button>

      {/* Botões Rápidos de Preenchimento para Teste */}
      <div className="preenchimento-rapido">
        <h3 className="preenchimento-titulo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Preenchimento Rápido (Teste)
        </h3>
        <div className="chips-grupo">
          <button 
            type="button" 
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('admin')}
            disabled={isLoading}
          >
            🎓 Administrador
          </button>
          <button 
            type="button" 
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('docente')}
            disabled={isLoading}
          >
            👨‍🏫 Professor
          </button>
          <button 
            type="button" 
            className="chip-botao"
            onClick={() => handlePrefillTestCredentials('discente')}
            disabled={isLoading}
          >
            ✏️ Aluno
          </button>
        </div>
      </div>
    </form>
  )
}
