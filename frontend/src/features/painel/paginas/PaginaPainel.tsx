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
  IconUserCheck,
  IconBookmark
} from '@tabler/icons-react'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterUsuarios } from '../../usuarios/servicos/servicoUsuario'
import { obterDisciplinas } from '../../disciplinas/servicos/servicoDisciplina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'

interface Estatisticas {
  totalEstudantes: number
  totalDocentes: number
  totalDisciplinas: number
  totalTurmas: number
}

// Atividades recentes fictícias para simular auditoria de sistema (UC12 / Rastreabilidade)
const ATIVIDADES_RECENTES = [
  {
    id: 1,
    acao: 'Matrícula efetuada',
    detalhe: 'Estudante Lucas Gonzaga Santos matriculado na turma T01 de Língua Portuguesa.',
    data: 'Hoje às 10:45',
    icone: IconUserCheck,
    corIcone: 'var(--cor-sucesso)'
  },
  {
    id: 2,
    acao: 'Nova turma criada',
    detalhe: 'Turma T02 criada para a disciplina Matemática (MATE2002).',
    data: 'Hoje às 09:12',
    icone: IconSchool,
    corIcone: 'var(--cor-primaria)'
  },
  {
    id: 3,
    acao: 'Disciplina atualizada',
    detalhe: 'Dados da disciplina História (HIST3003) foram alterados pelo Administrador.',
    data: 'Ontem às 16:30',
    icone: IconBookmark,
    corIcone: 'var(--cor-alerta)'
  },
  {
    id: 4,
    acao: 'Cadastro de professor',
    detalhe: 'Professor Roberto Alves Santos adicionado e vinculado ao perfil Docente.',
    data: '10/06/2026 às 14:20',
    icone: IconUsers,
    corIcone: 'var(--cor-azul-brilhante)'
  }
]

/**
 * Painel principal do Administrador.
 * Agrupa métricas dinâmicas, atalhos de ações rápidas e um feed de rastreabilidade do sistema.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState<Estatisticas>({
    totalEstudantes: 0,
    totalDocentes: 0,
    totalDisciplinas: 0,
    totalTurmas: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const [usuarios, disciplinas, turmas] = await Promise.all([
          obterUsuarios(),
          obterDisciplinas(),
          obterTurmas()
        ])

        const totalEstudantes = usuarios.filter((u) => u.perfil === 'DISCENTE').length
        const totalDocentes = usuarios.filter((u) => u.perfil === 'DOCENTE').length
        const totalDisciplinas = disciplinas.filter((d) => d.ativa).length
        const totalTurmas = turmas.filter((t) => t.status !== 'CANCELADA').length

        setStats({ totalEstudantes, totalDocentes, totalDisciplinas, totalTurmas })
      } catch (err) {
        console.error('Erro ao calcular estatísticas do dashboard:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarEstatisticas()
  }, [])

  // Definição dos cartões de métricas do dashboard
  const cartoesMetricas = [
    {
      titulo: 'Alunos Matriculados',
      valor: stats.totalEstudantes,
      descricao: 'Alunos ativos no ano',
      icone: IconUsers,
      cor: 'var(--cor-primaria)'
    },
    {
      titulo: 'Corpo Docente',
      valor: stats.totalDocentes,
      descricao: 'Professores cadastrados',
      icone: IconUsersGroup,
      cor: 'var(--cor-alerta)'
    },
    {
      titulo: 'Disciplinas Ativas',
      valor: stats.totalDisciplinas,
      descricao: 'Na grade curricular',
      icone: IconBook,
      cor: 'var(--cor-sucesso)'
    },
    {
      titulo: 'Turmas em Curso',
      valor: stats.totalTurmas,
      descricao: 'Ano letivo 2026',
      icone: IconSchool,
      cor: 'var(--cor-azul-claro)'
    }
  ]

  // Configuração para animação em cascata (Staggered layout)
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
        <PageHeader title="Painel Geral" description="Resumo das atividades escolares no SGE." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando dados do painel...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho */}
      <PageHeader 
        title="Painel Geral" 
        description="Acompanhe estatísticas, logs de atividade e atalhos rápidos do SGE." 
      />

      {/* Grid de Estatísticas (Cartões Premium Animados) */}
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
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cor-azul-escuro)', marginBottom: '4px' }}>
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

      {/* Layout de Duas Colunas: Atividades Recentes e Atalhos Rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
        
        {/* Atividades Recentes (Auditoria/Rastreabilidade) */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconActivity size={18} style={{ color: 'var(--cor-primaria)' }} />
            Atividades Recentes do Sistema
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {ATIVIDADES_RECENTES.map((act) => (
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

        {/* Links Rápidos (Ações Frequentes) */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px' }}>
            Ações Administrativas
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/admin/matriculas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Matricular Aluno</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
            
            <Link to="/admin/turmas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Criar Turma</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
            
            <Link to="/admin/disciplinas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Cadastrar Disciplina</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
            
            <Link to="/admin/usuarios" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--cor-borda)', borderRadius: '8px', color: 'var(--cor-texto)', fontWeight: 600, fontSize: '14px', backgroundColor: 'var(--cor-fundo)', textDecoration: 'none', transition: 'var(--transicao-suave)' }} className="btn-link-action">
              <span>Novo Usuário</span>
              <IconArrowUpRight size={18} style={{ color: 'var(--cor-texto-secundario)' }} />
            </Link>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
