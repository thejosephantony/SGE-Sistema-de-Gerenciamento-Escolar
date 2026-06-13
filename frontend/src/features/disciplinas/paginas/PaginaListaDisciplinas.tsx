import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconEye, 
  IconEyeOff, 
  IconAlertTriangle,
  IconInbox,
  IconClock
} from '@tabler/icons-react'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import DisciplineFormModal from '../componentes/ModalFormularioDisciplina'
import type { Disciplina } from '../tipos'
import { obterDisciplinas, salvarDisciplina, alterarStatusDisciplina } from '../servicos/servicoDisciplina'

/**
 * Página de listagem de disciplinas do SGE (Exclusiva do Administrador).
 * Permite cadastrar, editar, buscar e ativar/desativar disciplinas da instituição.
 */
export default function DisciplineListPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  
  // Controles de busca e filtro
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')

  // UI States (Conforme seção 9.4 do guia AGENTS.md)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  
  // Controle de Modais
  const [modalAberto, setModalAberto] = useState(false)
  const [disciplinaParaEdicao, setDisciplinaParaEdicao] = useState<Disciplina | null>(null)

  // Carrega as disciplinas cadastradas
  const carregarDisciplinas = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await obterDisciplinas()
      setDisciplinas(dados)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível carregar as disciplinas escolares. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDisciplinas()
  }, [])

  // Abre modal para cadastrar nova disciplina
  const handleNovaDisciplina = () => {
    setDisciplinaParaEdicao(null)
    setModalAberto(true)
  }

  // Abre modal para editar disciplina existente
  const handleEditarDisciplina = (disciplina: Disciplina) => {
    setDisciplinaParaEdicao(disciplina)
    setModalAberto(true)
  }

  // Salva dados no service e atualiza lista
  const handleSalvarDisciplina = async (disciplina: Omit<Disciplina, 'id'> & { id?: string }) => {
    await salvarDisciplina(disciplina)
    await carregarDisciplinas()
  }

  // Altera status de ativa/inativa da disciplina (Exclusão lógica)
  const handleAlternarStatusDisciplina = async (id: string, statusAtual: boolean) => {
    const novoStatus = !statusAtual
    const confirmacao = window.confirm(
      `Deseja realmente ${novoStatus ? 'ativar' : 'desativar'} esta disciplina?`
    )
    if (!confirmacao) return

    try {
      await alterarStatusDisciplina(id, novoStatus)
      await carregarDisciplinas()
    } catch (err) {
      console.error(err)
      alert('Ocorreu um erro ao alterar o status da disciplina.')
    }
  }

  // Filtra as disciplinas cadastradas na memória local
  const disciplinasFiltradas = disciplinas.filter((disc) => {
    const atendeFiltroStatus = 
      filtroStatus === 'TODOS' || 
      (filtroStatus === 'ATIVAS' && disc.ativa) || 
      (filtroStatus === 'INATIVAS' && !disc.ativa)
      
    const atendeBusca = 
      disc.nome.toLowerCase().includes(busca.toLowerCase()) || 
      disc.codigo.toLowerCase().includes(busca.toLowerCase())
    
    return atendeFiltroStatus && atendeBusca
  })

  // 1. Estado de Carregamento
  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Disciplinas" description="Gerencie as disciplinas e matérias da grade escolar da instituição." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando disciplinas e matérias escolares...</p>
        </div>
      </PageContainer>
    )
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Disciplinas" description="Gerencie as disciplinas e matérias da grade escolar da instituição." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto' }}>{erro}</p>
          <button onClick={carregarDisciplinas} className="btn-secundario" style={{ marginTop: '12px' }}>Tentar Novamente</button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho da Tela com Botão de Ação */}
      <PageHeader 
        title="Disciplinas" 
        description="Gerencie as matérias e disciplinas cadastradas na grade escolar do SGE." 
        action={
          <button onClick={handleNovaDisciplina} className="login-botao" style={{ width: 'auto', padding: '10px 18px', gap: '8px' }}>
            <IconPlus size={18} />
            Nova Disciplina
          </button>
        }
      />

      {/* Controles de Filtros e Busca */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
        {/* Barra de Busca */}
        <div className="input-group" style={{ flexGrow: 1, margin: 0, minWidth: '250px' }}>
          <div className="input-group-wrapper">
            <span className="input-icon">
              <IconSearch size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por código ou nome de disciplina..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Seletor de Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="filtroStatusSelect" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cor-texto-secundario)', whiteSpace: 'nowrap' }}>Status:</label>
          <select
            id="filtroStatusSelect"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
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
            <option value="TODOS">Todas</option>
            <option value="ATIVAS">Ativas</option>
            <option value="INATIVAS">Inativas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Disciplinas ou Lista Vazia */}
      {disciplinasFiltradas.length === 0 ? (
        // 3. Estado de Lista Vazia
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma disciplina encontrada</h3>
          <p style={{ maxWidth: '380px' }}>Não encontramos nenhuma disciplina cadastrada com os filtros informados.</p>
        </div>
      ) : (
        // 4. Estado de Sucesso
        <div className="tabela-container">
          <table className="tabela-sge">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome da Disciplina</th>
                <th>Carga Horária</th>
                <th>Ementa Resumida</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {disciplinasFiltradas.map((disc) => (
                <tr key={disc.id}>
                  <td style={{ fontWeight: 700, color: 'var(--cor-primaria)' }}>{disc.codigo}</td>
                  <td style={{ fontWeight: 600 }}>{disc.nome}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <IconClock size={16} style={{ color: 'var(--cor-texto-secundario)' }} />
                      <span>{disc.cargaHoraria} horas</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: '320px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--cor-texto-secundario)', fontSize: '13px' }} title={disc.ementa}>
                    {disc.ementa}
                  </td>
                  <td>
                    <span className={`status-tag ${disc.ativa ? 'status-ativo' : 'status-inativo'}`}>
                      {disc.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleEditarDisciplina(disc)} 
                        className="btn-secundario" 
                        style={{ padding: '8px 10px' }}
                        title="Editar disciplina"
                        disabled={!disc.ativa}
                      >
                        <IconEdit size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleAlternarStatusDisciplina(disc.id, disc.ativa)} 
                        className="btn-secundario" 
                        style={{ 
                          padding: '8px 10px',
                          color: disc.ativa ? 'var(--cor-erro)' : 'var(--cor-sucesso)',
                          borderColor: disc.ativa ? 'hsla(350, 89%, 46%, 0.2)' : 'hsla(142, 76%, 36%, 0.2)'
                        }}
                        title={disc.ativa ? 'Desativar disciplina' : 'Ativar disciplina'}
                      >
                        {disc.ativa ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Renderização do Modal de Cadastro/Edição */}
      <AnimatePresence>
        {modalAberto && (
          <DisciplineFormModal 
            disciplinaParaEditar={disciplinaParaEdicao} 
            onClose={() => setModalAberto(false)} 
            onSave={handleSalvarDisciplina} 
          />
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
