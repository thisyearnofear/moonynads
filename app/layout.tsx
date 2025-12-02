import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/web3-provider"
import { FarcasterProvider } from "@/components/farcaster-provider"
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
    'fc:frame': 'vNext',
    'fc:frame:image': MINIAPP_CONFIG.imageUrl,
    'fc:frame:image:aspect_ratio': '3:2',
    'fc:frame:button:1': MINIAPP_CONFIG.buttonTitle,
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': MINIAPP_CONFIG.homeUrl,
    'og:image': MINIAPP_CONFIG.imageUrl,
    'fc:miniapp': JSON.stringify(generateMiniAppEmbed())
  },
  
  icons: {
    icon: [
      {
        url: "/moonynadssquare.png",
        sizes: "any",
        type: "image/png",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
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