import { useState, useEffect, useCallback, useRef } from 'react'
import { DataTable } from './components/DataTable'
import { RefreshCw, History, Car, Upload, Check, AlertCircle, Logo, DollarSign } from './components/Icons'
import { fetchData, updateField, deleteRecord, postData } from './lib/api'

type TabId = 'users' | 'accounts' | 'sessions' | 'favorites' | 'service-requests' | 'sell-submissions' | 'versions' | 'vehicle-import'

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
]

// Column definitions for each table
const columnDefs = {
  users: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', editable: true },
    { key: 'email', label: 'Email', editable: true },
    { key: 'emailVerified', label: 'Verified', render: (v: unknown) => v ? '✓' : '—' },
    { key: 'image', label: 'Image', editable: true },
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
  inventoryStatus: string
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
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Upload CSV File</h3>
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
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            <Upload />
            Choose CSV File
          </button>
          <span className="text-sm text-zinc-500">
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
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Preview</h3>
              <p className="text-sm text-zinc-500 mt-1">
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
            <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">
                  Importing {importProgress.current} of {importProgress.total}...
                </span>
                <span className="text-zinc-500">
                  <span className="text-green-400">{importProgress.success} success</span>
                  {importProgress.failed > 0 && (
                    <span className="text-red-400 ml-2">{importProgress.failed} failed</span>
                  )}
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
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
                <tr className="text-left text-zinc-500 border-b border-zinc-800">
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
                  <tr key={i} className={`border-b border-zinc-800/50 ${v.exists ? 'opacity-50' : ''}`}>
                    <td className="py-2 pr-4">
                      {v.exists ? (
                        <span className="text-yellow-400 text-xs">EXISTS</span>
                      ) : (
                        <span className="text-green-400 text-xs">NEW</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-white">{v.listingTitle}</td>
                    <td className="py-2 pr-4 text-zinc-400">{v.chassis || '—'}</td>
                    <td className="py-2 pr-4 text-zinc-400">{v.mileage.toLocaleString()}</td>
                    <td className="py-2 pr-4 text-zinc-400">{formatPrice(v.listingPrice)}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        v.inventoryStatus.includes('Current') 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {v.inventoryStatus.includes('Current') ? 'Current' : 'Sold'}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="text-zinc-500 text-xs">
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
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-3">CSV Format</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Upload a CSV file with the following columns:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-zinc-500">Listing Title</div>
            <div className="text-zinc-400">Vehicle title (required)</div>
            <div className="text-zinc-500">Slug</div>
            <div className="text-zinc-400">URL-friendly ID (required)</div>
            <div className="text-zinc-500">VIN</div>
            <div className="text-zinc-400">Vehicle identification number (required)</div>
            <div className="text-zinc-500">Stock Number</div>
            <div className="text-zinc-400">Last 7 of VIN</div>
            <div className="text-zinc-500">Chassis</div>
            <div className="text-zinc-400">E30, E46, F87, etc.</div>
            <div className="text-zinc-500">Mileage</div>
            <div className="text-zinc-400">Current odometer</div>
            <div className="text-zinc-500">Listing Price</div>
            <div className="text-zinc-400">Sale price</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('users')
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentTab = tabs.find((t) => t.id === activeTab)!
  const columns = columnDefs[activeTab] || []

  const loadData = useCallback(async () => {
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
  }, [currentTab.endpoint])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdate = async (id: string, field: string, value: string) => {
    await updateField(currentTab.endpoint, id, field, value)
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    await deleteRecord(currentTab.endpoint, id)
    await loadData()
  }

  const isReadOnly = activeTab === 'versions' || activeTab === 'accounts' || activeTab === 'sessions' || activeTab === 'vehicle-import'

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-7 w-auto" />
              <div className="h-6 w-px bg-zinc-700" />
              <span className="text-sm font-medium text-zinc-400">Data Manager</span>
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

      {/* Tabs */}
      <nav className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.id === 'versions' && <History />}
                {tab.id === 'vehicle-import' && <Car />}
                {tab.id === 'sell-submissions' && <DollarSign />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">{currentTab.label}</h2>
            {activeTab !== 'vehicle-import' && (
              <p className="text-sm text-zinc-500 mt-1">
                {loading ? 'Loading...' : `${data.length} records`}
              </p>
            )}
            {activeTab === 'vehicle-import' && (
              <p className="text-sm text-zinc-500 mt-1">
                Import vehicles from CSV to Sanity CMS
              </p>
            )}
          </div>
          {activeTab === 'versions' && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <History />
              <span>All changes are tracked automatically</span>
            </div>
          )}
        </div>

        {/* Vehicle Import Panel */}
        {activeTab === 'vehicle-import' && (
          <VehicleImportPanel />
        )}

        {/* Standard Table Views */}
        {activeTab !== 'vehicle-import' && (
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

            {/* Data Table */}
            {!loading && !error && (
              <DataTable
                data={data as { id: string }[]}
                columns={columns}
                onUpdate={isReadOnly ? undefined : handleUpdate}
                onDelete={isReadOnly ? undefined : handleDelete}
              />
            )}

            {/* Help Text */}
            {!isReadOnly && !loading && !error && data.length > 0 && (
              <p className="text-sm text-zinc-600 mt-4">
                💡 Click any highlighted cell to edit. Press Enter to save or Escape to cancel.
              </p>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-zinc-600 text-center">
            Enthusiast Auto Data Manager • Connected to Neon Postgres
          </p>
        </div>
      </footer>
    </div>
  )
}

