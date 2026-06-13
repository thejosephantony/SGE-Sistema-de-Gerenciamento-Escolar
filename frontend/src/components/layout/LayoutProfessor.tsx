import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { 
  IconLayoutDashboard, 
  IconUsersGroup, 
  IconNotebook, 
  IconFileAnalytics, 
  IconLogout,
  IconMenu2,
  IconChevronLeft
} from '@tabler/icons-react'
import { useAuth } from '../../contexts/ContextoAutenticacao'

/**
 * Componente de layout padrão para o perfil Professor (Docente).
 * Contém a Sidebar lateral de navegação e a área de conteúdo dinâmico (Outlet).
 */
export default function LayoutProfessor() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [colapsado, setColapsado] = useState(false)

  // Executa o logout e retorna à tela de login
  const handleSair = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar de Navegação */}
      <aside className={`admin-sidebar ${colapsado ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
          {!colapsado && <span>SGE</span>}
        </div>

        {/* Botão de Alternância (Toggle) Absoluto na Borda */}
        <button 
          onClick={() => setColapsado(!colapsado)}
          className="sidebar-toggle-btn"
          aria-label={colapsado ? "Abrir Menu" : "Recolher Menu"}
          title={colapsado ? "Abrir Menu" : "Recolher Menu"}
        >
          {colapsado ? <IconMenu2 size={14} /> : <IconChevronLeft size={14} />}
        </button>


        {/* Links de navegação utilizando NavLink para gerenciar a classe 'active' */}
        <nav className="admin-sidebar-menu">
          <NavLink 
            to="/professor/dashboard" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Painel Geral"
          >
            <IconLayoutDashboard size={20} aria-hidden="true" />
            <span>Painel Geral</span>
          </NavLink>
          
          <NavLink 
            to="/professor/turmas" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Minhas Turmas"
          >
            <IconUsersGroup size={20} aria-hidden="true" />
            <span>Minhas Turmas</span>
          </NavLink>
          
          <NavLink 
            to="/professor/diario" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Diário de Classe"
          >
            <IconNotebook size={20} aria-hidden="true" />
            <span>Diário de Classe</span>
          </NavLink>
          
          <NavLink 
            to="/professor/relatorios" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Relatórios"
          >
            <IconFileAnalytics size={20} aria-hidden="true" />
            <span>Relatórios</span>
          </NavLink>
        </nav>

        {/* Rodapé da Sidebar - Botão Sair */}
        <div className="admin-sidebar-footer">
          <button 
            onClick={handleSair} 
            className="admin-menu-item" 
            style={{ color: 'hsl(350, 89%, 60%)' }}
            data-tooltip="Sair do SGE"
          >
            <IconLogout size={20} aria-hidden="true" />
            <span>Sair do SGE</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal à Direita */}
      <div className="admin-content-area">
        {/* Barra superior de identificação */}
        <header className="admin-header">
          <div className="admin-header-welcome">
            Olá, Prof. <span>{usuario?.nome || 'Professor'}</span>
          </div>
          
          <div className="admin-header-profile">
            <span className="admin-profile-tag" style={{ backgroundColor: 'hsl(38, 92%, 95%)', color: 'var(--cor-alerta)' }}>Professor</span>
            
            {/* Botão Sair visível apenas em mobile */}
            <button 
              onClick={handleSair} 
              className="chip-botao" 
              style={{ display: 'none', gap: '6px', color: 'var(--cor-erro)', borderColor: 'var(--cor-erro)' }}
            >
              <IconLogout size={16} />
              Sair
            </button>
          </div>
        </header>

        {/* Área de carregamento dinâmico das rotas do professor */}
        <Outlet />
      </div>
    </div>
  )
}


