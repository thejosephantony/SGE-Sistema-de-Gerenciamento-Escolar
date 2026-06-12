import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  action?: ReactNode
}

/**
 * Componente de cabeçalho padronizado para as telas do SGE.
 * Deixa claro onde o usuário está e qual a ação principal da tela (ex: Botão "Cadastrar").
 */
export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--cor-borda)',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--cor-azul-escuro)', marginBottom: '4px' }}>
          {title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--cor-texto-secundario)' }}>
          {description}
        </p>
      </div>

      {action && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {action}
        </div>
      )}
    </div>
  )
}
