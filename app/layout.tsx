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
  title: "Moonynads - Onchain ASCII Art NFTs on Monad",
  description: "Collect unique lunar ASCII art NFTs on Monad blockchain. 12 Days of Moonynads Advent Calendar featuring rare digital collectibles.",
  generator: "Next.js",
  openGraph: {
    title: "Moonynads Gallery",
    description: "12 Days of lunar ASCII art NFTs with dynamic minting mechanics on Monad",
    url: "https://m00nynads.vercel.app",
    siteName: "Moonynads",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moonynads - ASCII Art NFT Gallery",
      },
    ],
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
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