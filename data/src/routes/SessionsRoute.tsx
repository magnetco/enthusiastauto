import { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw } from '../components/Icons'
import { DataTable } from '../components/DataTable'
import { fetchData } from '../lib/api'
import { fadeIn } from '../lib/animations'

const formatDate = (v: unknown) => {
  if (!v) return '—'
  try {
    const date = new Date(v as string)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return v as string
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'user_email', label: 'User Email' },
  { key: 'user_name', label: 'User Name' },
  { key: 'expires', label: 'Expires', render: formatDate },
  { 
    key: 'sessionToken', 
    label: 'Token', 
    render: (v: unknown) => (v as string)?.slice(0, 20) + '...' 
  },
]

export function SessionsRoute() {
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchData<Record<string, unknown>[]>('/sessions')
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!loading && contentRef.current) {
      fadeIn(contentRef.current)
    }
  }, [loading])

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sessions</h2>
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? 'Loading...' : `${data.length} records`}
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8" ref={contentRef}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-red-500 rounded-full" />
          </div>
        )}

        {!loading && !error && (
          <DataTable
            data={data as { id: string }[]}
            columns={columns}
          />
        )}
      </main>
    </>
  )
}
