import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import type { PerfilUsuario } from '../../autenticacao/tipos'
import type { Usuario as UsuarioCompleto } from '../tipos'

interface UserFormModalProps {
  usuarioParaEditar?: UsuarioCompleto | null
  onClose: () => void
  onSave: (usuario: Omit<UsuarioCompleto, 'id'> & { id?: string }) => Promise<void>
}

/**
 * Modal dinâmico para cadastrar ou editar usuários.
 * Ajusta seus campos conforme o perfil de acesso selecionado.
 */
export default function UserFormModal({ usuarioParaEditar, onClose, onSave }: UserFormModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [perfil, setPerfil] = useState<PerfilUsuario>('DISCENTE')
  const [senha, setSenha] = useState('')
  
  // Campos condicionais (Discente)
  const [matricula, setMatricula] = useState('')
  const [curso, setCurso] = useState('')

  // Campos condicionais (Docente)
  const [registroDocente, setRegistroDocente] = useState('')
  const [titulacao, setTitulacao] = useState('Licenciatura')

  // Campos condicionais (Administrador)
  const [matriculaAdministrativa, setMatriculaAdministrativa] = useState('')

  // UI States
  const [carregando, setCarregando] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

  // Carrega os dados se for modo edição
  useEffect(() => {
    if (usuarioParaEditar) {
      setNome(usuarioParaEditar.nome)
      setEmail(usuarioParaEditar.email)
      setPerfil(usuarioParaEditar.perfil)
      
      if (usuarioParaEditar.perfil === 'DISCENTE') {
        setMatricula(usuarioParaEditar.matricula || '')
        setCurso(usuarioParaEditar.curso || '')
      } else if (usuarioParaEditar.perfil === 'DOCENTE') {
        setRegistroDocente(usuarioParaEditar.registroDocente || '')
        setTitulacao(usuarioParaEditar.titulacao || 'Especialização')
      } else if (usuarioParaEditar.perfil === 'ADMINISTRADOR') {
        setMatriculaAdministrativa(usuarioParaEditar.matriculaAdministrativa || '')
      }
    }
  }, [usuarioParaEditar])

  // Validação em português conforme o perfil selecionado
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!nome.trim()) novosErros.nome = 'O nome completo é obrigatório.'
    
    if (!email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'Insira um formato de e-mail válido.'
    }

    // Senha apenas no cadastro
    if (!usuarioParaEditar && (!senha || senha.length < 6)) {
      novosErros.senha = 'A senha temporária é obrigatória e deve ter pelo menos 6 caracteres.'
    }

    // Validações por perfil
    if (perfil === 'DISCENTE') {
      if (!matricula.trim()) novosErros.matricula = 'A matrícula do aluno é obrigatória.'
      if (!curso.trim()) novosErros.curso = 'A série / ano escolar é obrigatória.'
    } else if (perfil === 'DOCENTE') {
      if (!registroDocente.trim()) novosErros.registroDocente = 'O registro do professor é obrigatório.'
    } else if (perfil === 'ADMINISTRADOR') {
      if (!matriculaAdministrativa.trim()) novosErros.matriculaAdministrativa = 'A matrícula administrativa é obrigatória.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Submissão do formulário chamando o callback do pai
  const handleSubmeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCarregando(true)

    // Prepara os dados para salvar
    const dadosParaSalvar: Omit<UsuarioCompleto, 'id'> & { id?: string } = {
      ...(usuarioParaEditar ? { id: usuarioParaEditar.id } : {}),
      nome,
      email,
      perfil,
      status: usuarioParaEditar ? usuarioParaEditar.status : 'ATIVO',
      ...(perfil === 'DISCENTE' ? { matricula, curso } : {}),
      ...(perfil === 'DOCENTE' ? { registroDocente, titulacao } : {}),
      ...(perfil === 'ADMINISTRADOR' ? { matriculaAdministrativa } : {})
    }

    try {
      await onSave(dadosParaSalvar)
      onClose()
    } catch (err) {
      console.error(err)
      setErros({ global: 'Ocorreu um erro ao salvar o usuário. Tente novamente.' })
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
      >
        {/* Cabeçalho do Modal */}
        <div className="modal-header">
          <h2>{usuarioParaEditar ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={carregando} title="Fechar modal">
            <IconX size={20} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSubmeterFormulario}>
          <div className="modal-body">
            {erros.global && <div style={{ color: 'var(--cor-erro)', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>{erros.global}</div>}

            {/* Nome Completo */}
            <div className="input-group">
              <label htmlFor="modalNome">Nome Completo</label>
              <input 
                type="text" 
                id="modalNome" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos de Andrade Silva"
                className={erros.nome ? 'input-com-erro' : ''}
                style={{ paddingLeft: '16px' }}
                disabled={carregando}
              />
              {erros.nome && <span className="input-erro-msg">{erros.nome}</span>}
            </div>

            {/* E-mail Institucional */}
            <div className="input-group">
              <label htmlFor="modalEmail">E-mail Institucional</label>
              <input 
                type="email" 
                id="modalEmail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: carlos.silva@colegio.se.gov.br"
                className={erros.email ? 'input-com-erro' : ''}
                style={{ paddingLeft: '16px' }}
                disabled={carregando}
              />
              {erros.email && <span className="input-erro-msg">{erros.email}</span>}
            </div>

            {/* Perfil de Usuário */}
            <div className="input-group">
              <label htmlFor="modalPerfil">Perfil Escolar</label>
              <select
                id="modalPerfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value as PerfilUsuario)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--raio-borda)',
                  border: '1px solid var(--cor-borda)',
                  outline: 'none',
                  fontSize: '15px'
                }}
                disabled={carregando || !!usuarioParaEditar} // Não permite alterar perfil na edição por integridade do banco
              >
                <option value="DISCENTE">Aluno</option>
                <option value="DOCENTE">Professor</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </div>

            {/* Senha temporária (Apenas criação) */}
            {!usuarioParaEditar && (
              <div className="input-group">
                <label htmlFor="modalSenha">Senha Temporária</label>
                <input 
                  type="password" 
                  id="modalSenha" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Min. 6 caracteres"
                  className={erros.senha ? 'input-com-erro' : ''}
                  style={{ paddingLeft: '16px' }}
                  disabled={carregando}
                />
                {erros.senha && <span className="input-erro-msg">{erros.senha}</span>}
              </div>
            )}

            {/* ========================================================================
               CAMPOS CONDICIONAIS DE ACORDO COM O PERFIL
               ======================================================================== */}

            {perfil === 'DISCENTE' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div className="input-group">
                  <label htmlFor="modalMatricula">Matrícula Escolar</label>
                  <input 
                    type="text" 
                    id="modalMatricula" 
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 2026001201"
                    className={erros.matricula ? 'input-com-erro' : ''}
                    style={{ paddingLeft: '16px' }}
                    disabled={carregando}
                  />
                  {erros.matricula && <span className="input-erro-msg">{erros.matricula}</span>}
                </div>
                <div className="input-group">
                  <label htmlFor="modalCurso">Série / Ano Escolar</label>
                  <input 
                    type="text" 
                    id="modalCurso" 
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    placeholder="Ex: 1º Ano Ensino Médio"
                    className={erros.curso ? 'input-com-erro' : ''}
                    style={{ paddingLeft: '16px' }}
                    disabled={carregando}
                  />
                  {erros.curso && <span className="input-erro-msg">{erros.curso}</span>}
                </div>
              </motion.div>
            )}

            {perfil === 'DOCENTE' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div className="input-group">
                  <label htmlFor="modalRegDocente">Registro do Professor (Cadastro/Matrícula)</label>
                  <input 
                    type="text" 
                    id="modalRegDocente" 
                    value={registroDocente}
                    onChange={(e) => setRegistroDocente(e.target.value)}
                    placeholder="Ex: DOC11092"
                    className={erros.registroDocente ? 'input-com-erro' : ''}
                    style={{ paddingLeft: '16px' }}
                    disabled={carregando}
                  />
                  {erros.registroDocente && <span className="input-erro-msg">{erros.registroDocente}</span>}
                </div>
                <div className="input-group">
                  <label htmlFor="modalTitulacao">Titulação Máxima</label>
                  <select
                    id="modalTitulacao"
                    value={titulacao}
                    onChange={(e) => setTitulacao(e.target.value)}
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
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Especialização">Especialização</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>
              </motion.div>
            )}

            {perfil === 'ADMINISTRADOR' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div className="input-group">
                  <label htmlFor="modalMatAdmin">Matrícula Administrativa</label>
                  <input 
                    type="text" 
                    id="modalMatAdmin" 
                    value={matriculaAdministrativa}
                    onChange={(e) => setMatriculaAdministrativa(e.target.value)}
                    placeholder="Ex: ADM88231"
                    className={erros.matriculaAdministrativa ? 'input-com-erro' : ''}
                    style={{ paddingLeft: '16px' }}
                    disabled={carregando}
                  />
                  {erros.matriculaAdministrativa && <span className="input-erro-msg">{erros.matriculaAdministrativa}</span>}
                </div>
              </motion.div>
            )}
          </div>

          {/* Rodapé de Ações */}
          <div className="modal-footer">
            <button type="button" className="btn-secundario" onClick={onClose} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" className="login-botao" style={{ width: 'auto', padding: '10px 24px' }} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
