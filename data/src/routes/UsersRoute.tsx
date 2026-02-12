import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from '../components/Icons'
import { DataTable } from '../components/DataTable'
import { fetchData, updateField, deleteRecord } from '../lib/api'

interface Column {
  key: string
  label: string
  editable?: boolean
  render?: (v: unknown) => React.ReactNode
}

const columns: Column[] = [
  { 
    key: 'image', 
    label: 'Avatar', 
    render: (v: unknown) => {
      const imageUrl = v as string | null
      if (!imageUrl) return <span className="text-zinc-600">—</span>
      return (
        <img 
          src={imageUrl} 
          alt="Avatar" 
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )
    }
  },
  { key: 'name', label: 'Name', editable: true },
  { key: 'email', label: 'Email', editable: true },
  { key: 'emailVerified', label: 'Verified', render: (v: unknown) => v ? '✓' : '—' },
  { key: 'id', label: 'ID' },
  { 
    key: 'createdAt', 
    label: 'Created', 
    render: (v: unknown) => {
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
  },
]

export function UsersRoute() {
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchData<Record<string, unknown>[]>('/users')
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

  const handleUpdate = async (id: string, field: string, value: string) => {
    await updateField('/users', id, field, value)
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    await deleteRecord('/users', id)
    await loadData()
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Users</h2>
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? 'Loading...' : `${data.length} records`}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <p className="text-sm text-red-500/70 mt-1">
              Make sure the server is running and DATABASE_URL is set
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-red-500 rounded-full" />
          </div>
        )}

        {/* Table View */}
        {!loading && !error && (
          <DataTable
            data={data as { id: string }[]}
            columns={columns}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}

        {/* Help Text */}
        {!loading && !error && data.length > 0 && (
          <p className="text-sm text-zinc-600 mt-4">
            💡 Click any highlighted cell to edit. Press Enter to save or Escape to cancel.
          </p>
        )}
      </main>
    </>
  )
}
