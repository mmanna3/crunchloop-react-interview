import type { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-orange-50/25 to-zinc-100 font-sans text-zinc-900 antialiased">
      <div className="mx-auto max-w-xl px-4 py-10 sm:max-w-2xl sm:px-6 sm:py-14">
        {children}
      </div>
    </div>
  )
}
