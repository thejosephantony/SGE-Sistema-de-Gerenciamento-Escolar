import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import type { Disciplina } from '../tipos'

interface DisciplineFormModalProps {
  disciplinaParaEditar?: Disciplina | null
  onClose: () => void
  onSave: (disciplina: Omit<Disciplina, 'id'> & { id?: string }) => Promise<void>
}

/**
 * Modal dinâmico para cadastrar ou editar disciplinas do SGE.
 */
export default function DisciplineFormModal({ disciplinaParaEditar, onClose, onSave }: DisciplineFormModalProps) {
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [cargaHoraria, setCargaHoraria] = useState<number>(60)
  const [ementa, setEmenta] = useState('')

  // UI States
  const [carregando, setCarregando] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

  // Carrega dados se for edição
  useEffect(() => {
    if (disciplinaParaEditar) {
      setNome(disciplinaParaEditar.nome)
      setCodigo(disciplinaParaEditar.codigo)
      setCargaHoraria(disciplinaParaEditar.cargaHoraria)
      setEmenta(disciplinaParaEditar.ementa)
    }
  }, [disciplinaParaEditar])

  // Validação em português
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!nome.trim()) novosErros.nome = 'O nome da disciplina é obrigatório.'
    
    if (!codigo.trim()) {
      novosErros.codigo = 'O código da disciplina é obrigatório.'
    } else if (!/^[A-Z]{4}\d{4}$/.test(codigo.toUpperCase().trim())) {
      novosErros.codigo = 'O código deve conter 4 letras e 4 números (ex: PORT1001).'
    }

    if (!cargaHoraria || cargaHoraria <= 0) {
      novosErros.cargaHoraria = 'A carga horária deve ser maior que 0.'
    }

    if (!ementa.trim()) {
      novosErros.ementa = 'A ementa da disciplina é obrigatória.'
    } else if (ementa.length < 20) {
      novosErros.ementa = 'A ementa deve conter pelo menos 20 caracteres.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Envia dados chamando o callback do componente pai
  const handleSubmeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCarregando(true)

    const dadosParaSalvar: Omit<Disciplina, 'id'> & { id?: string } = {
      ...(disciplinaParaEditar ? { id: disciplinaParaEditar.id } : {}),
      nome: nome.trim(),
      codigo: codigo.toUpperCase().trim(),
      cargaHoraria,
      ementa: ementa.trim(),
      ativa: disciplinaParaEditar ? disciplinaParaEditar.ativa : true
    }

    try {
      await onSave(dadosParaSalvar)
      onClose()
    } catch (err: unknown) {
      const msgErro = err instanceof Error ? err.message : 'Erro ao salvar a disciplina.'
      setErros({ global: msgErro })
    } finally {
      setCarregando(false)
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
        style={{ maxWidth: '600px' }}
      >
        {/* Cabeçalho */}
        <div className="modal-header">
          <h2>{disciplinaParaEditar ? 'Editar Disciplina' : 'Nova Disciplina'}</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={carregando} title="Fechar modal">
            <IconX size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmeterFormulario}>
          <div className="modal-body">
            {erros.global && <div style={{ color: 'var(--cor-erro)', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>{erros.global}</div>}

            {/* Código da Disciplina */}
            <div className="input-group">
              <label htmlFor="modalCodDisc">Código da Disciplina (Ex: PORT1001)</label>
              <input 
                type="text" 
                id="modalCodDisc" 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: PORT1001"
                className={erros.codigo ? 'input-com-erro' : ''}
                style={{ paddingLeft: '16px', textTransform: 'uppercase' }}
                disabled={carregando}
              />
              {erros.codigo && <span className="input-erro-msg">{erros.codigo}</span>}
            </div>

            {/* Nome da Disciplina */}
            <div className="input-group">
              <label htmlFor="modalNomeDisc">Nome da Disciplina</label>
              <input 
                type="text" 
                id="modalNomeDisc" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Língua Portuguesa"
                className={erros.nome ? 'input-com-erro' : ''}
                style={{ paddingLeft: '16px' }}
                disabled={carregando}
              />
              {erros.nome && <span className="input-erro-msg">{erros.nome}</span>}
            </div>

            {/* Carga Horária */}
            <div className="input-group">
              <label htmlFor="modalCHDisc">Carga Horária (Horas Aula)</label>
              <select
                id="modalCHDisc"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--raio-borda)',
                  border: '1px solid var(--cor-borda)',
                  outline: 'none',
                  fontSize: '15px'
                }}
                disabled={carregando}
              >
                <option value={30}>30 horas</option>
                <option value={60}>60 horas</option>
                <option value={90}>90 horas</option>
                <option value={120}>120 horas</option>
              </select>
            </div>

            {/* Ementa */}
            <div className="input-group">
              <label htmlFor="modalEmentaDisc">Ementa da Disciplina</label>
              <textarea
                id="modalEmentaDisc"
                value={ementa}
                onChange={(e) => setEmenta(e.target.value)}
                placeholder="Digite a ementa com tópicos, referências e objetivos da disciplina escolar..."
                className={erros.ementa ? 'input-com-erro' : ''}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--raio-borda)',
                  border: '1px solid var(--cor-borda)',
                  outline: 'none',
                  fontSize: '15px',
                  minHeight: '120px',
                  resize: 'vertical',
                  lineHeight: '1.5'
                }}
                disabled={carregando}
              />
              {erros.ementa && <span className="input-erro-msg">{erros.ementa}</span>}
            </div>
          </div>

          {/* Rodapé */}
          <div className="modal-footer">
            <button type="button" className="btn-secundario" onClick={onClose} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" className="login-botao" style={{ width: 'auto', padding: '10px 24px' }} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Disciplina'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
