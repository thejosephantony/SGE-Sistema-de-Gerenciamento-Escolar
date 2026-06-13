import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconAlertTriangle,
  IconInbox,
  IconCalendar,
  IconUsers
} from '@tabler/icons-react'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import ClassFormModal from '../componentes/ModalFormularioTurma'
import type { Turma, StatusTurma } from '../tipos'
import { obterTurmas, salvarTurma } from '../servicos/servicoTurma'

/**
 * Tela de listagem e criação de turmas do SGE (Exclusiva do Administrador).
 * Permite gerenciar as turmas, associando disciplinas, professores, períodos letivos e status.
 */
export default function ClassListPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  
  // Controles de busca e filtros
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')

  // UI States (Conforme seção 9.4 do guia AGENTS.md)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Controle de Modais
  const [modalAberto, setModalAberto] = useState(false)
  const [turmaParaEdicao, setTurmaParaEdicao] = useState<Turma | null>(null)

  // Carrega a lista de turmas
  const carregarTurmas = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await obterTurmas()
      setTurmas(dados)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível carregar as turmas cadastradas. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTurmas()
  }, [])

  // Abre modal para cadastrar nova turma
  const handleNovaTurma = () => {
    setTurmaParaEdicao(null)
    setModalAberto(true)
  }

  // Abre modal para editar turma existente
  const handleEditarTurma = (turma: Turma) => {
    setTurmaParaEdicao(turma)
    setModalAberto(true)
  }

  // Salva os dados no service e atualiza a tabela
  const handleSalvarTurma = async (turma: Omit<Turma, 'id'> & { id?: string }) => {
    await salvarTurma(turma)
    await carregarTurmas()
  }

  // Filtra as turmas em memória local
  const turmasFiltradas = turmas.filter((t) => {
    const atendeFiltroStatus = filtroStatus === 'TODOS' || t.status === filtroStatus
    
    const atendeBusca = 
      t.codigo.toLowerCase().includes(busca.toLowerCase()) || 
      t.disciplinaNome.toLowerCase().includes(busca.toLowerCase()) ||
      t.docenteNome.toLowerCase().includes(busca.toLowerCase()) ||
      t.disciplinaCodigo.toLowerCase().includes(busca.toLowerCase())

    return atendeFiltroStatus && atendeBusca
  })

  // Tradução do status da turma para exibição
  const obterRotuloStatus = (status: StatusTurma): string => {
    switch (status) {
      case 'PLANEJADA': return 'Planejada'
      case 'ABERTA': return 'Aberta'
      case 'EM_ANDAMENTO': return 'Em Andamento'
      case 'ENCERRADA': return 'Encerrada'
      case 'CANCELADA': return 'Cancelada'
      default: return status
    }
  }

  // Cor correspondente ao status da turma
  const obterCorStatus = (status: StatusTurma): { bg: string; text: string } => {
    switch (status) {
      case 'PLANEJADA':
        return { bg: 'hsl(210, 40%, 95%)', text: 'var(--cor-texto-secundario)' }
      case 'ABERTA':
        return { bg: 'hsl(142, 76%, 95%)', text: 'var(--cor-sucesso)' }
      case 'EM_ANDAMENTO':
        return { bg: 'hsl(221, 83%, 95%)', text: 'var(--cor-primaria)' }
      case 'ENCERRADA':
        return { bg: 'hsl(215, 28%, 90%)', text: 'var(--cor-azul-escuro)' }
      case 'CANCELADA':
        return { bg: 'hsl(350, 89%, 96%)', text: 'var(--cor-erro)' }
      default:
        return { bg: 'var(--cor-fundo-alternativo)', text: 'var(--cor-texto)' }
    }
  }

  // 1. Estado de Carregamento
  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Turmas" description="Gerencie as turmas ativas do SGE." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando turmas cadastradas...</p>
        </div>
      </PageContainer>
    )
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Turmas" description="Gerencie as turmas ativas do SGE." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto' }}>{erro}</p>
          <button onClick={carregarTurmas} className="btn-secundario" style={{ marginTop: '12px' }}>Tentar Novamente</button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho */}
      <PageHeader 
        title="Turmas" 
        description="Acompanhe as turmas criadas, vincule professores e organize anos letivos." 
        action={
          <button onClick={handleNovaTurma} className="login-botao" style={{ width: 'auto', padding: '10px 18px', gap: '8px' }}>
            <IconPlus size={18} />
            Nova Turma
          </button>
        }
      />

      {/* Controles de Busca e Filtro */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
        {/* Barra de Busca */}
        <div className="input-group" style={{ flexGrow: 1, margin: 0, minWidth: '250px' }}>
          <div className="input-group-wrapper">
            <span className="input-icon">
              <IconSearch size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por código, disciplina ou professor..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Seletor de Status da Turma */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="filtroStatusClass" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cor-texto-secundario)', whiteSpace: 'nowrap' }}>Status:</label>
          <select
            id="filtroStatusClass"
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
            <option value="TODOS">Todos os Status</option>
            <option value="PLANEJADA">Planejadas</option>
            <option value="ABERTA">Abertas (Matrícula)</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="ENCERRADA">Encerradas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Turmas ou Lista Vazia */}
      {turmasFiltradas.length === 0 ? (
        // 3. Estado de Lista Vazia
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma turma encontrada</h3>
          <p style={{ maxWidth: '380px' }}>Não existem turmas criadas que correspondam aos filtros ou termos de pesquisa selecionados.</p>
        </div>
      ) : (
        // 4. Estado de Sucesso
        <div className="tabela-container">
          <table className="tabela-sge">
            <thead>
              <tr>
                <th>Código/Turma</th>
                <th>Disciplina Associada</th>
                <th>Professor Responsável</th>
                <th>Ano Letivo</th>
                <th>Capacidade</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmasFiltradas.map((t) => {
                const cores = obterCorStatus(t.status)
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)' }}>{t.codigo}</td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{t.disciplinaNome}</span>
                        <span style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)' }}>{t.disciplinaCodigo}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{t.docenteNome}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                        <IconCalendar size={16} />
                        <span>Ano {t.periodoLetivo}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                        <IconUsers size={16} />
                        <span>Máx. {t.capacidade} alunos</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-tag" style={{ backgroundColor: cores.bg, color: cores.text }}>
                        {obterRotuloStatus(t.status)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditarTurma(t)} 
                        className="btn-secundario" 
                        style={{ padding: '8px 10px' }}
                        title="Editar configurações da turma"
                        disabled={t.status === 'CANCELADA'}
                      >
                        <IconEdit size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Renderização do Modal de Cadastro/Edição */}
      <AnimatePresence>
        {modalAberto && (
          <ClassFormModal 
            turmaParaEditar={turmaParaEdicao} 
            onClose={() => setModalAberto(false)} 
            onSave={handleSalvarTurma} 
          />
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
