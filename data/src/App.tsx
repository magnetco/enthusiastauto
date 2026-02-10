import { useState, useEffect, useCallback, useRef } from 'react'
import { DataTable } from './components/DataTable'
import { RefreshCw, Upload, Check, AlertCircle, History, List, Columns, User, Mail, Phone, Car } from './components/Icons'
import { fetchData, updateField, deleteRecord, postData } from './lib/api'
import { Sidebar } from './components/Sidebar'
import { ServiceRequestDetail } from './components/ServiceRequestDetail'
import { SellSubmissionDetail } from './components/SellSubmissionDetail'
import { KanbanBoard } from './components/KanbanBoard'
import { SettingsPage } from './components/SettingsPage'
import { DocumentationPage } from './components/DocumentationPage'

type TabId = 'users' | 'accounts' | 'sessions' | 'favorites' | 'service-requests' | 'sell-submissions' | 'versions' | 'vehicle-import' | 'documentation' | 'settings'

interface Tab {
  id: TabId
  label: string
  endpoint: string
}

const tabs: Tab[] = [
  { id: 'users', label: 'Users', endpoint: '/users' },
  { id: 'accounts', label: 'Accounts', endpoint: '/accounts' },
  { id: 'sessions', label: 'Sessions', endpoint: '/sessions' },
  { id: 'favorites', label: 'Favorites', endpoint: '/favorites' },
  { id: 'service-requests', label: 'Service Requests', endpoint: '/service-requests' },
  { id: 'sell-submissions', label: 'Sell Submissions', endpoint: '/sell-submissions' },
  { id: 'versions', label: 'Version History', endpoint: '/versions' },
  { id: 'vehicle-import', label: 'Vehicle Import', endpoint: '/vehicle-import' },
  { id: 'documentation', label: 'Documentation', endpoint: '/documentation' },
  { id: 'settings', label: 'Settings', endpoint: '/settings' },
]

