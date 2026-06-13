import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  IconBook, 
  IconCalendarEvent, 
  IconAlertCircle, 
  IconTrendingUp, 
  IconAward, 
  IconChecklist, 
  IconBell, 
  IconArrowRight 
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'
import type { Matricula } from '../../matriculas/tipos'

interface EstatisticasAluno {
  mediaGeral: number
  frequenciaGeral: number
  totalMaterias: number
  totalFaltas: number
}

export default function PaginaPainelAluno() {
  const { usuario } = useAuth()
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [stats, setStats] = useState<EstatisticasAluno>({
    mediaGeral: 0,
    frequenciaGeral: 0,
    totalMaterias: 0,
    totalFaltas: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDadosAluno() {
      if (!usuario) return
      try {
        const todasMatriculas = await obterMatriculas()
        
        // Filtra matrículas ativas para o aluno logado
        const minhasMatriculas = todasMatriculas.filter(
          (m) => m.discenteId === usuario.id && m.status === 'ATIVA'
        )
        setMatriculas(minhasMatriculas)

        // Cálculo de estatísticas
        let somaMedias = 0
        let totalMateriasComNota = 0
        let somatorioFrequencia = 0
        let totalFaltas = 0

        minhasMatriculas.forEach((m) => {
          const p1 = m.notaP1 !== undefined ? m.notaP1 : NaN
          const p2 = m.notaP2 !== undefined ? m.notaP2 : NaN
          const faltas = m.faltas || 0
          
          totalFaltas += faltas
          
          // Frequência por matéria (cada falta reduz 4% de presença)
          const freqMat = Math.max(0, 100 - (faltas * 4))
          somatorioFrequencia += freqMat

          if (!isNaN(p1) && !isNaN(p2)) {
            somaMedias += (p1 + p2) / 2
            totalMateriasComNota++
          }
        })

        const mediaGeral = totalMateriasComNota > 0 
          ? Number((somaMedias / totalMateriasComNota).toFixed(2)) 
          : 0
          
        const frequenciaGeral = minhasMatriculas.length > 0 
          ? Math.round(somatorioFrequencia / minhasMatriculas.length) 
          : 100

        setStats({
          mediaGeral,
          frequenciaGeral,
          totalMaterias: minhasMatriculas.length,
          totalFaltas
        })
      } catch (err) {
        console.error('Erro ao buscar dados do painel do aluno:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosAluno()
  }, [usuario])

  // Avisos escolares fictícios de alta qualidade
  const avisosMural = [
    {
      id: 1,
      titulo: 'Simulado Geral 1º Bimestre',
      conteudo: 'Atenção alunos, o primeiro simulado geral ocorrerá no próximo sábado (20/06) às 08:00. A participação é obrigatória.',
      data: 'Hoje às 09:00',
      tipo: 'alerta',
      icone: IconAlertCircle,
      cor: 'var(--cor-erro)'
    },
    {
      id: 2,
      titulo: 'Inscrições Abertas - Olimpíada de Matemática',
      conteudo: 'Inscreva-se na secretaria ou pelo portal com seu professor de Matemática. As provas da primeira fase iniciam dia 28/06.',
      data: 'Ontem',
      tipo: 'evento',
      icone: IconCalendarEvent,
      cor: 'var(--cor-primaria)'
    },
    {
      id: 3,
      titulo: 'Recesso Escolar de São João',
      conteudo: 'A diretoria informa que não haverá atividades letivas presenciais entre os dias 23 e 26 de junho em virtude dos festejos juninos.',
      data: '10 de Junho',
      tipo: 'info',
      icone: IconBell,
      cor: 'var(--cor-alerta)'
    }
  ]

  const cartoesMetricas = [
    {
      titulo: 'Média Geral',
      valor: stats.mediaGeral > 0 ? `${stats.mediaGeral.toFixed(1)}` : 'Sem Notas',
      descricao: 'Desempenho acadêmico',
      icone: IconAward,
      cor: stats.mediaGeral >= 6.0 ? 'var(--cor-sucesso)' : 'var(--cor-alerta)'
    },
    {
      titulo: 'Frequência Geral',
      valor: `${stats.frequenciaGeral}%`,
      descricao: 'Presença nas salas de aula',
      icone: IconChecklist,
      cor: stats.frequenciaGeral >= 75 ? 'var(--cor-primaria)' : 'var(--cor-erro)'
    },
    {
      titulo: 'Matérias Ativas',
      valor: stats.totalMaterias,
      descricao: 'Disciplinas matriculadas',
      icone: IconBook,
      cor: 'var(--cor-azul-claro)'
    },
    {
      titulo: 'Faltas Acumuladas',
      valor: stats.totalFaltas,
      descricao: 'Total de faltas registradas',
      icone: IconAlertCircle,
      cor: stats.totalFaltas > 5 ? 'var(--cor-alerta)' : 'var(--cor-texto-secundario)'
    }
  ]

  const containerVariantes = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariantes = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Painel Geral" description="Carregando boletim do aluno..." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Buscando notas e faltas...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho */}
      <PageHeader 
        title="Painel Geral" 
        description={`Olá, ${usuario?.nome || 'Aluno'}! Acompanhe seu progresso, boletim e avisos da secretaria para o ano letivo 2026.`} 
      />

      {/* Grid de Estatísticas */}
      <motion.div 
        variants={containerVariantes}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          width: '100%'
        }}
      >
        {cartoesMetricas.map((c, index) => (
          <motion.div
            key={index}
            variants={itemVariantes}
            whileHover={{ y: -4, boxShadow: 'var(--sombra-card)' }}
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
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cor-texto-secundario)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {c.titulo}
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cor-azul-escuro)', marginBottom: '4px', fontFamily: 'monospace' }}>
                {c.valor}
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)' }}>
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
              <c.icone size={24} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Duas Colunas: Desempenho e Avisos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
        
        {/* Rendimento por Matéria */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconTrendingUp size={18} style={{ color: 'var(--cor-primaria)' }} />
            Meu Rendimento por Matéria
          </h3>
          
          {matriculas.length === 0 ? (
            <p style={{ color: 'var(--cor-texto-secundario)', textAlign: 'center', padding: '20px' }}>Você não possui matrículas ativas em nenhuma disciplina.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {matriculas.map((m) => {
                const p1 = m.notaP1 !== undefined ? m.notaP1 : NaN
                const p2 = m.notaP2 !== undefined ? m.notaP2 : NaN
                const temNotas = !isNaN(p1) && !isNaN(p2)
                const mediaCalculada = temNotas ? (p1 + p2) / 2 : 0
                const percentualProgresso = Math.min(100, Math.round((mediaCalculada / 10) * 100))

                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)', fontSize: '14px' }}>
                          {m.disciplinaNome}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)', marginLeft: '8px' }}>
                          ({m.disciplinaCodigo})
                        </span>
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', fontFamily: 'monospace', color: mediaCalculada >= 6.0 ? 'var(--cor-sucesso)' : 'var(--cor-alerta)' }}>
                        Média: {temNotas ? mediaCalculada.toFixed(1) : 'Sem Nota'}
                      </span>
                    </div>
                    {/* Barra de Progresso da Nota */}
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--cor-fundo-alternativo)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentualProgresso}%` }}
                        transition={{ duration: 0.6 }}
                        style={{ 
                          height: '100%', 
                          backgroundColor: mediaCalculada >= 6.0 ? 'var(--cor-sucesso)' : 'var(--cor-alerta)', 
                          borderRadius: '4px' 
                        }}
                      ></motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Mural de Recados */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconBell size={18} style={{ color: 'var(--cor-alerta)' }} />
            Mural da Escola
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {avisosMural.map((av) => (
              <div 
                key={av.id} 
                style={{ 
                  padding: '16px', 
                  backgroundColor: 'var(--cor-fundo-alternativo)', 
                  borderRadius: '8px', 
                  borderLeft: `4px solid ${av.cor}` 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cor-azul-escuro)' }}>
                    {av.titulo}
                  </h4>
                  <span style={{ fontSize: '10px', color: 'var(--cor-texto-secundario)' }}>
                    {av.data}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)', lineHeight: '1.4' }}>
                  {av.conteudo}
                </p>
              </div>
            ))}
          </div>

          <Link 
            to="/aluno/boletim" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              marginTop: '16px', 
              fontSize: '13px', 
              color: 'var(--cor-primaria)', 
              fontWeight: 700,
              textDecoration: 'none'
            }} 
            className="hover-underline"
          >
            <span>Ver boletim completo</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

      </div>
    </PageContainer>
  )
}
