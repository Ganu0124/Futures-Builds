import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FutureBuilds Admin',
  description: 'FutureBuilds internal admin dashboard',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
