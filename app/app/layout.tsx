import { Suspense } from 'react'
import AppNav from '@/components/AppNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh pb-28 md:pb-10 md:pl-64">
      {/* Inside the student app, the public website header and footer are hidden */}
      <style>{'[data-site-chrome]{display:none !important}'}</style>
      <Suspense fallback={null}><AppNav /></Suspense>
      {children}
    </div>
  )
}
