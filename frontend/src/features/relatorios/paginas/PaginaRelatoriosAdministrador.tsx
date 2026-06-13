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
import type { Usuario } from '../../usuarios/tipos'
import type { Turma } from '../../turmas/tipos'

type TipoRelatorio = 'BOLETIM' | 'DIARIO' | 'TURMA'

/**
 * Tela de visualização e geração de relatórios acadêmicos do SGE.
 * Permite simular a emissão de boletins de alunos ou diários de frequência e rendimento de turmas.
 */
export default function PaginaRelatoriosAdministrador() {
  const [tipo, setTipo] = useState<TipoRelatorio>('BOLETIM')
  const [discenteId, setDiscenteId] = useState('')
  const [turmaId, setTurmaId] = useState('')

  // Listas auxiliares para os filtros
  const [discentes, setDiscentes] = useState<Usuario[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])

  // UI States
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  
  // Resultado do relatório simulado
  const [relatorioGerado, setRelatorioGerado] = useState<boolean>(false)

  // Carrega dependências
  useEffect(() => {
    async function carregarDependencias() {
      try {
        const [listaUsuarios, listaTurmas] = await Promise.all([
          obterUsuarios(),
          obterTurmas()
        ])

        const alunos = listaUsuarios.filter((u: Usuario) => u.perfil === 'DISCENTE')
        setDiscentes(alunos)
        if (alunos.length > 0) setDiscenteId(alunos[0].id)

        setTurmas(listaTurmas)
        if (listaTurmas.length > 0) setTurmaId(listaTurmas[0].id)
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar dependências dos relatórios.')
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarDependencias()
  }, [])

  // Handler de envio
  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault()
    setGerandoRelatorio(true)
    setRelatorioGerado(false)

    // Simula a geração do PDF/Relatório de dados
    setTimeout(() => {
      setGerandoRelatorio(false)
      setRelatorioGerado(true)
    }, 1000)
  }

  // Nome do discente selecionado
  const alunoSelecionado = discentes.find((d) => d.id === discenteId)
  // Dados da turma selecionada
  const turmaSelecionada = turmas.find((t) => t.id === turmaId)

  // 1. Estado de Carregamento
  if (carregandoDados) {
    return (
      <ContainerPagina>
        <CabecalhoPagina title="Relatórios Acadêmicos" description="Gere documentos escolares." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando dados...</p>
        </div>
      </ContainerPagina>
    )
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <ContainerPagina>
        <CabecalhoPagina title="Relatórios Acadêmicos" description="Gere documentos escolares." />
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-erro)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <IconAlertTriangle size={48} style={{ color: 'var(--cor-erro)' }} />
          <h3 style={{ color: 'var(--cor-erro)', fontSize: '18px' }}>Erro ao Carregar</h3>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Painel de Filtros e Seleção */}
        <div style={{ background: 'var(--cor-fundo)', padding: '24px', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-suave)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconReport size={18} style={{ color: 'var(--cor-primaria)' }} />
            Parâmetros do Relatório
          </h3>

          <form onSubmit={handleGerarRelatorio}>
            {/* Tipo de Relatório */}
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

            {/* Condicional 1: Selecionar Aluno se for Boletim */}
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
                    <option key={d.id} value={d.id}>{d.nome} (Matrícula: {d.matricula})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Condicional 2: Selecionar Turma se for Diário ou Relatório de Turma */}
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
                    <option key={t.id} value={t.id}>{t.disciplinaCodigo} — {t.disciplinaNome} ({t.codigo})</option>
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

        {/* Visualização de Relatório Gerado (Simulado em CSS Premium) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!relatorioGerado ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--cor-fundo)', borderRadius: '12px', border: '1px solid var(--cor-borda)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <IconFileText size={48} style={{ color: 'var(--cor-texto-secundario)', opacity: 0.4 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--cor-azul-escuro)' }}>Nenhum relatório emitido</h3>
              <p style={{ maxWidth: '380px' }}>Selecione os parâmetros ao lado e clique em "Visualizar Relatório" para ver o demonstrativo escolar na tela.</p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-card)', overflow: 'hidden' }}>
              {/* Barra de Ações do Relatório */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--cor-fundo-alternativo)', borderBottom: '1px solid var(--cor-borda)' }}>
                <span style={{ fontSize: '12px', color: 'var(--cor-sucesso)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconCheck size={16} /> Documento Gerado com Sucesso
                </span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={() => alert("Simulando download do arquivo PDF do relatório...")}>
                    <IconDownload size={14} />
                    Baixar PDF
                  </button>
                  <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={() => window.print()}>
                    <IconPrinter size={14} />
                    Imprimir
                  </button>
                </div>
              </div>

              {/* Corpo do Documento (Simulado visualmente) */}
              <div style={{ padding: '40px', color: 'black', fontFamily: 'serif', fontSize: '14px', lineHeight: '1.6' }}>
                {/* Cabeçalho do Boletim da Instituição */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'var(--fonte-sans)', fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Colégio Estadual de Sergipe</h2>
                  <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '13px', margin: '4px 0 0 0', color: '#4b5563' }}>Portal do Aluno SGE — Sistema de Gerenciamento Escolar</p>
                  <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '12px', margin: '2px 0 0 0', color: '#6b7280' }}>Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                </div>

                {/* Exibição Condicional de Conteúdo do Boletim */}
                {tipo === 'BOLETIM' && alunoSelecionado && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--fonte-sans)', fontSize: '16px', textTransform: 'uppercase', fontWeight: 700 }}>Boletim de Rendimento Escolar</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', fontFamily: 'var(--fonte-sans)', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div>
                        <strong>Aluno:</strong> {alunoSelecionado.nome}<br />
                        <strong>Matrícula:</strong> {alunoSelecionado.matricula}
                      </div>
                      <div>
                        <strong>Série/Ano:</strong> {alunoSelecionado.curso}<br />
                        <strong>Ano Letivo:</strong> 2026
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--fonte-sans)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Disciplina</th>
                          <th style={{ padding: '8px' }}>P1</th>
                          <th style={{ padding: '8px' }}>P2</th>
                          <th style={{ padding: '8px' }}>Média</th>
                          <th style={{ padding: '8px' }}>Frequência</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Situação</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>Língua Portuguesa</td>
                          <td style={{ padding: '10px 8px' }}>8.5</td>
                          <td style={{ padding: '10px 8px' }}>9.0</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>8.8</td>
                          <td style={{ padding: '10px 8px' }}>95%</td>
                          <td style={{ padding: '10px 8px', color: 'green', fontWeight: 'bold', textAlign: 'right' }}>APROVADO</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>Matemática</td>
                          <td style={{ padding: '10px 8px' }}>7.0</td>
                          <td style={{ padding: '10px 8px' }}>8.0</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>7.5</td>
                          <td style={{ padding: '10px 8px' }}>92%</td>
                          <td style={{ padding: '10px 8px', color: 'green', fontWeight: 'bold', textAlign: 'right' }}>APROVADO</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>História</td>
                          <td style={{ padding: '10px 8px' }}>9.5</td>
                          <td style={{ padding: '10px 8px' }}>8.5</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>9.0</td>
                          <td style={{ padding: '10px 8px' }}>100%</td>
                          <td style={{ padding: '10px 8px', color: 'green', fontWeight: 'bold', textAlign: 'right' }}>APROVADO</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>Geografia</td>
                          <td style={{ padding: '10px 8px' }}>8.0</td>
                          <td style={{ padding: '10px 8px' }}>8.0</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>8.0</td>
                          <td style={{ padding: '10px 8px' }}>96%</td>
                          <td style={{ padding: '10px 8px', color: 'green', fontWeight: 'bold', textAlign: 'right' }}>APROVADO</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Exibição Condicional de Diário de Classe */}
                {tipo === 'DIARIO' && turmaSelecionada && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--fonte-sans)', fontSize: '16px', textTransform: 'uppercase', fontWeight: 700 }}>Diário de Classe — Frequência Consolidada</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', fontFamily: 'var(--fonte-sans)', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
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
                          <th style={{ padding: '8px' }}>Aulas Dadas</th>
                          <th style={{ padding: '8px' }}>Presenças</th>
                          <th style={{ padding: '8px' }}>Faltas</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Frequência</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>2026000109</td>
                          <td style={{ padding: '10px 8px', fontWeight: 600 }}>Lucas Gonzaga Santos</td>
                          <td style={{ padding: '10px 8px' }}>24</td>
                          <td style={{ padding: '10px 8px' }}>22</td>
                          <td style={{ padding: '10px 8px' }}>2</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold', textAlign: 'right' }}>91.6%</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '10px 8px' }}>2026000212</td>
                          <td style={{ padding: '10px 8px', fontWeight: 600 }}>Ellen Vitória Santos</td>
                          <td style={{ padding: '10px 8px' }}>24</td>
                          <td style={{ padding: '10px 8px' }}>24</td>
                          <td style={{ padding: '10px 8px' }}>0</td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold', textAlign: 'right' }}>100.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Exibição Condicional de Relatório de Turma */}
                {tipo === 'TURMA' && turmaSelecionada && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--fonte-sans)', fontSize: '16px', textTransform: 'uppercase', fontWeight: 700 }}>Relatório de Desempenho Escolar de Turma</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', fontFamily: 'var(--fonte-sans)', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div>
                        <strong>Disciplina:</strong> {turmaSelecionada.disciplinaNome} ({turmaSelecionada.disciplinaCodigo})<br />
                        <strong>Professor Responsável:</strong> {turmaSelecionada.docenteNome}
                      </div>
                      <div>
                        <strong>Turma/Ano Letivo:</strong> {turmaSelecionada.codigo} / {turmaSelecionada.periodoLetivo}<br />
                        <strong>Status do Ciclo:</strong> {turmaSelecionada.status}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px', fontFamily: 'var(--fonte-sans)', textAlign: 'center' }}>
                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Média Geral da Turma</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-primaria)' }}>8.15 / 10</div>
                      </div>
                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Aprovados</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-sucesso)' }}>100.0%</div>
                      </div>
                      <div style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Frequência Média</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cor-azul-escuro)' }}>95.8%</div>
                      </div>
                    </div>
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
