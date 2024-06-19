import React from 'react'
import { Metadata } from 'next'
import { Jost } from 'next/font/google'

import { AdminBar } from './_components/AdminBar'
import { Footer1 } from './_components/Footer'
import { Header1 } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jost',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={jost.variable}>
        <Providers>
          <AdminBar />
          {/* @ts-expect-error */}
          <Header1 />
          <main className="main">{children}</main>
          {/* @ts-expect-error */}
          <Footer1 />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://frozit.in'),
  twitter: {
    card: 'summary_large_image',
    creator: '@Ayan',
  },
  openGraph: mergeOpenGraph(),
}
