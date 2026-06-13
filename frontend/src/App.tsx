import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './contexts/ContextoAutenticacao'

// Import de Páginas do Módulo de Autenticação
import PaginaLogin from './features/autenticacao/paginas/PaginaLogin'
import LandingPage from './pages/LandingPage/LandingPage'

// Import de Layout e Componentes do Administrador
import LayoutAdministrador from './components/layout/LayoutAdministrador'
import PaginaPainel from './features/painel/paginas/PaginaPainel'
import PaginaListaUsuarios from './features/usuarios/paginas/PaginaListaUsuarios'
import PaginaListaDisciplinas from './features/disciplinas/paginas/PaginaListaDisciplinas'
import PaginaListaTurmas from './features/turmas/paginas/PaginaListaTurmas'
import PaginaMatricula from './features/matriculas/paginas/PaginaMatricula'
import PaginaRelatoriosAdministrador from './features/relatorios/paginas/PaginaRelatoriosAdministrador'

// Import de Layout e Componentes do Professor
import LayoutProfessor from './components/layout/LayoutProfessor'
import PaginaPainelProfessor from './features/professor/paginas/PaginaPainelProfessor'
import PaginaMinhasTurmas from './features/professor/paginas/PaginaMinhasTurmas'
import PaginaDiarioClasse from './features/professor/paginas/PaginaDiarioClasse'
import PaginaRelatoriosProfessor from './features/professor/paginas/PaginaRelatoriosProfessor'

// Import de Layout e Componentes do Aluno
import LayoutAluno from './components/layout/LayoutAluno'
import PaginaPainelAluno from './features/aluno/paginas/PaginaPainelAluno'
import PaginaBoletim from './features/aluno/paginas/PaginaBoletim'
import PaginaHorario from './features/aluno/paginas/PaginaHorario'

/**
 * Componente Wrapper para Proteger as Rotas do Administrador.
 * Redireciona para o login caso o usuário tente acessar sem estar autenticado.
 */
function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()

  if (carregandoContexto) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--cor-fundo-alternativo)' }}>
        <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)' }}></span>
      </div>
    )
  }

  // Se não estiver logado, envia de volta para a tela de login
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // Se o perfil não for administrador, impede o acesso
  if (usuario.perfil !== 'ADMINISTRADOR') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Acesso Não Autorizado</h2>
        <p>Esta área é exclusiva para o perfil Administrador.</p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return children
}

/**
 * Componente Wrapper para Proteger as Rotas do Professor.
 * Redireciona para o login caso o usuário tente acessar sem estar autenticado como Docente.
 */
function RotaProtegidaProfessor({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()

  if (carregandoContexto) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--cor-fundo-alternativo)' }}>
        <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)' }}></span>
      </div>
    )
  }

  // Se não estiver logado, envia de volta para a tela de login
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // Se o perfil não for docente (professor), impede o acesso
  if (usuario.perfil !== 'DOCENTE') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Acesso Não Autorizado</h2>
        <p>Esta área é exclusiva para o perfil Professor.</p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return children
}

/**
 * Componente Wrapper para Proteger as Rotas do Aluno.
 * Redireciona para o login caso o usuário tente acessar sem estar autenticado como Aluno (Discente).
 */
function RotaProtegidaAluno({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()

  if (carregandoContexto) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--cor-fundo-alternativo)' }}>
        <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)' }}></span>
      </div>
    )
  }

  // Se não estiver logado, envia de volta para a tela de login
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // Se o perfil não for discente (aluno), impede o acesso
  if (usuario.perfil !== 'DISCENTE') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Acesso Não Autorizado</h2>
        <p>Esta área é exclusiva para o perfil Aluno.</p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return children
}

/**
 * Roteador principal do SGE.
 * Gerencia as transições entre a tela de Login e o Painel do Administrador.
 */
function RoteadorApp() {
  const { usuario } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública raiz: Landing Page */}
        <Route 
          path="/" 
          element={
            usuario ? (
              usuario.perfil === 'ADMINISTRADOR' 
                ? <Navigate to="/admin/dashboard" replace /> 
                : usuario.perfil === 'DOCENTE'
                ? <Navigate to="/professor/dashboard" replace />
                : <Navigate to="/aluno/dashboard" replace />
            ) : <LandingPage />
          } 
        />

        {/* Rota pública: Login */}
        <Route 
          path="/login" 
          element={
            usuario ? (
              usuario.perfil === 'ADMINISTRADOR' 
                ? <Navigate to="/admin/dashboard" replace /> 
                : usuario.perfil === 'DOCENTE'
                ? <Navigate to="/professor/dashboard" replace />
                : <Navigate to="/aluno/dashboard" replace />
            ) : <PaginaLogin />
          } 
        />

        {/* Rotas Privadas e Protegidas: Perfil Administrador */}
        <Route 
          path="/admin" 
          element={
            <RotaProtegida>
              <LayoutAdministrador />
            </RotaProtegida>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainel />} />
          <Route path="usuarios" element={<PaginaListaUsuarios />} />
          <Route path="disciplinas" element={<PaginaListaDisciplinas />} />
          <Route path="turmas" element={<PaginaListaTurmas />} />
          <Route path="matriculas" element={<PaginaMatricula />} />
          <Route path="relatorios" element={<PaginaRelatoriosAdministrador />} />
        </Route>

        {/* Rotas Privadas e Protegidas: Perfil Professor */}
        <Route 
          path="/professor" 
          element={
            <RotaProtegidaProfessor>
              <LayoutProfessor />
            </RotaProtegidaProfessor>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainelProfessor />} />
          <Route path="turmas" element={<PaginaMinhasTurmas />} />
          <Route path="diario" element={<PaginaDiarioClasse />} />
          <Route path="relatorios" element={<PaginaRelatoriosProfessor />} />
        </Route>

        {/* Rotas Privadas e Protegidas: Perfil Aluno */}
        <Route 
          path="/aluno" 
          element={
            <RotaProtegidaAluno>
              <LayoutAluno />
            </RotaProtegidaAluno>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainelAluno />} />
          <Route path="boletim" element={<PaginaBoletim />} />
          <Route path="horario" element={<PaginaHorario />} />
        </Route>

        {/* Fallback para rotas inválidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RoteadorApp />
    </AuthProvider>
  )
}
