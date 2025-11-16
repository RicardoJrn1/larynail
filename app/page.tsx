"use client"

import type React from "react"
import Image from "next/image"
import {
  FaWhatsapp, FaTimes,
  FaInstagram, FaChevronLeft, FaChevronRight, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope,
  FaPaintBrush, FaHandSparkles, FaGem
} from "react-icons/fa"
import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"

interface SocialLink {
  href: string
  icon: typeof FaWhatsapp
  label: string
  hoverColor: string
}

interface FooterLink {
  href: string
  label: string
}

interface ContactInfo {
  address: string
  phone: string
  email: string
}

interface Service {
  icon: React.ElementType
  title: string
  description: string
}


// TODO: Substituir pelas imagens do seu portfólio de unhas
const PORTFOLIO_IMAGES = ["/trabalho_1.webp", "/trabalho_2.webp", "/trabalho_3.webp", "/trabalho_4.webp"]
const AUTO_PLAY_INTERVAL = 5000

// TODO: Atualizar com seus links de redes sociais
const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: `https://wa.me/5591985160395?text=${encodeURIComponent("Olá! Gostaria de agendar um horário.")}`,
    icon: FaWhatsapp, label: "Link para o WhatsApp", hoverColor: "hover:text-green-500",
  },
  {
    href: "https://www.instagram.com/bylaryssamarinho",
    icon: FaInstagram,
    label: "Link para o Instagram",
    hoverColor: "hover:text-rose-500",
  },
] as const

