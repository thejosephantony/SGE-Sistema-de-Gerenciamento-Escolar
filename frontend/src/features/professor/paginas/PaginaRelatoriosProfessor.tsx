import React, { useState, useEffect } from 'react'
import { 
  IconFileText, 
  IconDownload, 
  IconPrinter, 
  IconCheck, 
  IconAlertTriangle,
  IconReport
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'
import type { Turma } from '../../turmas/tipos'
import type { Matricula } from '../../matriculas/tipos'

type TipoRelatorioProf = 'PAUTA' | 'CHAMADA'

export default function PaginaRelatoriosProfessor() {
  const { usuario } = useAuth()
  const [tipo, setTipo] = useState<TipoRelatorioProf>('PAUTA')
  const [turmaId, setTurmaId] = useState('')

  // Listas de dados
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [matriculasTurma, setMatriculasTurma] = useState<Matricula[]>([])

  // UI States
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [relatorioGerado, setRelatorioGerado] = useState(false)

  // Carrega as turmas do professor logado
  useEffect(() => {
    async function carregarTurmas() {
      if (!usuario) return
      try {
        const listaTurmas = await obterTurmas()
        const filtradas = listaTurmas.filter((t) => t.docenteId === usuario.id && t.status !== 'CANCELADA')
        setTurmas(filtradas)
        if (filtradas.length > 0) {
          setTurmaId(filtradas[0].id)
        }
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar turmas vinculadas.')
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarTurmas()
  }, [usuario])

  // Carrega matrículas quando a turma selecionada ou o relatório gerado muda
  useEffect(() => {
    async function carregarMatriculasTurma() {
      if (!turmaId) return
      try {
        const todasMatriculas = await obterMatriculas()
        const filtradas = todasMatriculas.filter(
          (m) => m.turmaId === turmaId && m.status === 'ATIVA'
        )
        setMatriculasTurma(filtradas)
      } catch (err) {
        console.error(err)
      }
    }

    carregarMatriculasTurma()
  }, [turmaId, relatorioGerado])

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault()
    setGerandoRelatorio(true)
    setRelatorioGerado(false)

    setTimeout(() => {
      setGerandoRelatorio(false)
      setRelatorioGerado(true)
    }, 900)
  }

  // Turma selecionada
  const turmaSelecionada = turmas.find((t) => t.id === turmaId)

  if (carregandoDados) {
    return (
      <PageContainer>
        <PageHeader title="Relatórios Escolares" description="Emita pautas de notas ou diários de chamada." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando turmas...</p>
        </div>
      </PageContainer>
    )
  }

  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Relatórios Escolares" description="Emita pautas de notas ou diários de chamada." />
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
        title="Relatórios Escolares" 
        description="Gere e exporte a pauta de notas final ou diário de presença das turmas sob seu ensino." 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Painel de Filtros e Seleção */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconReport size={18} style={{ color: 'var(--cor-primaria)' }} />
            Parâmetros do Documento
          </h3>

          <form onSubmit={handleGerarRelatorio}>
            {/* Tipo de Relatório */}
            <div className="input-group">
              <label htmlFor="selectTipoRel">Selecione o Tipo de Documento</label>
              <select
                id="selectTipoRel"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as TipoRelatorioProf)
                  setRelatorioGerado(false)
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--raio-borda)',
                  border: '1px solid var(--cor-borda)',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: 'var(--cor-fundo)',
                  fontWeight: 600
                }}
                disabled={gerandoRelatorio}
              >
                <option value="PAUTA">Pauta de Notas da Turma</option>
                <option value="CHAMADA">Ficha de Frequência Consolidada</option>
              </select>
            </div>

            {/* Seleção da Turma */}
            <div className="input-group">
              <label htmlFor="selectTurmRel">Selecione a Turma</label>
              {turmas.length === 0 ? (
                <p style={{ color: 'var(--cor-erro)', fontSize: '13px' }}>Nenhuma turma disponível.</p>
              ) : (
                <select
                  id="selectTurmRel"
                  value={turmaId}
                  onChange={(e) => {
                    setTurmaId(e.target.value)
                    setRelatorioGerado(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--raio-borda)',
                    border: '1px solid var(--cor-borda)',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: 'var(--cor-fundo)'
                  }}
                  disabled={gerandoRelatorio}
                >
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>{t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})</option>
                  ))}
                </select>
              )}
            </div>

            <button 
              type="submit" 
              className="login-botao" 
              style={{ width: '100%', gap: '8px', marginTop: '8px' }}
              disabled={gerandoRelatorio || turmas.length === 0}
            >
              {gerandoRelatorio ? (
                <>
                  <span className="spinner"></span>
                  <span>Gerando Pauta...</span>
                </>
              ) : (
                <>
                  <IconFileText size={18} />
                  Visualizar Diário
                </>
              )}
            </button>
          </form>
        </div>

        {/* Visualização de Relatório Gerado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!relatorioGerado ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <IconFileText size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhum relatório emitido</h3>
              <p style={{ maxWidth: '380px' }}>Selecione a turma e o diário desejado para visualizar a caderneta escolar em tempo real.</p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-card)', overflow: 'hidden' }}>
              {/* Barra de Ações */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--cor-fundo-alternativo)', borderBottom: '1px solid var(--cor-borda)' }}>
                <span style={{ fontSize: '12px', color: 'var(--cor-sucesso)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconCheck size={16} /> Caderneta Gerada com Sucesso
                </span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={() => alert("Simulando download do arquivo PDF do diário de classe...")}>
                    <IconDownload size={14} />
                    Exportar
                  </button>
                  <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={() => window.print()}>
                    <IconPrinter size={14} />
                    Imprimir
                  </button>
                </div>
              </div>

              {/* Corpo do Diário de Classe Simulado */}
              <div style={{ padding: '40px', color: 'black', fontFamily: 'serif', fontSize: '14px', lineHeight: '1.6' }}>
                {/* Cabeçalho */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'var(--fonte-sans)', fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Colégio Estadual de Sergipe</h2>
                  <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '13px', margin: '4px 0 0 0', color: '#4b5563' }}>Portal do Professor SGE — Caderneta Escolar Oficial</p>
                  <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '12px', margin: '2px 0 0 0', color: '#6b7280' }}>Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                </div>

                {turmaSelecionada && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--fonte-sans)', fontSize: '16px', textTransform: 'uppercase', fontWeight: 700 }}>
                      {tipo === 'PAUTA' ? 'Pauta de Notas da Turma' : 'Ficha de Frequência Consolidada'}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', fontFamily: 'var(--fonte-sans)', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#374151' }}>
                      <div>
                        <strong>Matéria / Disciplina:</strong> {turmaSelecionada.disciplinaNome} ({turmaSelecionada.disciplinaCodigo})<br />
                        <strong>Professor:</strong> {usuario?.nome}
                      </div>
                      <div>
                        <strong>Turma / Código:</strong> {turmaSelecionada.codigo}<br />
                        <strong>Ano Letivo:</strong> {turmaSelecionada.periodoLetivo}
                      </div>
                    </div>

                    {matriculasTurma.length === 0 ? (
                      <p style={{ fontFamily: 'var(--fonte-sans)', textAlign: 'center', color: '#6b7280', padding: '20px' }}>Não há registros de alunos para esta turma.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--fonte-sans)' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>Matrícula</th>
                            <th style={{ padding: '8px' }}>Nome do Aluno</th>
                            {tipo === 'PAUTA' ? (
                              <>
                                <th style={{ padding: '8px', textAlign: 'center' }}>P1</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>P2</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Média</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Situação</th>
                              </>
                            ) : (
                              <>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Faltas</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Frequência</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Condição</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {matriculasTurma.map((m) => {
                            const p1 = m.notaP1 !== undefined ? m.notaP1 : NaN
                            const p2 = m.notaP2 !== undefined ? m.notaP2 : NaN
                            const media = !isNaN(p1) && !isNaN(p2) ? (p1 + p2) / 2 : NaN
                            
                            const faltas = m.faltas || 0
                            const freq = Math.max(0, 100 - (faltas * 4))

                            return (
                              <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px 8px', fontFamily: 'monospace' }}>{m.discenteMatricula}</td>
                                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{m.discenteNome}</td>
                                {tipo === 'PAUTA' ? (
                                  <>
                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace' }}>{!isNaN(p1) ? p1.toFixed(1) : '--'}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace' }}>{!isNaN(p2) ? p2.toFixed(1) : '--'}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }}>{!isNaN(media) ? media.toFixed(1) : '--'}</td>
                                    <td style={{ 
                                      padding: '10px 8px', 
                                      textAlign: 'right', 
                                      fontWeight: 'bold',
                                      color: freq < 75 ? '#dc2626' : isNaN(media) ? '#4b5563' : media >= 6.0 ? '#16a34a' : '#d97706'
                                    }}>
                                      {freq < 75 ? 'REP. FALTAS' : isNaN(media) ? 'SEM NOTAS' : media >= 6.0 ? 'APROVADO' : 'RECUPERAÇÃO'}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace' }}>{faltas}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }}>{freq}%</td>
                                    <td style={{ 
                                      padding: '10px 8px', 
                                      textAlign: 'right', 
                                      fontWeight: 'bold',
                                      color: freq >= 75 ? '#16a34a' : '#dc2626'
                                    }}>
                                      {freq >= 75 ? 'REGULAR' : 'INSUFICIENTE'}
                                    </td>
                                  </>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
