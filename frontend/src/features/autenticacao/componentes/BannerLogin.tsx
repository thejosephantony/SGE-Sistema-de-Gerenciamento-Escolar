import { motion } from 'framer-motion'
import imagemTelaLogin from '../../../assets/imagem tela login sge2.webp'

/**
 * Componente apresentado no lado esquerdo do layout split screen.
 * Exibe o branding institucional (SGE), slogans e a ilustração 3D integrada em azul e branco.
 */
export default function LoginBanner() {
  return (
    <div className="login-left">
      {/* Elementos de Brilho de Fundo (Glow Effect) estilo UFS */}
      <div className="login-left-glow-1"></div>
      <div className="login-left-glow-2"></div>
      
      {/* Ondas/Curvas Geométricas de Fundo tipo UFS */}
      <div className="login-left-shapes">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="login-shape-svg" aria-hidden="true">
          <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="rgba(255, 255, 255, 0.02)"></path>
        </svg>
      </div>

      {/* Cabeçalho da Marca */}
      <div className="login-left-header">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="logo-sge-texto">SGE</span>
      </div>

      {/* Conteúdo Central */}
      <div className="login-left-body">
        <div className="login-left-text-group">
          {/* Título Acadêmico Animado */}
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="login-left-titulo"
          >
            Conectando você ao<br />futuro da educação.
          </motion.h2>

          {/* Descrição Animada */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="login-left-subtitulo"
          >
            Gerencie notas, turmas, atividades e o seu desempenho<br />acadêmico em um só lugar de forma simples, elegante e<br />integrada.
          </motion.p>
        </div>

        {/* Ilustração 3D Principal com Efeito Floating Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0], // Efeito de flutuação suave vertical
            scale: 1 
          }}
          transition={{ 
            opacity: { delay: 0.3, duration: 0.8 },
            scale: { delay: 0.3, duration: 0.8 },
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 5,
              ease: "easeInOut"
            }
          }}
          className="login-image-container"
        >
          <img 
            src={imagemTelaLogin} 
            alt="Dashboard SGE Ilustrativo" 
            className="login-illustration-img"
          />
          {/* Sombra realista sob o painel flutuante */}
          <div className="login-illustration-shadow"></div>
        </motion.div>
      </div>

      {/* Rodapé Institucional */}
      <div className="login-left-footer">
        <p>© {new Date().getFullYear()} SGE — Colégio Estadual de Sergipe.</p>
      </div>
    </div>
  )
}

