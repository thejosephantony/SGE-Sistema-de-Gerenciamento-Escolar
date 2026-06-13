import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import type { Turma, StatusTurma } from '../tipos'
import { obterDisciplinas } from '../../disciplinas/servicos/servicoDisciplina'
import { obterUsuarios } from '../../usuarios/servicos/servicoUsuario'
import type { Disciplina } from '../../disciplinas/tipos'
import type { Usuario } from '../../usuarios/tipos'

interface ClassFormModalProps {
  turmaParaEditar?: Turma | null
  onClose: () => void
  onSave: (turma: Omit<Turma, 'id'> & { id?: string }) => Promise<void>
}

/**
 * Modal para cadastrar ou editar Turmas.
 * Carrega a lista de disciplinas e professores do sistema para permitir a associação.
 */
export default function ClassFormModal({ turmaParaEditar, onClose, onSave }: ClassFormModalProps) {
  const [codigo, setCodigo] = useState('T01')
  const [capacidade, setCapacidade] = useState<number>(30)
  const [periodoLetivo, setPeriodoLetivo] = useState('2026')
  const [disciplinaId, setDisciplinaId] = useState('')
  const [docenteId, setDocenteId] = useState('')
  const [status, setStatus] = useState<StatusTurma>('PLANEJADA')

  // Listas auxiliares carregadas dinamicamente
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [docentes, setDocentes] = useState<Usuario[]>([])

  // UI States
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [carregandoSubmissao, setCarregandoSubmissao] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

  // Carrega professores e disciplinas ativas
  useEffect(() => {
    async function carregarDependencias() {
      try {
        const [listaDisciplinas, listaUsuarios] = await Promise.all([
          obterDisciplinas(),
          obterUsuarios()
        ])

        // Filtra apenas disciplinas ativas
        const ativas = listaDisciplinas.filter((d) => d.ativa)
        setDisciplinas(ativas)
        if (ativas.length > 0 && !turmaParaEditar) {
          setDisciplinaId(ativas[0].id)
        }

        // Filtra apenas usuários ativos com o perfil DOCENTE
        const professores = listaUsuarios.filter((u) => u.perfil === 'DOCENTE' && u.status === 'ATIVO')
        setDocentes(professores)
        if (professores.length > 0 && !turmaParaEditar) {
          setDocenteId(professores[0].id)
        }
      } catch (err) {
        console.error(err)
        setErros({ global: 'Não foi possível carregar as dependências de professores/disciplinas.' })
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarDependencias()
  }, [turmaParaEditar])

  // Preenche dados se for edição
  useEffect(() => {
    if (turmaParaEditar) {
      setCodigo(turmaParaEditar.codigo)
      setCapacidade(turmaParaEditar.capacidade)
      setPeriodoLetivo(turmaParaEditar.periodoLetivo)
      setDisciplinaId(turmaParaEditar.disciplinaId)
      setDocenteId(turmaParaEditar.docenteId)
      setStatus(turmaParaEditar.status)
    }
  }, [turmaParaEditar])

  // Validação em português
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!codigo.trim()) {
      novosErros.codigo = 'O código da turma é obrigatório.'
    } else if (!/^T\d{2}$/.test(codigo.toUpperCase().trim())) {
      novosErros.codigo = 'O código deve seguir o padrão T + 2 dígitos (ex: T01, T02).'
    }

    if (!capacidade || capacidade <= 0) {
      novosErros.capacidade = 'A capacidade de alunos deve ser maior que 0.'
    }

    if (!periodoLetivo.trim()) {
      novosErros.periodoLetivo = 'O período letivo é obrigatório.'
    } else if (!/^\d{4}$/.test(periodoLetivo.trim())) {
      novosErros.periodoLetivo = 'O ano letivo deve seguir o formato AAAA (ex: 2026).'
    }

    if (!disciplinaId) novosErros.disciplinaId = 'Selecione uma disciplina cadastrada.'
    if (!docenteId) novosErros.docenteId = 'Selecione um professor responsável.'

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Envia formulário chamando o callback onSave
  const handleSubmeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCarregandoSubmissao(true)

    // Encontra os nomes correspondentes para salvar redundâncias limpas no mock
    const disciplinaSelecionada = disciplinas.find((d) => d.id === disciplinaId)
    const docenteSelecionado = docentes.find((u) => u.id === docenteId)

    const dadosParaSalvar: Omit<Turma, 'id'> & { id?: string } = {
      ...(turmaParaEditar ? { id: turmaParaEditar.id } : {}),
      codigo: codigo.toUpperCase().trim(),
      capacidade,
      status,
      periodoLetivo: periodoLetivo.trim(),
      disciplinaId,
      disciplinaNome: disciplinaSelecionada?.nome || 'Disciplina N/A',
      disciplinaCodigo: disciplinaSelecionada?.codigo || 'N/A',
      docenteId,
      docenteNome: docenteSelecionado?.nome || 'Docente N/A'
    }

    try {
      await onSave(dadosParaSalvar)
      onClose()
    } catch (err: unknown) {
      const msgErro = err instanceof Error ? err.message : 'Erro ao salvar a turma.'
      setErros({ global: msgErro })
    } finally {
      setCarregandoSubmissao(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="modal-container"
      >
        {/* Cabeçalho */}
        <div className="modal-header">
          <h2>{turmaParaEditar ? 'Editar Turma' : 'Criar Nova Turma'}</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={carregandoSubmissao || carregandoDados} title="Fechar modal">
            <IconX size={20} />
          </button>
        </div>

        {/* Formulário */}
        {carregandoDados ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' }}>
            <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)' }}></span>
            <p style={{ color: 'var(--cor-texto-secundario)', fontSize: '14px' }}>Carregando dados necessários...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmeterFormulario}>
            <div className="modal-body">
              {erros.global && <div style={{ color: 'var(--cor-erro)', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>{erros.global}</div>}

              {/* Código da Turma */}
              <div className="input-group">
                <label htmlFor="modalCodTurma">Código da Turma (Ex: T01)</label>
                <input 
                  type="text" 
                  id="modalCodTurma" 
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: T01"
                  className={erros.codigo ? 'input-com-erro' : ''}
                  style={{ paddingLeft: '16px', textTransform: 'uppercase' }}
                  disabled={carregandoSubmissao}
                />
                {erros.codigo && <span className="input-erro-msg">{erros.codigo}</span>}
              </div>

              {/* Ano Letivo */}
              <div className="input-group">
                <label htmlFor="modalPerTurma">Ano Letivo (Ex: 2026)</label>
                <input 
                  type="text" 
                  id="modalPerTurma" 
                  value={periodoLetivo}
                  onChange={(e) => setPeriodoLetivo(e.target.value)}
                  placeholder="Ex: 2026"
                  className={erros.periodoLetivo ? 'input-com-erro' : ''}
                  style={{ paddingLeft: '16px' }}
                  disabled={carregandoSubmissao}
                />
                {erros.periodoLetivo && <span className="input-erro-msg">{erros.periodoLetivo}</span>}
              </div>

              {/* Capacidade de Alunos */}
              <div className="input-group">
                <label htmlFor="modalCapTurma">Capacidade Máxima (Alunos)</label>
                <input 
                  type="number" 
                  id="modalCapTurma" 
                  value={capacidade}
                  onChange={(e) => setCapacidade(Number(e.target.value))}
                  placeholder="Ex: 35"
                  className={erros.capacidade ? 'input-com-erro' : ''}
                  style={{ paddingLeft: '16px' }}
                  disabled={carregandoSubmissao}
                  min="1"
                />
                {erros.capacidade && <span className="input-erro-msg">{erros.capacidade}</span>}
              </div>

              {/* Seleção de Disciplina */}
              <div className="input-group">
                <label htmlFor="modalSelectDisc">Matéria / Disciplina</label>
                {disciplinas.length === 0 ? (
                  <p style={{ color: 'var(--cor-erro)', fontSize: '13px', padding: '10px 0' }}>Cadastre uma disciplina ativa primeiro!</p>
                ) : (
                  <select
                    id="modalSelectDisc"
                    value={disciplinaId}
                    onChange={(e) => setDisciplinaId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 'var(--raio-borda)',
                      border: '1px solid var(--cor-borda)',
                      outline: 'none',
                      fontSize: '15px',
                      backgroundColor: 'var(--cor-fundo)'
                    }}
                    disabled={carregandoSubmissao || !!turmaParaEditar}
                  >
                    {disciplinas.map((d) => (
                      <option key={d.id} value={d.id}>{d.codigo} — {d.nome}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Seleção de Professor */}
              <div className="input-group">
                <label htmlFor="modalSelectDoc">Professor Responsável</label>
                {docentes.length === 0 ? (
                  <p style={{ color: 'var(--cor-erro)', fontSize: '13px', padding: '10px 0' }}>Cadastre um professor ativo primeiro!</p>
                ) : (
                  <select
                    id="modalSelectDoc"
                    value={docenteId}
                    onChange={(e) => setDocenteId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 'var(--raio-borda)',
                      border: '1px solid var(--cor-borda)',
                      outline: 'none',
                      fontSize: '15px',
                      backgroundColor: 'var(--cor-fundo)'
                    }}
                    disabled={carregandoSubmissao}
                  >
                    {docentes.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.nome}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Status da Turma (Apenas edição) */}
              {turmaParaEditar && (
                <div className="input-group">
                  <label htmlFor="modalSelectStatus">Status do Ciclo da Turma</label>
                  <select
                    id="modalSelectStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusTurma)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 'var(--raio-borda)',
                      border: '1px solid var(--cor-borda)',
                      outline: 'none',
                      fontSize: '15px',
                      backgroundColor: 'var(--cor-fundo)'
                    }}
                    disabled={carregandoSubmissao}
                  >
                    <option value="PLANEJADA">Planejada</option>
                    <option value="ABERTA">Aberta (Matrículas Disponíveis)</option>
                    <option value="EM_ANDAMENTO">Em Andamento (Aulas Iniciadas)</option>
                    <option value="ENCERRADA">Encerrada (Finalizada)</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="modal-footer">
              <button type="button" className="btn-secundario" onClick={onClose} disabled={carregandoSubmissao}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="login-botao" 
                style={{ width: 'auto', padding: '10px 24px' }} 
                disabled={carregandoSubmissao || disciplinas.length === 0 || docentes.length === 0}
              >
                {carregandoSubmissao ? 'Salvando...' : 'Salvar Turma'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
