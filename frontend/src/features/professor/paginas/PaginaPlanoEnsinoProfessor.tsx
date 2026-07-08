
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  IconAlertTriangle,
  IconCheck,
  IconFileText,
  IconInbox,
  IconNotebook
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import type { Turma } from '../../turmas/tipos'
import {
  buscarPlanoEnsinoPorTurma,
  salvarPlanoEnsino
} from '../../planoensino/servicos/servicoPlanoEnsino'
import type {
  PlanoEnsino,
  PlanoEnsinoRequest
} from '../../planoensino/tipos'

type CampoPlano = keyof PlanoEnsinoRequest

const FORMULARIO_INICIAL: PlanoEnsinoRequest = {
  ementa: '',
  objetivos: '',
  conteudoProgramatico: '',
  metodologia: '',
  avaliacao: '',
  bibliografia: ''
}

const CAMPOS: Array<{
  nome: CampoPlano
  label: string
  obrigatorio: boolean
  placeholder: string
}> = [
  {
    nome: 'ementa',
    label: 'Ementa',
    obrigatorio: true,
    placeholder: 'Descreva a síntese dos conteúdos e temas da disciplina.'
  },
  {
    nome: 'objetivos',
    label: 'Objetivos',
    obrigatorio: true,
    placeholder: 'Informe os objetivos gerais e específicos da turma.'
  },
  {
    nome: 'conteudoProgramatico',
    label: 'Conteúdo programático',
    obrigatorio: true,
    placeholder: 'Liste as unidades, tópicos e conteúdos previstos.'
  },
  {
    nome: 'metodologia',
    label: 'Metodologia',
    obrigatorio: true,
    placeholder: 'Descreva as estratégias de ensino, aulas, atividades e recursos.'
  },
  {
    nome: 'avaliacao',
    label: 'Avaliação',
    obrigatorio: true,
    placeholder: 'Informe os critérios, instrumentos e formas de avaliação.'
  },
  {
    nome: 'bibliografia',
    label: 'Bibliografia',
    obrigatorio: false,
    placeholder: 'Informe referências básicas e complementares.'
  }
]

