import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  IconPlus, 
  IconSearch, 
  IconUserEdit, 
  IconUserOff, 
  IconUserCheck, 
  IconAlertTriangle,
  IconInbox
} from '@tabler/icons-react'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import UserFormModal from '../componentes/ModalFormularioUsuario'
import type { Usuario } from '../tipos'
import { obterUsuarios, salvarUsuario, alterarStatusUsuario } from '../servicos/servicoUsuario'

/**
 * Tela principal de gerenciamento de usuários do SGE (Exclusiva do Administrador).
 * Lista todos os usuários cadastrados e permite busca, filtragem, criação, edição e desativação lógica.
 */
export default function UserListPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  
  // Estados de busca e filtro
  const [busca, setBusca] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState<string>('TODOS')

  // UI States (Conforme seção 9.4 do guia AGENTS.md)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  
  // Controle de Modais
  const [modalAberto, setModalAberto] = useState(false)
  const [usuarioParaEdicao, setUsuarioParaEdicao] = useState<Usuario | null>(null)

  // Carrega os dados de usuários ao montar a tela
  const carregarUsuarios = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await obterUsuarios()
      setUsuarios(dados)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível carregar os usuários cadastrados. Tente novamente mais tarde.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  // Abre modal para cadastrar novo usuário
  const handleNovoUsuario = () => {
    setUsuarioParaEdicao(null)
    setModalAberto(true)
  }

  // Abre modal para editar usuário existente
  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioParaEdicao(usuario)
    setModalAberto(true)
  }

  // Salva ou atualiza os dados no Service e recarrega a lista
  const handleSalvarUsuario = async (usuario: Omit<Usuario, 'id'> & { id?: string }) => {
    await salvarUsuario(usuario)
    await carregarUsuarios()
  }

  // Desativa ou reativa um usuário (Exclusão lógica)
  const handleAlternarStatusUsuario = async (id: string, statusAtual: 'ATIVO' | 'INATIVO') => {
    const novoStatus = statusAtual === 'ATIVO' ? 'INATIVO' : 'ATIVO'
    const confirmacao = window.confirm(
      `Deseja realmente ${novoStatus === 'INATIVO' ? 'desativar' : 'ativar'} este usuário?`
    )
    if (!confirmacao) return

    try {
      await alterarStatusUsuario(id, novoStatus)
      await carregarUsuarios()
    } catch (err) {
      console.error(err)
      alert('Ocorreu um erro ao alterar o status do usuário.')
    }
  }

  // Filtra e busca os usuários em memória local de forma eficiente
  const usuariosFiltrados = usuarios.filter((usr) => {
    const atendeFiltroPerfil = filtroPerfil === 'TODOS' || usr.perfil === filtroPerfil
    const atendeBusca = 
      usr.nome.toLowerCase().includes(busca.toLowerCase()) || 
      usr.email.toLowerCase().includes(busca.toLowerCase()) ||
      (usr.matricula && usr.matricula.includes(busca))
    
    return atendeFiltroPerfil && atendeBusca
  })

  // 1. Estado de Carregamento
  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Usuários" description="Gerencie as contas de alunos, professores e administradores." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando dados dos usuários...</p>
        </div>
      </PageContainer>
    )
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Usuários" description="Gerencie as contas de alunos, professores e administradores." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto' }}>{erro}</p>
          <button onClick={carregarUsuarios} className="btn-secundario" style={{ marginTop: '12px' }}>Tentar Novamente</button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho da Tela com Botão de Ação */}
      <PageHeader 
        title="Usuários" 
        description="Gerencie as contas de alunos, professores e administradores da instituição." 
        action={
          <button onClick={handleNovoUsuario} className="login-botao" style={{ width: 'auto', padding: '10px 18px', gap: '8px' }}>
            <IconPlus size={18} />
            Novo Usuário
          </button>
        }
      />

      {/* Controles de Filtragem e Busca */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
        {/* Barra de Busca */}
        <div className="input-group" style={{ flexGrow: 1, margin: 0, minWidth: '250px' }}>
          <div className="input-group-wrapper">
            <span className="input-icon">
              <IconSearch size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou matrícula..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Seletor de Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="filtroPerfilSelect" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cor-texto-secundario)', whiteSpace: 'nowrap' }}>Filtrar por Perfil:</label>
          <select
            id="filtroPerfilSelect"
            value={filtroPerfil}
            onChange={(e) => setFiltroPerfil(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--raio-borda)',
              border: '1px solid var(--cor-borda)',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: 'var(--cor-fundo)'
            }}
          >
            <option value="TODOS">Todos os Perfis</option>
            <option value="ADMINISTRADOR">Administradores</option>
            <option value="DOCENTE">Professores</option>
            <option value="DISCENTE">Alunos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Usuários ou Lista Vazia */}
      {usuariosFiltrados.length === 0 ? (
        // 3. Estado de Lista Vazia
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhum usuário encontrado</h3>
          <p style={{ maxWidth: '380px' }}>Tente alterar a busca ou filtros selecionados para encontrar o registro desejado.</p>
        </div>
      ) : (
        // 4. Estado de Sucesso
        <div className="tabela-container">
          <table className="tabela-sge">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Identificador Escolar</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usr) => (
                <tr key={usr.id}>
                  <td style={{ fontWeight: 600 }}>{usr.nome}</td>
                  <td>{usr.email}</td>
                  <td>
                    <span 
                      className="status-tag"
                      style={{
                        backgroundColor: usr.perfil === 'ADMINISTRADOR' ? 'hsl(210, 40%, 95%)' : usr.perfil === 'DOCENTE' ? 'hsl(38, 92%, 95%)' : 'hsl(221, 83%, 95%)',
                        color: usr.perfil === 'ADMINISTRADOR' ? 'var(--cor-azul-escuro)' : usr.perfil === 'DOCENTE' ? 'var(--cor-alerta)' : 'var(--cor-primaria)'
                      }}
                    >
                      {usr.perfil === 'ADMINISTRADOR' ? 'Administrador' : usr.perfil === 'DOCENTE' ? 'Professor' : 'Aluno'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--cor-texto-secundario)', fontSize: '13px' }}>
                    {usr.perfil === 'DISCENTE' && `Matrícula: ${usr.matricula} (${usr.curso})`}
                    {usr.perfil === 'DOCENTE' && `Reg: ${usr.registroDocente} (${usr.titulacao})`}
                    {usr.perfil === 'ADMINISTRADOR' && `Mat: ${usr.matriculaAdministrativa}`}
                  </td>
                  <td>
                    <span className={`status-tag ${usr.status === 'ATIVO' ? 'status-ativo' : 'status-inativo'}`}>
                      {usr.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleEditarUsuario(usr)} 
                        className="btn-secundario" 
                        style={{ padding: '8px 10px' }}
                        title="Editar usuário"
                        disabled={usr.status === 'INATIVO'}
                      >
                        <IconUserEdit size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleAlternarStatusUsuario(usr.id, usr.status)} 
                        className="btn-secundario" 
                        style={{ 
                          padding: '8px 10px',
                          color: usr.status === 'ATIVO' ? 'var(--cor-erro)' : 'var(--cor-sucesso)',
                          borderColor: usr.status === 'ATIVO' ? 'hsla(350, 89%, 46%, 0.2)' : 'hsla(142, 76%, 36%, 0.2)'
                        }}
                        title={usr.status === 'ATIVO' ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        {usr.status === 'ATIVO' ? <IconUserOff size={16} /> : <IconUserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Renderização do Modal de Formulário (se aberto) */}
      <AnimatePresence>
        {modalAberto && (
          <UserFormModal 
            usuarioParaEditar={usuarioParaEdicao} 
            onClose={() => setModalAberto(false)} 
            onSave={handleSalvarUsuario} 
          />
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
