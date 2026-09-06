import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FutureBuilds — Building Ideas Into Intelligent Digital Solutions',
  description:
    'Transform your ideas into powerful digital products through technology, AI, software development, automation, and data-driven solutions with FutureBuilds.',
  keywords: 'FutureBuilds, AI solutions, web development, software engineering, automation, cloud architecture, technology company',
  openGraph: {
    title: 'FutureBuilds — Building Ideas Into Intelligent Digital Solutions',
    description: 'Transform your ideas into powerful digital products through technology, AI, software development, automation, and data-driven solutions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
