import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/web3-provider"
import { FarcasterProvider } from "@/components/farcaster-provider"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: 'Moonynads Gallery - Token-Gated ASCII Art NFTs',
  description: 'Collect unique lunar ASCII art NFTs through dynamic advent calendar drops on Monad blockchain',
  generator: 'Next.js',
  keywords: 'NFT, ASCII art, Monad, blockchain, advent calendar, m00nynad, lunar art',
  authors: [{ name: 'Moonynads Team' }],
  creator: 'Moonynads',
  publisher: 'Moonynads',
  metadataBase: new URL('https://m00nynads.vercel.app'),
  
  // Open Graph for Farcaster & Social Media
  openGraph: {
    title: 'Moonynads Gallery',
    description: '12 Days of lunar ASCII art NFTs with dynamic minting mechanics',
    url: 'https://m00nynads.vercel.app',
    siteName: 'Moonynads',
    images: [
      {
        url: '/moonynadsbanner.png',
        width: 1200,
        height: 400,
        alt: 'Moonynads Banner'
      },
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Moonynads - Token-Gated ASCII Art NFTs'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Moonynads Gallery',
    description: '12 Days of lunar ASCII art NFTs with dynamic minting mechanics',
    creator: '@moonynads',
    images: ['/moonynadsbanner.png'],
  },
  
  // Farcaster Frame & Additional Meta Tags
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://m00nynads.vercel.app/moonynadsbanner.png',
    'fc:frame:image:aspect_ratio': '3:1',
    'fc:frame:button:1': '🌙 Explore Gallery',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://m00nynads.vercel.app',
    'og:image': '/moonynadsbanner.png',
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