"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FaInstagram, FaTimes, FaWhatsapp } from "react-icons/fa"
import { PiClockAfternoon, PiHeartStraight, PiSealCheck } from "react-icons/pi"
import CardFanCarousel from "@/components/ui/card-fan-carousel"

const WHATSAPP_URL = `https://wa.me/351964659354?text=${encodeURIComponent("Olá! Gostaria de agendar um horário.")}`
const INSTAGRAM_URL = "https://www.instagram.com/bylaryssamarinho"
const PHONE_DISPLAY = "+351 964 659 354"

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#trabalhos", label: "Trabalhos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#endereco", label: "Endereço" },
]

const PORTFOLIO_IMAGES = ["/trabalho_1.webp", "/trabalho_2.webp", "/trabalho_3.webp", "/trabalho_4.webp"]

// Constante de módulo: referência estável evita re-execução dos efeitos do carrossel a cada render
const PORTFOLIO_CARDS = PORTFOLIO_IMAGES.map((src, index) => ({
  imgUrl: src,
  alt: `Exemplo de trabalho com unhas ${index + 1}`,
}))

const FEATURES: { icon: React.ElementType; label: string }[] = [
  { icon: PiSealCheck, label: "Qualidade de salão" },
  { icon: PiClockAfternoon, label: "Resultado duradouro" },
  { icon: PiHeartStraight, label: "Cuidado em cada detalhe" },
]

const MARQUEE_ITEMS = [
  "Alongamento em fibra",
  "Nail art",
  "Esmaltação em gel",
  "Manicure",
  "Naturalidade",
  "Precisão",
]

// Cada metade do marquee precisa ser mais larga que qualquer tela (até 4K ~3840px),
// senão o fim da faixa entra na tela e aparece um vão vazio antes do loop reiniciar
const MARQUEE_SEQUENCE = Array.from({ length: 4 }, () => MARQUEE_ITEMS).flat()

const PILLARS = [
  { title: "Naturalidade", text: "Alongamentos leves, com aspecto de unha natural." },
  { title: "Durabilidade", text: "Materiais resistentes para um resultado que dura." },
  { title: "Exclusividade", text: "Cada design é pensado para o seu estilo." },
]

// TODO: Ajustar valores e itens de cada serviço
const SERVICES = [
  {
    title: "Esmaltação em Gel",
    price: "20",
    popular: false,
    features: [
      "Cutilagem e preparação completa",
      "Esmaltação em gel com brilho intenso",
      "Durabilidade média de 3 semanas",
    ],
  },
  {
    title: "Alongamento em Fibra",
    price: "45",
    popular: true,
    features: [
      "Formato e comprimento à sua escolha",
      "Fibra de vidro leve e resistente",
      "Aspecto natural, sem exageros",
      "Finalização em gel",
    ],
  },
  {
    title: "Manutenção",
    price: "30",
    popular: false,
    features: [
      "Reposição do crescimento",
      "Reforço da estrutura",
      "Troca de cor inclusa",
    ],
  },
]

