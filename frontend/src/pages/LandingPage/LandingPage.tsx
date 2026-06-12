import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

interface Slide {
  badge: string
  title: string
  description: string
  imageUrl: string
}

const slidesData: Slide[] = [
  {
    badge: 'Inovação Pedagógica',
    title: 'SGE moderniza a rotina escolar com acompanhamento de notas em tempo real e diário digital',
    description: 'Nova plataforma facilita a comunicação entre pais, estudantes e a direção do Colégio Estadual de Sergipe.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&width=1920'
  },
  {
    badge: 'Conquistas',
    title: 'Estudantes da Unidade de Robótica conquistam primeiro lugar na Olimpíada de Tecnologia',
    description: 'Protótipo inovador desenvolvido pelos alunos do CES representará Sergipe na etapa nacional no próximo semestre.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&width=1920'
  },
  {
    badge: 'Ensino Integral',
    title: 'CES amplia oferta de turmas de ensino em tempo integral para o ano letivo de 2026',
    description: 'Novas disciplinas eletivas de empreendedorismo e sustentabilidade integram o projeto pedagógico.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&width=1920'
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  
  // Estados da UI
  const [activeSlide, setActiveSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  
  // Estados de Acessibilidade
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    const saved = localStorage.getItem('sge-zoom-level')
    return saved ? parseFloat(saved) : 1.0
  })
  
  const [contrastActive, setContrastActive] = useState<boolean>(() => {
    return localStorage.getItem('sge-contrast-active') === 'true'
  })

  // Efeito para aplicar e sincronizar o zoom
  useEffect(() => {
    const sizeInPx = zoomLevel * 16
    document.documentElement.style.fontSize = `${sizeInPx}px`
    localStorage.setItem('sge-zoom-level', zoomLevel.toString())
  }, [zoomLevel])

  // Efeito para aplicar e sincronizar o alto contraste no body
  useEffect(() => {
    if (contrastActive) {
      document.body.classList.add('contrast-active')
    } else {
      document.body.classList.remove('contrast-active')
    }
    localStorage.setItem('sge-contrast-active', contrastActive.toString())
    
    // Cleanup ao desmontar a página
    return () => {
      document.body.classList.remove('contrast-active')
    }
  }, [contrastActive])

  // Efeito do Autoplay do Carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesData.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [activeSlide])

  // Handlers de Acessibilidade
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.3, prev + 0.1))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.7, prev - 0.1))
  }

  const handleZoomReset = () => {
    setZoomLevel(1.0)
  }

  const handleToggleContrast = () => {
    setContrastActive((prev) => !prev)
  }

  // Busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      showToast(`Pesquisando por: "${searchQuery}" (Funcionalidade simulada nesta Landing Page)`)
      setSearchQuery('')
    }
  }

  // Toast e links demonstrativos
  const showToast = (message: string) => {
    setToast(message)
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleDemoLink = (e: React.MouseEvent, label: string) => {
    e.preventDefault()
    showToast(`Você clicou em: "${label}". Este link é demonstrativo nesta Landing Page.`)
  }

  return (
    <div className={styles.landingPageContainer}>
      
      {/* Barra Superior de Acessibilidade (UFS Style) */}
      <div className={styles.topAccessibilityBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.accessibilityControls}>
            <button onClick={handleZoomIn} title="Aumentar Fonte">A+</button>
            <button onClick={handleZoomReset} title="Tamanho Padrão">A</button>
            <button onClick={handleZoomOut} title="Diminuir Fonte">A-</button>
            <button onClick={handleToggleContrast} className={styles.contrastBtn} title="Alternar Contraste">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 18a6 6 0 0 0 0-12v12z" fill="currentColor"/>
              </svg>
              Contraste
            </button>
          </div>

          <div className={styles.topBarRight}>
            {/* Barra de Busca */}
            <form onSubmit={handleSearchSubmit} className={styles.searchBoxBar}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise aqui..."
              />
              <button type="submit" aria-label="Pesquisar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>
            
            {/* Seletor de Idiomas */}
            <div className={styles.languageSelector} onClick={(e) => handleDemoLink(e, 'Idioma: Português')}>
              <span>Português</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cabeçalho Principal (Logo e Branding) */}
      <header className={styles.mainHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLogoBrand}>
            <div className={styles.logoCircleContainer}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
            </div>
            <div className={styles.brandText}>
              <h1>SGE</h1>
              <h2>Colégio Estadual de Sergipe</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Menu de Navegação Horizontal com Mega Dropdowns */}
      <nav className={styles.navigationMenuBar}>
        <div className={styles.menuContainer}>
          <ul className={styles.navTabsList}>
            <li className={styles.navTabItem}>
              <a href="#" className={styles.tabLink} onClick={(e) => e.preventDefault()}>
                O Colégio
                <svg className={styles.chevronMenu} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
              {/* Dropdown */}
              <div className={styles.megaDropdownMenu}>
                <div className={styles.dropdownColumns}>
                  <div className={styles.dropdownCol}>
                    <h3>Institucional</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Quem Somos')}>Quem Somos</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Histórico da Escola')}>Histórico da Escola</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Corpo Diretivo')}>Corpo Diretivo</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Projeto Político Pedagógico')}>Projeto Político Pedagógico</a></li>
                    </ul>
                  </div>
                  <div className={styles.dropdownCol}>
                    <h3>Estrutura</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Salas de Recursos')}>Salas de Recursos</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Quadra Poliesportiva')}>Quadra Poliesportiva</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Laboratório de Ciências')}>Laboratório de Ciências</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Refeitório Escolar')}>Refeitório Escolar</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className={styles.navTabItem}>
              <a href="#" className={styles.tabLink} onClick={(e) => e.preventDefault()}>
                Ensino
                <svg className={styles.chevronMenu} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
              {/* Dropdown */}
              <div className={styles.megaDropdownMenu}>
                <div className={styles.dropdownColumns}>
                  <div className={styles.dropdownCol}>
                    <h3>Níveis de Ensino</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Ensino Fundamental II')}>Ensino Fundamental II</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Ensino Médio Regular')}>Ensino Médio Regular</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Educação de Jovens e Adultos (EJA)')}>Educação de Jovens e Adultos (EJA)</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Educação Especial')}>Educação Especial</a></li>
                    </ul>
                  </div>
                  <div className={styles.dropdownCol}>
                    <h3>Processos Seletivos</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Matrículas Novas 2026')}>Matrículas Novas 2026</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Transferências de Alunos')}>Transferências de Alunos</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Sorteio Público de Vagas')}>Sorteio Público de Vagas</a></li>
                    </ul>
                  </div>
                  <div className={styles.dropdownCol}>
                    <h3>Assistência ao Aluno</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Transporte Escolar')}>Transporte Escolar</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Alimentação Saudável')}>Alimentação Saudável</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Distribuição de Fardamento')}>Distribuição de Fardamento</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Material Didático')}>Material Didático</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className={styles.navTabItem}>
              <a href="#" className={styles.tabLink} onClick={(e) => e.preventDefault()}>
                Projetos
                <svg className={styles.chevronMenu} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
              <div className={styles.megaDropdownMenu}>
                <div className={styles.dropdownColumns}>
                  <div className={styles.dropdownCol}>
                    <h3>Cultura & Esporte</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Jogos da Primavera')}>Jogos da Primavera</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Clube de Leitura')}>Clube de Leitura</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Fanfarra CES')}>Fanfarra CES</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Mostra de Cinema Escolar')}>Mostra de Cinema Escolar</a></li>
                    </ul>
                  </div>
                  <div className={styles.dropdownCol}>
                    <h3>Tecnologia</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Clube de Robótica')}>Clube de Robótica</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Feira de Ciências')}>Feira de Ciências</a></li>
                      <li><a href="#" onClick={(e) => handleDemoLink(e, 'Olimpíadas de Matemática')}>Olimpíadas de Matemática</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className={styles.navTabItem}><a href="#" className={styles.tabLink} onClick={(e) => handleDemoLink(e, 'Comunicação')}>Comunicação</a></li>
            <li className={styles.navTabItem}><a href="#" className={styles.tabLink} onClick={(e) => handleDemoLink(e, 'Acesso à Informação')}>Acesso à Informação</a></li>
          </ul>

          {/* Botão Entrar / Login do Portal SGE */}
          <div className={styles.loginActionBtnContainer}>
            <button onClick={() => navigate('/login')} className={styles.navLoginBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Entrar no SGE
            </button>
          </div>
        </div>
      </nav>

      {/* Carrossel de Banners Principal */}
      <section className={styles.heroCarouselSection}>
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            {slidesData.map((slide, index) => (
              <div 
                key={index} 
                className={`${styles.carouselSlide} ${index === activeSlide ? styles.active : ''}`} 
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${slide.imageUrl}')` }}
              >
                <div className={styles.slideContentCard}>
                  <span className={styles.slideBadge}>{slide.badge}</span>
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação por pontos */}
          <div className={styles.carouselDots}>
            {slidesData.map((_, index) => (
              <span 
                key={index} 
                className={`${styles.dot} ${index === activeSlide ? styles.active : ''}`} 
                onClick={() => setActiveSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Bento Grid Acadêmico (Ensino, Pesquisa, Inovação, Extensão) */}
      <section className={styles.academicBentoSection}>
        <div className={styles.container}>
          <h2 className={styles.academicTitle}>Programas e Ensino</h2>
          
          {/* Ensino 4 Cards */}
          <div className={styles.academicGridEnsino}>
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Ensino Fundamental II')}
              className={styles.bentoCardBlue} 
              style={{ backgroundImage: `linear-gradient(rgba(11, 79, 159, 0.85), rgba(11, 79, 159, 0.95)), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&width=600')` }}
            >
              <h3>Ensino Fundamental II</h3>
              <p>Preparação sólida do 6º ao 9º ano com incentivo à leitura e artes.</p>
              <span>Conhecer Grade &gt;</span>
            </a>
            
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Ensino Médio Regular')}
              className={styles.bentoCardBlue} 
              style={{ backgroundImage: `linear-gradient(rgba(11, 79, 159, 0.85), rgba(11, 79, 159, 0.95)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&width=600')` }}
            >
              <h3>Ensino Médio Regular</h3>
              <p>Preparação focada no vestibular nacional e itinerários formativos.</p>
              <span>Conhecer Grade &gt;</span>
            </a>
            
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Ensino Profissional')}
              className={styles.bentoCardBlue} 
              style={{ backgroundImage: `linear-gradient(rgba(11, 79, 159, 0.85), rgba(11, 79, 159, 0.95)), url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&width=600')` }}
            >
              <h3>Ensino Profissional</h3>
              <p>Cursos integrados de informática, robótica e iniciação tecnológica.</p>
              <span>Conhecer Cursos &gt;</span>
            </a>

            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Projetos Complementares')}
              className={styles.bentoCardBlue} 
              style={{ backgroundImage: `linear-gradient(rgba(11, 79, 159, 0.85), rgba(11, 79, 159, 0.95)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&width=600')` }}
            >
              <h3>Projetos Complementares</h3>
              <p>Ensino complementar no contraturno e projetos extracurriculares.</p>
              <span>Conhecer Projetos &gt;</span>
            </a>
          </div>

          {/* Pesquisa, Inovação, Extensão Cards */}
          <div className={styles.academicTrioGrid}>
            {/* Pesquisa (Verde) */}
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Ciência e Pesquisa')}
              className={`${styles.trioCard} ${styles.cardGreen}`} 
              style={{ backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.88), rgba(22, 163, 74, 0.95)), url('https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&width=600')` }}
            >
              <h3>Ciência e Pesquisa</h3>
              <p>Feira Científica Anual incentiva estudantes a pesquisarem biologia e meio ambiente.</p>
              <span>Ver Trabalhos &gt;</span>
            </a>

            {/* Inovação (Roxo) */}
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Inovação Tecnológica')}
              className={`${styles.trioCard} ${styles.cardPurple}`} 
              style={{ backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.88), rgba(124, 58, 237, 0.95)), url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&width=600')` }}
            >
              <h3>Inovação Tecnológica</h3>
              <p>Desenvolvimento prático no laboratório com projetos de placas arduino e robótica.</p>
              <span>Ver Laboratório &gt;</span>
            </a>

            {/* Extensão (Laranja) */}
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Esporte e Cultura')}
              className={`${styles.trioCard} ${styles.cardOrange}`} 
              style={{ backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.88), rgba(249, 115, 22, 0.95)), url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&width=600')` }}
            >
              <h3>Esporte e Cultura</h3>
              <p>Clube de teatro, artes plásticas e participação em campeonatos estaduais.</p>
              <span>Ver Projetos &gt;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Seção de Notícias (UFS Style Layout) */}
      <section className={styles.newsListSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleHeader}>Últimas Notícias</h2>
          
          <div className={styles.newsLayoutGrid}>
            {/* Lado Esquerdo - Notícia em Destaque */}
            <a 
              href="#" 
              onClick={(e) => handleDemoLink(e, 'Notícia: Edital de Rematrículas')}
              className={styles.newsMainCard}
            >
              <div className={styles.newsMainImage} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&width=800')" }}></div>
              <div className={styles.newsMainContent}>
                <span className={styles.newsMetaTag}>EDITAL Nº 32/2026/SEC</span>
                <h3>CES divulga edital oficial de rematrículas escolares e vagas remanescentes para o 2º Bimestre</h3>
                <p>Os interessados em ingressar ou realizar a transferência interna nas turmas regulares do Ensino Médio devem efetivar a entrega de documentos físicos na secretaria escolar até a próxima quinta-feira.</p>
                <span className={styles.newsDate}>Publicado: Sexta-feira, 12 de Junho de 2026</span>
              </div>
            </a>

            {/* Lado Direito - Grade de Notícias Secundárias */}
            <div className={styles.newsSecondaryColumn}>
              {/* Card Gradiente Azul */}
              <a 
                href="#" 
                onClick={(e) => handleDemoLink(e, 'Notícia: Calendário de Conselho de Classe')}
                className={styles.newsBlueGradientCard}
              >
                <span className={styles.newsMetaTag}>CALENDÁRIO LETIVO</span>
                <h3>Cronograma do Conselho de Classe e entrega de boletins referentes ao 1º Bimestre letivo</h3>
                <p>Confira os dias em que as aulas serão suspensas para a reunião geral de professores do CES.</p>
                <span className={styles.newsDate}>Publicado: Sexta-feira, 12 de Junho de 2026</span>
              </a>

              {/* Duas Notícias Menores Lado a Lado */}
              <div className={styles.newsTrioRow}>
                <a 
                  href="#" 
                  onClick={(e) => handleDemoLink(e, 'Notícia: Campanha de Mantimentos')}
                  className={styles.newsRowCard}
                >
                  <div className={styles.newsCardThumb} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&width=400')" }}></div>
                  <h4>Campanha Escolar arrecada mais de meia tonelada de mantimentos para comunidades locais</h4>
                  <span className={styles.newsDate}>Publicado: Quinta-feira, 11 de Junho de 2026</span>
                </a>

                <a 
                  href="#" 
                  onClick={(e) => handleDemoLink(e, 'Notícia: Oficinas de Literatura')}
                  className={styles.newsRowCard}
                >
                  <div className={styles.newsCardThumb} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&width=400')" }}></div>
                  <h4>Oficinas de Literatura e Escrita Criativa na Biblioteca iniciam inscrições nesta segunda</h4>
                  <span className={styles.newsDate}>Publicado: Quinta-feira, 11 de Junho de 2026</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Serviços Online Escolares (UFS Style Container) */}
      <section className={styles.schoolServicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesContainerCard}>
            <h2>Serviços Online</h2>
            
            <div className={styles.servicesGridLayout}>
              {/* Bibliotecas */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Biblioteca Digital')}>
                <div className={styles.serviceText}>
                  <span>Biblioteca Digital</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
              </a>

              {/* Refeitório */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Cardápio da Merenda')}>
                <div className={styles.serviceText}>
                  <span>Cardápio da Merenda</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
              </a>

              {/* Concursos / Provões */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Provões & Avaliações')}>
                <div className={styles.serviceText}>
                  <span>Provões & Avaliações</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
              </a>

              {/* Secretaria Digital */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Secretaria Digital')}>
                <div className={styles.serviceText}>
                  <span>Secretaria Digital</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </a>

              {/* Calendário */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Calendário Escolar')}>
                <div className={styles.serviceText}>
                  <span>Calendário Escolar</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </a>

              {/* Indicadores */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Dados & Indicadores')}>
                <div className={styles.serviceText}>
                  <span>Dados & Indicadores</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
              </a>

              {/* Carta de Serviços */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Carta de Serviços')}>
                <div className={styles.serviceText}>
                  <span>Carta de Serviços</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
              </a>

              {/* Ouvidoria */}
              <a href="#" className={styles.serviceItemBtn} onClick={(e) => handleDemoLink(e, 'Ouvidoria CES')}>
                <div className={styles.serviceText}>
                  <span>Ouvidoria CES</span>
                </div>
                <div className={styles.serviceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19a7.5 7.5 0 0 0 6-12.49L12 2 6 6.51A7.5 7.5 0 0 0 12 19z"/>
                    <circle cx="12" cy="10" r="1"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé Institucional */}
      <footer className={styles.institutionalFooter}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrandInfo}>
            <div className={styles.footerLogo}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
              <h3>SGE — Colégio Estadual de Sergipe</h3>
            </div>
            <p>Desenvolvido para gerenciar a rotina pedagógica e acadêmica com inovação, qualidade e acessibilidade.</p>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} Colégio Estadual de Sergipe. Todos os direitos reservados.</p>
          </div>

          <div className={styles.footerLinksGrid}>
            <div className={styles.footerLinksCol}>
              <h4>Endereço</h4>
              <p>Centro de Aracaju, SE — Brasil<br/>Praça Olímpio Campos, S/N</p>
              <p>Telefone: +55 (79) 3211-1000</p>
            </div>
            
            <div className={styles.footerLinksCol}>
              <h4>Links Úteis</h4>
              <ul>
                <li><a href="#" onClick={(e) => handleDemoLink(e, 'Portal da SEED')}>Portal da SEED</a></li>
                <li><a href="#" onClick={(e) => handleDemoLink(e, 'Portal do Governo de Sergipe')}>Portal do Governo de Sergipe</a></li>
                <li><a href="#" onClick={(e) => handleDemoLink(e, 'Suporte ao Portal SGE')}>Suporte ao Portal SGE</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Flutuante */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: contrastActive ? '#000000' : 'rgba(11, 79, 159, 0.95)',
            color: contrastActive ? '#ffff00' : '#ffffff',
            border: contrastActive ? '2px solid #ffff00' : 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontSize: '0.875rem',
            fontWeight: '600',
            zIndex: 1000,
            pointerEvents: 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {toast}
        </div>
      )}

    </div>
  )
}
