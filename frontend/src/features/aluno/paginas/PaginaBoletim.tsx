import { useState, useEffect } from 'react'
import { 
  IconDownload, 
  IconPrinter, 
  IconAlertTriangle,
  IconAward
} from '@tabler/icons-react'
import { useAuth } from '../../../contexts/ContextoAutenticacao'
import PageContainer from '../../../components/ui/ContainerPagina'
import PageHeader from '../../../components/ui/CabecalhoPagina'
import { buscarMatriculasPorDiscente } from '../../matriculas/servicos/servicoMatricula'
import type { Matricula } from '../../matriculas/tipos'

export default function PaginaBoletim() {
  const { usuario } = useAuth()
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarBoletim() {
      if (!usuario) return
      try {
        // Busca apenas as matrículas do aluno logado via endpoint otimizado
        const minhasMatriculas = await buscarMatriculasPorDiscente(String(usuario.id))
        const ativas = minhasMatriculas.filter((m) => m.status === 'ATIVA')
        setMatriculas(ativas)
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar o seu boletim escolar.')
      } finally {
        setCarregando(false)
      }
    }

    carregarBoletim()
  }, [usuario])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Simulando exportação do boletim escolar oficial em formato PDF...')
  }

  if (carregando) {
    return (
      <PageContainer>
        <PageHeader title="Boletim Escolar" description="Carregando informações acadêmicas..." />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <span className="spinner" style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--cor-primaria)', width: '36px', height: '36px', borderWidth: '4px' }}></span>
          <p style={{ color: 'var(--cor-texto-secundario)', fontWeight: 600 }}>Carregando notas...</p>
        </div>
      </PageContainer>
    )
  }

  if (erro) {
    return (
      <PageContainer>
        <PageHeader title="Boletim Escolar" description="Consulte suas notas e faltas." />
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
      {/* Cabeçalho da página */}
      <PageHeader 
        title="Boletim Escolar" 
        description="Visualize e imprima suas notas oficiais e dados de frequência escolar do ano letivo 2026." 
      />

      {/* Caixa do Boletim Timbrado */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--cor-borda)', boxShadow: 'var(--sombra-card)', overflow: 'hidden' }}>
        
        {/* Barra superior de ações */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--cor-fundo-alternativo)', borderBottom: '1px solid var(--cor-borda)' }}>
          <span style={{ fontSize: '13px', color: 'var(--cor-texto-secundario)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconAward size={18} style={{ color: 'var(--cor-sucesso)' }} />
            Boletim Individual Homologado
          </span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={handleExport}>
              <IconDownload size={14} />
              Exportar PDF
            </button>
            <button className="btn-secundario" style={{ padding: '8px 12px', gap: '6px', fontSize: '13px' }} onClick={handlePrint}>
              <IconPrinter size={14} />
              Imprimir
            </button>
          </div>
        </div>

        {/* Boletim Escolar Físico Simulador */}
        <div style={{ padding: '40px', color: 'black', lineHeight: '1.6' }} className="print-area">
          {/* Topo do documento */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: 'black' }}>Colégio Estadual de Sergipe</h2>
            <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: '#4b5563', fontWeight: 600 }}>Secretaria Geral Escolar — Boletim de Notas do Estudante</p>
            <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#6b7280' }}>Emitido automaticamente pelo Portal SGE em: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          {/* Dados do Aluno */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '32px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#374151', fontSize: '13px' }}>
            <div>
              <strong>Estudante:</strong> {usuario?.nome}<br />
              <strong>Matrícula (RA):</strong> {matriculas[0]?.discenteMatricula || 'N/A'}<br />
              <strong>Série / Curso:</strong> Ensino Médio
            </div>
            <div>
              <strong>Ano Letivo:</strong> 2026<br />
              <strong>Escola:</strong> Unidade Estadual de Ensino Médio<br />
              <strong>Situação Geral:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>REGULAR</span>
            </div>
          </div>

          {/* Tabela de Notas */}
          {matriculas.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhuma matrícula ativa registrada.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px' }}>Matéria</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Nota P1</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Nota P2</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Média Final</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Faltas</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Frequência</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', width: '120px' }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {matriculas.map((m) => {
                  const p1 = m.notaP1 !== undefined ? m.notaP1 : NaN
                  const p2 = m.notaP2 !== undefined ? m.notaP2 : NaN
                  const faltasNum = m.faltas || 0
                  const frequenciaCalculada = Math.max(0, 100 - (faltasNum * 4))

                  // Usa campos calculados pelo backend quando disponíveis
                  const mediaFinal = m.media !== undefined ? m.media : (!isNaN(p1) && !isNaN(p2) ? (p1 + p2) / 2 : NaN)

                  let sitTxt = 'SEM NOTAS'
                  let sitCor = '#4b5563'

                  switch (m.situacao) {
                    case 'APROVADO':
                      sitTxt = 'APROVADO'; sitCor = '#16a34a'; break
                    case 'EM_RECUPERACAO':
                      sitTxt = 'RECUPERAÇÃO'; sitCor = '#d97706'; break
                    case 'REPROVADO_FREQUENCIA':
                      sitTxt = 'REP. POR FALTA'; sitCor = '#dc2626'; break
                    default:
                      sitTxt = 'SEM NOTAS'; sitCor = '#4b5563'
                  }

                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>{m.disciplinaNome}</span>
                          <span style={{ fontSize: '10px', color: '#6b7280', display: 'block' }}>Código: {m.disciplinaCodigo}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'monospace' }}>
                        {!isNaN(p1) ? p1.toFixed(1) : '--'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'monospace' }}>
                        {!isNaN(p2) ? p2.toFixed(1) : '--'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {!isNaN(mediaFinal) ? mediaFinal.toFixed(1) : '--'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'monospace' }}>
                        {faltasNum}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {frequenciaCalculada}%
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', color: sitCor }}>
                        {sitTxt}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* Rodapé de assinaturas */}
          <div style={{ marginTop: '64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', textAlign: 'center', fontSize: '12px' }}>
            <div>
              <div style={{ width: '200px', borderBottom: '1px solid black', margin: '0 auto 8px auto', height: '30px' }}></div>
              <span>Assinatura do Estudante</span>
            </div>
            <div>
              <div style={{ width: '200px', borderBottom: '1px solid black', margin: '0 auto 8px auto', height: '30px' }}></div>
              <span>Secretaria Geral CES</span>
            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  )
}
