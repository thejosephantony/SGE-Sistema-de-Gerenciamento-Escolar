import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageContainerProps {
  children: ReactNode
}

/**
 * Componente que serve como container principal para as páginas.
 * Centraliza e adiciona espaçamento padrão às telas administrativas com animação suave de fade-in.
 */
export default function PageContainer({ children }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        padding: '32px',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {children}
    </motion.main>
  )
}
