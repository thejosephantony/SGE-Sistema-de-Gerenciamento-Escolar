import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './contexts/ContextoAutenticacao'

import PaginaLogin from './features/autenticacao/paginas/PaginaLogin'
import PaginaRecuperarSenha from './features/autenticacao/paginas/PaginaRecuperarSenha'
import PaginaRedefinirSenha from './features/autenticacao/paginas/PaginaRedefinirSenha'
import LandingPage from './pages/LandingPage/LandingPage'
import PaginaMeuPerfil from './features/perfil/paginas/PaginaMeuPerfil'

import LayoutAdministrador from './components/layout/LayoutAdministrador'
import PaginaPainel from './features/painel/paginas/PaginaPainel'
import PaginaListaUsuarios from './features/usuarios/paginas/PaginaListaUsuarios'
import PaginaListaDisciplinas from './features/disciplinas/paginas/PaginaListaDisciplinas'
import PaginaListaTurmas from './features/turmas/paginas/PaginaListaTurmas'
import PaginaMatricula from './features/matriculas/paginas/PaginaMatricula'
import PaginaRelatoriosAdministrador from './features/relatorios/paginas/PaginaRelatoriosAdministrador'
import PaginaPlanoEnsinoProfessor from './features/professor/paginas/PaginaPlanoEnsinoProfessor'
import PaginaPlanoEnsinoAluno from './features/aluno/paginas/PaginaPlanoEnsinoAluno'

import LayoutProfessor from './components/layout/LayoutProfessor'
import PaginaPainelProfessor from './features/professor/paginas/PaginaPainelProfessor'
import PaginaMinhasTurmas from './features/professor/paginas/PaginaMinhasTurmas'
import PaginaDiarioClasse from './features/professor/paginas/PaginaDiarioClasse'
import PaginaRelatoriosProfessor from './features/professor/paginas/PaginaRelatoriosProfessor'
import PaginaAVAProfessor from './features/ava/paginas/PaginaAVAProfessor'

import LayoutAluno from './components/layout/LayoutAluno'
import PaginaPainelAluno from './features/aluno/paginas/PaginaPainelAluno'
import PaginaBoletim from './features/aluno/paginas/PaginaBoletim'
import PaginaHorario from './features/aluno/paginas/PaginaHorario'
import PaginaAVAAluno from './features/ava/paginas/PaginaAVAAluno'

function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()
  if (carregandoContexto) return <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}><span className="spinner"></span></div>
  if (!usuario) return <Navigate to="/" replace />
  if (usuario.perfil !== 'ADMINISTRADOR') return <Navigate to="/" replace />
  return children
}

function RotaProtegidaProfessor({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()
  if (carregandoContexto) return <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}><span className="spinner"></span></div>
  if (!usuario) return <Navigate to="/" replace />
  if (usuario.perfil !== 'DOCENTE') return <Navigate to="/" replace />
  return children
}

function RotaProtegidaAluno({ children }: { children: ReactNode }) {
  const { usuario, carregandoContexto } = useAuth()
  if (carregandoContexto) return <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}><span className="spinner"></span></div>
  if (!usuario) return <Navigate to="/" replace />
  if (usuario.perfil !== 'DISCENTE') return <Navigate to="/" replace />
  return children
}

function RoteadorApp() {
  const { usuario } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          usuario
            ? usuario.perfil === 'ADMINISTRADOR' ? <Navigate to="/admin/dashboard" replace />
            : usuario.perfil === 'DOCENTE' ? <Navigate to="/professor/dashboard" replace />
            : <Navigate to="/aluno/dashboard" replace />
            : <LandingPage />
        } />

        <Route path="/login" element={
          usuario
            ? usuario.perfil === 'ADMINISTRADOR' ? <Navigate to="/admin/dashboard" replace />
            : usuario.perfil === 'DOCENTE' ? <Navigate to="/professor/dashboard" replace />
            : <Navigate to="/aluno/dashboard" replace />
            : <PaginaLogin />
        } />
		<Route
			  path="/recuperar-senha"
			  element={
				usuario
				  ? usuario.perfil === 'ADMINISTRADOR'
					? <Navigate to="/admin/dashboard" replace />
					: usuario.perfil === 'DOCENTE'
					  ? <Navigate to="/professor/dashboard" replace />
					  : <Navigate to="/aluno/dashboard" replace />
				  : <PaginaRecuperarSenha />
			  }
			/>

			<Route
			  path="/redefinir-senha"
			  element={
				usuario
				  ? usuario.perfil === 'ADMINISTRADOR'
					? <Navigate to="/admin/dashboard" replace />
					: usuario.perfil === 'DOCENTE'
					  ? <Navigate to="/professor/dashboard" replace />
					  : <Navigate to="/aluno/dashboard" replace />
				  : <PaginaRedefinirSenha />
			  }
			/>
        <Route path="/admin" element={<RotaProtegida><LayoutAdministrador /></RotaProtegida>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainel />} />
          <Route path="usuarios" element={<PaginaListaUsuarios />} />
          <Route path="disciplinas" element={<PaginaListaDisciplinas />} />
          <Route path="turmas" element={<PaginaListaTurmas />} />
          <Route path="matriculas" element={<PaginaMatricula />} />
          <Route path="relatorios" element={<PaginaRelatoriosAdministrador />} />
        </Route>

        <Route path="/professor" element={<RotaProtegidaProfessor><LayoutProfessor /></RotaProtegidaProfessor>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainelProfessor />} />
          <Route path="turmas" element={<PaginaMinhasTurmas />} />
          <Route path="diario" element={<PaginaDiarioClasse />} />
          <Route path="meu-perfil" element={<PaginaMeuPerfil />} />
          <Route path="plano-ensino" element={<PaginaPlanoEnsinoProfessor />} />
          <Route path="ava" element={<PaginaAVAProfessor />} />
          <Route path="relatorios" element={<PaginaRelatoriosProfessor />} />
        </Route>

        <Route path="/aluno" element={<RotaProtegidaAluno><LayoutAluno /></RotaProtegidaAluno>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PaginaPainelAluno />} />
          <Route path="plano-ensino" element={<PaginaPlanoEnsinoAluno />} />
          <Route path="meu-perfil" element={<PaginaMeuPerfil />} />
          <Route path="boletim" element={<PaginaBoletim />} />
          <Route path="ava" element={<PaginaAVAAluno />} />
          <Route path="horario" element={<PaginaHorario />} />
        </Route>

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
