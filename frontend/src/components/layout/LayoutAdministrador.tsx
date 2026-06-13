import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconBook, 
  IconUsersGroup, 
  IconUserPlus, 
  IconFileAnalytics, 
  IconLogout,
  IconMenu2,
  IconChevronLeft
} from '@tabler/icons-react'
import { useAuth } from '../../contexts/ContextoAutenticacao'

/**
 * Componente de layout administrativo padrão.
 * Contém a Sidebar lateral com os menus acadêmicos e a área de conteúdo dinâmico (Outlet).
 */
export default function AdminLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [colapsado, setColapsado] = useState(false)

  // Executa o encerramento da sessão e redireciona para a tela de login
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
            to="/admin/dashboard" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Painel Geral"
          >
            <IconLayoutDashboard size={20} aria-hidden="true" />
            <span>Painel Geral</span>
          </NavLink>
          
          <NavLink 
            to="/admin/usuarios" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Gerenciar Usuários"
          >
            <IconUsers size={20} aria-hidden="true" />
            <span>Gerenciar Usuários</span>
          </NavLink>
          
          <NavLink 
            to="/admin/disciplinas" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Gerenciar Disciplinas"
          >
            <IconBook size={20} aria-hidden="true" />
            <span>Gerenciar Disciplinas</span>
          </NavLink>
          
          <NavLink 
            to="/admin/turmas" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Gerenciar Turmas"
          >
            <IconUsersGroup size={20} aria-hidden="true" />
            <span>Gerenciar Turmas</span>
          </NavLink>
          
          <NavLink 
            to="/admin/matriculas" 
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            data-tooltip="Matrículas"
          >
            <IconUserPlus size={20} aria-hidden="true" />
            <span>Matrículas</span>
          </NavLink>
          
          <NavLink 
            to="/admin/relatorios" 
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
            Olá, <span>{usuario?.nome || 'Administrador'}</span>
          </div>
          
          <div className="admin-header-profile">
            <span className="admin-profile-tag">Administrador</span>
            
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

        {/* Área de carregamento dinâmico das rotas administrativas */}
        <Outlet />
      </div>
    </div>
  )
}


