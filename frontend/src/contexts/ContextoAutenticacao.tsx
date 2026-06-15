import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { authService, obterUsuarioSalvo } from '../services/authService'
import { obterToken } from '../services/api'
import type { UsuarioAutenticado } from '../types/auth'

interface AuthContextData {
  usuario: UsuarioAutenticado | null
  carregandoContexto: boolean
  login: (email: string, senha: string) => Promise<UsuarioAutenticado>
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => obterUsuarioSalvo())
  const [carregandoContexto, setCarregandoContexto] = useState(true)

  useEffect(() => {
    async function carregarUsuarioAutenticado() {
      const token = obterToken()

      if (!token) {
        setUsuario(null)
        setCarregandoContexto(false)
        return
      }

      try {
        const usuarioAutenticado = await authService.me()
        setUsuario(usuarioAutenticado)
      } catch {
        authService.logout()
        setUsuario(null)
      } finally {
        setCarregandoContexto(false)
      }
    }

    carregarUsuarioAutenticado()
  }, [])

  async function login(email: string, senha: string): Promise<UsuarioAutenticado> {
    const resposta = await authService.login({ email, senha })
    setUsuario(resposta.usuario)
    return resposta.usuario
  }

  function logout() {
    authService.logout()
    setUsuario(null)
  }

  const value = useMemo(
    () => ({
      usuario,
      carregandoContexto,
      login,
      logout
    }),
    [usuario, carregandoContexto]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.')
  }

  return context
}