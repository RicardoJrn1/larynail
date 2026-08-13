import type React from "react"
import type { Metadata, Viewport } from "next"
import { IM_Fell_DW_Pica, Instrument_Serif } from "next/font/google"
import "./globals.css"

const fellPica = IM_Fell_DW_Pica({
  variable: "--font-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "LariNail — Especialista em Alongamento com Naturalidade",
  description:
    "Laryssa Marinho — Especialista em unhas, transformando autoestima com arte e cuidado. Agende seu horário pelo WhatsApp.",
  keywords: ["unhas", "manicure", "nail art", "unhas de gel", "alongamento de unha", "larinail"],
  authors: [{ name: "Laryssa Marinho" }],
  creator: "Laryssa Marinho",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    title: "LariNail — Especialista em Alongamento com Naturalidade",
    description: "Transforme suas unhas com a especialista Laryssa Marinho. Agende seu horário!",
    siteName: "LariNail",
  },
  icons: {
    icon: "/nail_logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#fdf1f5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`${fellPica.variable} ${instrumentSerif.variable} font-serif antialiased`}>{children}</body>
    </html>
  )
}
