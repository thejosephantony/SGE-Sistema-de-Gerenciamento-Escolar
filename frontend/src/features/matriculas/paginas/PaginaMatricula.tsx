import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconUserPlus, 
  IconSearch, 
  IconTrash, 
  IconAlertTriangle,
  IconInbox,
  IconCalendar,
  IconUserCheck
} from '@tabler/icons-react'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import type { Matricula } from '../tipos'
import { obterMatriculas, matricularDiscente, cancelarMatricula } from '../servicos/servicoMatricula'
import { obterUsuarios } from '../../usuarios/servicos/servicoUsuario'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import type { Usuario } from '../../usuarios/tipos'
import type { Turma } from '../../turmas/tipos'

/**
 * Página de gerenciamento de Matrículas (Exclusiva do Administrador).
 * Permite matricular alunos em turmas ativas e visualizar/cancelar registros existentes.
 */
export default function EnrollmentPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [discentes, setDiscentes] = useState<Usuario[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])

  // Formulário de Nova Matrícula
  const [discenteId, setDiscenteId] = useState('')
  const [turmaId, setTurmaId] = useState('')

  // Pesquisa/Filtro histórico
  const [busca, setBusca] = useState('')

  // UI States (Conforme seção 9.4 do guia AGENTS.md)
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [carregandoSubmissao, setCarregandoSubmissao] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)

  // Carrega todas as informações necessárias
  const carregarDadosMatricula = async () => {
    try {
      const [listaMatriculas, listaUsuarios, listaTurmas] = await Promise.all([
        obterMatriculas(),
        obterUsuarios(),
        obterTurmas()
      ])

      setMatriculas(listaMatriculas)

      // Filtra apenas usuários DISCENTES e ATIVOS
      const alunosAtivos = listaUsuarios.filter((u) => u.perfil === 'DISCENTE' && u.status === 'ATIVO')
      setDiscentes(alunosAtivos)
      if (alunosAtivos.length > 0) setDiscenteId(alunosAtivos[0].id)

      // Filtra turmas que estão ABERTAS ou PLANEJADAS (aptas a receber alunos)
      const turmasAptas = listaTurmas.filter((t) => t.status === 'ABERTA' || t.status === 'PLANEJADA')
      setTurmas(turmasAptas)
      if (turmasAptas.length > 0) setTurmaId(turmasAptas[0].id)

    } catch (err) {
      console.error(err)
      setErro('Erro ao carregar os dados de matrícula. Recarregue a página.')
    } finally {
      setCarregandoDados(false)
    }
  }

  useEffect(() => {
    carregarDadosMatricula()
  }, [])

  // Helper de Toast Notificação
  const handleMostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ mensagem, tipo })
    setTimeout(() => {
      setNotificacao(null)
    }, 3500)
  }

  // Criação de nova matrícula
  const handleConfirmarMatricula = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!discenteId || !turmaId) {
      handleMostrarToast('Selecione um aluno e uma turma válida.', 'erro')
      return
    }

    setCarregandoSubmissao(true)
    
    // Busca os dados adicionais do aluno para o registro mockado
    const aluno = discentes.find((d) => d.id === discenteId)
    if (!aluno) return

    try {
      await matricularDiscente(
        discenteId,
        aluno.nome,
        aluno.matricula || 'N/A',
        turmaId
      )
      handleMostrarToast(`Matrícula efetuada com sucesso para ${aluno.nome}!`, 'sucesso')
      // Recarrega as matrículas históricas
      const novasMatriculas = await obterMatriculas()
      setMatriculas(novasMatriculas)
    } catch (err: unknown) {
      const msgErro = err instanceof Error ? err.message : 'Erro ao realizar matrícula.'
      handleMostrarToast(msgErro, 'erro')
    } finally {
      setCarregandoSubmissao(false)
    }
  }

  // Cancelamento de matrícula
  const handleCancelarMatricula = async (id: string, nomeAluno: string) => {
    const confirmacao = window.confirm(`Deseja realmente cancelar a matrícula de ${nomeAluno}?`)
    if (!confirmacao) return

    try {
      await cancelarMatricula(id)
      handleMostrarToast(`Matrícula de ${nomeAluno} cancelada.`, 'sucesso')
      // Recarrega as matrículas históricas
      const novasMatriculas = await obterMatriculas()
      setMatriculas(novasMatriculas)
    } catch (err) {
      console.error(err)
      handleMostrarToast('Não foi possível cancelar a matrícula.', 'erro')
    }
  }

  // Filtra as matrículas históricas na tela
  const matriculasFiltradas = matriculas.filter((m) => {
    return (
      m.discenteNome.toLowerCase().includes(busca.toLowerCase()) ||
      m.discenteMatricula.includes(busca) ||
      m.disciplinaNome.toLowerCase().includes(busca.toLowerCase()) ||
      m.turmaCodigo.toLowerCase().includes(busca.toLowerCase())
    )
  })

  // 1. Estado de Carregamento
  if (carregandoDados) {
    return (
      <PageContainer>
        <PageHeader title="Matrículas" description="Gerencie as matrículas escolares." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando dados escolares de matrícula...</p>
        </div>
      </PageContainer>
    )
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Matrículas" description="Gerencie as matrículas escolares." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto' }}>{erro}</p>
          <button onClick={carregarDadosMatricula} className="btn-secundario" style={{ marginTop: '12px' }}>Tentar Novamente</button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Matricular Aluno" 
        description="Vincule alunos às turmas com vagas abertas no ano letivo atual." 
      />

      {/* Grid de Duas Colunas: Formulário de Nova Matrícula à Esquerda, Histórico à Direita */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', width: '100%', alignItems: 'start' }}>
        
        {/* Formulário de Nova Inscrição */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconUserCheck size={18} style={{ color: 'var(--cor-primaria)' }} />
            Nova Matrícula
          </h3>
          
          {discentes.length === 0 || turmas.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--cor-erro)', lineHeight: '1.5' }}>
              Para realizar matrículas, é necessário possuir alunos ativos cadastrados e turmas nos status "PLANEJADA" ou "ABERTA".
            </p>
          ) : (
            <form onSubmit={handleConfirmarMatricula}>
              {/* Seleção do Estudante */}
              <div className="input-group">
                <label htmlFor="selectAlunMat">Selecione o Aluno</label>
                <select
                  id="selectAlunMat"
                  value={discenteId}
                  onChange={(e) => setDiscenteId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--raio-borda)',
                    border: '1px solid var(--cor-borda)',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: 'var(--cor-fundo)'
                  }}
                  disabled={carregandoSubmissao}
                >
                  {discentes.map((d) => (
                    <option key={d.id} value={d.id}>{d.nome} (Matrícula: {d.matricula})</option>
                  ))}
                </select>
              </div>

              {/* Seleção da Turma */}
              <div className="input-group">
                <label htmlFor="selectTurmMat">Selecione a Turma</label>
                <select
                  id="selectTurmMat"
                  value={turmaId}
                  onChange={(e) => setTurmaId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--raio-borda)',
                    border: '1px solid var(--cor-borda)',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: 'var(--cor-fundo)'
                  }}
                  disabled={carregandoSubmissao}
                >
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>{t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo} / {t.periodoLetivo})</option>
                  ))}
                </select>
              </div>

              {/* Botão de Matrícula */}
              <button 
                type="submit" 
                className="login-botao" 
                style={{ width: '100%', gap: '8px', marginTop: '8px' }}
                disabled={carregandoSubmissao}
              >
                {carregandoSubmissao ? (
                  <>
                    <span className="spinner"></span>
                    <span>Efetuando Matrícula...</span>
                  </>
                ) : (
                  <>
                    <IconUserPlus size={18} />
                    Confirmar Matrícula
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Histórico e Tabela de Matrículas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Caixa de Busca */}
          <div className="input-group" style={{ margin: 0, width: '100%' }}>
            <div className="input-group-wrapper">
              <span className="input-icon">
                <IconSearch size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Buscar matrícula por aluno, Matrícula ou disciplina..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* Histórico de Matrículas */}
          {matriculasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <IconInbox size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.6 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhuma matrícula registrada</h3>
              <p style={{ maxWidth: '380px' }}>Tente ajustar a busca para encontrar o registro desejado.</p>
            </div>
          ) : (
            <div className="tabela-container">
              <table className="tabela-sge">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Disciplina / Turma</th>
                    <th>Data Matrícula</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {matriculasFiltradas.map((mat) => (
                    <tr key={mat.id}>
                      <td>
                        <div>
                          <span style={{ fontWeight: 600, display: 'block' }}>{mat.discenteNome}</span>
                          <span style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)' }}>Matrícula: {mat.discenteMatricula}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span style={{ fontWeight: 600, display: 'block' }}>{mat.disciplinaNome}</span>
                          <span style={{ fontSize: '12px', color: 'var(--cor-texto-secundario)' }}>{mat.disciplinaCodigo} — Turma {mat.turmaCodigo}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--cor-texto-secundario)' }}>
                          <IconCalendar size={16} />
                          <span>{new Date(mat.dataMatricula).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-tag ${mat.status === 'ATIVA' ? 'status-ativo' : 'status-inativo'}`}>
                          {mat.status === 'ATIVA' ? 'Ativa' : 'Cancelada'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {mat.status === 'ATIVA' && (
                          <button 
                            onClick={() => handleCancelarMatricula(mat.id, mat.discenteNome)} 
                            className="btn-secundario" 
                            style={{ 
                              padding: '8px 10px',
                              color: 'var(--cor-erro)',
                              borderColor: 'hsla(350, 89%, 46%, 0.2)'
                            }}
                            title="Cancelar Matrícula"
                          >
                            <IconTrash size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Notificação Toast Flutuante com Framer Motion (Slide-in e fade-out) */}
      <AnimatePresence>
        {notificacao && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
