import type { Metadata } from 'next'
import { Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'SUNDAY LEAGUE // Manager',
  description: 'Retro-futuristic team balancing and player tracking for casual football clubs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={barlowCondensed.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-stadium-950 relative overflow-x-hidden">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}