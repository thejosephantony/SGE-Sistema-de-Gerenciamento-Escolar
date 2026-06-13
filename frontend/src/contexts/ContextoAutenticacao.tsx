import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { DadosUsuario } from '../features/autenticacao/tipos'

interface AuthContextType {
  usuario: DadosUsuario | null
  token: string | null
  carregandoContexto: boolean
  login: (token: string, usuario: DadosUsuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provedor de contexto global para autenticação.
 * Armazena e restaura o token JWT e dados do usuário da sessionStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<DadosUsuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregandoContexto, setCarregandoContexto] = useState(true)

  // Ao carregar a aplicação, restaura a sessão existente
  useEffect(() => {
    const tokenSalvo = sessionStorage.getItem('sge-session-token')
    const usuarioSalvo = sessionStorage.getItem('sge-user-data')

    if (tokenSalvo && usuarioSalvo) {
      try {
        setToken(tokenSalvo)
        setUsuario(JSON.parse(usuarioSalvo))
      } catch (error) {
        console.error('Falha ao restaurar sessão anterior:', error)
        sessionStorage.removeItem('sge-session-token')
        sessionStorage.removeItem('sge-user-data')
      }
    }
    setCarregandoContexto(false)
  }, [])

  // Efetua login definindo estado e persistência local temporária
  const login = (novoToken: string, novoUsuario: DadosUsuario) => {
    setToken(novoToken)
    setUsuario(novoUsuario)
    sessionStorage.setItem('sge-session-token', novoToken)
    sessionStorage.setItem('sge-user-data', JSON.stringify(novoUsuario))
  }

  // Efetua logout limpando os dados da sessão
  const logout = () => {
    setToken(null)
    setUsuario(null)
    sessionStorage.removeItem('sge-session-token')
    sessionStorage.removeItem('sge-user-data')
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregandoContexto, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook customizado para consumir os dados do contexto de Autenticação.
 */
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (contexto === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return contexto
}
