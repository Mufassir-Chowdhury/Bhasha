import type React from "react"
import type { Metadata } from "next"
import { Fredoka, Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ProgressProvider } from "@/lib/progress-context"
import { FlashcardProvider } from "@/lib/flashcard-context"

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BanglaKids - Learn Bangla Language",
  description: "Fun and interactive Bangla language learning app for kids",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <AuthProvider>
          <ProgressProvider>
            <FlashcardProvider>{children}</FlashcardProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
