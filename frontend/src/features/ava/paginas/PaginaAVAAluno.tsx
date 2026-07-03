import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconSearch, IconInbox, IconAlertTriangle,
  IconBook, IconClipboardList, IconSend
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { buscarMatriculasPorDiscente } from '../../matriculas/servicos/servicoMatricula'
import {
  obterMateriaisPorTurma,
  obterAtividadesPorTurma,
  obterMinhasEntregas,
  enviarEntrega
} from '../servicos/servicoAva'
import type { MaterialDidatico, Atividade, EntregaAtividade } from '../tipos'

type Aba = 'materiais' | 'atividades' | 'minhas-entregas'

export default function PaginaAVAAluno() {
  const { usuario } = useAuth()

  const [turmaIds, setTurmaIds] = useState<string[]>([])
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState('')
  const [turmaLabels, setTurmaLabels] = useState<Record<string, string>>({})
  const [abaAtiva, setAbaAtiva] = useState<Aba>('materiais')

  const [materiais, setMateriais] = useState<MaterialDidatico[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [minhasEntregas, setMinhasEntregas] = useState<EntregaAtividade[]>([])

  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null)
  const [textoEntrega, setTextoEntrega] = useState('')
  const [linkEntrega, setLinkEntrega] = useState('')
  const [enviandoEntrega, setEnviandoEntrega] = useState(false)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)
  const [busca, setBusca] = useState('')

  const mostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ mensagem, tipo })
    setTimeout(() => setNotificacao(null), 3500)
  }

  // Carrega turmas do aluno via matrículas
  useEffect(() => {
    async function carregar() {
      if (!usuario) return
      try {
        const matriculas = await buscarMatriculasPorDiscente(String(usuario.id))
        const ativas = matriculas.filter((m) => m.status === 'ATIVA')
        const ids = [...new Set(ativas.map((m) => m.turmaId))]
        const labels: Record<string, string> = {}
        ativas.forEach((m) => {
          labels[m.turmaId] = `${m.disciplinaCodigo} — ${m.disciplinaNome} (${m.turmaCodigo})`
        })
        setTurmaIds(ids)
        setTurmaLabels(labels)
        if (ids.length > 0) setTurmaSelecionadaId(ids[0])

        const entregas = await obterMinhasEntregas()
        setMinhasEntregas(entregas)
      } catch {
        setErro('Erro ao carregar suas turmas.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [usuario])

  // Carrega conteúdo da turma selecionada
  useEffect(() => {
    if (!turmaSelecionadaId) return
    async function carregarConteudo() {
      try {
        const [mat, atv] = await Promise.all([
          obterMateriaisPorTurma(turmaSelecionadaId),
          obterAtividadesPorTurma(turmaSelecionadaId)
        ])
        setMateriais(mat)
        setAtividades(atv)
      } catch {
        mostrarToast('Erro ao carregar conteúdo da turma.', 'erro')
      }
    }
    carregarConteudo()
  }, [turmaSelecionadaId])

  const handleEnviarEntrega = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!atividadeSelecionada) return
    if (!textoEntrega.trim() && !linkEntrega.trim()) {
      mostrarToast('Informe o texto ou o link da entrega.', 'erro')
      return
    }
    setEnviandoEntrega(true)
    try {
      const nova = await enviarEntrega({
        atividadeId: atividadeSelecionada.id,
        textoResposta: textoEntrega,
        linkArquivo: linkEntrega
      })
      setMinhasEntregas((prev) => {
        const semAntiga = prev.filter((e) => e.atividadeId !== atividadeSelecionada.id)
        return [nova, ...semAntiga]
      })
      setAtividadeSelecionada(null)
      setTextoEntrega('')
      setLinkEntrega('')
      mostrarToast('Entrega enviada com sucesso!')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao enviar entrega.', 'erro')
    } finally {
      setEnviandoEntrega(false)
    }
  }

  const jaEntregou = (atividadeId: string) =>
    minhasEntregas.some((e) => e.atividadeId === atividadeId)

  const materiaisFiltrados = materiais.filter((m) =>
    m.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  const atividadesFiltradas = atividades.filter((a) =>
    a.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="AVA" description="Ambiente Virtual de Aprendizagem" />
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
        <PageHeader title="AVA" description="Ambiente Virtual de Aprendizagem" />
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
      <PageHeader title="AVA" description="Acesse os materiais e atividades das suas turmas." />

      {turmaIds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma turma ativa</h3>
          <p>Você não possui matrículas ativas no momento.</p>
        </div>
      ) : (
        <>
          {/* Seletor de turma + busca */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div className="input-group" style={{ margin: 0, minWidth: '260px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cor-texto-secundario)', marginBottom: '6px', display: 'block' }}>Turma:</label>
              <select
                value={turmaSelecionadaId}
                onChange={(e) => { setTurmaSelecionadaId(e.target.value); setBusca('') }}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--cor-fundo)' }}
              >
                {turmaIds.map((id) => (
                  <option key={id} value={id}>{turmaLabels[id]}</option>
                ))}
              </select>
            </div>

            {abaAtiva !== 'minhas-entregas' && (
              <div className="input-group" style={{ margin: 0, flexGrow: 1, alignSelf: 'flex-end' }}>
                <div className="input-group-wrapper">
                  <span className="input-icon"><IconSearch size={18} /></span>
                  <input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Abas */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--cor-borda)', width: '100%' }}>
            {([
              { id: 'materiais', label: 'Materiais', icon: <IconBook size={16} /> },
              { id: 'atividades', label: 'Atividades', icon: <IconClipboardList size={16} /> },
              { id: 'minhas-entregas', label: 'Minhas Entregas', icon: <IconSend size={16} /> },
            ] as { id: Aba; label: string; icon: React.ReactNode }[]).map((aba) => (
              <button
                key={aba.id}
                onClick={() => { setAbaAtiva(aba.id); setAtividadeSelecionada(null) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                  color: abaAtiva === aba.id ? 'var(--cor-primaria)' : 'var(--cor-texto-secundario)',
                  borderBottom: abaAtiva === aba.id ? '2px solid var(--cor-primaria)' : '2px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.15s'
                }}
              >
                {aba.icon}
                {aba.label}
              </button>
            ))}
          </div>

          {/* ─── ABA MATERIAIS ─── */}
          {abaAtiva === 'materiais' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {materiaisFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--cor-texto-secundario)' }}>Nenhum material disponível nesta turma.</p>
                </div>
              ) : materiaisFiltrados.map((m) => (
                <div key={m.id} style={{ background: 'var(--cor-fundo)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--cor-borda)' }}>
                  <p style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)', margin: '0 0 4px 0' }}>{m.titulo}</p>
                  {m.descricao && <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: '0 0 6px 0' }}>{m.descricao}</p>}
                  {m.linkArquivo && (
                    <a href={m.linkArquivo} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--cor-primaria)' }}>
                      Acessar material →
                    </a>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)', margin: '6px 0 0 0' }}>
                    Por {m.docenteNome} • {new Date(m.dataPublicacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ─── ABA ATIVIDADES ─── */}
          {abaAtiva === 'atividades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {atividadeSelecionada ? (
                // Formulário de entrega
                <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', maxWidth: '600px' }}>
                  <button onClick={() => setAtividadeSelecionada(null)} className="btn-secundario" style={{ marginBottom: '16px', fontSize: '13px' }}>
                    ← Voltar
                  </button>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', margin: '0 0 4px 0' }}>
                    {atividadeSelecionada.titulo}
                  </h3>
                  {atividadeSelecionada.descricao && (
                    <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: '0 0 12px 0' }}>{atividadeSelecionada.descricao}</p>
                  )}
                  <p style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)', margin: '0 0 20px 0' }}>
                    Prazo: {new Date(atividadeSelecionada.prazo).toLocaleString('pt-BR')}
                  </p>
                  <form onSubmit={handleEnviarEntrega}>
                    <div className="input-group">
                      <label>Sua resposta</label>
                      <textarea
                        value={textoEntrega}
                        onChange={(e) => setTextoEntrega(e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                        rows={5}
                        disabled={enviandoEntrega}
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Link do arquivo (opcional)</label>
                      <input type="url" value={linkEntrega} onChange={(e) => setLinkEntrega(e.target.value)} placeholder="https://..." disabled={enviandoEntrega} />
                    </div>
                    <button type="submit" className="login-botao" style={{ width: '100%', gap: '8px', marginTop: '4px' }} disabled={enviandoEntrega}>
                      {enviandoEntrega ? <><span className="spinner"></span><span>Enviando...</span></> : <><IconSend size={16} />Enviar Entrega</>}
                    </button>
                  </form>
                </div>
              ) : atividadesFiltradas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--cor-texto-secundario)' }}>Nenhuma atividade disponível nesta turma.</p>
                </div>
              ) : atividadesFiltradas.map((a) => {
                const prazoDate = new Date(a.prazo)
                const vencida = prazoDate < new Date()
                const entregou = jaEntregou(a.id)
                return (
                  <div key={a.id} style={{ background: 'var(--cor-fundo)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--cor-borda)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)', margin: 0 }}>{a.titulo}</p>
                        {entregou && (
                          <span className="status-tag" style={{ backgroundColor: 'hsl(142, 76%, 95%)', color: 'var(--cor-sucesso)', fontSize: '11px' }}>
                            Entregue
                          </span>
                        )}
                        {a.status === 'ENCERRADA' && (
                          <span className="status-tag" style={{ backgroundColor: 'var(--cor-fundo-alternativo)', color: 'var(--cor-texto-secundario)', fontSize: '11px' }}>
                            Encerrada
                          </span>
                        )}
                      </div>
                      {a.descricao && <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: '0 0 4px 0' }}>{a.descricao}</p>}
                      <p style={{ fontSize: '12px', color: vencida ? 'var(--cor-erro)' : 'var(--cor-texto-secundario)', margin: 0 }}>
                        Prazo: {prazoDate.toLocaleString('pt-BR')} {vencida && !entregou && '(vencida)'}
                      </p>
                    </div>
                    {a.status === 'ABERTA' && !entregou && (
                      <button onClick={() => setAtividadeSelecionada(a)} className="login-botao" style={{ width: 'auto', padding: '8px 14px', gap: '6px', fontSize: '13px', flexShrink: 0 }}>
                        <IconSend size={14} />
                        Entregar
                      </button>
                    )}
                    {entregou && a.status === 'ABERTA' && (
                      <button onClick={() => setAtividadeSelecionada(a)} className="btn-secundario" style={{ padding: '8px 14px', gap: '6px', fontSize: '13px', flexShrink: 0 }}>
                        Reenviar
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── ABA MINHAS ENTREGAS ─── */}
          {abaAtiva === 'minhas-entregas' && (
            <div style={{ width: '100%' }}>
              {minhasEntregas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--cor-texto-secundario)' }}>Você ainda não fez nenhuma entrega.</p>
                </div>
              ) : (
                <div className="tabela-container">
                  <table className="tabela-sge">
                    <thead>
                      <tr>
                        <th>Atividade</th>
                        <th>Resposta</th>
                        <th>Link</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {minhasEntregas.map((e) => (
                        <tr key={e.id}>
                          <td style={{ fontWeight: 600 }}>{e.atividadeTitulo}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                            {e.textoResposta || '—'}
                          </td>
                          <td>
                            {e.linkArquivo
                              ? <a href={e.linkArquivo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cor-primaria)', fontSize: '13px' }}>Abrir →</a>
                              : <span style={{ color: 'var(--cor-texto-secundario)', fontSize: '13px' }}>—</span>
                            }
                          </td>
                          <td style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                            {new Date(e.dataEntrega).toLocaleString('pt-BR')}
                          </td>
                          <td>
                            <span className="status-tag" style={{
                              backgroundColor: e.status === 'ENVIADA' ? 'hsl(142, 76%, 95%)' : 'hsl(350, 89%, 95%)',
                              color: e.status === 'ENVIADA' ? 'var(--cor-sucesso)' : 'var(--cor-erro)',
                              fontSize: '11px'
                            }}>
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Toast */}
      <AnimatePresence>
        {notificacao && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`toast-notificacao toast-sucesso ${notificacao.tipo === 'erro' ? 'toast-erro' : ''}`}
            style={notificacao.tipo === 'erro' ? { borderLeft: '4px solid var(--cor-erro)' } : undefined}
            role="alert"
          >
            <span>{notificacao.mensagem}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
