import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconNotebook, 
  IconDeviceFloppy, 
  IconAlertTriangle, 
  IconInbox,
  IconSearch
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import { obterMatriculas, atualizarNotasFaltas } from '../../matriculas/servicos/servicoMatricula'
import type { Turma } from '../../turmas/tipos'
import type { Matricula } from '../../matriculas/tipos'

interface RegistroNotasFaltas {
  notaP1: string
  notaP2: string
  faltas: string
}

export default function PaginaDiarioClasse() {
  const { usuario } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlTurmaId = searchParams.get('turmaId')

  // Listas de dados
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState('')
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  
  // Estado local para armazenar as edições temporárias dos inputs
  const [dadosEdicao, setDadosEdicao] = useState<Record<string, RegistroNotasFaltas>>({})

  // UI States
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [salvandoDados, setSalvandoDados] = useState(false)
  const [buscaEstudante, setBuscaEstudante] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)

  // 1. Carrega as turmas do professor
  useEffect(() => {
    async function carregarTurmasProfessor() {
      if (!usuario) return
      try {
        const listaTurmas = await obterTurmas()
        const filtradas = listaTurmas.filter((t) => Number(t.docenteId) === usuario.id && t.status !== 'CANCELADA')
        setTurmas(filtradas)

        if (filtradas.length > 0) {
          // Preenche com a turma da URL ou a primeira da lista
          const inicialId = urlTurmaId && filtradas.some((t) => t.id === urlTurmaId) 
            ? urlTurmaId 
            : filtradas[0].id
          setTurmaSelecionadaId(inicialId)
        }
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar a lista de turmas.')
      } finally {
        setCarregandoDados(false)
      }
    }
    carregarTurmasProfessor()
  }, [usuario, urlTurmaId])

  // 2. Carrega as matrículas da turma selecionada
  useEffect(() => {
    async function carregarAlunosTurma() {
      if (!turmaSelecionadaId) return
      try {
        const todasMatriculas = await obterMatriculas()
        const filtradas = todasMatriculas.filter(
          (m) => m.turmaId === turmaSelecionadaId && m.status === 'ATIVA'
        )
        setMatriculas(filtradas)

        // Inicializa o estado de edição com os valores atuais do banco mock
        const dicionarioEdicao: Record<string, RegistroNotasFaltas> = {}
        filtradas.forEach((m) => {
          dicionarioEdicao[m.id] = {
            notaP1: m.notaP1 !== undefined ? m.notaP1.toString() : '',
            notaP2: m.notaP2 !== undefined ? m.notaP2.toString() : '',
            faltas: m.faltas !== undefined ? m.faltas.toString() : '0'
          }
        })
        setDadosEdicao(dicionarioEdicao)
      } catch (err) {
        console.error(err)
        handleMostrarToast('Erro ao buscar estudantes matriculados.', 'erro')
      }
    }

    carregarAlunosTurma()
  }, [turmaSelecionadaId])

  // Helper de Notificação Toast
  const handleMostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ mensagem, tipo })
    setTimeout(() => {
      setNotificacao(null)
    }, 3500)
  }

  // Handler de mudança da turma
  const handleTrocaTurma = (id: string) => {
    setTurmaSelecionadaId(id)
    setSearchParams({ turmaId: id })
  }

  // Handler de alteração dos inputs de notas e faltas na tabela
  const handleAlterarCampo = (matriculaId: string, campo: keyof RegistroNotasFaltas, valor: string) => {
    setDadosEdicao((prev) => ({
      ...prev,
      [matriculaId]: {
        ...prev[matriculaId],
        [campo]: valor
      }
    }))
  }

  // Validação dos dados digitados
  const validarCampos = (): boolean => {
    for (const matriculaId of Object.keys(dadosEdicao)) {
      const registro = dadosEdicao[matriculaId]
      const alunoNome = matriculas.find((m) => m.id === matriculaId)?.discenteNome || 'Estudante'

      // Validar Nota P1 (opcional, mas se preenchida deve ser entre 0 e 10)
      if (registro.notaP1.trim() !== '') {
        const p1 = Number(registro.notaP1.replace(',', '.'))
        if (isNaN(p1) || p1 < 0 || p1 > 10) {
          handleMostrarToast(`A Nota P1 de ${alunoNome} deve ser um número entre 0 e 10.`, 'erro')
          return false
        }
      }

      // Validar Nota P2 (opcional, mas se preenchida deve ser entre 0 e 10)
      if (registro.notaP2.trim() !== '') {
        const p2 = Number(registro.notaP2.replace(',', '.'))
        if (isNaN(p2) || p2 < 0 || p2 > 10) {
          handleMostrarToast(`A Nota P2 de ${alunoNome} deve ser um número entre 0 e 10.`, 'erro')
          return false
        }
      }

      // Validar Faltas (deve ser número inteiro não negativo)
      const faltasNum = Number(registro.faltas)
      if (registro.faltas.trim() === '' || isNaN(faltasNum) || !Number.isInteger(faltasNum) || faltasNum < 0) {
        handleMostrarToast(`As Faltas de ${alunoNome} devem ser um número inteiro maior ou igual a 0.`, 'erro')
        return false
      }
    }
    return true
  }

  // Grava as alterações no serviço mockado
  const handleSalvarDiario = async () => {
    if (!validarCampos()) return
    setSalvandoDados(true)

    try {
      // Executa as chamadas assíncronas para atualizar cada registro de matrícula
      await Promise.all(
        Object.keys(dadosEdicao).map(async (matriculaId) => {
          const registro = dadosEdicao[matriculaId]
          const p1 = registro.notaP1.trim() !== '' ? Number(registro.notaP1.replace(',', '.')) : undefined
          const p2 = registro.notaP2.trim() !== '' ? Number(registro.notaP2.replace(',', '.')) : undefined
          const faltas = Number(registro.faltas)

          await atualizarNotasFaltas(matriculaId, p1, p2, faltas)
        })
      )

      handleMostrarToast('Diário de classe salvo e atualizado com sucesso!', 'sucesso')
      
      // Recarrega as informações atualizadas
      const todasMatriculas = await obterMatriculas()
      const filtradas = todasMatriculas.filter(
        (m) => m.turmaId === turmaSelecionadaId && m.status === 'ATIVA'
      )
      setMatriculas(filtradas)
    } catch (err) {
      console.error(err)
      handleMostrarToast('Erro ao tentar salvar notas e faltas.', 'erro')
    } finally {
      setSalvandoDados(false)
    }
  }

  // Filtra estudantes da lista na tabela
  const estudantesFiltrados = matriculas.filter((m) => {
    return (
      m.discenteNome.toLowerCase().includes(buscaEstudante.toLowerCase()) ||
      m.discenteMatricula.includes(buscaEstudante)
    )
  })

  // Turma selecionada ativa
  const turmaAtiva = turmas.find((t) => t.id === turmaSelecionadaId)

  if (carregandoDados) {
    return (
      <PageContainer>
        <PageHeader title="Diário de Classe" description="Lance notas e registre faltas dos alunos." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando dados das turmas...</p>
        </div>
      </PageContainer>
    )
  }

  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Diário de Classe" description="Lance notas e registre faltas dos alunos." />
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
        title="Diário de Classe" 
        description="Gerencie a caderneta de chamada, lance notas avaliativas e presenças dos alunos no ano letivo." 
      />

      {/* Barra de Filtros (Seleção de Turma e Busca por Aluno) */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
          {/* Seletor de Turma */}
          <div className="input-group" style={{ margin: 0, minWidth: '240px' }}>
            <label htmlFor="selectTurmaDiario" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cor-texto-secundario)', marginBottom: '6px', display: 'block' }}>Selecionar Turma:</label>
            {turmas.length === 0 ? (
              <p style={{ color: 'var(--cor-erro)', fontSize: '13px' }}>Nenhuma turma ativa vinculada.</p>
            ) : (
              <select
                id="selectTurmaDiario"
                value={turmaSelecionadaId}
                onChange={(e) => handleTrocaTurma(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--raio-borda)',
                  border: '1px solid var(--cor-borda)',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: 'var(--cor-fundo)'
                }}
                disabled={salvandoDados}
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>{t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})</option>
                ))}
              </select>
            )}
          </div>

          {/* Busca por Aluno */}
          {turmaSelecionadaId && (
            <div className="input-group" style={{ margin: 0, minWidth: '240px', flexGrow: 1, alignSelf: 'flex-end' }}>
              <div className="input-group-wrapper">
                <span className="input-icon">
                  <IconSearch size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="Filtrar aluno por nome ou matrícula..." 
                  value={buscaEstudante}
                  onChange={(e) => setBuscaEstudante(e.target.value)}
                  disabled={salvandoDados}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botão de Salvar Alterações */}
        {turmaSelecionadaId && matriculas.length > 0 && (
          <button 
            onClick={handleSalvarDiario}
            className="login-botao" 
            style={{ width: 'auto', alignSelf: 'flex-end', padding: '12px 24px', gap: '8px', boxShadow: 'var(--sombra-suave)' }}
            disabled={salvandoDados}
          >
            {salvandoDados ? (
              <>
                <span className="spinner"></span>
                <span>Salvando Dados...</span>
              </>
            ) : (
              <>
                <IconDeviceFloppy size={18} />
                Salvar Alterações
              </>
            )}
          </button>
        )}
      </div>

      {/* Caderneta de Chamada / Lançamentos */}
      {!turmaSelecionadaId ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconNotebook size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma turma sob sua responsabilidade</h3>
          <p style={{ maxWidth: '400px' }}>Cadastre ou solicite o vínculo de novas turmas na secretaria para lançar suas cadernetas.</p>
        </div>
      ) : matriculas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Não há alunos matriculados nesta turma</h3>
          <p style={{ maxWidth: '400px' }}>Solicite à secretaria a inclusão ou transferência de alunos na turma para realizar avaliações.</p>
        </div>
      ) : (
        /* Tabela Premium do Diário */
        <div className="tabela-container">
          {turmaAtiva && (
            <div style={{ padding: '16px 24px', backgroundColor: 'var(--cor-fundo-alternativo)', borderBottom: '1px solid var(--cor-borda)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>
              <span>Disciplina: <strong style={{ color: 'var(--cor-azul-escuro)' }}>{turmaAtiva.disciplinaNome}</strong></span>
              <span>Ano Letivo: <strong>{turmaAtiva.periodoLetivo}</strong></span>
              <span>Total: <strong>{matriculas.length} Alunos</strong></span>
            </div>
          )}
          <table className="tabela-sge">
            <thead>
              <tr>
                <th>Aluno</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Nota P1</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Nota P2</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Média</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Faltas (Total)</th>
                <th style={{ width: '110px', textAlign: 'center' }}>Frequência</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {estudantesFiltrados.map((mat) => {
                const edicao = dadosEdicao[mat.id] || { notaP1: '', notaP2: '', faltas: '0' }
                
                // Cálculo da Média em Tempo Real
                const p1 = edicao.notaP1.trim() !== '' ? Number(edicao.notaP1.replace(',', '.')) : NaN
                const p2 = edicao.notaP2.trim() !== '' ? Number(edicao.notaP2.replace(',', '.')) : NaN
                const temNotas = !isNaN(p1) && !isNaN(p2)
                const mediaCalculada = temNotas ? (p1 + p2) / 2 : NaN

                // Cálculo da Frequência
                const faltasNum = Number(edicao.faltas) || 0
                const frequenciaCalculada = Math.max(0, 100 - (faltasNum * 4)) // Cada falta = -4% de presença (sobre 25 aulas virtuais fictícias)

                // Definição da Situação em Tempo Real
                let situacaoText = 'Sem Notas'
                let situacaoCor = 'var(--cor-texto-secundario)'
                let situacaoBg = 'var(--cor-fundo-alternativo)'

                if (frequenciaCalculada < 75) {
                  situacaoText = 'REP. POR FALTA'
                  situacaoCor = 'var(--cor-erro)'
                  situacaoBg = 'hsl(350, 89%, 95%)'
                } else if (temNotas) {
                  if (mediaCalculada >= 6.0) {
                    situacaoText = 'APROVADO'
                    situacaoCor = 'var(--cor-sucesso)'
                    situacaoBg = 'hsl(142, 76%, 95%)'
                  } else {
                    situacaoText = 'RECUPERAÇÃO'
                    situacaoCor = 'var(--cor-alerta)'
                    situacaoBg = 'hsl(38, 92%, 95%)'
                  }
                }

                return (
                  <tr key={mat.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{mat.discenteNome}</span>
                        <span style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)' }}>Matrícula: {mat.discenteMatricula}</span>
                      </div>
                    </td>
                    
                    {/* Nota P1 Input */}
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="text" 
                        value={edicao.notaP1}
                        onChange={(e) => handleAlterarCampo(mat.id, 'notaP1', e.target.value)}
                        placeholder="--"
                        style={{
                          width: '64px',
                          textAlign: 'center',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid var(--cor-borda)',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'var(--cor-fundo)'
                        }}
                        disabled={salvandoDados}
                      />
                    </td>

                    {/* Nota P2 Input */}
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="text" 
                        value={edicao.notaP2}
                        onChange={(e) => handleAlterarCampo(mat.id, 'notaP2', e.target.value)}
                        placeholder="--"
                        style={{
                          width: '64px',
                          textAlign: 'center',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid var(--cor-borda)',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'var(--cor-fundo)'
                        }}
                        disabled={salvandoDados}
                      />
                    </td>

                    {/* Média Dinâmica */}
                    <td style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '15px' }}>
                      {!isNaN(mediaCalculada) ? mediaCalculada.toFixed(1) : '--'}
                    </td>

                    {/* Faltas Input */}
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={edicao.faltas}
                        onChange={(e) => handleAlterarCampo(mat.id, 'faltas', e.target.value)}
                        min="0"
                        style={{
                          width: '74px',
                          textAlign: 'center',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid var(--cor-borda)',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'var(--cor-fundo)'
                        }}
                        disabled={salvandoDados}
                      />
                    </td>

                    {/* Frequência Dinâmica */}
                    <td style={{ 
                      textAlign: 'center', 
                      fontWeight: 700, 
                      fontFamily: 'monospace',
                      color: frequenciaCalculada >= 75 ? 'var(--cor-azul-escuro)' : 'var(--cor-erro)'
                    }}>
                      {frequenciaCalculada}%
                    </td>

                    {/* Situação Escolar Badge */}
                    <td style={{ textAlign: 'right' }}>
                      <span 
                        className="status-tag"
                        style={{
                          backgroundColor: situacaoBg,
                          color: situacaoCor,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          textAlign: 'center',
                          minWidth: '95px'
                        }}
                      >
                        {situacaoText}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Notificação Toast */}
      <AnimatePresence>
        {notificacao && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`toast-notificacao toast-sucesso ${notificacao.tipo === 'erro' ? 'toast-erro' : ''}`}
            style={
              notificacao.tipo === 'erro' 
                ? { borderLeft: '4px solid var(--cor-erro)' } 
                : undefined
            }
            role="alert"
          >
            {notificacao.tipo === 'erro' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
            <span>{notificacao.mensagem}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
