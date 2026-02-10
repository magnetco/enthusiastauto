import { useEffect, useRef } from 'react'
import { DocumentationPage } from '../components/DocumentationPage'
import { fadeIn } from '../lib/animations'

export function DocumentationRoute() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      fadeIn(contentRef.current)
    }
  }, [])

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Documentation</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Platform architecture and operational guides
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8" ref={contentRef}>
        <DocumentationPage />
      </main>
    </>
  )
}
