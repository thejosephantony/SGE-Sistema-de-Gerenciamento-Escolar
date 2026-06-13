import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  IconSearch, 
  IconInbox, 
  IconCalendar, 
  IconUsers, 
  IconNotebook, 
  IconAlertTriangle 
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'
import type { Turma } from '../../turmas/tipos'

interface TurmaComAlunos extends Turma {
  alunosMatriculados: number
}

export default function PaginaMinhasTurmas() {
  const { usuario } = useAuth()
  const [turmas, setTurmas] = useState<TurmaComAlunos[]>([])
  const [busca, setBusca] = useState('')
  
  // UI States
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      if (!usuario) return
      try {
        const [listaTurmas, listaMatriculas] = await Promise.all([
          obterTurmas(),
          obterMatriculas()
        ])

        // Filtra turmas do professor logado
        const minhasTurmas = listaTurmas.filter((t) => t.docenteId === usuario.id && t.status !== 'CANCELADA')

        // Associa a contagem de matrículas ativas para cada turma
        const turmasPreenchidas = minhasTurmas.map((turma) => {
          const totalAtivas = listaMatriculas.filter(
            (m) => m.turmaId === turma.id && m.status === 'ATIVA'
          ).length
          return {
            ...turma,
            alunosMatriculados: totalAtivas
          }
        })

        setTurmas(turmasPreenchidas)
      } catch (err) {
        console.error(err)
        setErro('Não foi possível carregar as suas turmas. Recarregue a página.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [usuario])

  // Filtra pelo termo de busca
  const turmasFiltradas = turmas.filter((t) => {
    return (
      t.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      t.disciplinaNome.toLowerCase().includes(busca.toLowerCase()) ||
      t.disciplinaCodigo.toLowerCase().includes(busca.toLowerCase())
    )
  })

  // Cores de status das turmas
  const obterCoresStatus = (status: string) => {
    switch (status) {
      case 'PLANEJADA':
        return { bg: 'hsl(210, 40%, 95%)', text: 'var(--cor-texto-secundario)', rotulo: 'Planejada' }
      case 'ABERTA':
        return { bg: 'hsl(142, 76%, 95%)', text: 'var(--cor-sucesso)', rotulo: 'Matrícula Aberta' }
      case 'EM_ANDAMENTO':
        return { bg: 'hsl(221, 83%, 95%)', text: 'var(--cor-primaria)', rotulo: 'Em Andamento' }
      case 'ENCERRADA':
        return { bg: 'hsl(215, 28%, 90%)', text: 'var(--cor-azul-escuro)', rotulo: 'Finalizada' }
      default:
        return { bg: 'var(--cor-fundo-alternativo)', text: 'var(--cor-texto)', rotulo: status }
    }
  }

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Minhas Turmas" description="Visualize e gerencie suas turmas ativas." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando suas turmas...</p>
        </div>
      </PageContainer>
    )
  }

  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Minhas Turmas" description="Visualize e gerencie suas turmas ativas." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
          <p>{erro}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Minhas Turmas" 
        description="Consulte as matérias sob sua responsabilidade, cronograma de aulas e densidade de alunos por sala." 
      />

      {/* Caixa de Busca */}
      <div className="input-group" style={{ margin: 0, width: '100%', maxWidth: '480px' }}>
        <div className="input-group-wrapper">
          <span className="input-icon">
            <IconSearch size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Buscar por código da turma ou nome da disciplina..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {turmasFiltradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma turma encontrada</h3>
          <p style={{ maxWidth: '380px' }}>Você não possui turmas ativas registradas com esses parâmetros.</p>
        </div>
      ) : (
        /* Bento Grid das Turmas */
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%'
          }}
        >
          {turmasFiltradas.map((t) => {
            const cores = obterCoresStatus(t.status)
            const percentualOcupacao = Math.min(100, Math.round((t.alunosMatriculados / t.capacidade) * 100))
            
            return (
              <motion.div
                key={t.id}
                whileHover={{ y: -4, boxShadow: 'var(--sombra-card)' }}
                style={{
                  backgroundColor: 'var(--cor-fundo)',
                  borderRadius: '12px',
                  border: '1px solid var(--cor-borda)',
                  boxShadow: 'var(--sombra-suave)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                }}
              >
                {/* Cabeçalho do Card */}
                <div style={{ padding: '24px', borderBottom: '1px solid var(--cor-borda)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--cor-primaria)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t.disciplinaCodigo}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--cor-azul-escuro)', marginTop: '4px', lineHeight: '1.3' }}>
                      {t.disciplinaNome}
                    </h3>
                  </div>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      backgroundColor: cores.bg, 
                      color: cores.text,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cores.rotulo}
                  </span>
                </div>

                {/* Corpo do Card */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                  {/* Dados Básicos */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconCalendar size={16} />
                      Ano Letivo: <strong>{t.periodoLetivo}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconUsers size={16} />
                      Turma: <strong>{t.codigo}</strong>
                    </span>
                  </div>

                  {/* Barra de Ocupação/Alunos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Alunos Matriculados</span>
                      <span style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)' }}>{t.alunosMatriculados} / {t.capacidade}</span>
                    </div>
                    {/* Linha de Progresso */}
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--cor-fundo-alternativo)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentualOcupacao}%`, backgroundColor: percentualOcupacao > 90 ? 'var(--cor-erro)' : 'var(--cor-primaria)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div style={{ padding: '16px 24px', backgroundColor: 'var(--cor-fundo-alternativo)', borderTop: '1px solid var(--cor-borda)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link 
                    to={`/professor/diario?turmaId=${t.id}`}
                    className="login-botao"
                    style={{ 
                      width: 'auto', 
                      padding: '8px 16px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      gap: '6px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconNotebook size={16} />
                    Abrir Diário
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
