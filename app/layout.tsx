import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/lib/provider"
import { LanguageProvider } from "@/lib/i18n/context"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

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
  title: {
    default: "E-Commerce Store",
    template: "%s | E-Commerce Store",
  },
  description: "Your one-stop shop for everything. Discover amazing products at unbeatable prices.",
  keywords: ["e-commerce", "shopping", "online store", "products"],
  authors: [{ name: "E-Commerce Store" }],
  creator: "E-Commerce Store",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "E-Commerce Store",
    title: "E-Commerce Store",
    description: "Your one-stop shop for everything",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Store",
    description: "Your one-stop shop for everything",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
          <ReduxProvider>
            {children}
            <Toaster 
              position="top-right" 
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  error: "bg-destructive text-destructive-foreground",
                  success: "bg-green-500 text-white",
                  warning: "bg-yellow-500 text-white",
                  info: "bg-blue-500 text-white",
                },
              }}
            />
          </ReduxProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
