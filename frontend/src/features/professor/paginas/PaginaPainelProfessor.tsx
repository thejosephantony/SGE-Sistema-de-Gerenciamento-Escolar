import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  IconUsers, 
  IconSchool, 
  IconBook, 
  IconUsersGroup, 
  IconArrowUpRight, 
  IconActivity,
  IconBookmark,
  IconCheck
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'

interface EstatisticasProfessor {
  totalTurmas: number
  totalAlunos: number
  mediaNotas: number
  mediaFrequencia: number
}

export default function PaginaPainelProfessor() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState<EstatisticasProfessor>({
    totalTurmas: 0,
    totalAlunos: 0,
    mediaNotas: 0,
    mediaFrequencia: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarEstatisticas() {
      if (!usuario) return
      try {
        const [todasTurmas, todasMatriculas] = await Promise.all([
          obterTurmas(),
          obterMatriculas()
        ])

        // Filtra as turmas do professor logado
        const minhasTurmas = todasTurmas.filter((t) => Number(t.docenteId) === usuario.id && t.status !== 'CANCELADA')
        const minhasTurmasIds = minhasTurmas.map((t) => t.id)

        // Filtra as matrículas nas turmas do professor
        const matriculasMinhasTurmas = todasMatriculas.filter(
          (m) => minhasTurmasIds.includes(m.turmaId) && m.status === 'ATIVA'
        )

        // Calcula média de notas
        let somaNotas = 0
        let totalNotasValidas = 0
        matriculasMinhasTurmas.forEach((m) => {
          if (m.notaP1 !== undefined || m.notaP2 !== undefined) {
            const p1 = m.notaP1 || 0
            const p2 = m.notaP2 || 0
            somaNotas += (p1 + p2) / 2
            totalNotasValidas++
          }
        })
        const mediaNotas = totalNotasValidas > 0 ? Number((somaNotas / totalNotasValidas).toFixed(2)) : 0

        // Calcula média de frequência (baseando-se em 24 aulas totais; cada falta = -4.16% de presença)
        let somatorioFrequencia = 0
        matriculasMinhasTurmas.forEach((m) => {
          const faltas = m.faltas || 0
          const presenca = Math.max(0, 100 - (faltas * 4)) // Cada falta reduz 4% de frequência
          somatorioFrequencia += presenca
        })
        const mediaFrequencia = matriculasMinhasTurmas.length > 0 
          ? Math.round(somatorioFrequencia / matriculasMinhasTurmas.length) 
          : 100

        setStats({
          totalTurmas: minhasTurmas.length,
          totalAlunos: matriculasMinhasTurmas.length,
          mediaNotas,
          mediaFrequencia
        })
      } catch (err) {
        console.error('Erro ao calcular estatísticas do professor:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarEstatisticas()
  }, [usuario])

  // Atividades recentes simuladas do diário escolar
  const atividadesRecentes = [
    {
      id: 1,
      acao: 'Nota lançada',
      detalhe: 'Notas P1 e P2 lançadas para Lucas Gonzaga Santos em Língua Portuguesa.',
      data: 'Hoje às 10:15',
      icone: IconCheck,
      corIcone: 'var(--cor-sucesso)'
    },
    {
      id: 2,
      acao: 'Chamada realizada',
      detalhe: 'Frequência de alunos registrada para a Turma T01 de Matemática.',
      data: 'Ontem às 14:30',
      icone: IconSchool,
      corIcone: 'var(--cor-primaria)'
    },
    {
      id: 3,
      acao: 'Turma vinculada',
      detalhe: 'Você foi vinculado como professor responsável da turma T02 de História.',
      data: '10/06/2026 às 09:00',
      icone: IconBookmark,
      corIcone: 'var(--cor-alerta)'
    }
  ]

  const cartoesMetricas = [
    {
      titulo: 'Minhas Turmas',
      valor: stats.totalTurmas,
      descricao: 'Classes ativas vinculadas',
      icone: IconUsersGroup,
      cor: 'var(--cor-primaria)'
    },
    {
      titulo: 'Total de Alunos',
      valor: stats.totalAlunos,
      descricao: 'Estudantes matriculados',
      icone: IconUsers,
      cor: 'var(--cor-azul-claro)'
    },
    {
      titulo: 'Média de Notas',
      valor: stats.totalAlunos > 0 ? `${stats.mediaNotas} / 10` : 'Sem Notas',
      descricao: 'Aproveitamento geral',
      icone: IconBook,
      cor: 'var(--cor-sucesso)'
    },
    {
      titulo: 'Frequência Média',
      valor: `${stats.mediaFrequencia}%`,
      descricao: 'Presença nas aulas',
      icone: IconSchool,
      cor: 'var(--cor-alerta)'
    }
  ]

  const containerVariantes = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariantes = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Painel Geral" description="Resumo das suas atividades escolares." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando estatísticas...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho */}
      <PageHeader 
        title="Painel Geral" 
        description="Acompanhe o rendimento de suas turmas, atalhos rápidos e histórico do diário de classe." 
      />

      {/* Grid de Estatísticas */}
      <motion.div 
        variants={containerVariantes}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          width: '100%'
        }}
      >
        {cartoesMetricas.map((c, index) => (
          <motion.div
            key={index}
            variants={itemVariantes}
            whileHover={{ y: -5, boxShadow: 'var(--sombra-card)' }}
            style={{
              backgroundColor: 'var(--cor-fundo)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--cor-borda)',
              boxShadow: 'var(--sombra-suave)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'default',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease'
            }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cor-texto-secundario)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {c.titulo}
              </p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cor-azul-escuro)', marginBottom: '4px', fontFamily: 'monospace' }}>
                {c.valor}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)' }}>
                {c.descricao}
              </p>
            </div>
            
            <div 
              style={{
                backgroundColor: 'var(--cor-fundo-alternativo)',
                color: c.cor,
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <c.icone size={28} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Layout de Duas Colunas: Logs e Atalhos */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
        
        {/* Atividades Recentes */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconActivity size={18} style={{ color: 'var(--cor-primaria)' }} />
            Diário de Atividades do Professor
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {atividadesRecentes.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'var(--cor-fundo-alternativo)', color: act.corIcone, padding: '10px', borderRadius: '10px', display: 'flex', flexShrink: 0 }}>
                  <act.icone size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--cor-azul-escuro)', display: 'block', marginBottom: '2px' }}>
                    {act.acao}
                  </span>
                  <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', lineHeight: '1.4', marginBottom: '4px' }}>
                    {act.detalhe}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)', opacity: 0.8 }}>
                    {act.data}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px' }}>
            Atalhos do Diário
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/professor/diario" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Lançar Notas & Faltas</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
            
            <Link to="/professor/turmas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Minhas Turmas</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
            
            <Link to="/professor/relatorios" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Imprimir Relatórios</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