export default function PaginaPlanoEnsinoProfessor() {
  const { usuario } = useAuth()

  const [turmas, setTurmas] = useState<Turma[]>([])
  const [turmaId, setTurmaId] = useState('')
  const [plano, setPlano] = useState<PlanoEnsino | null>(null)
  const [formulario, setFormulario] =
    useState<PlanoEnsinoRequest>(FORMULARIO_INICIAL)

  const [carregandoTurmas, setCarregandoTurmas] = useState(true)
  const [carregandoPlano, setCarregandoPlano] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [notificacao, setNotificacao] = useState<{
    mensagem: string
    tipo: 'sucesso' | 'erro'
  } | null>(null)

  const turmaSelecionada = useMemo(
    () => turmas.find((t) => t.id === turmaId),
    [turmas, turmaId]
  )

  const mostrarMensagem = (mensagem: string, tipo: 'sucesso' | 'erro') => {
    setNotificacao({ mensagem, tipo })

    setTimeout(() => {
      setNotificacao(null)
    }, 5000)
  }

  useEffect(() => {
    async function carregarTurmasProfessor() {
      if (!usuario) return

      try {
        setCarregandoTurmas(true)

        const listaTurmas = await obterTurmas()

        const minhasTurmas = listaTurmas.filter(
          (t) => Number(t.docenteId) === usuario.id && t.status !== 'CANCELADA'
        )

        setTurmas(minhasTurmas)

        if (minhasTurmas.length > 0) {
          setTurmaId(minhasTurmas[0].id)
        }
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar as turmas vinculadas ao professor.')
      } finally {
        setCarregandoTurmas(false)
      }
    }

    carregarTurmasProfessor()
  }, [usuario])

  useEffect(() => {
    async function carregarPlano() {
      if (!turmaId) return

      try {
        setCarregandoPlano(true)
        setErro(null)

        const planoEncontrado = await buscarPlanoEnsinoPorTurma(turmaId)

        setPlano(planoEncontrado)
        setFormulario({
          ementa: planoEncontrado.ementa,
          objetivos: planoEncontrado.objetivos,
          conteudoProgramatico: planoEncontrado.conteudoProgramatico,
          metodologia: planoEncontrado.metodologia,
          avaliacao: planoEncontrado.avaliacao,
          bibliografia: planoEncontrado.bibliografia || ''
        })
      } catch {
        setPlano(null)
        setFormulario(FORMULARIO_INICIAL)
      } finally {
        setCarregandoPlano(false)
      }
    }

    carregarPlano()
  }, [turmaId])

  const handleCampoChange = (campo: CampoPlano, valor: string) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor
    }))
  }

  const validarFormulario = () => {
    const campoVazio = CAMPOS.find(
      (campo) => campo.obrigatorio && !formulario[campo.nome]?.trim()
    )

    if (campoVazio) {
      mostrarMensagem(`O campo "${campoVazio.label}" é obrigatório.`, 'erro')
      return false
    }

    return true
  }

  const handleSalvar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!turmaId || !validarFormulario()) {
      return
    }

    try {
      setSalvando(true)

      const salvo = await salvarPlanoEnsino(turmaId, {
        ...formulario,
        bibliografia: formulario.bibliografia?.trim() || ''
      })

      setPlano(salvo)
      mostrarMensagem('Plano de ensino salvo com sucesso.', 'sucesso')
    } catch (err) {
      console.error(err)
      mostrarMensagem('Não foi possível salvar o plano de ensino.', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  if (carregandoTurmas) {
    return (
      <PageContainer>
        <PageHeader
          title="Plano de Ensino"
          description="Carregando turmas vinculadas."
        />

        <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
          <span className="spinner"></span>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Plano de Ensino"
        description="Cadastre e atualize o plano de ensino das suas turmas."
      />

      {notificacao && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            border:
              notificacao.tipo === 'sucesso'
                ? '1px solid var(--cor-sucesso)'
                : '1px solid var(--cor-erro)',
            backgroundColor:
              notificacao.tipo === 'sucesso'
                ? 'rgba(22, 163, 74, 0.08)'
                : 'rgba(220, 38, 38, 0.08)',
            color:
              notificacao.tipo === 'sucesso'
                ? 'var(--cor-sucesso)'
                : 'var(--cor-erro)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          {notificacao.tipo === 'sucesso' ? (
            <IconCheck size={18} />
          ) : (
            <IconAlertTriangle size={18} />
          )}
          <span>{notificacao.mensagem}</span>
        </div>
      )}

      {erro && (
        <div
          style={{
            marginBottom: '16px',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid var(--cor-erro)',
            color: 'var(--cor-erro)',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700
          }}
        >
          <IconAlertTriangle size={18} />
          <span>{erro}</span>
        </div>
      )}

      {turmas.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            backgroundColor: 'var(--cor-fundo)',
            borderRadius: '12px',
            border: '1px solid var(--cor-borda)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <IconInbox
            size={48}
            style={{ color: 'var(--cor-texto-secundario)', opacity: 0.5 }}
          />
          <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>
            Nenhuma turma vinculada
          </h3>
          <p style={{ maxWidth: '480px' }}>
            Não há turmas disponíveis para cadastro de plano de ensino.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '24px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--cor-fundo)',
              border: '1px solid var(--cor-borda)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--sombra-suave)'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--cor-azul-escuro)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IconNotebook size={18} style={{ color: 'var(--cor-primaria)' }} />
              Turma
            </h3>

            <div className="input-group">
              <label htmlFor="turmaPlanoEnsino">Selecione a turma</label>

              <select
                id="turmaPlanoEnsino"
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
                disabled={carregandoPlano || salvando}
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})
                  </option>
                ))}
              </select>
            </div>

            {turmaSelecionada && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '14px',
                  backgroundColor: 'var(--cor-fundo-alternativo)',
                  borderRadius: '10px',
                  border: '1px solid var(--cor-borda)',
                  fontSize: '13px',
                  lineHeight: 1.6
                }}
              >
                <strong>Disciplina:</strong> {turmaSelecionada.disciplinaNome}
                <br />
                <strong>Código:</strong> {turmaSelecionada.codigo}
                <br />
                <strong>Período:</strong> {turmaSelecionada.periodoLetivo}
                <br />
                <strong>Status:</strong> {turmaSelecionada.status}
              </div>
            )}

            <div
              style={{
                marginTop: '18px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: plano
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'rgba(245, 158, 11, 0.08)',
                border: plano
                  ? '1px solid var(--cor-sucesso)'
                  : '1px solid var(--cor-alerta)',
                color: plano ? 'var(--cor-sucesso)' : 'var(--cor-alerta)',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              {plano
                ? 'Plano já cadastrado. Alterações atualizarão o registro.'
                : 'Nenhum plano cadastrado para esta turma.'}
            </div>
          </div>

          <form
            onSubmit={handleSalvar}
            style={{
              backgroundColor: 'var(--cor-fundo)',
              border: '1px solid var(--cor-borda)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--sombra-suave)'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--cor-azul-escuro)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IconFileText size={18} style={{ color: 'var(--cor-primaria)' }} />
              Dados do plano de ensino
            </h3>

            {carregandoPlano ? (
              <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
                <span className="spinner"></span>
              </div>
            ) : (
              <>
                {CAMPOS.map((campo) => (
                  <div className="input-group" key={campo.nome}>
                    <label htmlFor={campo.nome}>
                      {campo.label}
                      {campo.obrigatorio ? ' *' : ''}
                    </label>

                    <textarea
                      id={campo.nome}
                      value={formulario[campo.nome] || ''}
                      onChange={(e) => handleCampoChange(campo.nome, e.target.value)}
                      placeholder={campo.placeholder}
                      rows={campo.nome === 'conteudoProgramatico' ? 6 : 4}
                      disabled={salvando}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--raio-borda)',
                        border: '1px solid var(--cor-borda)',
                        outline: 'none',
                        fontSize: '14px',
                        backgroundColor: 'var(--cor-fundo)',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="login-botao"
                  disabled={salvando}
                  style={{ width: '100%', gap: '8px', marginTop: '8px' }}
                >
                  {salvando ? (
                    <>
                      <span className="spinner"></span>
                      <span>Salvando plano...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck size={18} />
                      Salvar plano de ensino
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </PageContainer>
  )
}
