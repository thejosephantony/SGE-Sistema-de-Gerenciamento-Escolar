import React, { useState, useEffect } from 'react'
import {
  IconFileText,
  IconDownload,
  IconPrinter,
  IconCheck,
  IconAlertTriangle,
  IconReport
} from '@tabler/icons-react'
import ContainerPagina from '../../../components/ui/ContainerPagina'
import CabecalhoPagina from '../../../components/ui/CabecalhoPagina'
import { obterUsuarios } from '../../usuarios/servicos/servicoUsuario'
import { obterTurmas } from '../../turmas/servicos/servicoTurma'
import { obterMatriculas } from '../../matriculas/servicos/servicoMatricula'
import type { Usuario } from '../../usuarios/tipos'
import type { Turma } from '../../turmas/tipos'
import type { Matricula } from '../../matriculas/tipos'

type TipoRelatorio = 'BOLETIM' | 'DIARIO' | 'TURMA'

const TOTAL_AULAS = 24

export default function PaginaRelatoriosAdministrador() {
  const [tipo, setTipo] = useState<TipoRelatorio>('BOLETIM')
  const [discenteId, setDiscenteId] = useState('')
  const [turmaId, setTurmaId] = useState('')

  const [discentes, setDiscentes] = useState<Usuario[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])

  const [carregandoDados, setCarregandoDados] = useState(true)
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [relatorioGerado, setRelatorioGerado] = useState(false)

  useEffect(() => {
    async function carregarDependencias() {
      try {
        const [listaUsuarios, listaTurmas, listaMatriculas] = await Promise.all([
          obterUsuarios(),
          obterTurmas(),
          obterMatriculas()
        ])

        const alunos = listaUsuarios.filter(
          (u) => u.perfil === 'DISCENTE' && u.status === 'ATIVO'
        )

        setDiscentes(alunos)
        setTurmas(listaTurmas)
        setMatriculas(listaMatriculas)

        if (alunos.length > 0) {
          setDiscenteId(String(alunos[0].id))
        }

        if (listaTurmas.length > 0) {
          setTurmaId(String(listaTurmas[0].id))
        }
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar dependências dos relatórios.')
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarDependencias()
  }, [])

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault()

    setGerandoRelatorio(true)
    setRelatorioGerado(false)

    setTimeout(() => {
      setGerandoRelatorio(false)
      setRelatorioGerado(true)
    }, 400)
  }

  const handleImprimirRelatorio = () => {
    const areaRelatorio = document.getElementById('relatorio-area-impressao-admin')

    if (!areaRelatorio) {
      window.print()
      return
    }

    const janelaImpressao = window.open('', '_blank', 'width=1000,height=800')

    if (!janelaImpressao) {
      window.print()
      return
    }

    const tituloRelatorio =
      tipo === 'BOLETIM'
        ? 'Boletim Individual'
        : tipo === 'DIARIO'
          ? 'Diário de Classe'
          : 'Relatório de Turma'

    janelaImpressao.document.open()

    janelaImpressao.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>${tituloRelatorio} - SGE</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            :root {
              --fonte-sans: Arial, Helvetica, sans-serif;
              --cor-primaria: #111827;
              --cor-sucesso: #111827;
              --cor-azul-escuro: #111827;
              --cor-borda: #d1d5db;
              --cor-fundo: #ffffff;
              --cor-fundo-alternativo: #f9fafb;
              --sombra-card: none;
            }

            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #000000;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10px;
              line-height: 1.25;
            }

            #relatorio-area-impressao-admin {
              width: 100% !important;
              max-width: 190mm !important;
              margin: 0 auto !important;
              padding: 0 !important;
              color: #000000 !important;
              background: #ffffff !important;
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 10px !important;
              line-height: 1.25 !important;
              box-shadow: none !important;
              border: 0 !important;
            }

            #relatorio-area-impressao-admin * {
              max-width: 100% !important;
              font-family: Arial, Helvetica, sans-serif !important;
            }

            #relatorio-area-impressao-admin h2 {
              font-size: 15px !important;
              line-height: 1.2 !important;
              margin: 0 !important;
              padding: 0 !important;
              text-align: center !important;
            }

            #relatorio-area-impressao-admin h3 {
              font-size: 12px !important;
              line-height: 1.25 !important;
              margin: 0 0 6mm 0 !important;
              padding: 0 !important;
              text-align: center !important;
            }

            #relatorio-area-impressao-admin p {
              font-size: 9px !important;
              line-height: 1.25 !important;
              margin: 1mm 0 !important;
            }

            #relatorio-area-impressao-admin div {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            #relatorio-area-impressao-admin div[style*="grid-template-columns"] {
              gap: 5mm !important;
              margin-bottom: 6mm !important;
              padding: 4mm !important;
              border-radius: 0 !important;
              border: 1px solid #d1d5db !important;
            }

            #relatorio-area-impressao-admin table {
              width: 100% !important;
              border-collapse: collapse !important;
              table-layout: fixed !important;
              font-size: 8.5px !important;
              margin-top: 4mm !important;
            }

            #relatorio-area-impressao-admin thead {
              display: table-header-group;
            }

            #relatorio-area-impressao-admin tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            #relatorio-area-impressao-admin th,
            #relatorio-area-impressao-admin td {
              padding: 3px 4px !important;
              vertical-align: top !important;
              overflow-wrap: anywhere !important;
              word-break: break-word !important;
              border-bottom: 1px solid #e5e7eb !important;
            }

            #relatorio-area-impressao-admin th {
              font-weight: 700 !important;
              border-bottom: 2px solid #000000 !important;
            }

            .relatorio-documento-diario th:nth-child(1),
            .relatorio-documento-diario td:nth-child(1) {
              width: 24mm !important;
            }

            .relatorio-documento-diario th:nth-child(2),
            .relatorio-documento-diario td:nth-child(2) {
              width: 50mm !important;
            }

            .relatorio-documento-diario th:nth-child(3),
            .relatorio-documento-diario td:nth-child(3) {
              width: 20mm !important;
              text-align: center !important;
            }

            .relatorio-documento-diario th:nth-child(4),
            .relatorio-documento-diario td:nth-child(4) {
              width: 20mm !important;
              text-align: center !important;
            }

            .relatorio-documento-diario th:nth-child(5),
            .relatorio-documento-diario td:nth-child(5) {
              width: 16mm !important;
              text-align: center !important;
            }

            .relatorio-documento-diario th:nth-child(6),
            .relatorio-documento-diario td:nth-child(6) {
              width: 24mm !important;
              text-align: right !important;
            }

            .relatorio-documento-boletim table,
            .relatorio-documento-turma table {
              font-size: 8px !important;
            }

            .relatorio-documento-boletim th:nth-child(1),
            .relatorio-documento-boletim td:nth-child(1) {
              width: 42mm !important;
            }

            .relatorio-documento-boletim th:nth-child(2),
            .relatorio-documento-boletim td:nth-child(2),
            .relatorio-documento-boletim th:nth-child(3),
            .relatorio-documento-boletim td:nth-child(3),
            .relatorio-documento-boletim th:nth-child(4),
            .relatorio-documento-boletim td:nth-child(4),
            .relatorio-documento-boletim th:nth-child(5),
            .relatorio-documento-boletim td:nth-child(5) {
              width: 14mm !important;
              text-align: center !important;
            }

            .relatorio-documento-boletim th:nth-child(6),
            .relatorio-documento-boletim td:nth-child(6) {
              width: 20mm !important;
              text-align: center !important;
            }

            .relatorio-documento-boletim th:nth-child(7),
            .relatorio-documento-boletim td:nth-child(7) {
              width: 30mm !important;
              text-align: right !important;
            }

            .relatorio-documento-turma th:nth-child(1),
            .relatorio-documento-turma td:nth-child(1) {
              width: 24mm !important;
            }

            .relatorio-documento-turma th:nth-child(2),
            .relatorio-documento-turma td:nth-child(2) {
              width: 50mm !important;
            }

            .relatorio-documento-turma th:nth-child(3),
            .relatorio-documento-turma td:nth-child(3),
            .relatorio-documento-turma th:nth-child(4),
            .relatorio-documento-turma td:nth-child(4),
            .relatorio-documento-turma th:nth-child(5),
            .relatorio-documento-turma td:nth-child(5) {
              width: 20mm !important;
              text-align: center !important;
            }

            .relatorio-documento-turma th:nth-child(6),
            .relatorio-documento-turma td:nth-child(6) {
              width: 30mm !important;
              text-align: right !important;
            }

            @media print {
              html,
              body {
                width: 190mm;
              }
            }
          </style>
        </head>

        <body>
          ${areaRelatorio.outerHTML}
        </body>
      </html>
    `)

    janelaImpressao.document.close()

    janelaImpressao.onafterprint = () => {
      janelaImpressao.close()
    }

    setTimeout(() => {
      janelaImpressao.focus()
      janelaImpressao.print()
    }, 300)
  }

  const alunoSelecionado = discentes.find(
    (d) => String(d.id) === String(discenteId)
  )

  const turmaSelecionada = turmas.find(
    (t) => String(t.id) === String(turmaId)
  )

  const matriculasDoAluno = matriculas.filter(
    (m) => String(m.discenteId) === String(discenteId) && m.status === 'ATIVA'
  )

  const matriculasDaTurma = matriculas.filter(
    (m) => String(m.turmaId) === String(turmaId) && m.status === 'ATIVA'
  )

  const calcularFrequencia = (faltas?: number) => {
    const faltasNum = faltas ?? 0
    return Math.max(0, 100 - (faltasNum * (100 / TOTAL_AULAS)))
  }

  const calcularMedia = (notaP1?: number, notaP2?: number) => {
    if (notaP1 === undefined || notaP2 === undefined) return undefined
    return (notaP1 + notaP2) / 2
  }

  const calcularSituacao = (matricula: Matricula) => {
    const frequencia = calcularFrequencia(matricula.faltas)
    const media = calcularMedia(matricula.notaP1, matricula.notaP2)

    if (frequencia < 75) return 'REPROVADO_FREQUENCIA'
    if (media === undefined) return 'SEM_NOTAS'
    if (media >= 6) return 'APROVADO'
    return 'EM_RECUPERACAO'
  }

  const formatarNota = (nota?: number) => {
    if (nota === undefined || Number.isNaN(nota)) return '--'
    return nota.toFixed(1)
  }

  const formatarMedia = (media?: number) => {
    if (media === undefined || Number.isNaN(media)) return '--'
    return media.toFixed(1)
  }

  const formatarSituacao = (situacao: string) => {
    switch (situacao) {
      case 'APROVADO':
        return 'APROVADO'
      case 'EM_RECUPERACAO':
        return 'RECUPERAÇÃO'
      case 'REPROVADO_FREQUENCIA':
        return 'REP. POR FALTA'
      default:
        return 'SEM NOTAS'
    }
  }

  const corSituacao = (situacao: string) => {
    switch (situacao) {
      case 'APROVADO':
        return 'green'
      case 'EM_RECUPERACAO':
        return '#d97706'
      case 'REPROVADO_FREQUENCIA':
        return '#dc2626'
      default:
        return '#4b5563'
    }
  }

  const matriculasDaTurmaComNota = matriculasDaTurma.filter(
    (m) => calcularMedia(m.notaP1, m.notaP2) !== undefined
  )

  const mediaGeralTurma =
    matriculasDaTurmaComNota.length > 0
      ? matriculasDaTurmaComNota.reduce((acc, m) => {
          const media = calcularMedia(m.notaP1, m.notaP2) ?? 0
          return acc + media
        }, 0) / matriculasDaTurmaComNota.length
      : undefined

  const frequenciaMediaTurma =
    matriculasDaTurma.length > 0
      ? matriculasDaTurma.reduce((acc, m) => acc + calcularFrequencia(m.faltas), 0) /
        matriculasDaTurma.length
      : undefined

  const totalAprovados = matriculasDaTurma.filter(
    (m) => calcularSituacao(m) === 'APROVADO'
  ).length

  const percentualAprovados =
    matriculasDaTurma.length > 0
      ? (totalAprovados / matriculasDaTurma.length) * 100
      : undefined

  if (carregandoDados) {
    return (
      <ContainerPagina>
        <CabecalhoPagina title="Relatórios Acadêmicos" description="Gere documentos escolares." />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 0',
            gap: '16px'
          }}
        >
          <span
            className="spinner"
            style={{
              borderColor: 'var(--cor-borda)',
              borderTopColor: 'var(--cor-primaria)',
              width: '36px',
              height: '36px',
              borderWidth: '4px'
            }}
          ></span>

          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>
            Carregando dados...
          </p>
        </div>
      </ContainerPagina>
    )
  }

  if (erro) {
    return (
      <ContainerPagina>
        <CabecalhoPagina title="Relatórios Acadêmicos" description="Gere documentos escolares." />

        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--cor-fundo)',
            borderRadius: '12px',
            border: '1px solid var(--cor-erro)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />

          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>
            Erro ao Carregar
          </h3>

          <p>{erro}</p>
        </div>
      </ContainerPagina>
    )
  }

  return (
    <ContainerPagina>
      <CabecalhoPagina
        title="Relatórios Acadêmicos"
        description="Emita boletins de rendimento individual, diários de classe ou relatórios de turmas."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        <div
          style={{
            background: 'var(--cor-fundo)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--cor-borda)',
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
            <IconReport size={18} style={{ color: 'var(--cor-primaria)' }} />
            Parâmetros do Relatório
          </h3>

          <form onSubmit={handleGerarRelatorio}>
            <div className="input-group">
              <label htmlFor="selectTipoRel">Selecione o Tipo de Documento</label>

              <select
                id="selectTipoRel"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as TipoRelatorio)
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
                <option value="BOLETIM">Boletim Individual do Aluno</option>
                <option value="DIARIO">Diário de Classe (Frequência)</option>
                <option value="TURMA">Relatório de Desempenho da Turma</option>
              </select>
            </div>

            {tipo === 'BOLETIM' && (
              <div className="input-group">
                <label htmlFor="selectAlunRel">Selecione o Aluno</label>

                <select
                  id="selectAlunRel"
                  value={discenteId}
                  onChange={(e) => {
                    setDiscenteId(e.target.value)
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
                  {discentes.map((d) => (
                    <option key={String(d.id)} value={String(d.id)}>
                      {d.nome} (Matrícula: {d.matricula || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(tipo === 'DIARIO' || tipo === 'TURMA') && (
              <div className="input-group">
                <label htmlFor="selectTurmRel">Selecione a Turma</label>

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
                    <option key={String(t.id)} value={String(t.id)}>
                      {t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="login-botao"
              style={{ width: '100%', gap: '8px', marginTop: '8px' }}
              disabled={gerandoRelatorio}
            >
              {gerandoRelatorio ? (
                <>
                  <span className="spinner"></span>
                  <span>Gerando Documento...</span>
                </>
              ) : (
                <>
                  <IconFileText size={18} />
                  Visualizar Relatório
                </>
              )}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!relatorioGerado ? (
            <div
              style={{
                textAlign: 'center',
                padding: '100px 20px',
                backgroundColor: 'var(--cor-fundo)',
                borderRadius: '12px',
                border: '1px solid var(--cor-borda)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <IconFileText size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />

              <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>
                Nenhum relatório emitido
              </h3>

              <p style={{ maxWidth: '380px' }}>
                Selecione os parâmetros ao lado e clique em "Visualizar Relatório" para ver o demonstrativo escolar na tela.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid var(--cor-borda)',
                boxShadow: 'var(--sombra-card)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  backgroundColor: 'var(--cor-fundo-alternativo)',
                  borderBottom: '1px solid var(--cor-borda)'
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--cor-sucesso)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <IconCheck size={16} /> Documento Gerado com Sucesso
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secundario"
                    style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }}
                    onClick={handleImprimirRelatorio}
                  >
                    <IconDownload size={14} />
                    Baixar PDF
                  </button>

                  <button
                    className="btn-secundario"
                    style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }}
                    onClick={handleImprimirRelatorio}
                  >
                    <IconPrinter size={14} />
                    Imprimir
                  </button>
                </div>
              </div>

              <div
                id="relatorio-area-impressao-admin"
                className={`relatorio-documento-print relatorio-documento-${tipo.toLowerCase()}`}
                style={{
                  padding: '40px',
                  color: 'black',
                  fontFamily: 'serif',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    borderBottom: '2px solid black',
                    paddingBottom: '20px',
                    marginBottom: '24px'
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--fonte-sans)',
                      fontSize: '20px',
                      fontWeight: 800,
                      margin: 0,
                      textTransform: 'uppercase'
                    }}
                  >
                    Colégio Estadual de Sergipe
                  </h2>

                  <p
                    style={{
                      fontFamily: 'var(--fonte-sans)',
                      fontSize: '13px',
                      margin: '4px 0 0 0',
                      color: '#4b5563'
                    }}
                  >
                    Portal do Aluno SGE — Sistema de Gerenciamento Escolar
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--fonte-sans)',
                      fontSize: '12px',
                      margin: '2px 0 0 0',
                      color: '#6b7280'
                    }}
                  >
                    Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                  </p>
                </div>

                {tipo === 'BOLETIM' && alunoSelecionado && (
                  <div>
                    <h3
                      style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        fontFamily: 'var(--fonte-sans)',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        fontWeight: 700
                      }}
                    >
                      Boletim de Rendimento Escolar
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '32px',
                        fontFamily: 'var(--fonte-sans)',
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div>
                        <strong>Aluno:</strong> {alunoSelecionado.nome}<br />
                        <strong>Matrícula:</strong> {alunoSelecionado.matricula || 'N/A'}
                      </div>

                      <div>
                        <strong>Série/Ano:</strong> {alunoSelecionado.curso || 'N/A'}<br />
                        <strong>Ano Letivo:</strong> 2026
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--fonte-sans)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Disciplina</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>P1</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>P2</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Média</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Faltas</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Frequência</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Situação</th>
                        </tr>
                      </thead>

                      <tbody>
                        {matriculasDoAluno.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ padding: '12px', textAlign: 'center' }}>
                              Nenhuma matrícula ativa encontrada para este aluno.
                            </td>
                          </tr>
                        ) : (
                          matriculasDoAluno.map((m) => {
                            const media = calcularMedia(m.notaP1, m.notaP2)
                            const faltas = m.faltas ?? 0
                            const frequencia = calcularFrequencia(faltas)
                            const situacao = calcularSituacao(m)

                            return (
                              <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px 8px' }}>
                                  {m.disciplinaNome}
                                  <br />
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {m.disciplinaCodigo} — Turma {m.turmaCodigo}
                                  </span>
                                </td>

                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {formatarNota(m.notaP1)}
                                </td>

                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {formatarNota(m.notaP2)}
                                </td>

                                <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                                  {formatarMedia(media)}
                                </td>

                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {faltas}
                                </td>

                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {frequencia.toFixed(1)}%
                                </td>

                                <td
                                  style={{
                                    padding: '10px 8px',
                                    color: corSituacao(situacao),
                                    fontWeight: 'bold',
                                    textAlign: 'right'
                                  }}
                                >
                                  {formatarSituacao(situacao)}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {tipo === 'DIARIO' && turmaSelecionada && (
                  <div>
                    <h3
                      style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        fontFamily: 'var(--fonte-sans)',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        fontWeight: 700
                      }}
                    >
                      Diário de Classe — Frequência Consolidada
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '32px',
                        fontFamily: 'var(--fonte-sans)',
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div>
                        <strong>Disciplina:</strong> {turmaSelecionada.disciplinaNome} ({turmaSelecionada.disciplinaCodigo})<br />
                        <strong>Professor Responsável:</strong> {turmaSelecionada.docenteNome}
                      </div>

                      <div>
                        <strong>Turma/Ano Letivo:</strong> {turmaSelecionada.codigo} / {turmaSelecionada.periodoLetivo}<br />
                        <strong>Capacidade:</strong> {turmaSelecionada.capacidade} alunos
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--fonte-sans)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Matrícula</th>
                          <th style={{ padding: '8px' }}>Aluno</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Aulas Dadas</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Presenças</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Faltas</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Frequência</th>
                        </tr>
                      </thead>

                      <tbody>
                        {matriculasDaTurma.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '12px', textAlign: 'center' }}>
                              Nenhum aluno matriculado nesta turma.
                            </td>
                          </tr>
                        ) : (
                          matriculasDaTurma.map((m) => {
                            const faltas = m.faltas ?? 0
                            const presencas = Math.max(0, TOTAL_AULAS - faltas)
                            const frequencia = calcularFrequencia(faltas)

                            return (
                              <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px 8px' }}>{m.discenteMatricula}</td>
                                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{m.discenteNome}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>{TOTAL_AULAS}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>{presencas}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>{faltas}</td>
                                <td style={{ padding: '10px 8px', fontWeight: 'bold', textAlign: 'right' }}>
                                  {frequencia.toFixed(1)}%
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {tipo === 'TURMA' && turmaSelecionada && (
                  <div>
                    <h3
                      style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        fontFamily: 'var(--fonte-sans)',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        fontWeight: 700
                      }}
                    >
                      Relatório de Desempenho Escolar de Turma
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '32px',
                        fontFamily: 'var(--fonte-sans)',
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div>
                        <strong>Disciplina:</strong> {turmaSelecionada.disciplinaNome} ({turmaSelecionada.disciplinaCodigo})<br />
                        <strong>Professor Responsável:</strong> {turmaSelecionada.docenteNome}
                      </div>

                      <div>
                        <strong>Turma/Ano Letivo:</strong> {turmaSelecionada.codigo} / {turmaSelecionada.periodoLetivo}<br />
                        <strong>Status do Ciclo:</strong> {turmaSelecionada.status}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        marginBottom: '32px',
                        fontFamily: 'var(--fonte-sans)',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Média Geral da Turma</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-primaria)' }}>
                          {mediaGeralTurma !== undefined ? `${mediaGeralTurma.toFixed(2)} / 10` : '--'}
                        </div>
                      </div>

                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Aprovados</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-sucesso)' }}>
                          {percentualAprovados !== undefined ? `${percentualAprovados.toFixed(1)}%` : '--'}
                        </div>
                      </div>

                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Frequência Média</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-azul-escuro)' }}>
                          {frequenciaMediaTurma !== undefined ? `${frequenciaMediaTurma.toFixed(1)}%` : '--'}
                        </div>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--fonte-sans)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Matrícula</th>
                          <th style={{ padding: '8px' }}>Aluno</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Média</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Faltas</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>Frequência</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Situação</th>
                        </tr>
                      </thead>

                      <tbody>
                        {matriculasDaTurma.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '12px', textAlign: 'center' }}>
                              Nenhum aluno matriculado nesta turma.
                            </td>
                          </tr>
                        ) : (
                          matriculasDaTurma.map((m) => {
                            const media = calcularMedia(m.notaP1, m.notaP2)
                            const faltas = m.faltas ?? 0
                            const frequencia = calcularFrequencia(faltas)
                            const situacao = calcularSituacao(m)

                            return (
                              <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px 8px' }}>{m.discenteMatricula}</td>
                                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{m.discenteNome}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                                  {formatarMedia(media)}
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>{faltas}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  {frequencia.toFixed(1)}%
                                </td>
                                <td
                                  style={{
                                    padding: '10px 8px',
                                    textAlign: 'right',
                                    color: corSituacao(situacao),
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {formatarSituacao(situacao)}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContainerPagina>
  )
}