import { useState, useEffect } from 'react'
import { 
  IconCalendar, 
  IconClock, 
  IconMapPin, 
  IconUser,
  IconInbox
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import type { Matricula } from '../../matriculas/tipos'
import type { Turma } from '../../turmas/tipos'

interface AulaGrade {
  hora: string
  segunda: { codigo: string; nome: string; professor: string; sala: string } | null
  terca: { codigo: string; nome: string; professor: string; sala: string } | null
  quarta: { codigo: string; nome: string; professor: string; sala: string } | null
  quinta: { codigo: string; nome: string; professor: string; sala: string } | null
  sexta: { codigo: string; nome: string; professor: string; sala: string } | null
}

export default function PaginaHorario() {
  const { usuario } = useAuth()
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      if (!usuario) return
      try {
        const [todasMatriculas, todasTurmas] = await Promise.all([
          obterMatriculas(),
          obterTurmas()
        ])

        // Matrículas ativas do estudante
        const minhasMatriculas = todasMatriculas.filter(
          (m) => Number(m.discenteId) === usuario.id && m.status === 'ATIVA'
        )
        setMatriculas(minhasMatriculas)
        setTurmas(todasTurmas)
      } catch (err) {
        console.error('Erro ao carregar horários do aluno:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [usuario])

  // Dicionário de horários padrão para as matérias escolares do CES
  // Se o aluno tiver a matrícula ativa na matéria, ela aparece na grade horária.
  const possuiMateria = (codigoDisciplina: string) => {
    const matricula = matriculas.find((m) => m.disciplinaCodigo === codigoDisciplina)
    if (!matricula) return null

    // Busca dados adicionais do professor e turma
    const turmaObj = turmas.find((t) => t.id === matricula.turmaId)
    return {
      codigo: matricula.disciplinaCodigo,
      nome: matricula.disciplinaNome,
      professor: turmaObj?.docenteNome || 'Professor da Disciplina',
      sala: `Bloco A — Sala ${turmaObj?.codigo === 'T01' ? '102' : '104'}`
    }
  }

  // Definição da Grade Horária Escolar (Matérias distribuídas na semana)
  const gradeAulas: AulaGrade[] = [
    {
      hora: '07:30 - 09:10',
      segunda: possuiMateria('PORT1001'), // Língua Portuguesa
      terca: possuiMateria('MATE2002'),    // Matemática
      quarta: possuiMateria('PORT1001'),   // Língua Portuguesa
      quinta: possuiMateria('MATE2002'),   // Matemática
      sexta: possuiMateria('HIST3003')     // História
    },
    {
      hora: '09:30 - 11:10',
      segunda: possuiMateria('GEOG4004'), // Geografia
      terca: possuiMateria('HIST3003'),    // História
      quarta: possuiMateria('GEOG4004'),   // Geografia
      quinta: possuiMateria('PORT1001'),   // Língua Portuguesa
      sexta: possuiMateria('MATE2002')     // Matemática
    }
  ]

  const diasSemana = [
    { chave: 'segunda', label: 'Segunda-feira' },
    { chave: 'terca', label: 'Terça-feira' },
    { chave: 'quarta', label: 'Quarta-feira' },
    { chave: 'quinta', label: 'Quinta-feira' },
    { chave: 'sexta', label: 'Sexta-feira' }
  ] as const

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Grade Horária" description="Carregando o quadro de horários..." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Estruturando horários...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Cabeçalho */}
      <PageHeader 
        title="Grade Horária" 
        description="Consulte os horários das suas aulas e a localização das salas de aula para a semana letiva." 
      />

      {matriculas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Você não está matriculado em nenhuma turma</h3>
          <p style={{ maxWidth: '400px' }}>Procure a secretaria escolar para solicitar suas matrículas e visualizar seu quadro de horários.</p>
        </div>
      ) : (
        /* Quadro de Horários Grid */
        <div className="tabela-container" style={{ overflowX: 'auto' }}>
          <table className="tabela-sge" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px' }}>
            <thead>
              <tr>
                <th style={{ width: '140px', padding: '16px 20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconClock size={16} /> Horário
                  </span>
                </th>
                {diasSemana.map((d) => (
                  <th key={d.chave} style={{ padding: '16px 20px', textAlign: 'center' }}>
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradeAulas.map((aula, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--cor-borda)' }}>
                  {/* Horário da Aula */}
                  <td style={{ padding: '24px 20px', fontWeight: 'bold', color: 'var(--cor-azul-escuro)', backgroundColor: 'var(--cor-fundo-alternativo)', fontSize: '14px', fontFamily: 'monospace' }}>
                    {aula.hora}
                  </td>
                  
                  {/* Dias da semana */}
                  {diasSemana.map((dia) => {
                    const materia = aula[dia.chave]
                    
                    return (
                      <td key={dia.chave} style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {materia ? (
                          <div 
                            style={{
                              backgroundColor: 'var(--cor-primaria-suave)',
                              border: '1px solid var(--cor-borda)',
                              padding: '16px',
                              borderRadius: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.03)'
                            }}
                          >
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cor-primaria)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {materia.codigo}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cor-azul-escuro)', lineHeight: '1.2' }}>
                              {materia.nome}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: 'var(--cor-texto-secundario)', marginTop: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                <IconUser size={12} /> {materia.professor}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontWeight: 600 }}>
                                <IconMapPin size={12} /> {materia.sala}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div 
                            style={{
                              border: '1px dashed var(--cor-borda)',
                              padding: '16px',
                              borderRadius: '10px',
                              color: 'var(--cor-texto-secundario)',
                              fontSize: '12px',
                              fontStyle: 'italic',
                              opacity: 0.6
                            }}
                          >
                            Horário Livre
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Informativo */}
      <div style={{ display: 'flex', gap: '12px', backgroundColor: 'var(--cor-fundo)', padding: '20px', borderRadius: '12px', border: '1px solid var(--cor-borda)', alignItems: 'center', width: '100%' }}>
        <IconCalendar size={24} style={{ color: 'var(--cor-primaria)' }} />
        <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: 0 }}>
          <strong>Aviso sobre Salas:</strong> A alocação de salas é gerada de acordo com as disponibilidades físicas das turmas. Em caso de dúvidas sobre as salas de aula de simulados ou aulas extras, dirija-se à secretaria acadêmica.
        </p>
      </div>
    </PageContainer>
  )
}