const FOOTER_LINKS: FooterLink[] = [
  { href: "#inicio", label: "Início" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#contato", label: "Contato" },
]

// TODO: Atualizar com suas informações de contato
const CONTACT_INFO: ContactInfo = {
  address: "Rua Boaventura da Silva, 42 - Vila dos Cabanos, Barcarena - PA",
  phone: "(91) 98516-0395",
  email: "seuemail@exemplo.com.br",
}

// TODO: Personalize com seus serviços
const SERVICES: Service[] = [
  {
    icon: FaHandSparkles,
    title: "Manicure",
    description: "Cuidado completo para suas mãos, com cutilagem, esmaltação e hidratação profissional."
  },
  {
    icon: FaGem,
    title: "Alongamento em Fibra",
    description: "Unhas longas, resistentes e com aspecto natural, utilizando a técnica de fibra de vidro."
  },
  {
    icon: FaPaintBrush,
    title: "Nail Art Personalizada",
    description: "Designs exclusivos e criativos para você expressar sua personalidade através das unhas."
  }
]
const currentYear = new Date().getFullYear()

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const headerRef = useRef<HTMLElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === "#inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const targetId = href.replace("#", "")
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const headerHeight = headerRef.current?.offsetHeight || 0
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - headerHeight - 20

        window.scrollTo({ top: offsetPosition, behavior: "smooth" })
      }
    }
  }

  return (
    <>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização de imagem em tela cheia"
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
            aria-label="Fechar visualização"
          >
            <FaTimes size={28} />
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Visualização ampliada do trabalho"
              fill
              className="object-contain animate-in zoom-in"
            />
          </div>
        </div>
      )}
      {/* Seção 1 - Header */}
      <header
        ref={headerRef}
        id="inicio"
        className="sticky top-0 z-50 backdrop-blur-xl bg-rose-100/90 shadow-lg animate-in fade-in slide-in-from-top duration-700"
      >
        <div className="container mx-auto px-4">
          <nav className="relative flex items-center justify-between py-3 md:py-5" aria-label="Navegação principal">
            {/* TODO: Atualizar o logo */}
            <Link
              href="/"
              aria-label="LaryNail - Voltar para a página inicial"
              className="transition-all duration-300 hover:scale-105 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 rounded-lg"
            >
              <Image
                src="/nail_logo.png"
                alt="LaryNail Logo"
                width={240}
                height={80}
                className="h-16 md:h-20 w-auto drop-shadow-lg"
                priority
                sizes="(max-width: 768px) 160px, 240px"
              />
            </Link>

            <div className="flex items-center gap-2 md:gap-4" role="list" aria-label="Redes sociais">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label, hoverColor }, index) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`
                    group relative p-2 md:p-3 rounded-full
                    bg-black/5 backdrop-blur-sm
                    border border-black/10
                    text-gray-700 transition-all duration-300
                    ${hoverColor}
                    hover:scale-110 hover:bg-black/10
                    hover:border-black/20 hover:shadow-lg
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500
                    animate-in fade-in zoom-in
                  `}
                  role="listitem"
                >
                  <Icon size={18} aria-hidden="true" className="relative z-10 md:w-5 md:h-5" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Seção de Apresentação */}
        <AnimatedSection>
          <section className="w-full py-16 md:py-24 text-center bg-white">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 text-balance">
                Especialista em alongamento com naturalidade
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Transforme suas unhas em obras de arte. Cuidado, precisão e os melhores produtos para um resultado
                impecável e duradouro.
              </p>
              <a
                href={`https://wa.me/5591985160395?text=${encodeURIComponent("Olá! Gostaria de agendar um horário.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-rose-500 text-white text-base font-bold rounded-full transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 active:scale-95"
              >
                Agende seu Horário
              </a>
            </div>
          </section>
        </AnimatedSection>

        {/* Seção 2 - Galeria de Trabalhos / Portfólio */}
        <AnimatedSection>
          <section
            id="portfolio"
            className="w-full py-16 md:py-24 bg-rose-50/50"
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Um pouco do meu trabalho</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
                Confira alguns dos meus trabalhos mais recentes e inspire-se para sua próxima visita.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {PORTFOLIO_IMAGES.map((src, index) => (
                  <button
                    key={src}
                    onClick={() => setSelectedImage(src)}
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-2xl hover:scale-105 focus-visible:outline-rose-500 focus-visible:outline-offset-2 focus-visible:outline-2"
                  >
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Exemplo de trabalho com unhas ${index + 1}`}
                      fill
                      className="object-cover"
                      quality={75}
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
        
        {/* Seção de Convite para o Instagram */}
        <AnimatedSection>
          <section className="w-full py-16 md:py-24 text-center bg-rose-50/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-balance">
                Quer conhecer mais do meu trabalho?
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Acompanhe meu dia a dia e veja os trabalhos mais recentes diretamente no meu perfil do Instagram.
              </p>
              <a
                href="https://www.instagram.com/bylaryssamarinho"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base font-bold rounded-full transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 active:scale-95"
              >
                <FaInstagram size={20} />
                Acessar o Instagram
              </a>
            </div>
          </section>
        </AnimatedSection>

        {/* Seção de Serviços */}
        <AnimatedSection>
          <section id="servicos" className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
                Oferecemos uma variedade de serviços para deixar suas unhas perfeitas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {SERVICES.map((service, index) => (
                  <div key={service.title} style={{ animationDelay: `${index * 150}ms` }} className="relative overflow-hidden bg-rose-50/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-in fade-in zoom-in group">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-rose-200 rounded-full">
                      <service.icon className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Seção de Localização */}
        <AnimatedSection>
          <section id="localizacao" className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-balance">
                Onde me encontrar
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
                {CONTACT_INFO.address}
              </p>
              <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-rose-200/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.35821382419!2d-48.6261196!3d-1.5125008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a4780f75313799%3A0x53544f387933177b!2sR.%20Boaventura%20da%20Silva%2C%2042%20-%20Vila%20dos%20Cabanos%2C%20Barcarena%20-%20PA%2C%2068447-000!5e0!3m2!1spt-BR!2sbr!4v1719610500000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do espaço LaryNail no Google Maps"
                ></iframe>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <AnimatedSection>
        <footer className="bg-rose-100 text-gray-800 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {/* Coluna 1: Logo e Descrição */}
              {/* TODO: Atualizar logo e descrição */}
              <div className="space-y-4">
                <Image src="/nail_logo.png" alt="LaryNail Logo" width={360} height={120} className="h-24 w-auto mx-auto sm:mx-0" loading="lazy" />
                <p className="text-sm leading-relaxed">
                  Especialista em unhas, transformando autoestima com arte e cuidado.
                </p>
              </div>

              {/* Coluna 2: Links Rápidos */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Navegação</h3>
                <ul className="space-y-2">
                  {FOOTER_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="hover:text-rose-600 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 rounded"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coluna 3: Contato */}
              <div id="contato">
                <h3 className="font-bold text-gray-900 mb-4">Contato</h3>
                <address className="space-y-2 not-italic text-sm">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <FaMapMarkerAlt size={12} aria-hidden="true" />
                    <span>{CONTACT_INFO.address}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <FaPhoneAlt size={12} aria-hidden="true" />
                    <a href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`} className="hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 rounded">
                      {CONTACT_INFO.phone}
                    </a>
                  </p>
                </address>
              </div>

              {/* Coluna 4: Redes Sociais */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Siga-nos</h3>
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <ul className="flex items-center justify-center sm:justify-start gap-4" aria-label="Redes sociais">
                    {SOCIAL_LINKS.map(({ href, icon: Icon, label, hoverColor }) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className={`text-2xl ${hoverColor} transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 rounded`}
                        >
                          <Icon aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-12 border-t border-gray-900/10 pt-4 md:pt-8 text-center text-xs md:text-sm text-gray-500">
              <p>&copy; {currentYear} LaryNail. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </>
  )
}
