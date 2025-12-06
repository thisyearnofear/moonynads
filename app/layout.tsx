import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/blockchain/web3-provider"
import { FarcasterProvider } from "@/components/blockchain/farcaster-provider"
import { DemoModeHandler } from "@/components/ui/demo-mode-handler"
import { MINIAPP_CONFIG, MINIAPP_METADATA, MINIAPP_OPENGRAPH, generateMiniAppEmbed } from "@/lib/miniapp-config"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: `${MINIAPP_CONFIG.name} Gallery - ${MINIAPP_METADATA.subtitle}`,
  description: MINIAPP_METADATA.description,
  generator: 'Next.js',
  keywords: 'NFT, ASCII art, Monad, blockchain, advent calendar, m00nynad, lunar art',
  authors: [{ name: 'Moonynads Team' }],
  creator: MINIAPP_CONFIG.name,
  publisher: MINIAPP_CONFIG.name,
  metadataBase: new URL(MINIAPP_CONFIG.homeUrl),
  
  // Open Graph for Farcaster & Social Media
  openGraph: {
    title: MINIAPP_OPENGRAPH.ogTitle,
    description: MINIAPP_OPENGRAPH.ogDescription,
    url: MINIAPP_CONFIG.homeUrl,
    siteName: MINIAPP_CONFIG.name,
    images: [
      {
        url: MINIAPP_OPENGRAPH.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${MINIAPP_CONFIG.name} Gallery`
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: MINIAPP_OPENGRAPH.ogTitle,
    description: MINIAPP_OPENGRAPH.ogDescription,
    creator: '@moonynads',
    images: [MINIAPP_CONFIG.imageUrl],
  },
  
  // Farcaster Frame & Additional Meta Tags
  other: {
    'og:image': MINIAPP_CONFIG.imageUrl,
    'fc:miniapp': JSON.stringify(generateMiniAppEmbed()),
    'fc:frame': JSON.stringify(generateMiniAppEmbed())
  },
  
  icons: {
    icon: [
      {
        url: "/moonynadssquare.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  },
  
  // Farcaster Mini App Manifest
  manifest: '/.well-known/farcaster.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.className} antialiased`}>
        <DemoModeHandler />
        <FarcasterProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </FarcasterProvider>
        <Analytics />
      </body>
    </html>
  )
}