// Column definitions for each table
const columnDefs = {
  users: [
    { 
      key: 'image', 
      label: 'Avatar', 
      render: (v: unknown) => {
        const imageUrl = v as string | null
        if (!imageUrl) return <span style={{ color: 'var(--text-tertiary)' }}>—</span>
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
    { key: 'createdAt', label: 'Created', render: (v: unknown) => formatDate(v as string) },
  ],
  accounts: [
    { key: 'id', label: 'ID' },
    { key: 'user_email', label: 'User Email' },
    { key: 'provider', label: 'Provider' },
    { key: 'type', label: 'Type' },
    { key: 'providerAccountId', label: 'Provider Account ID' },
  ],
  sessions: [
    { key: 'id', label: 'ID' },
    { key: 'user_email', label: 'User Email' },
    { key: 'user_name', label: 'User Name' },
    { key: 'expires', label: 'Expires', render: (v: unknown) => formatDate(v as string) },
    { 
      key: 'sessionToken', 
      label: 'Token', 
      render: (v: unknown) => (v as string)?.slice(0, 20) + '...' 
    },
  ],
  favorites: [
    { key: 'id', label: 'ID' },
    { key: 'user_email', label: 'User Email' },
    { key: 'itemType', label: 'Type', editable: true },
    { key: 'itemId', label: 'Item ID', editable: true },
    { key: 'itemHandle', label: 'Handle', editable: true },
    { key: 'createdAt', label: 'Created', render: (v: unknown) => formatDate(v as string) },
  ],
  'service-requests': [
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
    { key: 'createdAt', label: 'Created', render: (v: unknown) => formatDate(v as string) },
  ],
  'sell-submissions': [
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
    { key: 'createdAt', label: 'Created', render: (v: unknown) => formatDate(v as string) },
  ],
  versions: [
    { key: 'id', label: 'ID' },
    { key: 'table_name', label: 'Table' },
    { key: 'record_id', label: 'Record ID' },
    { key: 'field_name', label: 'Field' },
    { key: 'old_value', label: 'Old Value' },
    { key: 'new_value', label: 'New Value' },
    { key: 'changed_at', label: 'Changed At', render: (v: unknown) => formatDate(v as string) },
  ],
  'vehicle-import': [], // Uses custom UI, not DataTable
}

// Vehicle Import types
interface VehiclePreview {
  listingTitle: string
  slug: string
  stockNumber: string
  vin: string
  chassis: string
  mileage: number
  listingPrice: number
  status: string
  hasSignatureShot: boolean
  hasGallery: boolean
  exists?: boolean
}

interface ImportConfig {
  configured: boolean
  projectId: string | null
  dataset: string | null
  hasToken: boolean
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// Vehicle Import Panel Component
function VehicleImportPanel() {
  const [config, setConfig] = useState<ImportConfig | null>(null)
  const [vehicles, setVehicles] = useState<VehiclePreview[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 })
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load config on mount
  useEffect(() => {
    fetchData<ImportConfig>('/vehicle-import/config')
      .then(setConfig)
      .catch((err) => setError(err.message))
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setVehicles([])

    try {
      const text = await file.text()
      const result = await postData<{ total: number; vehicles: VehiclePreview[] }>(
        '/vehicle-import/preview',
        { csvData: text }
      )
      setVehicles(result.vehicles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV')
    }
  }

  const handleImport = async () => {
    const toImport = vehicles.filter((v) => !v.exists)
    if (toImport.length === 0) {
      setError('No new vehicles to import')
      return
    }

    setImporting(true)
    setImportProgress({ current: 0, total: toImport.length, success: 0, failed: 0 })

    for (let i = 0; i < toImport.length; i++) {
      try {
        await postData('/vehicle-import/import-one', { vehicle: toImport[i] })
        setImportProgress((prev) => ({
          ...prev,
          current: i + 1,
          success: prev.success + 1,
        }))
      } catch {
        setImportProgress((prev) => ({
          ...prev,
          current: i + 1,
          failed: prev.failed + 1,
        }))
      }
    }

    setImporting(false)
  }

  const newVehicles = vehicles.filter((v) => !v.exists)
  const existingVehicles = vehicles.filter((v) => v.exists)

  return (
    <div className="space-y-6">
      {/* Config Status */}
      {config && !config.configured && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle />
            <span className="font-medium">Sanity Not Configured</span>
          </div>
          <p className="text-sm text-yellow-500/70 mt-1">
            Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN in your environment.
          </p>
        </div>
      )}

      {config?.configured && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <Check />
            <span className="font-medium">Connected to Sanity</span>
          </div>
          <p className="text-sm text-green-500/70 mt-1">
            Project: {config.projectId} • Dataset: {config.dataset}
          </p>
        </div>
      )}

      {/* File Upload */}
      <div 
        className="border rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Upload CSV File</h3>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!config?.configured}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors text-white"
            style={{
              backgroundColor: config?.configured ? '#ef4444' : 'var(--bg-tertiary)',
            }}
          >
            <Upload />
            Choose CSV File
          </button>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Upload a CSV file with vehicle inventory data
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Preview */}
      {vehicles.length > 0 && (
        <div 
          className="border rounded-lg p-6"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Preview</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {vehicles.length} vehicles found • {newVehicles.length} new • {existingVehicles.length} already exist
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing || newVehicles.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              <Car />
              Import {newVehicles.length} Vehicles
            </button>
          </div>

          {/* Import Progress */}
          {importing && (
            <div 
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Importing {importProgress.current} of {importProgress.total}...
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-green-400">{importProgress.success} success</span>
                  {importProgress.failed > 0 && (
                    <span className="text-red-400 ml-2">{importProgress.failed} failed</span>
                  )}
                </span>
              </div>
              <div 
                className="w-full rounded-full h-2"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Vehicle List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr 
                  className="text-left border-b"
                  style={{ 
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Chassis</th>
                  <th className="pb-2 pr-4">Mileage</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2 pr-4">Inventory</th>
                  <th className="pb-2">Media</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr 
                    key={i} 
                    className={`border-b ${v.exists ? 'opacity-50' : ''}`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <td className="py-2 pr-4">
                      {v.exists ? (
                        <span className="text-yellow-400 text-xs">EXISTS</span>
                      ) : (
                        <span className="text-green-400 text-xs">NEW</span>
                      )}
                    </td>
                    <td className="py-2 pr-4" style={{ color: 'var(--text-primary)' }}>{v.listingTitle}</td>
                    <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>{v.chassis || '—'}</td>
                    <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>{v.mileage.toLocaleString()}</td>
                    <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>{formatPrice(v.listingPrice)}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        v.status === 'current' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {v.status === 'current' ? 'Current' : 'Sold'}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {v.hasSignatureShot ? '📸' : '—'}
                        {v.hasGallery ? ' 🖼️' : ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions */}
      {vehicles.length === 0 && config?.configured && (
        <div 
          className="border rounded-lg p-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>CSV Format</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Upload a CSV file with the following columns:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div style={{ color: 'var(--text-secondary)' }}>Listing Title</div>
            <div style={{ color: 'var(--text-primary)' }}>Vehicle title (required)</div>
            <div style={{ color: 'var(--text-secondary)' }}>Slug</div>
            <div style={{ color: 'var(--text-primary)' }}>URL-friendly ID (required)</div>
            <div style={{ color: 'var(--text-secondary)' }}>VIN</div>
            <div style={{ color: 'var(--text-primary)' }}>Vehicle identification number (required)</div>
            <div style={{ color: 'var(--text-secondary)' }}>Stock Number</div>
            <div style={{ color: 'var(--text-primary)' }}>Last 7 of VIN</div>
            <div style={{ color: 'var(--text-secondary)' }}>Chassis</div>
            <div style={{ color: 'var(--text-primary)' }}>E30, E46, F87, etc.</div>
            <div style={{ color: 'var(--text-secondary)' }}>Mileage</div>
            <div style={{ color: 'var(--text-primary)' }}>Current odometer</div>
            <div style={{ color: 'var(--text-secondary)' }}>Listing Price</div>
            <div style={{ color: 'var(--text-primary)' }}>Sale price</div>
          </div>
        </div>
      )}
    </div>
  )
}

type ViewMode = 'table' | 'kanban'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('users')
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedServiceRequestId, setSelectedServiceRequestId] = useState<string | null>(null)
  const [selectedSellSubmissionId, setSelectedSellSubmissionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const currentTab = tabs.find((t) => t.id === activeTab)!
  const columns = columnDefs[activeTab] || []
  const supportsKanban = activeTab === 'service-requests' || activeTab === 'sell-submissions'
  const isReadOnly = activeTab === 'versions' || activeTab === 'accounts' || activeTab === 'sessions' || activeTab === 'vehicle-import' || activeTab === 'documentation' || activeTab === 'settings'

  const loadData = useCallback(async () => {
    // Skip loading for tabs that don't use the standard data table
    if (activeTab === 'vehicle-import' || activeTab === 'settings') {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await fetchData<Record<string, unknown>[]>(currentTab.endpoint)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [currentTab.endpoint, activeTab])

  useEffect(() => {
    // Reset view mode when changing tabs
    if (!supportsKanban) {
      setViewMode('table')
    }
    
    // Close any open detail modals when switching tabs
    setSelectedServiceRequestId(null)
    setSelectedSellSubmissionId(null)
    
    // Load data for the new tab
    loadData()
  }, [loadData, supportsKanban])

  const handleUpdate = async (id: string, field: string, value: string) => {
    await updateField(currentTab.endpoint, id, field, value)
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    await deleteRecord(currentTab.endpoint, id)
    await loadData()
  }

  const handleRowClick = (id: string) => {
    if (activeTab === 'service-requests') {
      setSelectedServiceRequestId(id)
    } else if (activeTab === 'sell-submissions') {
      setSelectedSellSubmissionId(id)
    }
  }

  // Kanban columns configuration
  const serviceRequestKanbanColumns = [
    { id: 'pending', label: 'Pending', color: 'yellow' },
    { id: 'contacted', label: 'Contacted', color: 'blue' },
    { id: 'scheduled', label: 'Scheduled', color: 'purple' },
    { id: 'in-progress', label: 'In Progress', color: 'orange' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'cancelled', label: 'Cancelled', color: 'red' },
  ]

  const sellSubmissionKanbanColumns = [
    { id: 'pending', label: 'Pending', color: 'yellow' },
    { id: 'contacted', label: 'Contacted', color: 'blue' },
    { id: 'evaluating', label: 'Evaluating', color: 'purple' },
    { id: 'offer-made', label: 'Offer Made', color: 'orange' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'cancelled', label: 'Cancelled', color: 'red' },
  ]

  const renderServiceRequestCard = (item: Record<string, unknown>) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{item.name as string}</h4>
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
          {new Date(item.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
      <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.serviceType as string}</span>
      </div>
    </div>
  )

  const renderSellSubmissionCard = (item: Record<string, unknown>) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>
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
      <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
      <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.mileage} miles</span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {new Date(item.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div 
        className="flex flex-col min-h-screen ml-72"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <header 
          className="border-b backdrop-blur-sm sticky top-0 z-10"
          style={{ 
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{currentTab.label}</h2>
                {activeTab !== 'vehicle-import' && activeTab !== 'documentation' && activeTab !== 'settings' && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {loading ? 'Loading...' : `${data.length} records`}
                  </p>
                )}
                {activeTab === 'vehicle-import' && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Import vehicles from CSV to Sanity CMS
                  </p>
                )}
                {activeTab === 'documentation' && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Platform architecture and operational guides
                  </p>
                )}
                {activeTab === 'settings' && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Manage application preferences
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {supportsKanban && (
                  <div 
                    className="flex items-center gap-1 rounded-lg p-1"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <button
                      onClick={() => setViewMode('table')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: viewMode === 'table' ? 'var(--bg-secondary)' : 'transparent',
                        color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <List />
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('kanban')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: viewMode === 'kanban' ? 'var(--bg-secondary)' : 'transparent',
                        color: viewMode === 'kanban' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <Columns />
                      Kanban
                    </button>
                  </div>
                )}
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                  }}
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
        {/* Version History Info */}
        {activeTab === 'versions' && (
          <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            <History />
            <span>All changes are tracked automatically</span>
          </div>
        )}

        {/* Vehicle Import Panel */}
        {activeTab === 'vehicle-import' && (
          <VehicleImportPanel />
        )}

        {/* Documentation Page */}
        {activeTab === 'documentation' && (
          <DocumentationPage />
        )}

        {/* Settings Page */}
        {activeTab === 'settings' && (
          <SettingsPage />
        )}

        {/* Standard Table Views */}
        {activeTab !== 'vehicle-import' && activeTab !== 'documentation' && activeTab !== 'settings' && (
          <>
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
            {!loading && !error && viewMode === 'table' && (
              <DataTable
                key={activeTab}
                data={data as { id: string }[]}
                columns={columns}
                onUpdate={isReadOnly ? undefined : handleUpdate}
                onDelete={isReadOnly ? undefined : handleDelete}
                onRowClick={handleRowClick}
              />
            )}

            {/* Kanban View */}
            {!loading && !error && viewMode === 'kanban' && activeTab === 'service-requests' && (
              <KanbanBoard
                key="service-requests-kanban"
                data={data as { id: string }[]}
                columns={serviceRequestKanbanColumns}
                statusField="status"
                onItemClick={handleRowClick}
                onRefresh={loadData}
                endpoint={currentTab.endpoint}
                renderCard={renderServiceRequestCard}
              />
            )}

            {!loading && !error && viewMode === 'kanban' && activeTab === 'sell-submissions' && (
              <KanbanBoard
                key="sell-submissions-kanban"
                data={data as { id: string }[]}
                columns={sellSubmissionKanbanColumns}
                statusField="status"
                onItemClick={handleRowClick}
                onRefresh={loadData}
                endpoint={currentTab.endpoint}
                renderCard={renderSellSubmissionCard}
              />
            )}

            {/* Help Text */}
            {!isReadOnly && !loading && !error && data.length > 0 && (
              <p className="text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>
                💡 Click any highlighted cell to edit. Press Enter to save or Escape to cancel.
              </p>
            )}
          </>
        )}
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto" style={{ borderColor: 'var(--border-color)' }}>
          <div className="px-6 py-4">
            <p className="text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
              Enthusiast Auto Data Manager • Connected to Neon Postgres
            </p>
          </div>
        </footer>
      </div>

      {/* Service Request Detail Modal */}
      {selectedServiceRequestId && (
        <ServiceRequestDetail
          requestId={selectedServiceRequestId}
          onClose={() => {
            setSelectedServiceRequestId(null)
            loadData() // Refresh data after closing
          }}
        />
      )}

      {/* Sell Submission Detail Modal */}
      {selectedSellSubmissionId && (
        <SellSubmissionDetail
          submissionId={selectedSellSubmissionId}
          onClose={() => {
            setSelectedSellSubmissionId(null)
            loadData() // Refresh data after closing
          }}
        />
      )}
    </div>
  )
}

