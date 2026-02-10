import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RefreshCw, List, Columns, Mail, Phone, Car } from '../components/Icons'
import { DataTable } from '../components/DataTable'
import { KanbanBoard } from '../components/KanbanBoard'
import { fetchData, updateField, deleteRecord } from '../lib/api'
import { fadeIn } from '../lib/animations'

type ViewMode = 'table' | 'kanban'

const columns = [
  { key: 'id', label: 'ID' },
  { 
    key: 'sellOption', 
    label: 'Type', 
    editable: true,
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'sell' ? 'bg-blue-500/20 text-blue-400' :
        v === 'consign' ? 'bg-purple-500/20 text-purple-400' :
        v === 'auction' ? 'bg-orange-500/20 text-orange-400' :
        'bg-zinc-500/20 text-zinc-400'
      }`}>
        {String(v).toUpperCase()}
      </span>
    )
  },
  { key: 'firstName', label: 'First Name', editable: true },
  { key: 'lastName', label: 'Last Name', editable: true },
  { key: 'email', label: 'Email', editable: true },
  { key: 'phone', label: 'Phone', editable: true },
  { key: 'year', label: 'Year', editable: true },
  { key: 'make', label: 'Make', editable: true },
  { key: 'model', label: 'Model', editable: true },
  { key: 'mileage', label: 'Mileage', editable: true },
  { key: 'vin', label: 'VIN', editable: true },
  { 
    key: 'status', 
    label: 'Status', 
    editable: true,
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
        v === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
        v === 'completed' ? 'bg-green-500/20 text-green-400' :
        v === 'cancelled' ? 'bg-red-500/20 text-red-400' :
        'bg-zinc-500/20 text-zinc-400'
      }`}>
        {String(v)}
      </span>
    )
  },
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

const kanbanColumns = [
  { id: 'pending', label: 'Pending', color: 'yellow' },
  { id: 'contacted', label: 'Contacted', color: 'blue' },
  { id: 'evaluating', label: 'Evaluating', color: 'purple' },
  { id: 'offer-made', label: 'Offer Made', color: 'orange' },
  { id: 'completed', label: 'Completed', color: 'green' },
  { id: 'cancelled', label: 'Cancelled', color: 'red' },
]

const renderCard = (item: Record<string, unknown>) => (
  <div className="space-y-2">
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-medium text-white line-clamp-1">
        {item.firstName} {item.lastName}
      </h4>
      <span className={`text-xs px-2 py-0.5 rounded ${
        item.sellOption === 'sell' ? 'bg-blue-500/20 text-blue-400' :
        item.sellOption === 'consign' ? 'bg-purple-500/20 text-purple-400' :
        'bg-orange-500/20 text-orange-400'
      }`}>
        {(item.sellOption as string).toUpperCase()}
      </span>
    </div>
    <div className="space-y-1 text-xs text-zinc-400">
      <div className="flex items-center gap-1.5">
        <Mail className="w-3 h-3" />
        <span className="truncate">{item.email as string}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Phone className="w-3 h-3" />
        <span>{item.phone as string}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Car className="w-3 h-3" />
        <span className="truncate">
          {item.year} {item.make} {item.model}
        </span>
      </div>
    </div>
    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
      <span className="text-xs text-zinc-500">{item.mileage} miles</span>
      <span className="text-xs text-zinc-500">
        {new Date(item.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  </div>
)

export function SellSubmissionsRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const contentRef = useRef<HTMLDivElement>(null)

  // Restore view mode from location state if available
  useEffect(() => {
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode)
    }
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition)
      }, 100)
    }
  }, [location.state])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchData<Record<string, unknown>[]>('/sell-submissions')
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

  const handleUpdate = async (id: string, field: string, value: string) => {
    await updateField('/sell-submissions', id, field, value)
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    await deleteRecord('/sell-submissions', id)
    await loadData()
  }

  const handleRowClick = (id: string) => {
    navigate(`/sell-submissions/${id}`, {
      state: {
        viewMode,
        scrollPosition: window.scrollY,
      },
    })
  }

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sell Submissions</h2>
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? 'Loading...' : `${data.length} records`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <List />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Columns />
                  Kanban
                </button>
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

        {!loading && !error && viewMode === 'table' && (
          <>
            <DataTable
              data={data as { id: string }[]}
              columns={columns}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onRowClick={handleRowClick}
            />
            {data.length > 0 && (
              <p className="text-sm text-zinc-600 mt-4">
                💡 Click any highlighted cell to edit. Press Enter to save or Escape to cancel.
              </p>
            )}
          </>
        )}

        {!loading && !error && viewMode === 'kanban' && (
          <KanbanBoard
            data={data as { id: string }[]}
            columns={kanbanColumns}
            statusField="status"
            onItemClick={handleRowClick}
            onRefresh={loadData}
            endpoint="/sell-submissions"
            renderCard={renderCard}
          />
        )}
      </main>
    </>
  )
}
