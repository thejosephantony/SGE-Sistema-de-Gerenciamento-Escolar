type TipoDocumento = 'boletim' | 'diario' | 'pauta' | 'turma'

interface OpcoesImpressao {
  elementId: string
  titulo: string
  tipo?: TipoDocumento
}

export function imprimirElemento({ elementId, titulo, tipo = 'boletim' }: OpcoesImpressao) {
  const area = document.getElementById(elementId)

  if (!area) {
    window.print()
    return
  }

  const janela = window.open('', '_blank', 'width=1000,height=800')

  if (!janela) {
    window.print()
    return
  }

  janela.document.open()

  janela.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>${titulo}</title>

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

          body {
            width: 190mm;
            margin: 0 auto;
          }

          #${elementId} {
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

          #${elementId} * {
            max-width: 100% !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          #${elementId} h2 {
            font-size: 15px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 0 !important;
            text-align: center !important;
          }

          #${elementId} h3 {
            font-size: 12px !important;
            line-height: 1.25 !important;
            margin: 0 0 6mm 0 !important;
            padding: 0 !important;
            text-align: center !important;
          }

          #${elementId} p {
            font-size: 9px !important;
            line-height: 1.25 !important;
            margin: 1mm 0 !important;
          }

          #${elementId} div {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          #${elementId} div[style*="grid-template-columns"] {
            gap: 5mm !important;
            margin-bottom: 6mm !important;
            padding: 4mm !important;
            border-radius: 0 !important;
            border: 1px solid #d1d5db !important;
          }

          #${elementId} table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            font-size: 8px !important;
            margin-top: 4mm !important;
          }

          #${elementId} thead {
            display: table-header-group;
          }

          #${elementId} tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          #${elementId} th,
          #${elementId} td {
            padding: 3px 4px !important;
            vertical-align: top !important;
            overflow-wrap: anywhere !important;
            word-break: break-word !important;
            border-bottom: 1px solid #e5e7eb !important;
          }

          #${elementId} th {
            font-weight: 700 !important;
            border-bottom: 2px solid #000000 !important;
          }

          .documento-boletim table {
            font-size: 7.8px !important;
          }

          .documento-boletim th:nth-child(1),
          .documento-boletim td:nth-child(1) {
            width: 42mm !important;
          }

          .documento-boletim th:nth-child(2),
          .documento-boletim td:nth-child(2),
          .documento-boletim th:nth-child(3),
          .documento-boletim td:nth-child(3),
          .documento-boletim th:nth-child(4),
          .documento-boletim td:nth-child(4),
          .documento-boletim th:nth-child(5),
          .documento-boletim td:nth-child(5) {
            width: 15mm !important;
            text-align: center !important;
          }

          .documento-boletim th:nth-child(6),
          .documento-boletim td:nth-child(6) {
            width: 22mm !important;
            text-align: center !important;
          }

          .documento-boletim th:nth-child(7),
          .documento-boletim td:nth-child(7) {
            width: 30mm !important;
            text-align: right !important;
          }

          .documento-diario th:nth-child(1),
          .documento-diario td:nth-child(1),
          .documento-pauta th:nth-child(1),
          .documento-pauta td:nth-child(1),
          .documento-turma th:nth-child(1),
          .documento-turma td:nth-child(1) {
            width: 24mm !important;
          }

          .documento-diario th:nth-child(2),
          .documento-diario td:nth-child(2),
          .documento-pauta th:nth-child(2),
          .documento-pauta td:nth-child(2),
          .documento-turma th:nth-child(2),
          .documento-turma td:nth-child(2) {
            width: 50mm !important;
          }

          .documento-diario th:nth-child(n+3),
          .documento-diario td:nth-child(n+3),
          .documento-pauta th:nth-child(n+3),
          .documento-pauta td:nth-child(n+3),
          .documento-turma th:nth-child(n+3),
          .documento-turma td:nth-child(n+3) {
            text-align: center !important;
          }
        </style>
      </head>

      <body>
        ${area.outerHTML}
      </body>
    </html>
  `)

  janela.document.close()

  janela.onafterprint = () => {
    janela.close()
  }

  setTimeout(() => {
    janela.focus()
    janela.print()
  }, 300)
}