// TODO: Atualizar com o endereço de atendimento em Portugal
const ADDRESS = "Rua Boaventura da Silva, 42 - Vila dos Cabanos, Barcarena - PA"
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.35821382419!2d-48.6261196!3d-1.5125008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a4780f75313799%3A0x53544f387933177b!2sR.%20Boaventura%20da%20Silva%2C%2042%20-%20Vila%20dos%20Cabanos%2C%20Barcarena%20-%20PA%2C%2068447-000!5e0!3m2!1spt-BR!2sbr!4v1719610500000!5m2!1spt-BR!2sbr"

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
      className={`transition-all duration-700 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Palavra decorativa gigante ao fundo das seções
function SectionWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute font-display italic whitespace-nowrap leading-none ${className}`}
    >
      {word}
    </span>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-serif text-xs md:text-sm uppercase tracking-[0.4em] border-b border-ink/40 pb-2 mb-6">
      {children}
    </span>
  )
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lightbox: Esc fecha, foco entra no botão de fechar e volta ao card na saída,
  // e o scroll da página fica travado enquanto aberto
  useEffect(() => {
    if (!selectedImage) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      lastFocusedRef.current?.focus()
    }
  }, [selectedImage])

  return (
    <>
      {/* Lightbox da galeria — tocar em qualquer lugar fecha */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 anim-fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização de imagem em tela cheia"
        >
          <button
            ref={closeButtonRef}
            className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Fechar visualização"
          >
            <FaTimes size={22} />
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-[85vh] anim-zoom-in">
            <Image src={selectedImage} alt="Visualização ampliada do trabalho" fill className="object-contain" />
          </div>
          <p className="absolute bottom-5 inset-x-0 text-center font-serif text-sm text-white/50">
            Toque em qualquer lugar para fechar
          </p>
        </div>
      )}

      {/* Botão flutuante do WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] text-white shadow-lg shadow-ink/20 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <FaWhatsapp size={28} aria-hidden="true" />
      </a>

      {/* Header — transparente no topo, vidro fosco ao rolar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-blush/70 backdrop-blur-xl border-b border-ink/10 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between py-3" aria-label="Navegação principal">
            <Link
              href="/"
              aria-label="LariNail - Voltar para a página inicial"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Image src="/nail_logo.png" alt="" width={44} height={60} className="h-11 w-auto" priority />
              <span className="font-display text-2xl tracking-wide">LariNail</span>
            </Link>

            <ul className="hidden md:flex items-center gap-10" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-serif text-sm uppercase tracking-[0.2em] text-ink/70 hover:text-crimson transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2" aria-label="Redes sociais">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full border border-ink/15 text-ink/80 hover:text-white hover:bg-crimson hover:border-crimson transition-all duration-300"
              >
                <FaInstagram size={17} aria-hidden="true" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full border border-ink/15 text-ink/80 hover:text-white hover:bg-crimson hover:border-crimson transition-all duration-300"
              >
                <FaWhatsapp size={17} aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="inicio" className="relative overflow-hidden">
          <div className="relative flex flex-col justify-center min-h-[min(82svh,50rem)]">
            {/* Imagem limitada à esquerda no desktop para preservar a resolução nativa */}
            <div className="absolute inset-0 md:w-[58%]">
              <Image
                src="/back.png"
                alt="Mãos com unhas vermelhas sobre fundo rosa"
                fill
                priority
                className="object-cover object-left"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="hidden md:block absolute inset-y-0 right-0 w-48 bg-gradient-to-r from-transparent to-blush" />
              <div className="absolute inset-0 bg-blush/55 md:bg-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-blush" />

            <SectionWord
              word="Especialidade"
              className="top-16 left-1/2 md:left-330 -translate-x-1/2 text-rosa/10 text-[4.5rem] md:text-[9rem]"
            />
            <div className="container relative mx-auto px-6 pt-28 pb-12 md:py-24 flex justify-center md:justify-end">
              <div className="max-w-xl text-center">
                <Eyebrow>Especialidade</Eyebrow>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] mb-6 text-balance">
                  Especialista em Alongamento <em className="text-crimson">com naturalidade</em>
                </h1>
                <p className="font-serif text-lg md:text-xl text-rosa leading-relaxed mb-10 text-balance">
                  Transforme suas unhas em obras de arte. Cuidado, precisão e os melhores produtos para um resultado
                  impecável e duradouro.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-9 py-4 bg-crimson text-blush font-serif text-lg rounded-full shadow-lg shadow-crimson/30 transition-all duration-300 hover:shadow-xl hover:shadow-crimson/40 hover:scale-105 active:scale-95"
                >
                  <FaWhatsapp size={20} aria-hidden="true" />
                  Agende seu horário
                </a>
              </div>
            </div>

            {/* Selos de confiança — alinhados à esquerda no mobile */}
            <div className="container relative mx-auto px-6 pb-12">
              <ul
                className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-end md:gap-x-12"
                role="list"
              >
                {FEATURES.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 text-crimson shadow-sm shrink-0">
                      <feature.icon size={22} aria-hidden="true" />
                    </span>
                    <span className="font-serif text-xs uppercase tracking-[0.25em] text-ink/80">{feature.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Faixa rolante */}
        <div className="bg-crimson text-blush py-4 overflow-hidden" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {MARQUEE_SEQUENCE.map((item, i) => (
                  <span key={`${copy}-${i}`} className="flex items-center font-display italic text-xl whitespace-nowrap">
                    <span className="mx-6">{item}</span>
                    <span className="text-blush/60">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sobre mim / Trabalhos */}
        <AnimatedSection>
          <section id="trabalhos" className="relative w-full py-20 md:py-28 scroll-mt-24 overflow-x-clip">
            <SectionWord
              word="Sobre Mim"
              className="top-10 left-1/2 -translate-x-1/2 text-rosa/10 text-[4.5rem] md:text-[9rem]"
            />

            <div className="container relative mx-auto px-6 text-center">
              <Eyebrow>Sobre mim</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mb-4">
                Um pouco do meu <em className="text-crimson">trabalho</em>
              </h2>
              <p className="font-serif text-lg text-rosa max-w-2xl mx-auto leading-relaxed mb-4 text-balance">
                Confira alguns dos meus trabalhos mais recentes e inspire-se para a sua próxima visita.
              </p>
              <p className="font-serif text-base text-ink/70 max-w-xl mx-auto leading-relaxed mb-6 text-balance">
                Sou a Laryssa Marinho, nail designer. Cada atendimento é único: técnica, higiene e um olhar artístico
                para criar unhas que valorizam o seu estilo.
              </p>

              <CardFanCarousel
                cards={PORTFOLIO_CARDS}
                onCardClick={(_, card) => setSelectedImage(card.imgUrl)}
                autoPlay
              />

              {/* Pilares do atendimento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-14">
                {PILLARS.map((pillar) => (
                  <div key={pillar.title} className="flex flex-col items-center gap-2">
                    <span className="font-display text-crimson text-xl" aria-hidden="true">
                      ✦
                    </span>
                    <h3 className="font-display text-2xl">{pillar.title}</h3>
                    <p className="font-serif text-sm text-ink/70 leading-relaxed">{pillar.text}</p>
                  </div>
                ))}
              </div>

              {/* Convite para o Instagram */}
              <div className="mt-20">
                <p className="font-display text-2xl md:text-3xl mb-6 text-balance">
                  Quer ver mais? Acompanhe os trabalhos <em className="text-crimson">mais recentes</em> no Instagram.
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3.5 border border-ink/30 rounded-full font-serif text-lg transition-all duration-300 hover:bg-crimson hover:border-crimson hover:text-blush hover:scale-105 active:scale-95"
                >
                  <FaInstagram size={20} aria-hidden="true" />
                  @bylaryssamarinho
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Serviços — catálogo de planos */}
        <AnimatedSection>
          <section id="servicos" className="relative w-full py-20 md:py-28 bg-petal scroll-mt-24 overflow-x-clip">
            <SectionWord
              word="Serviços"
              className="top-10 left-1/2 -translate-x-1/2 text-crimson/10 text-[4.5rem] md:text-[9rem]"
            />
            <div className="container relative mx-auto px-6 text-center">
              <Eyebrow>Serviços</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Meus Serviços</h2>
              <p className="font-serif text-lg text-rosa max-w-2xl mx-auto leading-relaxed mb-16 text-balance">
                Escolha o cuidado ideal para as suas unhas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto items-stretch">
                {SERVICES.map((service) => (
                  <div
                    key={service.title}
                    className={`relative flex flex-col rounded-3xl p-8 text-left transition-all duration-300 ${
                      service.popular
                        ? "bg-crimson text-blush shadow-xl shadow-crimson/30 md:scale-[1.06] md:-translate-y-1"
                        : "bg-blush shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-rosa/15"
                    }`}
                  >
                    {service.popular && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink text-blush font-serif text-xs uppercase tracking-[0.2em] px-5 py-1.5 rounded-full shadow-md">
                        Mais popular
                      </span>
                    )}

                    <h3 className="font-display text-2xl mb-4">{service.title}</h3>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="font-display text-5xl">{service.price}</span>
                      <span className="font-display text-2xl">€</span>
                      <span className={`font-serif text-sm ml-2 ${service.popular ? "text-blush/70" : "text-ink/50"}`}>
                        / sessão
                      </span>
                    </div>

                    <ul
                      className={`space-y-3 pt-6 mb-8 border-t ${
                        service.popular ? "border-blush/25" : "border-ink/10"
                      }`}
                    >
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            className={`text-sm leading-6 ${service.popular ? "text-blush/70" : "text-crimson"}`}
                            aria-hidden="true"
                          >
                            ✦
                          </span>
                          <span className={`font-serif text-sm leading-6 ${service.popular ? "text-blush/90" : "text-ink/75"}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`https://wa.me/351964659354?text=${encodeURIComponent(`Olá! Gostaria de agendar: ${service.title}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full py-3 font-serif text-base transition-all duration-300 active:scale-95 ${
                        service.popular
                          ? "bg-blush text-crimson hover:scale-[1.03] shadow-md"
                          : "border border-ink/20 hover:bg-crimson hover:border-crimson hover:text-blush"
                      }`}
                    >
                      <FaWhatsapp size={16} aria-hidden="true" />
                      Agendar
                    </a>
                  </div>
                ))}
              </div>

              <p className="font-serif text-xs text-ink/50 mt-8">
                Valores de referência — confirme disponibilidade e orçamento no agendamento.
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* Endereço */}
        <AnimatedSection>
          <section id="endereco" className="relative w-full py-20 md:py-28 scroll-mt-24 overflow-x-clip">
            <SectionWord
              word="Endereço"
              className="top-10 left-1/2 -translate-x-1/2 text-rosa/10 text-[4.5rem] md:text-[9rem]"
            />
            <div className="container relative mx-auto px-6 text-center">
              <Eyebrow>Endereço</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Saiba onde me encontrar</h2>
              <p className="font-serif text-lg text-rosa max-w-2xl mx-auto leading-relaxed mb-12">{ADDRESS}</p>
              <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-rosa/15 border border-petal">
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do espaço LariNail no Google Maps"
                ></iframe>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA final */}
        <AnimatedSection>
          <section className="container mx-auto px-6 pb-20 md:pb-28">
            <div className="relative overflow-hidden bg-crimson text-blush rounded-[2.5rem] px-8 py-16 md:py-20 text-center">
              <span className="pointer-events-none absolute -top-10 -left-6 font-display italic text-[10rem] leading-none text-blush/10 select-none" aria-hidden="true">
                ✦
              </span>
              <SectionWord
                word="agende"
                className="-bottom-6 right-4 text-blush/10 text-[4rem] md:text-[7rem]"
              />
              <h2 className="font-display text-3xl md:text-5xl mb-4 text-balance">
                Pronta para transformar <em>suas unhas</em>?
              </h2>
              <p className="font-serif text-lg text-blush/80 max-w-xl mx-auto mb-10 text-balance">
                Agende seu horário pelo WhatsApp e garanta um atendimento com todo o cuidado que você merece.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-9 py-4 bg-blush text-crimson font-serif text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
                Falar no WhatsApp
              </a>
            </div>
          </section>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="bg-ink text-blush py-14 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
            <div>
              <p className="font-display text-3xl mb-3">LariNail</p>
              <p className="font-serif text-sm text-blush/70 leading-relaxed">
                Especialista em unhas, transformando autoestima com arte e cuidado.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-blush/50 mb-4">Navegação</h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="font-serif text-blush/80 hover:text-blush transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-blush/50 mb-4">Contato</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-serif text-blush/80 hover:text-blush transition-colors"
                  >
                    <FaWhatsapp aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-serif text-blush/80 hover:text-blush transition-colors"
                  >
                    <FaInstagram aria-hidden="true" />
                    @bylaryssamarinho
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-blush/15 pt-6 text-center font-serif text-sm text-blush/50">
            <p>&copy; {currentYear} LariNail. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
