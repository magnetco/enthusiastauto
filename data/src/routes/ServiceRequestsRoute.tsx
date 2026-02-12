import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RefreshCw, List, Columns, Mail, Phone, Car } from '../components/Icons'
import { DataTable } from '../components/DataTable'
import { KanbanBoard } from '../components/KanbanBoard'
import { fetchData, updateField, deleteRecord } from '../lib/api'

type ViewMode = 'table' | 'kanban'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', editable: true },
  { key: 'email', label: 'Email', editable: true },
  { key: 'phone', label: 'Phone', editable: true },
  { key: 'serviceType', label: 'Service Type', editable: true },
  { key: 'vehicleYear', label: 'Year' },
  { key: 'vehicleMake', label: 'Make' },
  { key: 'vehicleModel', label: 'Model' },
  { 
    key: 'status', 
    label: 'Status', 
    editable: true,
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
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
  { id: 'scheduled', label: 'Scheduled', color: 'purple' },
  { id: 'in-progress', label: 'In Progress', color: 'orange' },
  { id: 'completed', label: 'Completed', color: 'green' },
  { id: 'cancelled', label: 'Cancelled', color: 'red' },
]

const renderCard = (item: Record<string, unknown>) => (
  <div className="space-y-2">
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-medium text-white line-clamp-1">{item.name as string}</h4>
      <span className="text-xs text-zinc-500 whitespace-nowrap">
        {new Date(item.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
          {item.vehicleYear} {item.vehicleMake} {item.vehicleModel}
        </span>
      </div>
    </div>
    <div className="pt-2 border-t border-zinc-800">
      <span className="text-xs text-zinc-500">{item.serviceType as string}</span>
    </div>
  </div>
)

export function ServiceRequestsRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

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
      const result = await fetchData<Record<string, unknown>[]>('/service-requests')
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
    await updateField('/service-requests', id, field, value)
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    await deleteRecord('/service-requests', id)
    await loadData()
  }

  const handleRowClick = (id: string) => {
    navigate(`/service-requests/${id}`, {
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
              <h2 className="text-2xl font-semibold text-white">Service Requests</h2>
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

      <main className="flex-1 px-6 py-8">
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
            endpoint="/service-requests"
            renderCard={renderCard}
          />
        )}
      </main>
    </>
  )
}
