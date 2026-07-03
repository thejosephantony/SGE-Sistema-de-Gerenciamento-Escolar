import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconPlus, IconSearch, IconInbox, IconAlertTriangle,
  IconBook, IconClipboardList, IconCheck, IconX, IconUsers
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import {
  obterMateriaisPorTurma, criarMaterial, removerMaterial,
  obterAtividadesPorTurma, criarAtividade, encerrarAtividade,
  obterEntregasPorAtividade
} from '../servicos/servicoAva'
import type { MaterialDidatico, Atividade, EntregaAtividade } from '../tipos'
import type { Turma } from '../../turmas/tipos'

type Aba = 'materiais' | 'atividades' | 'entregas'

export default function PaginaAVAProfessor() {
  const { usuario } = useAuth()

  const [turmas, setTurmas] = useState<Turma[]>([])
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState('')
  const [abaAtiva, setAbaAtiva] = useState<Aba>('materiais')

  const [materiais, setMateriais] = useState<MaterialDidatico[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [entregas, setEntregas] = useState<EntregaAtividade[]>([])
  const [atividadeSelecionadaId, setAtividadeSelecionadaId] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)

  // Formulário de material
  const [novoMaterialTitulo, setNovoMaterialTitulo] = useState('')
  const [novoMaterialDescricao, setNovoMaterialDescricao] = useState('')
  const [novoMaterialLink, setNovoMaterialLink] = useState('')
  const [salvandoMaterial, setSalvandoMaterial] = useState(false)

  // Formulário de atividade
  const [novaAtividadeTitulo, setNovaAtividadeTitulo] = useState('')
  const [novaAtividadeDescricao, setNovaAtividadeDescricao] = useState('')
  const [novaAtividadePrazo, setNovaAtividadePrazo] = useState('')
  const [salvandoAtividade, setSalvandoAtividade] = useState(false)

  const [busca, setBusca] = useState('')

  const mostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ mensagem, tipo })
    setTimeout(() => setNotificacao(null), 3500)
  }

  // Carrega turmas do professor
  useEffect(() => {
    async function carregar() {
      if (!usuario) return
      try {
        const todas = await obterTurmas()
        const minhas = todas.filter((t) => Number(t.docenteId) === usuario.id && t.status !== 'CANCELADA')
        setTurmas(minhas)
        if (minhas.length > 0) setTurmaSelecionadaId(minhas[0].id)
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
        setEntregas([])
        setAtividadeSelecionadaId('')
      } catch {
        mostrarToast('Erro ao carregar conteúdo da turma.', 'erro')
      }
    }
    carregarConteudo()
  }, [turmaSelecionadaId])

  // Carrega entregas da atividade selecionada
  useEffect(() => {
    if (!atividadeSelecionadaId) return
    obterEntregasPorAtividade(atividadeSelecionadaId)
      .then(setEntregas)
      .catch(() => mostrarToast('Erro ao carregar entregas.', 'erro'))
  }, [atividadeSelecionadaId])

  const handlePublicarMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoMaterialTitulo.trim()) return
    setSalvandoMaterial(true)
    try {
      const novo = await criarMaterial({
        titulo: novoMaterialTitulo,
        descricao: novoMaterialDescricao,
        linkArquivo: novoMaterialLink,
        turmaId: turmaSelecionadaId
      })
      setMateriais((prev) => [novo, ...prev])
      setNovoMaterialTitulo('')
      setNovoMaterialDescricao('')
      setNovoMaterialLink('')
      mostrarToast('Material publicado com sucesso!')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao publicar material.', 'erro')
    } finally {
      setSalvandoMaterial(false)
    }
  }

  const handleRemoverMaterial = async (id: string, titulo: string) => {
    if (!window.confirm(`Remover o material "${titulo}"?`)) return
    try {
      await removerMaterial(id)
      setMateriais((prev) => prev.filter((m) => m.id !== id))
      mostrarToast('Material removido.')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao remover material.', 'erro')
    }
  }

  const handleCriarAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaAtividadeTitulo.trim() || !novaAtividadePrazo) return
    setSalvandoAtividade(true)
    try {
      const nova = await criarAtividade({
        titulo: novaAtividadeTitulo,
        descricao: novaAtividadeDescricao,
        prazo: new Date(novaAtividadePrazo).toISOString(),
        turmaId: turmaSelecionadaId
      })
      setAtividades((prev) => [nova, ...prev])
      setNovaAtividadeTitulo('')
      setNovaAtividadeDescricao('')
      setNovaAtividadePrazo('')
      mostrarToast('Atividade criada com sucesso!')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao criar atividade.', 'erro')
    } finally {
      setSalvandoAtividade(false)
    }
  }

  const handleEncerrarAtividade = async (id: string, titulo: string) => {
    if (!window.confirm(`Encerrar a atividade "${titulo}"?`)) return
    try {
      await encerrarAtividade(id)
      setAtividades((prev) => prev.map((a) => a.id === id ? { ...a, status: 'ENCERRADA' } : a))
      mostrarToast('Atividade encerrada.')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao encerrar atividade.', 'erro')
    }
  }

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
      <PageHeader title="AVA" description="Publique materiais, crie atividades e acompanhe as entregas dos alunos." />

      {/* Seletor de Turma */}
      {turmas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma turma ativa</h3>
          <p>Você não possui turmas ativas no momento.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div className="input-group" style={{ margin: 0, minWidth: '260px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cor-texto-secundario)', marginBottom: '6px', display: 'block' }}>Turma:</label>
              <select
                value={turmaSelecionadaId}
                onChange={(e) => { setTurmaSelecionadaId(e.target.value); setBusca('') }}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--cor-fundo)' }}
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>{t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})</option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ margin: 0, flexGrow: 1, alignSelf: 'flex-end' }}>
              <div className="input-group-wrapper">
                <span className="input-icon"><IconSearch size={18} /></span>
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Abas */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--cor-borda)', width: '100%' }}>
            {([
              { id: 'materiais', label: 'Materiais', icon: <IconBook size={16} /> },
              { id: 'atividades', label: 'Atividades', icon: <IconClipboardList size={16} /> },
              { id: 'entregas', label: 'Entregas', icon: <IconUsers size={16} /> },
            ] as { id: Aba; label: string; icon: React.ReactNode }[]).map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', width: '100%', alignItems: 'start' }}>
              {/* Formulário */}
              <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconBook size={18} style={{ color: 'var(--cor-primaria)' }} />
                  Publicar Material
                </h3>
                <form onSubmit={handlePublicarMaterial}>
                  <div className="input-group">
                    <label>Título *</label>
                    <input type="text" value={novoMaterialTitulo} onChange={(e) => setNovoMaterialTitulo(e.target.value)} placeholder="Título do material" required disabled={salvandoMaterial} />
                  </div>
                  <div className="input-group">
                    <label>Descrição</label>
                    <textarea value={novoMaterialDescricao} onChange={(e) => setNovoMaterialDescricao(e.target.value)} placeholder="Descrição opcional" rows={3} disabled={salvandoMaterial} style={{ width: '100%', padding: '12px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', resize: 'vertical' }} />
                  </div>
                  <div className="input-group">
                    <label>Link do Arquivo</label>
                    <input type="url" value={novoMaterialLink} onChange={(e) => setNovoMaterialLink(e.target.value)} placeholder="https://..." disabled={salvandoMaterial} />
                  </div>
                  <button type="submit" className="login-botao" style={{ width: '100%', gap: '8px', marginTop: '4px' }} disabled={salvandoMaterial}>
                    {salvandoMaterial ? <><span className="spinner"></span><span>Publicando...</span></> : <><IconPlus size={16} />Publicar</>}
                  </button>
                </form>
              </div>

              {/* Lista de materiais */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {materiaisFiltrados.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                    <p style={{ color: 'var(--cor-texto-secundario)' }}>Nenhum material publicado nesta turma.</p>
                  </div>
                ) : materiaisFiltrados.map((m) => (
                  <div key={m.id} style={{ background: 'var(--cor-fundo)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--cor-borda)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)', margin: 0 }}>{m.titulo}</p>
                      {m.descricao && <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: '4px 0 0 0' }}>{m.descricao}</p>}
                      {m.linkArquivo && (
                        <a href={m.linkArquivo} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--cor-primaria)', marginTop: '4px', display: 'inline-block' }}>
                          Acessar arquivo →
                        </a>
                      )}
                      <p style={{ fontSize: '11px', color: 'var(--cor-texto-secundario)', margin: '6px 0 0 0' }}>
                        Publicado em {new Date(m.dataPublicacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button onClick={() => handleRemoverMaterial(m.id, m.titulo)} className="btn-secundario" style={{ padding: '8px 10px', color: 'var(--cor-erro)', borderColor: 'hsla(350, 89%, 46%, 0.2)', flexShrink: 0 }}>
                      <IconX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── ABA ATIVIDADES ─── */}
          {abaAtiva === 'atividades' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', width: '100%', alignItems: 'start' }}>
              {/* Formulário */}
              <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconClipboardList size={18} style={{ color: 'var(--cor-primaria)' }} />
                  Nova Atividade
                </h3>
                <form onSubmit={handleCriarAtividade}>
                  <div className="input-group">
                    <label>Título *</label>
                    <input type="text" value={novaAtividadeTitulo} onChange={(e) => setNovaAtividadeTitulo(e.target.value)} placeholder="Título da atividade" required disabled={salvandoAtividade} />
                  </div>
                  <div className="input-group">
                    <label>Descrição</label>
                    <textarea value={novaAtividadeDescricao} onChange={(e) => setNovaAtividadeDescricao(e.target.value)} placeholder="Descrição da atividade" rows={3} disabled={salvandoAtividade} style={{ width: '100%', padding: '12px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', resize: 'vertical' }} />
                  </div>
                  <div className="input-group">
                    <label>Prazo *</label>
                    <input type="datetime-local" value={novaAtividadePrazo} onChange={(e) => setNovaAtividadePrazo(e.target.value)} required disabled={salvandoAtividade} />
                  </div>
                  <button type="submit" className="login-botao" style={{ width: '100%', gap: '8px', marginTop: '4px' }} disabled={salvandoAtividade}>
                    {salvandoAtividade ? <><span className="spinner"></span><span>Criando...</span></> : <><IconPlus size={16} />Criar Atividade</>}
                  </button>
                </form>
              </div>

              {/* Lista de atividades */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {atividadesFiltradas.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                    <p style={{ color: 'var(--cor-texto-secundario)' }}>Nenhuma atividade criada nesta turma.</p>
                  </div>
                ) : atividadesFiltradas.map((a) => {
                  const prazoDate = new Date(a.prazo)
                  const vencida = prazoDate < new Date() && a.status === 'ABERTA'
                  return (
                    <div key={a.id} style={{ background: 'var(--cor-fundo)', padding: '16px 20px', borderRadius: '10px', border: `1px solid ${a.status === 'ABERTA' ? 'var(--cor-borda)' : 'var(--cor-borda)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <p style={{ fontWeight: 700, color: 'var(--cor-azul-escuro)', margin: 0 }}>{a.titulo}</p>
                          <span className="status-tag" style={{
                            backgroundColor: a.status === 'ABERTA' ? 'hsl(142, 76%, 95%)' : a.status === 'ENCERRADA' ? 'var(--cor-fundo-alternativo)' : 'hsl(350, 89%, 95%)',
                            color: a.status === 'ABERTA' ? 'var(--cor-sucesso)' : a.status === 'ENCERRADA' ? 'var(--cor-texto-secundario)' : 'var(--cor-erro)',
                            fontSize: '11px'
                          }}>
                            {a.status}
                          </span>
                        </div>
                        {a.descricao && <p style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', margin: '0 0 4px 0' }}>{a.descricao}</p>}
                        <p style={{ fontSize: '12px', color: vencida ? 'var(--cor-erro)' : 'var(--cor-texto-secundario)', margin: 0 }}>
                          Prazo: {prazoDate.toLocaleString('pt-BR')} {vencida && '(vencida)'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {a.status === 'ABERTA' && (
                          <button onClick={() => handleEncerrarAtividade(a.id, a.titulo)} className="btn-secundario" style={{ padding: '8px 10px', fontSize: '12px', gap: '4px' }} title="Encerrar atividade">
                            <IconCheck size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => { setAtividadeSelecionadaId(a.id); setAbaAtiva('entregas') }}
                          className="btn-secundario"
                          style={{ padding: '8px 10px', fontSize: '12px', gap: '4px' }}
                          title="Ver entregas"
                        >
                          <IconUsers size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── ABA ENTREGAS ─── */}
          {abaAtiva === 'entregas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {/* Seletor de atividade */}
              <div className="input-group" style={{ margin: 0, maxWidth: '400px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cor-texto-secundario)', marginBottom: '6px', display: 'block' }}>Atividade:</label>
                <select
                  value={atividadeSelecionadaId}
                  onChange={(e) => setAtividadeSelecionadaId(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', fontSize: '14px', backgroundColor: 'var(--cor-fundo)' }}
                >
                  <option value="">Selecione uma atividade</option>
                  {atividades.map((a) => (
                    <option key={a.id} value={a.id}>{a.titulo}</option>
                  ))}
                </select>
              </div>

              {!atividadeSelecionadaId ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <IconClipboardList size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--cor-texto-secundario)' }}>Selecione uma atividade para ver as entregas.</p>
                </div>
              ) : entregas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <IconInbox size={40} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--cor-texto-secundario)' }}>Nenhuma entrega recebida ainda.</p>
                </div>
              ) : (
                <div className="tabela-container">
                  <table className="tabela-sge">
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>Resposta</th>
                        <th>Link</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entregas.map((e) => (
                        <tr key={e.id}>
                          <td style={{ fontWeight: 600 }}>{e.discenteNome}</td>
                          <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
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
