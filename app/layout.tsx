import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "LaryNail - Especialista em Unhas",
  description: "Laryssa Marinho - Especialista em unhas, transformando autoestima com arte e cuidado.",
  keywords: ["unhas", "manicure", "nail art", "unhas de gel", "alongamento de unha", "larynail"],
  authors: [{ name: "Laryssa Marinho" }],
  creator: "Laryssa Marinho",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "LaryNail - Especialista em Unhas",
    description: "Transforme suas unhas com a especialista Laryssa Marinho. Agende seu horário!",
    siteName: "LaryNail",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff1f2" }, // rose-100
    { media: "(prefers-color-scheme: dark)", color: "#fff1f2" }, // rose-100
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
