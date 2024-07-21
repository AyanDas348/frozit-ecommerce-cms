import React from 'react'
import { Metadata } from 'next'
import { Inter, Jost, Ubuntu } from 'next/font/google'

import { AdminBar } from './_components/AdminBar'
import { Footer1 } from './_components/Footer'
import { Header1 } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'

const jost = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '700'],
  // variable: '--font-jost',
})

import { ToastContainer } from 'react-toastify'
import Script from 'next/script'

import 'react-toastify/dist/ReactToastify.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/assets/logo/logo.png" sizes="40x32" />
        <link rel="icon" href="/assets/logo/logo.png" />
        <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
        {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
        <title>Frozit Ecommerce</title>
      </head>
      <body className={jost.className}>
        <Providers>
          <AdminBar />
          {/* @ts-expect-error */}
          <Header1 />
          <main className="main">{children}</main>
          {/* @ts-expect-error */}
          <Footer1 />
        </Providers>
        <ToastContainer />
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
