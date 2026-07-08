import { useEffect, useMemo, useState } from 'react'
import {
  IconAlertTriangle,
  IconBook,
  IconFileText,
  IconInbox
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { buscarMatriculasPorDiscente } from '../../matriculas/servicos/servicoMatricula'
import type { Matricula } from '../../matriculas/tipos'
import { buscarPlanoEnsinoPorTurma } from '../../planoensino/servicos/servicoPlanoEnsino'
import type { PlanoEnsino } from '../../planoensino/tipos'

const SECOES_PLANO: Array<{
  titulo: string
  campo: keyof Pick<
    PlanoEnsino,
    | 'ementa'
    | 'objetivos'
    | 'conteudoProgramatico'
    | 'metodologia'
    | 'avaliacao'
    | 'bibliografia'
  >
}> = [
  { titulo: 'Ementa', campo: 'ementa' },
  { titulo: 'Objetivos', campo: 'objetivos' },
  { titulo: 'Conteúdo programático', campo: 'conteudoProgramatico' },
  { titulo: 'Metodologia', campo: 'metodologia' },
  { titulo: 'Avaliação', campo: 'avaliacao' },
  { titulo: 'Bibliografia', campo: 'bibliografia' }
]

export default function PaginaPlanoEnsinoAluno() {
  const { usuario } = useAuth()

  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [turmaId, setTurmaId] = useState('')
  const [plano, setPlano] = useState<PlanoEnsino | null>(null)

  const [carregandoMatriculas, setCarregandoMatriculas] = useState(true)
  const [carregandoPlano, setCarregandoPlano] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const matriculaSelecionada = useMemo(
    () => matriculas.find((m) => m.turmaId === turmaId),
    [matriculas, turmaId]
  )

  useEffect(() => {
    async function carregarMatriculas() {
      if (!usuario) return

      try {
        setCarregandoMatriculas(true)

        const lista = await buscarMatriculasPorDiscente(String(usuario.id))
        const ativas = lista.filter((m) => m.status === 'ATIVA')

        setMatriculas(ativas)

        if (ativas.length > 0) {
          setTurmaId(ativas[0].turmaId)
        }
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar suas turmas matriculadas.')
      } finally {
        setCarregandoMatriculas(false)
      }
    }

    carregarMatriculas()
  }, [usuario])

  useEffect(() => {
    async function carregarPlano() {
      if (!turmaId) return

      try {
        setCarregandoPlano(true)
        setErro(null)

        const planoEncontrado = await buscarPlanoEnsinoPorTurma(turmaId)
        setPlano(planoEncontrado)
      } catch {
        setPlano(null)
      } finally {
        setCarregandoPlano(false)
      }
    }

    carregarPlano()
  }, [turmaId])

  if (carregandoMatriculas) {
    return (
      <PageContainer>
        <PageHeader
          title="Plano de Ensino"
          description="Carregando suas turmas matriculadas."
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
        description="Consulte o plano de ensino das disciplinas em que você está matriculado."
      />

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

      {matriculas.length === 0 ? (
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
            Nenhuma matrícula ativa
          </h3>
          <p style={{ maxWidth: '480px' }}>
            Você ainda não possui turmas ativas para consultar o plano de ensino.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
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
              <IconBook size={18} style={{ color: 'var(--cor-primaria)' }} />
              Minhas turmas
            </h3>

            <div className="input-group">
              <label htmlFor="turmaPlanoAluno">Selecione a turma</label>

              <select
                id="turmaPlanoAluno"
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
                disabled={carregandoPlano}
              >
                {matriculas.map((m) => (
                  <option key={m.id} value={m.turmaId}>
                    {m.disciplinaCodigo} — {m.disciplinaNome} ({m.turmaCodigo})
                  </option>
                ))}
              </select>
            </div>

            {matriculaSelecionada && (
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
                <strong>Disciplina:</strong> {matriculaSelecionada.disciplinaNome}
                <br />
                <strong>Código:</strong> {matriculaSelecionada.disciplinaCodigo}
                <br />
                <strong>Turma:</strong> {matriculaSelecionada.turmaCodigo}
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: 'var(--cor-fundo)',
              border: '1px solid var(--cor-borda)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--sombra-suave)'
            }}
          >
            {carregandoPlano ? (
              <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
                <span className="spinner"></span>
              </div>
            ) : !plano ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '70px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <IconFileText
                  size={48}
                  style={{
                    color: 'var(--cor-texto-secundario)',
                    opacity: 0.5
                  }}
                />
                <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>
                  Plano ainda não cadastrado
                </h3>
                <p style={{ maxWidth: '480px' }}>
                  O docente responsável ainda não registrou o plano de ensino desta turma.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginBottom: '22px',
                    paddingBottom: '18px',
                    borderBottom: '1px solid var(--cor-borda)'
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      color: 'var(--cor-azul-escuro)',
                      marginBottom: '8px'
                    }}
                  >
                    {plano.disciplinaNome}
                  </h3>

                  <p
                    style={{
                      color: 'var(--cor-texto-secundario)',
                      fontSize: '14px',
                      lineHeight: 1.6
                    }}
                  >
                    Turma {plano.turmaCodigo} • {plano.periodoLetivo} • Prof.{' '}
                    {plano.docenteNome}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {SECOES_PLANO.map((secao) => {
                    const conteudo = plano[secao.campo]

                    if (!conteudo) {
                      return null
                    }

                    return (
                      <section
                        key={secao.campo}
                        style={{
                          padding: '18px',
                          borderRadius: '10px',
                          border: '1px solid var(--cor-borda)',
                          backgroundColor: 'var(--cor-fundo-alternativo)'
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '15px',
                            color: 'var(--cor-azul-escuro)',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <IconFileText
                            size={16}
                            style={{ color: 'var(--cor-primaria)' }}
                          />
                          {secao.titulo}
                        </h4>

                        <p
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.7,
                            fontSize: '14px',
                            color: 'var(--cor-texto)'
                          }}
                        >
                          {conteudo}
                        </p>
                      </section>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  )
}
